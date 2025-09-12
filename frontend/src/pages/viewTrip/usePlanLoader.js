// usePlanLoader.js
import { useEffect, useMemo, useState, useRef } from "react";
import { getHotelImage } from "@/services/GlobalApi";

/**
 * normalizeData mutates the plan intentionally (we will persist mutated plan back to sessionStorage)
 */
const normalizeData = (plan) => {
  if (!plan) return null;

  plan.tripDetails = plan.tripDetails || {};
  plan.tripDetails.numberOfTravelers =
    plan.tripDetails.numberOfTravelers ??
    plan.tripDetails.travelers ??
    plan.tripDetails.travellers ??
    plan.tripDetails.traveler ??
    plan.tripDetails.numberOfTravellers ??
    1;

  plan.tripDetails.noOfDays =
    plan.tripDetails.noOfDays ??
    plan.tripDetails.noofdays ??
    plan.tripDetails.noOfdays ??
    plan.tripDetails.noOfDay ??
    plan.tripDetails.days ??
    plan.tripDetails.day ??
    plan.noOfDays ??
    plan.noOfDay ??
    null;

  plan.tripDetails.budget = plan.tripDetails.budget ?? plan.tripDetails.Budget ?? plan.budget ?? null;
  plan.tripDetails.destination = plan.tripDetails.destination ?? plan.tripDetails.Destination ?? plan.destination ?? "Unknown";

  plan.hotelOptions = Array.isArray(plan.hotelOptions) ? plan.hotelOptions : [];
  plan.dailyItinerary = Array.isArray(plan.dailyItinerary) ? plan.dailyItinerary : [];

  return plan;
};

/** Helper to check whether a remote image URL actually loads (using DOM Image) */
const imageLoads = (url, timeout = 8000) =>
  new Promise((resolve) => {
    if (!url) return resolve(false);
    const img = new Image();
    let done = false;
    const cleanup = () => {
      if (done) return;
      done = true;
      img.onload = img.onerror = null;
      clearTimeout(timer);
    };
    const timer = setTimeout(() => {
      cleanup();
      resolve(false);
    }, timeout);

    img.onload = () => {
      cleanup();
      resolve(true);
    };
    img.onerror = () => {
      cleanup();
      resolve(false);
    };
    // assign last to trigger load attempt
    img.src = url;
  });

/** Try HEAD first (fast), fallback to DOM Image test if HEAD not allowed or fails */
const verifyImageUrl = async (url, headTimeout = 4000) => {
  if (!url) return false;

  // Try HEAD (may fail due to CORS or lack of support)
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), headTimeout);
    const resp = await fetch(url, { method: "HEAD", signal: controller.signal });
    clearTimeout(id);
    if (resp && resp.ok) return true;
    // if not ok, fall through to DOM image test below
  } catch (err) {
    // likely CORS or network issue — fall through to DOM test
  }

  // Fallback: try loading the image via DOM (works despite CORS; only load/error events)
  try {
    const ok = await imageLoads(url, 8000);
    return ok;
  } catch (err) {
    return false;
  }
};

/** Sleep helper */
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

export default function usePlanLoader(options = {}) {
  // Options with sensible defaults
  const {
    BATCH_SIZE = 6,
    RETRIES = 2,
    RETRY_DELAY_MS = 700, // initial delay, will be multiplied
    FALLBACK_IMAGE = "https://via.placeholder.com/800x450?text=No+Image",
    forceReplaceUnverified = true, // replace all that are not verified; verified ones are skipped
  } = options;

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;

    const safeStringify = (obj) => {
      try {
        return JSON.stringify(obj);
      } catch (err) {
        console.warn("Failed to stringify plan for sessionStorage:", err);
        return null;
      }
    };

    const loadAndReplaceImagesWithVerification = async () => {
      setLoading(true);
      try {
        const stored = sessionStorage.getItem("latest_trip_plan");
        if (!stored) {
          console.log("[usePlanLoader] no stored plan found");
          if (!cancelledRef.current) setPlan(null);
          return;
        }

        let originalPlan;
        try {
          originalPlan = JSON.parse(stored);
        } catch (err) {
          console.warn("[usePlanLoader] invalid JSON in sessionStorage:", err);
          if (!cancelledRef.current) setPlan(null);
          return;
        }

        // Normalize (in-place)
        normalizeData(originalPlan);

        const hotels = originalPlan.hotelOptions || [];
        if (hotels.length === 0) {
          const s = safeStringify(originalPlan);
          if (s !== null) sessionStorage.setItem("latest_trip_plan", s);
          if (!cancelledRef.current) setPlan(originalPlan);
          return;
        }

        // Process in batches
        for (let i = 0; i < hotels.length; i += BATCH_SIZE) {
          if (cancelledRef.current) break;
          const batch = hotels.slice(i, i + BATCH_SIZE);

          const batchResults = await Promise.all(
            batch.map(async (hotel, idxInBatch) => {
              const globalIndex = i + idxInBatch;

              // Skip if already verified and we are not forcing a re-replace
              if (!forceReplaceUnverified && hotel && hotel._imageVerified) {
                return { index: globalIndex, url: hotel.hotelImageUrl, verified: true, fallback: false };
              }

              // If hotel already has _imageVerified true, skip
              if (hotel && hotel._imageVerified) {
                return { index: globalIndex, url: hotel.hotelImageUrl, verified: true, fallback: false };
              }

              const name = hotel?.hotelName ?? hotel?.name ?? "";
              const address = hotel?.hotelAddress ?? hotel?.address ?? "";

              // Try multiple attempts to get a valid URL
              let lastUrl = "";
              let verified = false;
              for (let attempt = 0; attempt <= RETRIES; attempt++) {
                if (cancelledRef.current) break;

                try {
                  const candidate = await getHotelImage({ name, address });
                  lastUrl = candidate ? String(candidate) : "";
                } catch (err) {
                  console.warn(`[usePlanLoader] getHotelImage threw for hotel index ${globalIndex} (attempt ${attempt}):`, err);
                  lastUrl = "";
                }

                if (lastUrl) {
                  // Verify the URL actually loads
                  const ok = await verifyImageUrl(lastUrl);
                  if (ok) {
                    verified = true;
                    break;
                  } else {
                    // not valid; will retry
                    verified = false;
                  }
                }

                // exponential backoff
                const delay = RETRY_DELAY_MS * Math.pow(2, attempt);
                await sleep(delay);
              } // end attempts

              if (!verified) {
                // Use fallback image
                lastUrl = FALLBACK_IMAGE;
              }

              return { index: globalIndex, url: lastUrl, verified: !!verified, fallback: !verified };
            })
          ); // end Promise.all for batch

          // write batch results back into originalPlan.hotelOptions (mutate)
          for (const r of batchResults) {
            if (!r) continue;
            const idx = r.index;
            if (idx >= originalPlan.hotelOptions.length) continue;
            originalPlan.hotelOptions[idx].hotelImageUrl = r.url ?? "";
            // mark verified flag so future mounts don't re-fetch (unless you remove the flag)
            originalPlan.hotelOptions[idx]._imageVerified = true;
          }

          // Persist partial updates after each batch
          const serialized = safeStringify(originalPlan);
          if (serialized !== null) {
            try {
              sessionStorage.setItem("latest_trip_plan", serialized);
              // console.log(`[usePlanLoader] persisted after batch ${i / BATCH_SIZE}`, JSON.parse(sessionStorage.getItem("latest_trip_plan")));
            } catch (err) {
              console.warn("[usePlanLoader] failed to write sessionStorage after batch:", err);
            }
          }

          // re-render UI with shallow copy
          if (!cancelledRef.current) setPlan({ ...originalPlan });
        } // end batches

        // final persist
        const finalSerialized = safeStringify(originalPlan);
        if (finalSerialized !== null) {
          try {
            sessionStorage.setItem("latest_trip_plan", finalSerialized);
          } catch (err) {
            console.warn("[usePlanLoader] final persist failed:", err);
          }
        }

        if (!cancelledRef.current) setPlan(originalPlan);
      } catch (err) {
        console.error("[usePlanLoader] unexpected error:", err);
        if (!cancelledRef.current) setPlan(null);
      } finally {
        if (!cancelledRef.current) setLoading(false);
      }
    };

    loadAndReplaceImagesWithVerification();

    return () => {
      cancelledRef.current = true;
    };
  }, [
    BATCH_SIZE,
    RETRIES,
    RETRY_DELAY_MS,
    FALLBACK_IMAGE,
    forceReplaceUnverified,
  ]);

  const normalizedPlan = useMemo(() => (plan ? normalizeData(plan) : null), [plan]);

  return { plan, normalizedPlan, loading, setPlan };
}
