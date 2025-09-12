// src/pages/ViewTrip/index.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth";

import TripOverview from "@/components/my-trips/TripOverview.jsx";
import HotelGrid from "@/components/my-trips/HotelGrid.jsx";
import DailyItinerary from "@/components/my-trips/DailyItinerary.jsx";

import usePlanLoader from "./usePlanLoader.js";
import useSaveTrip from "./useSaveTrip.js";

import TabButton from "./TabButton.jsx";
import HeaderActions from "./HeaderActions.jsx";
import RawJson from "./RawJson.jsx";

/**
 * Entry: ViewTrip page (small & readable)
 */
export default function ViewTrip() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Hook handles loading from location.state / sessionStorage and enhancing images
  const { plan, normalizedPlan, loading } = usePlanLoader({ location });

  // Save logic extracted
  const { saving, saveTrip } = useSaveTrip({ user, plan: normalizedPlan , navigate });

  const [tab, setTab] = useState("overview");

  console.log("normalizedPlan in ViewTrip:", JSON.stringify(normalizedPlan, null, 2));

  if (loading) return <p className="p-4">Loading trip preview...</p>;
  if (!normalizedPlan) return <p className="p-4 text-red-500">No trip plan to display. Please generate a trip first.</p>;

  const { tripDetails = {}, hotelOptions = [], dailyItinerary = [] } = normalizedPlan;

  return (
    <div className="max-w-5xl pt-50 mx-auto px-4 md:pt-40 pb-10">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">{tripDetails.destination || "Untitled Trip"}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {tripDetails.noOfDays ? `${tripDetails.noOfDays} day(s)` : null} • {tripDetails.numberOfTravelers} traveler(s)
          </p>
        </div>

        <HeaderActions
          onBack={() => navigate(-1)}
          onSave={() => saveTrip()}
          saving={saving}
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

        {tab === "raw" && <RawJson data={normalizedPlan} />}
      </div>
    </div>
  );
}
