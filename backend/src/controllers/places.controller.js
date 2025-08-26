import * as placesService from "../services/places.service.js";
import { ApiError } from "../utils/ApiError.js";

export const getPlaceImage = async (req, res) => {
  const { placeName } = req.query;
  if (!placeName) throw new ApiError(400, "Missing placeName parameter");

  const imageUrl = await placesService.getFirstPhotoUrl(placeName);
  if (!imageUrl) throw new ApiError(404, "No photo reference found");

  res.json({ imageUrl });
};
