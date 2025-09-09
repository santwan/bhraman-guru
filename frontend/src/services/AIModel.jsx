import React from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function generateTravelPlan(input) {
  const res = await fetch(`${BACKEND_URL}/api/v1/trips/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const responseData = await res.json();

  if (!res.ok) {
    const message = responseData.message || res.statusText;
    const errors = responseData.errors ? `: ${responseData.errors.join(", ")}` : "";
    throw new Error(`${message}${errors}`);
  }

  return responseData.data;
}
