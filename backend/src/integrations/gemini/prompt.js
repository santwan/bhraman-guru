// prompt.js
export const buildSystemPrompt = (p) => `Generate a detailed Travel Plan for:
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
