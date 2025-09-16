const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000" 

export const getPlaceImage = async (placeName) => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/places/place-details`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ placeName }),
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.imageUrl || null;
  } catch (err) {
    console.error("Error fetching image from backend proxy:", err);
    return null;
  }
};


export const getHotelImage = async (hotelInfo) => {
  try {

    if(!hotelInfo.name) throw new Error("Hotel name is required");
    if(!hotelInfo.address) throw new Error("Hotel address is not defined")
    

    const res = await fetch( `${BACKEND_URL}/api/v1/places/hotel-details`, {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify(hotelInfo)

    })

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.hotelImageUrl || null;
  } catch (err) {
    console.error("Error fetching hotels images from backend proxy:", err);
    
  }
};