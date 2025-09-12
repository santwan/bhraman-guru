import { useEffect, useMemo, useState, useRef } from "react";
import { getHotelImage } from "@/services/GlobalApi";

// Helper to normalize the plan data
const normalizeData = (plan) => {
    if (!plan) return null;

    const p = { ...plan };

    p.tripDetails = p.tripDetails || {};
    p.tripDetails.numberOfTravelers = p.tripDetails.numberOfTravelers || p.tripDetails.travelers || p.tripDetails.travellers || p.tripDetails.traveler || p.tripDetails.numberOfTravellers || 1;
    p.tripDetails.noOfDays = p.tripDetails.noOfDays || p.tripDetails.noofdays || p.tripDetails.noOfdays || p.tripDetails.noOfDay || p.tripDetails.days || p.tripDetails.day || p.noOfDays || p.noOfDay || null;
    p.tripDetails.budget = p.tripDetails.budget || p.tripDetails.Budget || p.budget || null;
    p.tripDetails.destination = p.tripDetails.destination || p.tripDetails.Destination || p.destination || "Unknown";
    p.hotelOptions = Array.isArray(p.hotelOptions) ? p.hotelOptions : [];
    p.dailyItinerary = Array.isArray(p.dailyItinerary) ? p.dailyItinerary : [];
    
    return p;
};

export default function usePlanLoader() {
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const isMounted = useRef(true);

    useEffect(() => {
        // This effect runs only once on mount
        const loadAndEnhancePlan = async () => {
            let cancelled = false;
            setLoading(true);

            try {
                // 1. Load from sessionStorage
                const stored = sessionStorage.getItem("latest_trip_plan");
                if (!stored) {
                    if (isMounted.current) setPlan(null);
                    return; // Exit early if no plan
                }
                
                const initialPlan = JSON.parse(stored);

                // 2. Normalize the data
                const normalized = normalizeData(initialPlan);
                if (!normalized) return;

                // 3. Enhance hotel images
                const hotelsToEnhance = normalized.hotelOptions || [];
                const enhancedHotels = await Promise.all(
                    hotelsToEnhance.map(async (hotel) => {
                        if (hotel.hotelImageUrl) return hotel; // Skip if image exists
                        try {
                            const hotelInfo = { name: hotel.hotelName, address: hotel.hotelAddress };
                            const url = await getHotelImage(hotelInfo);
                            return { ...hotel, hotelImageUrl: url || "" };
                        } catch (err) {
                            console.warn(`Error fetching image for hotel: ${hotel.hotelName}`, err);
                            return { ...hotel, hotelImageUrl: "" };
                        }
                    })
                );

                if (cancelled || !isMounted.current) return;

                // 4. Set the final, enhanced plan
                setPlan({
                    ...normalized,
                    hotelOptions: enhancedHotels,
                });
                
            } catch (err) {
                console.error("Failed to load and enhance trip plan:", err);
                if (isMounted.current) setPlan(null);
            } finally {
                if (!cancelled && isMounted.current) {
                    setLoading(false); // 5. Stop loading
                }
            }
        };

        loadAndEnhancePlan();

        return () => {
            isMounted.current = false;
        };
    }, []); // Empty dependency array ensures this runs only once

    // The normalized plan is now derived directly from the final state
    const normalizedPlan = useMemo(() => normalizeData(plan), [plan]);

    return { plan, normalizedPlan, loading, setPlan };
}