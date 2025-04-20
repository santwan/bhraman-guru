// Fetch image URL from your backend (which handles Google Places API + CORS)
export const getPlaceImage = async (placeName) => {
    try {
      const encodedPlace = encodeURIComponent(placeName);
      const res = await fetch(`http://localhost:5000/api/place-details?placeName=${encodedPlace}`);
      const data = await res.json();
  
      return data?.imageUrl || null;
    } catch (err) {
      console.error("Error fetching image from backend proxy:", err);
      return null;
    }
  };
  
  // 🔴 NOT NEEDED anymore if you're using the backend only
  // Kept here only if you ever want to call Google API directly (not recommended from frontend)
  export const getPlaceId = async (placeName) => {
    const key = import.meta.env.VITE_GOOGLE_PLACE_API_KEY;
    const encodedPlace = encodeURIComponent(placeName);
    const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodedPlace}&inputtype=textquery&fields=place_id&key=${key}`;
  
    try {
      const res = await fetch(url);
      const data = await res.json();
      return data?.candidates?.[0]?.place_id || null;
    } catch (err) {
      console.error("Error fetching place ID:", err);
      return null;
    }
  };
  