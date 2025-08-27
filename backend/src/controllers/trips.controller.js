import * as tripsService from "../services/trips.service.js";
import { ApiError } from "../utils/ApiError.js";

export const generateTrip = async (req, res) => {
  const { location, noOfDays, traveler, budget } = req.body || {};
  if (!location || !noOfDays || !traveler || !budget) {
    throw new ApiError(400, "Missing one of: location, noOfDays, traveler, budget");
  }
  const plan = await tripsService.generateTrip({ location, noOfDays, traveler, budget });
  res.json(plan);
};
