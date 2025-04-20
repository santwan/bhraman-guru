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
        text: `Generate a detailed Travel Plan for:

                - Destination: ${location}
                - Duration: ${noOfDays} Days
                - Traveler: ${traveler}
                - Budget: ${budget}

                Return the result strictly as a JSON object using the following schema. Do not include any explanation, text, or formatting — only valid JSON.
                Output a JSON object with the following structure:

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
                    "geoCoordinates": {
                        "latitude": "string",
                        "longitude": "string"
                    },
                    "rating": "string (e.g., 4.5/5)",
                    "description": "string",
                    "bookingLink": "string (if no valid address found then return null"
                    }
                ],
                "dailyItinerary": [
                    {
                    "day": number,
                    "bestTimeToVisit": "string (e.g., Morning or October-March)",
                    "schedule": [
                        {
                        "placeName": "string",
                        "placeDetails": "string",
                        "placeImageUrl": "valid image URL",
                        "geoCoordinates": {
                            "latitude": "string",
                            "longitude": "string"
                        },
                        "ticketPricing": "string",
                        "rating": "string (e.g., 4.4/5)",
                        "estimatedTimeSpent": "string",
                        "travelTimeFromPrevious": "string"
                        }
                    ]
                    }
                ]
                }


                Ensure:
                ⚠️ Always use the exact structure and keys shown above.
                ⚠️ Ensure 'dailyItinerary' always uses a 'schedule' array with consistent keys.
                ⚠️ Always include **at least 6 hotel options** under the hotelOptions key.
                - For each hotel in hotelOptions, if a direct official website is not found, generate a valid third-party booking link instead (such as from Booking.com, MakeMyTrip, Agoda, or Goibibo).
                - Prefer links to known travel sites over leaving the bookingLink field as null.


                Respond only with JSON — no explanations or text before/after.`,
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
