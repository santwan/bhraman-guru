const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

export const getPlaceImage = async (placeName) => {
  try {
    const encodedPlace = encodeURIComponent(placeName);
    const res = await fetch(`${BACKEND_URL}/api/place-details?placeName=${encodedPlace}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.imageUrl || null;
  } catch (err) {
    console.error("Error fetching image from backend proxy:", err);
    return null;
  }
};
