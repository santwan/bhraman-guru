import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";

// Component imports
import TripOverview from "../components/my-trips/TripOverview.jsx";
import HotelGrid from "../components/my-trips/HotelGrid.jsx";
import DailyItinerary from "../components/my-trips/DailyItinerary.jsx";
import { getPlaceImage } from "../services/GlobalApi.jsx"; // ✅ Backend proxy version for hotels

export default function MyTrips() {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);

  const tripId = searchParams.get("tripId");

  useEffect(() => {
    const fetchTrip = async () => {
      if (!tripId || !user?.uid) return;

      try {
        const tripRef = doc(db, "trips", tripId);
        const tripSnap = await getDoc(tripRef);

        if (tripSnap.exists() && tripSnap.data().userId === user.uid) {
          const data = tripSnap.data();

          // ✅ Enhance hotel images only
          const enhancedHotels = await Promise.all(
            data.plan.hotelOptions.map(async (hotel) => {
              const imageUrl = await getPlaceImage(hotel.hotelName);
              return {
                ...hotel,
                hotelImageUrl: imageUrl || hotel.hotelImageUrl,
              };
            })
          );

          data.plan.hotelOptions = enhancedHotels;

          setTripData(data);
        } else {
          console.warn("Trip not found or access denied");
        }
      } catch (err) {
        console.error("Failed to fetch trip:", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
        fetchTrip();
    }
  }, [tripId, user]);

  if (loading) return <p className="p-4">Loading trip...</p>;
  if (!tripData) return <p className="p-4 text-red-500">Trip not found or access denied.</p>;

  const { plan } = tripData;
  const { tripDetails, hotelOptions, dailyItinerary } = plan;

  return (
    <div className="max-w-5xl pt-50 mx-auto px-4 md:pt-40 pb-10">
      <h1 className="text-3xl font-bold mb-4">Trip Plan: {tripDetails.destination}</h1>

      <TripOverview tripDetails={tripDetails} />
      <HotelGrid hotelOptions={hotelOptions} />
      <DailyItinerary dailyItinerary={dailyItinerary} />
    </div>
  );
}
