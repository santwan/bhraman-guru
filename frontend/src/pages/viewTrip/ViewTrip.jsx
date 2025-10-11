import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

import TripOverview from "@/components/my-trips/TripOverview.jsx";
import HotelGrid from "@/components/my-trips/HotelGrid.jsx";
import DailyItinerary from "@/components/my-trips/DailyItinerary.jsx";

import usePlanLoader from "@/hooks/usePlanLoader.js";
import useSaveTrip from "./useSaveTrip.js";

import TabButton from "./TabButton.jsx";
import HeaderActions from "./HeaderActions.jsx";
import RawJson from "./RawJson.jsx";

/**
 * ViewTrip page
 *
 * Responsibilities:
 *  - Load the trip plan from sessionStorage (via usePlanLoader)
 *  - Provide tabbed navigation for Overview / Hotels / Itinerary / Raw JSON
 *  - Trigger save flow (via useSaveTrip) which persists the plan to backend/firestore
 *  
 * Notes:
 *  - `usePlanLoader` returns both the original `plan` (the raw object loaded from sessionStorage)
 *    and a `normalizedPlan` (a safe copy / shape-normalized object ready for rendering).
 *    We intentionally prefer saving the raw `plan` because some hooks/components may mutate it
 *    in-place (e.g., writing fetched image URLs back to sessionStorage).
 *
 *  - Keep UI rendering deterministic: avoid any browser-only globals in render.
 *
 * @returns {JSX.Element}
 */
export default function ViewTrip() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // The hook now handles its own data loading from sessionStorage
  // `plan` will be the original object parsed from sessionStorage and mutated in-place by the hook.
  const { plan, normalizedPlan, loading } = usePlanLoader();
  

  // Save logic extracted
  // Use the raw `plan` (not only normalizedPlan) to ensure the saved object includes in-place mutations
  // (e.g. hotelImageUrl that were written back to sessionStorage).
  const { saving, saveTrip } = useSaveTrip({ user, plan, navigate });

  const [tab, setTab] = useState("overview");

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
  if (!normalizedPlan) return (
    <div className="min-h-screen">
      <div className="h-[100vh] flex justify-center items-center text-red-500">
        No trip plan to display. Please generate a trip first.
      </div>;
    </div>
  )
  

  // defensive destructure with defaults
  const { tripDetails = {}, hotelOptions = [], dailyItinerary = [] } = normalizedPlan;

  const numDays = tripDetails.noOfDays ?? tripDetails.noOfDays === 0 ? tripDetails.noOfDays : null;
  const numTravellers = tripDetails.numberOfTravelers ?? tripDetails.travelers ?? 1;

  return (
    <div className="max-w-5xl pt-50 mx-auto px-4 md:pt-40 pb-10">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">{tripDetails.destination || "Untitled Trip"}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {numDays ? `${numDays} day(s)` : null} {numDays ? " • " : ""}{numTravellers} traveler(s)
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

        {tab === "raw" && <RawJson data={normalizedPlan} />}
      </div>
    </div>
  );
}
