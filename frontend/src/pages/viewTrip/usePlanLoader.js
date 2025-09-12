// usePlanLoader.js
import { useEffect, useMemo, useState, useRef } from "react";
import { getHotelImage } from "@/services/GlobalApi";

/**
 * normalizeData mutates the plan intentionally (we persist mutated plan back to sessionStorage)
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

/** DOM-image based verification (no fetch/HEAD -> avoids CORS console errors) */
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
    img.src = url;
  });

const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

export default function usePlanLoader(options = {}) {
  const {
    BATCH_SIZE = 6,
    RETRIES = 1,
    RETRY_DELAY_MS = 600,
    FALLBACK_IMAGE = "https://via.placeholder.com/800x450?text=No+Image",
    forceReplaceUnverified = false, // set true to always replace even if _imageVerified present
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

    const loadAndReplaceImages = async () => {
      setLoading(true);
      try {
        const stored = sessionStorage.getItem("latest_trip_plan");
        if (!stored) {
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

        normalizeData(originalPlan);

        const hotels = originalPlan.hotelOptions || [];
        if (hotels.length === 0) {
          const s = safeStringify(originalPlan);
          if (s !== null) sessionStorage.setItem("latest_trip_plan", s);
          if (!cancelledRef.current) setPlan(originalPlan);
          return;
        }

        for (let i = 0; i < hotels.length; i += BATCH_SIZE) {
          if (cancelledRef.current) break;
          const batch = hotels.slice(i, i + BATCH_SIZE);

          const batchResults = await Promise.all(
            batch.map(async (hotel, idxInBatch) => {
              const idx = i + idxInBatch;

              // Skip if already verified and not forcing replace
              if (!forceReplaceUnverified && hotel && hotel._imageVerified) {
                return { index: idx, url: hotel.hotelImageUrl, verified: true, fallback: false };
              }

              const name = hotel?.hotelName ?? hotel?.name ?? "";
              const address = hotel?.hotelAddress ?? hotel?.address ?? "";

              let lastUrl = "";
              let verified = false;

              for (let attempt = 0; attempt <= RETRIES; attempt++) {
                if (cancelledRef.current) break;

                try {
                  // IMPORTANT: getHotelImage should call your backend (same-origin).
                  // If getHotelImage itself calls Google from the browser, that will still cause CORS issues.
                  const candidate = await getHotelImage({ name, address });
                  lastUrl = candidate ? String(candidate) : "";
                } catch (err) {
                  console.warn(`[usePlanLoader] getHotelImage error for hotel idx ${idx} attempt ${attempt}:`, err);
                  lastUrl = "";
                }

                if (lastUrl) {
                  // Verify via <img> load only (no fetch/HEAD)
                  const ok = await imageLoads(lastUrl, 8000);
                  if (ok) {
                    verified = true;
                    break;
                  } else {
                    verified = false;
                  }
                }

                // backoff before next attempt
                const delay = RETRY_DELAY_MS * Math.pow(2, attempt);
                await sleep(delay);
              } // attempts

              if (!verified) {
                lastUrl = FALLBACK_IMAGE;
              }

              return { index: idx, url: lastUrl, verified: !!verified, fallback: !verified };
            })
          ); // end Promise.all

          // write results back (mutate original plan)
          for (const r of batchResults) {
            if (!r) continue;
            const idx = r.index;
            if (idx >= originalPlan.hotelOptions.length) continue;
            originalPlan.hotelOptions[idx].hotelImageUrl = r.url ?? "";
            originalPlan.hotelOptions[idx]._imageVerified = true;
          }

          // persist after each batch
          const serialized = safeStringify(originalPlan);
          if (serialized !== null) {
            try {
              sessionStorage.setItem("latest_trip_plan", serialized);
            } catch (err) {
              console.warn("[usePlanLoader] failed to write sessionStorage after batch:", err);
            }
          }

          // shallow copy into state to trigger re-render
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

    loadAndReplaceImages();

    return () => {
      cancelledRef.current = true;
    };
  }, [BATCH_SIZE, RETRIES, RETRY_DELAY_MS, FALLBACK_IMAGE, forceReplaceUnverified]);

  const normalizedPlan = useMemo(() => (plan ? normalizeData(plan) : null), [plan]);

  return { plan, normalizedPlan, loading, setPlan };
}
