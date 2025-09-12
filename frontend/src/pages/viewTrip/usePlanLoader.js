import { useEffect, useMemo, useRef, useState } from "react";
import { getHotelImage } from "@/services/GlobalApi";

// No longer receives `location` prop
export default function usePlanLoader() {
    // Initialize plan to null. It will be populated from sessionStorage.
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true); // Start loading, as we need to read from storage.
    const enhancementRan = useRef(false);
    const isMounted = useRef(true);

    useEffect(() => {
        return () => { isMounted.current = false; };
    }, []);

    // Effect to load the plan from sessionStorage on initial mount
    useEffect(() => {
        try {
            const stored = sessionStorage.getItem("latest_trip_plan");
            if (stored) {
                const parsedPlan = JSON.parse(stored);
                if (isMounted.current) {
                    setPlan(parsedPlan);
                }
            } else {
                 if (isMounted.current) setLoading(false); // No plan found, stop loading
            }
        } catch (err) {
            console.warn("Failed reading latest_trip_plan from session storage", err);
            if (isMounted.current) setLoading(false);
        }
    }, []); // Empty dependency array ensures this runs only once

    const normalizedPlan = useMemo(() => {
        if (!plan) return null;

        const p = { ...plan };

        p.tripDetails = p.tripDetails || {};
        p.tripDetails.numberOfTravelers = p.tripDetails.numberOfTravelers || p.tripDetails.travelers || p.tripDetails.travellers || p.tripDetails.traveler || p.tripDetails.numberOfTravellers || 1;
        p.tripDetails.noOfDays = p.tripDetails.noOfDays || p.tripDetails.noofdays || p.tripDetails.noOfdays || p.tripDetails.noOfDay || p.tripDetails.days || p.tripDetails.day || p.noOfDays || p.noOfDay || null;
        p.tripDetails.budget = p.tripDetails.budget || p.tripDetails.Budget || p.budget || null;
        p.tripDetails.destination = p.tripDetails.destination || p.tripDetails.Destination || p.destination || "Unknown";
        p.hotelOptions = Array.isArray(p.hotelOptions) ? p.hotelOptions : (Array.isArray(plan?.hotelOptions) ? plan.hotelOptions : []);
        p.dailyItinerary = Array.isArray(p.dailyItinerary) ? p.dailyItinerary : (Array.isArray(plan?.dailyItinerary) ? plan.dailyItinerary : []);

        return p;
    }, [plan]);

    // Effect to enhance hotel images once the normalizedPlan is ready
    useEffect(() => {
        if (!normalizedPlan || enhancementRan.current) return;
        enhancementRan.current = true;

        let cancelled = false;

        const enhanceHotelImages = async () => {
            console.log("Initial plan before enhancement:", JSON.stringify(normalizedPlan, null, 2));
            setLoading(true); // Start loading for image enhancement
            try {
                const hotelsToEnhance = JSON.parse(JSON.stringify(normalizedPlan.hotelOptions));

                const enhancedHotels = await Promise.all(
                    hotelsToEnhance.map(async (hotel) => {
                        if (hotel.hotelImageUrl) return hotel; // Skip if image already exists
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

                setPlan(prevPlan => {
                    const newPlan = { ...prevPlan, hotelOptions: enhancedHotels };
                    console.log("Final plan after enhancement:", JSON.stringify(newPlan, null, 2));
                    return newPlan;
                });

            } catch (err) {
                console.warn("Failed enhancing hotel data", err);
            } finally {
                if (!cancelled && isMounted.current) {
                    setLoading(false); // Finish loading after enhancement
                }
            }
        };

        enhanceHotelImages();

        return () => {
            cancelled = true;
        };
    }, [normalizedPlan]);

    return { plan, normalizedPlan, loading, setPlan };
}
