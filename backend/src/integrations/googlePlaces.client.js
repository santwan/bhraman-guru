import axios from "axios";
import { env } from "../config/env.js";

const BASE = "https://maps.googleapis.com/maps/api/place";

export const findPlaceId = async (placeName) => {

  const { data } = await axios.get(`${BASE}/findplacefromtext/json`, {

    params: 
    {
      input: placeName,
      inputtype: "textquery",
      fields: "place_id",
      key: env.GOOGLE_API_KEY,
    },
  });

  return data?.candidates?.[0]?.place_id ?? null;
};



export const getFirstPhotoUrlByPlaceId = async (placeId, maxwidth = 800) => {

  const { data } = await axios.get(`${BASE}/details/json`, {

    params: 
    {
      place_id: placeId,
      fields: "photos",
      key: env.GOOGLE_API_KEY,
    },
  });

  console.log("Google Places API response:", data);
  const ref = data?.result?.photos?.[0]?.photo_reference;
  if (!ref) return null;

  return `${BASE}/photo?maxwidth=${maxwidth}&photoreference=${ref}&key=${env.GOOGLE_API_KEY}`;

};