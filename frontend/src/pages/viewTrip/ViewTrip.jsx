import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth";
import toast from "react-hot-toast";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

import TripOverview from "@/components/my-trips/TripOverview.jsx";
import HotelGrid from "@/components/my-trips/HotelGrid.jsx";
import DailyItinerary from "@/components/my-trips/DailyItinerary.jsx";

import usePlanLoader from "@/hooks/usePlanLoader.js";

import { saveTrip } from "@/services/tripServices.js"

import TabButton from "./TabButton.jsx";
import HeaderActions from "./HeaderActions.jsx";
import RawJson from "./RawJson.jsx";

export default function ViewTrip() {
  const navigate = useNavigate();

  const { plan, loading } = usePlanLoader();

  const { currentUser } = useAuth();

  const [tab, setTab] = useState("overview");

  const useSaveTripToDB = async () => {
    // console.log(currentUser)
    if(!currentUser.uid){
      toast.error("No Valid User Session Exists")
      return;
    }
    if(!plan){
      toast.error("Plan has expired in this Session")
    }
    // Creating the Object that will get stored inside the DB
    const tripPlan = {
      uid: currentUser.uid,
      plan: plan
    }
    // console.log(tripPlan)
    try{
      await saveTrip(tripPlan)
      toast.success("Trip Plan Saved Successfully")
    } catch (err){
      toast.error("Failed to save the trip plan")
    }
  }

  if (loading) return (
    <div className="flex min-h-screen flex-col items-center justify-center h-full w-full">
      <div>
        <DotLottieReact 
          src="/Loading Travel Animation.lottie"
          loop
          autoplay
        />
      </div>
    </div>
  )
  if (!plan) return (
    <div className="min-h-screen">
      <div className="h-[100vh] flex justify-center items-center text-red-500">
        No trip plan to display. Please generate a trip first.
      </div>;
    </div>
  )
  
  const { tripDetails = {}, hotelOptions = [], dailyItinerary = [] } = plan;

  const numDays = tripDetails.noOfDays 
  const numTravelers = tripDetails.numberOfTravelers 

  return (
    <div className="max-w-5xl pt-50 mx-auto px-4 md:pt-40 pb-10">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">{tripDetails.destination || "Untitled Trip"}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {numDays ? `${numDays} day(s)` : null} {numDays ? " • " : ""}{numTravelers} traveler(s)
          </p>
        </div>

        <HeaderActions
          onBack={() => navigate(-1)}
          onSave={() => useSaveTripToDB()}
        />
      </div>

      <div className="mb-6 border-b">
        <nav className="-mb-px flex space-x-4">
          <TabButton active={tab === "overview"} onClick={() => setTab("overview")}>Overview</TabButton>
          <TabButton active={tab === "hotels"} onClick={() => setTab("hotels")}>Hotels ({hotelOptions?.length || 0})</TabButton>
          <TabButton active={tab === "itinerary"} onClick={() => setTab("itinerary")}>Itinerary</TabButton>
          <TabButton active={tab === "raw"} onClick={() => setTab("raw")}>Raw JSON</TabButton>
        </nav>
      </div>

      <div>
        {tab === "overview" && <TripOverview tripDetails={tripDetails} />}

        {tab === "hotels" && (
          hotelOptions && hotelOptions.length ? (
            // pass hotelOptions — they will update as images are fetched
            <HotelGrid hotelOptions={hotelOptions} />
          ) : (
            <p className="p-4 text-gray-600">No hotel options available in this plan.</p>
          )
        )}

        {tab === "itinerary" && (
          dailyItinerary && dailyItinerary.length ? (
            <DailyItinerary dailyItinerary={dailyItinerary} />
          ) : (
            <p className="p-4 text-gray-600">No itinerary available in this plan.</p>
          )
        )}

        {tab === "raw" && <RawJson data={plan} />}
      </div>
    </div>
  );
}
