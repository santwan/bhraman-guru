import { findPlaceId, getFirstPhotoUrlByPlaceId } from "../integrations/googlePlaces.client.js";

export const getFirstPhotoUrl = async (placeName) => {
  const placeId = await findPlaceId(placeName);
  if (!placeId) return null;
  return getFirstPhotoUrlByPlaceId(placeId, 800); // maxwidth
};
