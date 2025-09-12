// src/pages/ViewTrip/hooks/useSaveTrip.js
import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";
import toast from "react-hot-toast";

/**
 * useSaveTrip
 * - user: auth user object (must have uid)
 * - plan: plan object to save
 * - navigate: react-router navigate function
 */
export default function useSaveTrip({ user, plan, navigate }) {
  const [saving, setSaving] = useState(false);

  const saveTrip = async () => {
    if (!plan) {
      toast.error("No plan to save.");
      return;
    }
    if (!user?.uid) {
      toast.error("Please sign in to save trips.");
      return;
    }

    const suggested = plan.tripDetails?.destination || "Untitled Trip";
    const title = window.prompt("Save trip as (enter a name):", suggested);
    if (title === null) return;

    setSaving(true);
    try {
      const payload = {
        userId: user.uid,
        title: title || suggested,
        createdAt: serverTimestamp(),
        plan,
      };
      const col = collection(db, "trips");
      const docRef = await addDoc(col, payload);
      toast.success("Trip saved!");
      // navigate to MyTrips so it can fetch by id
      navigate(`/my-trips?tripId=${docRef.id}`);
    } catch (err) {
      console.error("Failed to save trip:", err);
      toast.error("Failed to save trip. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return { saving, saveTrip };
}
