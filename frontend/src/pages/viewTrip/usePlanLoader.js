import { useEffect, useMemo, useRef, useState } from "react";
import { getPlaceImage, getHotelImage } from "@/services/GlobalApi";

export default function usePlanLoader({ location }) {
    const [plan, setPlan] = useState(() => location?.state?.plan || null);
    const [loading, setLoading] = useState(!plan);
    const enhancementRan = useRef(false);
    const isMounted = useRef(true);

    useEffect(() => {
        return () => { isMounted.current = false; };
    }, []);

    useEffect(() => {
        if (plan) {
            setLoading(false);
            return;
        }

        try {
            const stored = sessionStorage.getItem("latest_trip_plan");
            if (stored) setPlan(JSON.parse(stored));
        } catch (err) {
            console.warn("Failed reading latest_trip_plan from session storage", err);
        } finally {
            setLoading(false);
        }
    }, []);

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

    useEffect(() => {
        if (!normalizedPlan || enhancementRan.current) return;
        enhancementRan.current = true;

        let cancelled = false;

        const enhanceHotelImages = async () => {
            setLoading(true);
            try {
                const hotelsToEnhance = JSON.parse(JSON.stringify(normalizedPlan.hotelOptions));

                const enhancedHotels = await Promise.all(
                    hotelsToEnhance.map(async (hotel) => {
                        // If the image URL already exists, skip the API call
                        if (hotel.hotelImageUrl) {
                            return hotel;
                        }
                        try {
                            const hotelInfo = { name: hotel.hotelName, address: hotel.hotelAddress };
                            const url = await getHotelImage(hotelInfo);
                            return { ...hotel, hotelImageUrl: url || "" };
                        } catch (err) {
                            console.warn(`Error fetching image for hotel: ${hotel.hotelName}`, err);
                            return { ...hotel, hotelImageUrl: "" }; // Return with empty string on error
                        }
                    })
                );

                if (cancelled) return;

                setPlan(prevPlan => ({
                    ...prevPlan,
                    hotelOptions: enhancedHotels,
                    dailyItinerary: prevPlan.dailyItinerary // Ensure itinerary is not lost
                }));

            } catch (err) {
                console.warn("Failed enhancing hotel data", err);
            } finally {
                if (!cancelled && isMounted.current) {
                    setLoading(false);
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
