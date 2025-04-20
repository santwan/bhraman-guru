export async function generateTravelPlan(input) {
  const res = await fetch("https://bhraman-guru-production.up.railway.app/api/generate-trip", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || res.statusText);

  return data.plan;
}
