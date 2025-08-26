// src/integrations/gemini.client.js
import { GoogleGenAI } from "@google/genai";
import { env } from "../config/env.js";

// Initialize once
const ai = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });

const MODEL = "gemini-2.5-flash"; // or your preferred 2.x model

const SYSTEM = (p) => `
Generate a detailed Travel Plan for:
- Destination: ${p.location}
- Duration: ${p.noOfDays} Days
- Traveler: ${p.traveler}
- Budget: ${p.budget}

Return ONLY valid JSON using EXACT keys:
{
  "tripDetails": {
    "destination": "string",
    "noOfDays": number,
    "numberOfTravelers": number,
    "budget": "string"
  },
  "hotelOptions": [
    {
      "hotelName": "string",
      "hotelAddress": "string",
      "price": "string",
      "hotelImageUrl": "valid image URL",
      "geoCoordinates": { "latitude": "string", "longitude": "string" },
      "rating": "string",
      "description": "string",
      "bookingLink": "string or null"
    }
  ],
  "dailyItinerary": [
    {
      "day": number,
      "bestTimeToVisit": "string",
      "schedule": [
        {
          "placeName": "string",
          "placeDetails": "string",
          "placeImageUrl": "valid image URL",
          "geoCoordinates": { "latitude": "string", "longitude": "string" },
          "ticketPricing": "string",
          "rating": "string",
          "estimatedTimeSpent": "string",
          "travelTimeFromPrevious": "string"
        }
      ]
    }
  ]
}
Rules:
- Use the schema exactly.
- Include at least 6 hotel options.
- Prefer real booking links (Booking/MMT/Agoda/Goibibo); else null.
`;

export const generateTripPlanJSON = async (payload) => {
  // Stream with the new SDK
  const stream = await ai.models.generateContentStream({
    model: MODEL,
    contents: [
      { role: "user", parts: [{ text: SYSTEM(payload) }] },
      { role: "user", parts: [{ text: `Plan my trip to ${payload.location}. Respond in JSON only.` }] }
    ],
    // JSON mode hint (supported in GenAI SDK):
    config: { responseMimeType: "application/json", temperature: 0.8 }
  });

  let text = "";
  for await (const chunk of stream) {
    text += chunk.text;
  }

  // Be robust to accidental ``` fences
  const fenced = text.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  const jsonStr = fenced ? fenced[1] : text;

  return JSON.parse(jsonStr);
};
