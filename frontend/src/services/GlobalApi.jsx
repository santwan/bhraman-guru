// Fetch image URL from your backend (which handles Google Places API + CORS)
export const getPlaceImage = async (placeName) => {
  try {
    const encodedPlace = encodeURIComponent(placeName);
    // ← use a relative path here…
    const res = await fetch(`https://bhraman-guru-production.up.railway.app/api/place-details?placeName=${encodedPlace}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.imageUrl || null;
  } catch (err) {
    console.error("Error fetching image from backend proxy:", err);
    return null;
  }
};

  