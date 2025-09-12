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

        const enhancePlan = async () => {
            setLoading(true);
            try {
                const planToEnhance = JSON.parse(JSON.stringify(normalizedPlan));

                const enhancedHotelsPromise = Promise.all(
                    planToEnhance.hotelOptions.map(async (hotel) => {
                        try {
                            const hotelInfo = { name: hotel.hotelName, address: hotel.hotelAddress };
                            const url = await getHotelImage(hotelInfo);
                            return { ...hotel, hotelImageUrl: url || hotel.hotelImageUrl || "" };
                        } catch (err) {
                            console.warn("Error fetching hotel image:", err);
                            return hotel;
                        }
                    })
                );

                const enhancedItineraryPromise = Promise.all(
                    planToEnhance.dailyItinerary.map(async (day) => {
                        const enhancedSchedule = await Promise.all(
                            day.schedule.map(async (place) => {
                                if (place.placeImageUrl) return place;
                                try {
                                    const url = await getPlaceImage(place.placeName);
                                    return { ...place, placeImageUrl: url || "" };
                                } catch (err) {
                                    console.warn("Error fetching place image:", err);
                                    return place;
                                }
                            })
                        );
                        return { ...day, schedule: enhancedSchedule };
                    })
                );

                const [enhancedHotels, enhancedItinerary] = await Promise.all([
                    enhancedHotelsPromise,
                    enhancedItineraryPromise,
                ]);

                if (cancelled) return;

                const finalEnhancedPlan = {
                    ...planToEnhance,
                    hotelOptions: enhancedHotels,
                    dailyItinerary: enhancedItinerary,
                };

                console.log("Final plan object right before setting state:", JSON.stringify(finalEnhancedPlan, null, 2));
                setPlan(finalEnhancedPlan);

            } catch (err) {
                console.warn("Failed enhancing plan data", err);
            } finally {
                if (!cancelled && isMounted.current) {
                    setLoading(false);
                }
            }
        };

        enhancePlan();

        return () => {
            cancelled = true;
        };
    }, [normalizedPlan]);

    return { plan, normalizedPlan, loading, setPlan };
}
