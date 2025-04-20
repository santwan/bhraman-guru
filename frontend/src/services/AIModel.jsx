// src/services/AIModel.jsx
export async function generateTravelPlan(input) {
  const res = await fetch("/api/generate-trip", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error((await res.json()).error || res.statusText);
  return (await res.json()).plan;
}
