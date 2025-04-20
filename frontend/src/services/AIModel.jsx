import React from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function generateTravelPlan(input) {
  const res = await fetch(`${BACKEND_URL}/api/generate-trip`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data?.error || res.statusText);

  return data; // ⬅️ Now correct because backend returns full plan object
}

