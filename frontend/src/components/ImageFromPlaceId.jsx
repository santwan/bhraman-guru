// components/ImageFromPlaceId.jsx
import { useEffect, useState } from "react";
import { getPlaceImage } from "../services/GlobalApi";

export default function ImageFromPlaceId({ placeId, alt = "Place", className = "" }) {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (!placeId) return;

    const fetchImage = async () => {
      const url = await getPlaceImage(placeId);
      setImageUrl(url);
    };

    fetchImage();
  }, [placeId]);

  return (
    <img
      src={imageUrl || "/fallback.jpg"} // Use a default fallback image
      alt={alt}
      className={className}
    />
  );
}