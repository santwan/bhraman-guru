import { generateTripPlanJSON } from "../integrations/gemini.client.js";

export const generateTrip = async ({ location, noOfDays, traveler, budget }) => {
  return generateTripPlanJSON({ location, noOfDays, traveler, budget });
}