// gemini.js
import { GoogleGenAI } from '@google/genai';


export async function generateTravelPlan({ location, noOfDays, traveler, budget }) {
  const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY, // Make sure this is correct
  });

  const config = {
    responseMimeType: 'application/json',
    systemInstruction: [
      {
        text: `Generate Travel Plan for ${location}, for ${noOfDays} Days for ${traveler} with a ${budget} Budget. Give me a Hotels Option List with HotelName, Hotel address, Price, Hotel image url, geo coordinates, rating, descriptions and suggest itinerary with placeName, Place Details, Place Image Url, Geo Coordinates, ticket pricing, rating, Time Travel each of the location for ${noOfDays} days with each day plan with best time to visit in JSON format.`,
      }
    ],
  };

  const model = 'gemini-2.5-pro-preview-03-25';
  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: `Plan my trip to ${location}.`,
        },
      ],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });

  let result = "";
  for await (const chunk of response) {
    result += chunk.text;
  }

  return result; // This should be a JSON string
}
