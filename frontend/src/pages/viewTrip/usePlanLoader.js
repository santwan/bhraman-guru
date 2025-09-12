import { useEffect, useMemo, useRef, useState } from "react";
import { getPlaceImage, getHotelImage } from "@/services/GlobalApi";

/**
 * Custom hook to load and manage plan data for a trip.
 * - location: react-router location object ( to read location state )
 * Returns: { plan, normalizedPlan, loading }
 */

export default function usePlanLoader( { location } ) {
    const [plan, setPlan] = useState(() => ( location?.state?.plan ) || null )

    const [loading, setLoading] = useState(!plan)

    const enhancementRan = useRef(false)
    const isMounted = useRef(true)

    useEffect(() => {

        return () => { isMounted.current = false }
    }, [])

    useEffect(() => {
        if(plan) {
            console.log(plan)
            setLoading(false)
            return
        };
        console.log(plan)
        
        try {
            const stored = sessionStorage.getItem("latest_trip_plan")
            if(stored) setPlan(JSON.parse(stored))

        } catch( err ) {
            console.warn("Failed reading latest_trip_plan from session storage", err)
        } finally {
            setLoading(false)
        }
        //Intentionally run only once on mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Normalize plan data structure
    const normalizedPlan = useMemo(() => {
        if(!plan) return null;

        const p = { ...plan };
        
        if(!p.tripDetails ){
            p.tripDetails = {}
            console.log("Trip Details is missing in the plan object")
        }

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
            null

        p.tripDetails.budget = 
            p.tripDetails.budget ??
            p.tripDetails.Budget ??
            p.budget ??
            null ;

        p.tripDetails.destination = 
            p.tripDetails.destination ??
            p.tripDetails.Destination ??
            p.destination ??
            "Unknown";
        
        p.hotelOptions = Array.isArray(p.hotelOptions) 
            ? p.hotelOptions
            : Array.isArray(plan?.hotelOptions)
            ? plan.hotelOptions 
            : [];

        p.dailyItinerary = Array.isArray(p.dailyItinerary) 
            ? p.dailyItinerary 
            : Array.isArray(plan?.dailyItinerary)
            ? plan.dailyItinerary 
            : [];


        return p;
    }, [plan]) // Must depend on the plan


    // Enhancement: run once after 'plan' available
    useEffect(() => {
        if(!plan) return ;

        if(enhancementRan.current) return ;

        enhancementRan.current = true ;

        // Local boolean declared inside the effect 
        // it's work is to tell the long running async process ( batches of images fetches ) to stop doing anything 
        // if the effect has been cleaned up - because of 
        //      - the component unmounted OR 
        //      - the effect re-ran ( e.g : plan changed ) and previous run was cleaned up

        // SUMMARY: `cancelled` prevents late or stale async results from mutating state after you no longer want that effect to be active 

/* 
        ! *************** WHAT `CANCELLED` DOES NOT DO ***********
        *  It doesnot abort in flight network requests ( e.g : fetch ) -- it only ignores       results after they resolve.
        *  If a network call is slow , the browser still carries it out , cancelled just prevent my code from handling the result 
*/
        let cancelled = false;
        ( async () => {

            setLoading(true);
            try {

                const hotels = normalizedPlan.hotelOptions;
                if(hotels.length){

                    const enhancedHotels = await Promise.all
                    ( hotels.map 
                        ( async (h) => 
                            {
                                
                                try {
                                    const hotelInfo = {
                                        name: h.hotelName,
                                        address: h.hotelAddress
                                    }
                                    console.log(hotelInfo);
                                    const url = await getHotelImage(hotelInfo);
                                    return { ...h, hotelImageUrl: url || h.hotelImageUrl || ""}

                                } catch (err){
                                    console.log("Error happens while fetching hotels images", err)
                                    return h;
                                }
                            }
                        )
                    )
                    if( !cancelled ){ 
                        setPlan( (prev) => (prev ? { ...prev, hotelOptions: enhancedHotels } : prev ))
                    }
                }

                // Now collecting days and places wrt that days from the dailyItinerary
                const days = Array.isArray(normalizedPlan.dailyItinerary) ? normalizedPlan.dailyItinerary: []
                const places = [];

                for( let dayIndex = 0; dayIndex < days.length; dayIndex++ ){

                    // days is array and day is an object inside the days array
                    const day = days[dayIndex];

                    // schedule is an array inside the day object 
                    // again schedule array is consist of objects , so traverseing on the array we will be selecting each object and that object contains information about the particular location to visit.
                    const schedule = Array.isArray(day?.schedule) ? day.schedule : [];

                    for( let placeIndex = 0; placeIndex < schedule.length; placeIndex++)
                    {
                        // Selecting each object at each indexes of schedule array
                        const placeObj = schedule[placeIndex];

                        if(!placeObj) continue;

                        if(!placeObj.placeImageUrl)
                        {
                            places.push(
                                {
                                    name: placeObj.placeName,
                                    dayIndex,
                                    placeIndex
                                }
                            )
                        }
                    }
                }

                // Defining the number of images to fetch in parallel
                // this helps prevent sending too many network requests at once
                const batchSize = 3; 

                // loop through the places array, but instead of incrementing by 1(i++) , 
                // We jump forward by batchSize ( i += batchSize ) This lets us process the array in chunks
                for( let i = 0; i < places.length; i +=batchSize ){

                    // we have previously initialized cancelled variable to false
                    // before starting a new batch, we check if it's been set to true
                    // if it has, we break out of the loop to avoid unnecessary work
                    if(cancelled) break;

                    // Extract a slice of the `places` array from index i to i + batchSize
                    // This gives us a smaller array containing up to batchSize number of places to process in this iteration
                    // e.g on the first loop , it gets item 0, 1, 2 . On the second loop, it gets items 3, 4, 5 and so on
                    const batch = places.slice( i , i + batchSize)

                    // ---PARALLEL FETCH---
                    // We use Promise.all to fetch images for all places in the current batch simultaneously
                    // This is more efficient than fetching them one by one, as it reduces the overall waiting time
                    await Promise.all( batch.map( async (item) => {
                        try {
                            // For each item in the batch , call getPlaceImage to fetch the image URL
                            const url = await getPlaceImage(item.name);

                            // If the image fetch failed ( returning nothing ) or the operation was cancelled 
                            // while we are waiting , we stop processing this single item
                            if(!url || cancelled ) return ;

                            // --- IMMUTABLE STATE UPDATE ---
                            // Now we update the plan state immutably ( a state update function ). It safely updates the object without mutating the original object. 
                            setPlan( prev => {
                                // prev is the current state of plan before the update

                                // If for some reason the state is null , donot do anything 
                                if( ! prev ) return prev ;

                                // 1. Create a shallow copy of the top level plan object
                                // We do this to ensure we are not mutating the original state directly
                                const updatedPlan = { ...prev };

                                // 2. Create a shallow copy of the dailyItinerary array
                                // The .slice() method creates a new array containing the same elements as the original
                                // item.i is the index of the day in the dailyItinerary array
                                const daily = Array.isArray(prev.dailyItinerary) ? prev.dailyItinerary.slice() : [];
                                const day = daily[item.dayIndex];
                                if( !day ) return prev ;

                                // 3. Create a shallow copy of the schedule array for the specific day
                                // item.k is the index of the place in the schedule array
                                const schedule = Array.isArray(day.schedule) ? day.schedule.slice() : [];
                                const place = schedule[item.placeIndex];
                                if( !place ) return prev ;

                                // 4. Update the place object with the new image URL
                                // This is the core update. We use the spread operator `{ ...place }` to copy all existing properties of the place object
                                // Then we add or overwrite the placeImageUrl property with the new URL we fetched
                                schedule[item.placeIndex] = { ...place, placeImageUrl: url };

                                // 5. work backewards to reassemble the full updated plan object
                                // Put the modified schedule array back into the day object
                                daily[item.dayIndex] = { ...day, schedule };

                                // 6. Attach the modified daily array to our top level updatedPlan object
                                updatedPlan.dailyItinerary = daily;

                                // 7. Finally, return the fully updated plan object
                                return updatedPlan ;
                            })
                        } catch (err) {
                            // If getPlaceImage throws an error, we catch it here
                            // We simply log the error and continue with the next item in the batch
                            console.warn("Failed fetching image for ", item.name, err)
                        }
                    }))

                    // --- THROTTLING ---
                    // After an entire batch is processed and finished , we pause for 100 milliseconds. 
                    // this is a simple throttling mechanism to prevent overwhelming the network or server with too many requests in a short period
                    await new Promise( res => setTimeout(res, 100) )

                }

            } catch (err){
                console.warn("Failed enhancing plan data", err)
            } finally {
                if (  !cancelled && isMounted.current ) setLoading(false)
            }
        })();

        return () => { cancelled = true }
    }, [normalizedPlan])

    return { plan, normalizedPlan, loading , setPlan }

}