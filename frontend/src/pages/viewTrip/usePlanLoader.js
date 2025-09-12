import { useEffect, useMemo, useState, useRef } from "react";
import { getHotelImage } from "@/services/GlobalApi";

/**
 * normalizeData mutates the plan intentionally (we want to persist back to sessionStorage)
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

export default function usePlanLoader() {
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

        // Normalize in-place (we'll mutate originalPlan.hotelOptions)
        normalizeData(originalPlan);

        const hotels = originalPlan.hotelOptions || [];
        if (hotels.length === 0) {
          const s = safeStringify(originalPlan);
          if (s !== null) sessionStorage.setItem("latest_trip_plan", s);
          if (!cancelledRef.current) setPlan(originalPlan);
          return;
        }

        // Tune this batch size as needed
        const BATCH_SIZE = 6;

        for (let i = 0; i < hotels.length; i += BATCH_SIZE) {
          if (cancelledRef.current) break;

          const batch = hotels.slice(i, i + BATCH_SIZE);

          // For each hotel in batch, ALWAYS request a new image URL (no skipping)
          const batchResults = await Promise.all(
            batch.map(async (hotel, idxInBatch) => {
              const name = hotel?.hotelName ?? hotel?.name ?? "";
              const address = hotel?.hotelAddress ?? hotel?.address ?? "";

              // Call getHotelImage even if name/address are empty (service may handle)
              try {
                const url = await getHotelImage({ name, address });
                // coerce to string to avoid non-string types being saved
                return url ? String(url) : "";
              } catch (err) {
                console.warn(`[usePlanLoader] getHotelImage error for batch index ${i + idxInBatch}:`, err);
                return "";
              }
            })
          );

          // Write batch results back into the originalPlan (mutate)
          for (let j = 0; j < batchResults.length; j++) {
            const hotelIndex = i + j;
            if (hotelIndex >= originalPlan.hotelOptions.length) continue;
            originalPlan.hotelOptions[hotelIndex].hotelImageUrl = batchResults[j] ?? "";
          }

          // Persist partial updates to sessionStorage after each batch
          const serialized = safeStringify(originalPlan);
          if (serialized !== null) {
            try {
              sessionStorage.setItem("latest_trip_plan", serialized);
              // console.log(`[usePlanLoader] persisted plan after batch ${i / BATCH_SIZE}`, JSON.parse(sessionStorage.getItem("latest_trip_plan")));
            } catch (err) {
              console.warn("[usePlanLoader] failed to write sessionStorage after batch:", err);
            }
          }

          // Force React re-render so UI sees updated urls immediately
          if (!cancelledRef.current) setPlan({ ...originalPlan });
        }

        // Final persist to be sure
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
  }, []);

  const normalizedPlan = useMemo(() => (plan ? normalizeData(plan) : null), [plan]);

  return { plan, normalizedPlan, loading, setPlan };
}
