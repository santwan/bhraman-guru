import { useEffect, useMemo, useState, useRef } from "react";
import { getHotelImage } from "@/services/GlobalApi";

// Helper to normalize the plan data (safer/shallow clone to avoid mutating original)
const normalizeData = (plan) => {
  if (!plan) return null;

  // shallow clone top level and tripDetails to avoid mutating original nested objects
  const p = { ...plan, tripDetails: { ...(plan.tripDetails || {}) } };

  p.tripDetails.numberOfTravelers =
    p.tripDetails.numberOfTravelers ??
    p.tripDetails.travelers ??
    p.tripDetails.travellers ??
    p.tripDetails.traveler ??
    p.tripDetails.numberOfTravellers ??
    1;

  p.tripDetails.noOfDays =
    p.tripDetails.noOfDays ??
    p.tripDetails.noofdays ??
    p.tripDetails.noOfdays ??
    p.tripDetails.noOfDay ??
    p.tripDetails.days ??
    p.tripDetails.day ??
    p.noOfDays ??
    p.noOfDay ??
    null;

  p.tripDetails.budget = p.tripDetails.budget ?? p.tripDetails.Budget ?? p.budget ?? null;
  p.tripDetails.destination = p.tripDetails.destination ?? p.tripDetails.Destination ?? p.destination ?? "Unknown";
  p.hotelOptions = Array.isArray(p.hotelOptions) ? p.hotelOptions.map(h => ({ ...h })) : [];
  p.dailyItinerary = Array.isArray(p.dailyItinerary) ? p.dailyItinerary.map(d => ({ ...d })) : [];

  return p;
};

export default function usePlanLoader() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  // cancellation flag reachable by effect and cleanup
  const cancelledRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;

    const loadAndEnhancePlan = async () => {
      setLoading(true);

      try {
        const stored = sessionStorage.getItem("latest_trip_plan");
        if (!stored) {
          if (!cancelledRef.current) setPlan(null);
          return;
        }

        let initialPlan;
        try {
          initialPlan = JSON.parse(stored);
        } catch (err) {
          console.warn("Invalid JSON in sessionStorage for latest_trip_plan", err);
          if (!cancelledRef.current) setPlan(null);
          return;
        }

        const normalized = normalizeData(initialPlan);
        if (!normalized) {
          if (!cancelledRef.current) setPlan(null);
          return;
        }

        // Enhance hotel images with basic validation
        const hotelsToEnhance = normalized.hotelOptions || [];

        // Simple concurrency-safe approach: batch in groups of N to avoid too many parallel requests
        const BATCH_SIZE = 6; // tune as needed
        const enhancedHotels = [];

        for (let i = 0; i < hotelsToEnhance.length; i += BATCH_SIZE) {
          if (cancelledRef.current) break;

          const batch = hotelsToEnhance.slice(i, i + BATCH_SIZE);

          const batchResults = await Promise.all(
            batch.map(async (hotel) => {
              if (hotel.hotelImageUrl) return { ...hotel }; // skip existing
              const name = hotel.hotelName ?? hotel.name ?? "";
              const address = hotel.hotelAddress ?? hotel.address ?? "";

              if (!name && !address) {
                // nothing to look up, return with empty image
                return { ...hotel, hotelImageUrl: "" };
              }

              try {
                const hotelInfo = { name, address };
                const url = await getHotelImage(hotelInfo);
                return { ...hotel, hotelImageUrl: url || "" };
              } catch (err) {
                console.warn(`Error fetching image for hotel: ${hotel.hotelName || name}`, err);
                return { ...hotel, hotelImageUrl: "" };
              }
            })
          );

          enhancedHotels.push(...batchResults);
        }

        if (!cancelledRef.current) {
          setPlan({
            ...normalized,
            hotelOptions: enhancedHotels,
          });
        }
      } catch (err) {
        console.error("Failed to load and enhance trip plan:", err);
        if (!cancelledRef.current) setPlan(null);
      } finally {
        // Only update loading if still mounted (i.e., not cancelled)
        if (!cancelledRef.current) setLoading(false);
      }
    };

    loadAndEnhancePlan();

    return () => {
      // mark cancelled so in-flight async ops won't call setState
      cancelledRef.current = true;
    };
  }, []); // run once on mount

  const normalizedPlan = useMemo(() => normalizeData(plan), [plan]);

  // return the state and setter (setter is useful but doc it)
  return { plan, normalizedPlan, loading, setPlan };
}
