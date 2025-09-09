// src/pages/ViewTrip.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import { useAuth } from "@/context/auth";
import toast from "react-hot-toast";

import TripOverview from "@/components/my-trips/TripOverview.jsx";
import HotelGrid from "@/components/my-trips/HotelGrid.jsx";
import DailyItinerary from "@/components/my-trips/DailyItinerary.jsx";
import { getPlaceImage } from "@/services/GlobalApi.jsx";

/**
 * ViewTrip page (corrected)
 * - Prevents effect-render loops
 * - Recovers plan from sessionStorage on mount if needed
 * - Enhances hotel and place images in a safe, batched manner
 * - Save-to-Firestore flow preserved
 */

export default function ViewTrip() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // initialize from location.state if available (one-time init)
  const [plan, setPlan] = useState(() => (location.state && location.state.plan) || null);
  const [loading, setLoading] = useState(!plan);
  const [saving, setSaving] = useState(false);
  const enhancementRan = useRef(false);
  const isMounted = useRef(true);

  // UI tab: 'overview' | 'hotels' | 'itinerary' | 'raw'
  const [tab, setTab] = useState("overview");

  // On mount: recover from sessionStorage if plan missing
  useEffect(() => {
    if (plan) {
      setLoading(false);
      return;
    }

    try {
      const stored = sessionStorage.getItem("latest_trip_plan");
      if (stored) {
        setPlan(JSON.parse(stored));
      }
    } catch (err) {
      console.warn("Failed to read plan from sessionStorage", err);
    } finally {
      // keep loading cleared after attempt
      setLoading(false);
    }

    return () => {
      isMounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  // Normalize plan shape for presentational components
  const normalizedPlan = useMemo(() => {
    if (!plan) return null;

    // shallow copy of top-level plan
    const p = { ...plan };

    if (!p.tripDetails) p.tripDetails = {};
    // map common variants to numberOfTravelers
    p.tripDetails.numberOfTravelers =
      p.tripDetails.numberOfTravelers ??
      p.tripDetails.traveler ??
      p.tripDetails.travellers ??
      p.tripDetails.travelers ??
      p.tripDetails.numberOfTravellers ??
      1;

    p.tripDetails.noOfDays = p.tripDetails.noOfDays ?? p.noOfDays ?? p.tripDetails.days ?? null;
    p.tripDetails.budget = p.tripDetails.budget ?? p.budget ?? null;
    p.tripDetails.destination = p.tripDetails.destination ?? p.destination ?? "Untitled";

    // normalize arrays defensively
    p.hotelOptions = Array.isArray(p.hotelOptions)
      ? p.hotelOptions
      : Array.isArray(p.plan?.hotelOptions)
      ? p.plan.hotelOptions
      : p.hotelOptions ?? [];

    if (!p.hotelOptions.length && p.plan && Array.isArray(p.plan.hotelOptions)) {
      p.hotelOptions = p.plan.hotelOptions;
    }

    p.dailyItinerary = Array.isArray(p.dailyItinerary)
      ? p.dailyItinerary
      : p.plan?.dailyItinerary ?? [];

    return p;
  }, [plan]);

  // Enhancement effect: runs only once per mount AFTER plan is available
  useEffect(() => {
    if (!plan) return; // nothing to enhance
    if (enhancementRan.current) return; // already ran
    enhancementRan.current = true;

    let cancelled = false;
    const runEnhancement = async () => {
      setLoading(true);

      try {
        // 1) Enhance hotels (parallel)
        const hotels = (plan.hotelOptions && Array.isArray(plan.hotelOptions)) ? plan.hotelOptions : [];
        if (hotels.length) {
          const enhanced = await Promise.all(
            hotels.map(async (h) => {
              // keep existing hotelImageUrl if present
              if (h.hotelImageUrl) return h;
              try {
                const url = await getPlaceImage(h.hotelName);
                return { ...h, hotelImageUrl: url || h.hotelImageUrl || "" };
              } catch (err) {
                console.warn("hotel image fetch failed for", h.hotelName, err);
                return h;
              }
            })
          );

          if (cancelled) return;
          // patch hotelOptions immutably
          setPlan((prev) => (prev ? { ...prev, hotelOptions: enhanced } : prev));
        }

        // 2) Prepare list of places to enhance
        const days = (plan.dailyItinerary && Array.isArray(plan.dailyItinerary)) ? plan.dailyItinerary : [];
        const placesList = [];
        days.forEach((day, di) => {
          (day.schedule || []).forEach((place, pi) => {
            if (!place) return;
            // only enqueue if image missing
            if (!place.placeImageUrl) {
              placesList.push({ name: place.placeName, di, pi });
            }
          });
        });

        // Batch fetch place images to avoid blocking UI (e.g., 3 at a time)
        const batchSize = 3;
        for (let i = 0; i < placesList.length; i += batchSize) {
          if (cancelled) break;
          const batch = placesList.slice(i, i + batchSize);
          await Promise.all(
            batch.map(async (item) => {
              try {
                const img = await getPlaceImage(item.name);
                if (!img) return;
                if (cancelled) return;

                // update only the specific nested item (no deep clone of the whole plan)
                setPlan((prev) => {
                  if (!prev) return prev;
                  // clone top-level and dailyItinerary array
                  const next = { ...prev };
                  next.dailyItinerary = Array.isArray(prev.dailyItinerary) ? [...prev.dailyItinerary] : [];
                  const targetDay = next.dailyItinerary[item.di];
                  if (!targetDay) return prev;
                  // clone schedule array and target place
                  const schedule = Array.isArray(targetDay.schedule) ? [...targetDay.schedule] : [];
                  const targetPlace = schedule[item.pi];
                  if (!targetPlace) return prev;
                  schedule[item.pi] = { ...targetPlace, placeImageUrl: img };
                  next.dailyItinerary[item.di] = { ...targetDay, schedule };
                  return next;
                });
              } catch (err) {
                // ignore single failures
                console.warn("place image fetch failed for", item.name, err);
              }
            })
          );
          // small pause to keep UI responsive
          // eslint-disable-next-line no-await-in-loop
          await new Promise((r) => setTimeout(r, 100));
        }
      } catch (err) {
        console.error("Enhancement error", err);
      } finally {
        if (!cancelled && isMounted.current) setLoading(false);
      }
    };

    runEnhancement();

    return () => {
      cancelled = true;
    };
    // intentionally only depend on `plan` so this runs once after we have a plan
  }, [plan]);

  // Save trip to Firestore
  const handleSaveTrip = async () => {
    const p = plan || normalizedPlan;
    if (!p) {
      toast.error("No trip plan available to save.");
      return;
    }
    if (!user?.uid) {
      toast.error("Please sign in to save trips.");
      return;
    }

    const suggested = p.tripDetails?.destination || "Untitled Trip";
    const title = window.prompt("Save trip as (enter a name):", suggested);
    if (title === null) return; // cancelled

    setSaving(true);
    try {
      const payload = {
        userId: user.uid,
        title: title || suggested,
        createdAt: serverTimestamp(),
        plan: p,
      };
      const col = collection(db, "trips");
      const docRef = await addDoc(col, payload);

      toast.success("Trip saved!");
      navigate(`/my-trips?tripId=${docRef.id}`);
    } catch (err) {
      console.error("Failed to save trip:", err);
      toast.error("Failed to save trip. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => navigate(-1);

  if (loading) return <p className="p-4">Loading trip preview...</p>;
  if (!normalizedPlan) return <p className="p-4 text-red-500">No trip plan to display. Please generate a trip first.</p>;

  // destructure for rendering
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

        <div className="flex items-center gap-3">
          <button onClick={handleBack} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Back</button>
          <button
            onClick={handleSaveTrip}
            disabled={saving}
            className={`px-4 py-2 rounded ${saving ? "bg-gray-300" : "bg-primary-600 hover:bg-primary-700 text-white"}`}
          >
            {saving ? "Saving..." : "Save Trip"}
          </button>
        </div>
      </div>

      {/* Tabs */}
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

        {tab === "raw" && (
          <pre className="bg-gray-100 p-4 rounded-lg text-sm text-left overflow-x-auto">
            {JSON.stringify(normalizedPlan, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}

/* Small presentational TabButton component */
function TabButton({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 -mb-px border-b-2 ${active ? "border-primary-600 text-primary-700" : "border-transparent text-gray-600 hover:text-gray-800"}`}
    >
      {children}
    </button>
  );
}
