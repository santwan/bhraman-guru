// backend/index.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1) CORS: restrict to your frontend origin
app.use(cors({
  origin: process.env.FRONTEND_URL,
  optionsSuccessStatus: 200
}));

// 2) Rate limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,
  message: { error: "Too many requests, please try again later." }
}));

// 3) JSON body parsing
app.use(express.json());

/**
 * GET /api/place-details
 * Proxy to Google Places API to fetch a photo reference and return an image URL.
 */
app.get("/api/place-details", async (req, res) => {
  const { placeName } = req.query;
  if (!placeName) {
    return res.status(400).json({ error: "Missing placeName parameter" });
  }

  try {
    // a) Find place_id
    const findResp = await axios.get("https://maps.googleapis.com/maps/api/place/findplacefromtext/json", {
      params: {
        input: placeName,
        inputtype: "textquery",
        fields: "place_id",
        key: process.env.GOOGLE_API_KEY,
      }
    });

    const placeId = findResp.data.candidates?.[0]?.place_id;
    if (!placeId) {
      return res.status(404).json({ error: "Place ID not found" });
    }

    // b) Fetch photo reference
    const detailsResp = await axios.get("https://maps.googleapis.com/maps/api/place/details/json", {
      params: {
        place_id: placeId,
        fields: "photos",
        key: process.env.GOOGLE_API_KEY,
      }
    });

    const photoRef = detailsResp.data.result?.photos?.[0]?.photo_reference;
    if (!photoRef) {
      return res.status(404).json({ error: "No photo reference found" });
    }

    // c) Build image URL
    const imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoRef}&key=${process.env.GOOGLE_API_KEY}`;
    res.json({ imageUrl });

  } catch (err) {
    console.error("Error in /api/place-details:", err.message);
    res.status(500).json({ error: "Failed to fetch place image" });
  }
});

/**
 * POST /api/generate-trip
 * Uses Google GenAI (Gemini) to generate a travel plan, keeping the API key secret.
 */

// backend/index.js

app.post("/api/generate-trip", async (req, res) => {
  const { location, noOfDays, traveler, budget } = req.body;
  if (!location || !noOfDays || !traveler || !budget) {
    return res.status(400).json({ error: "Missing one of: location, noOfDays, traveler, budget" });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const config = {
      responseMimeType: "application/json",
      temperature: 0.8,
      systemInstruction: [{
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
      }],
    };
    const model =  "gemini-1.5-pro-latest";
    const contents = [{
      role: "user",
      parts: [{ text: `Plan my trip to ${location}.` }]
    }];

    // 1) stream the AI response
    const stream = await ai.models.generateContentStream({ 
      model, 
      config, 
      contents 
    });
    
    let fullText = "";
    for await (const chunk of stream) {
      fullText += chunk.text;
    }

    // 2) return the raw string
    let planObj;
    try {
      planObj = JSON.parse(fullText);
    } catch(parseErr) {
      console.error("Failed to parse AI JSON:", parseErr, "raw:", fullText);
      return res.status(500).json({ error: "Invalid JSON from AI" });
    }

    // send the object itself
    return res.json(planObj);

  } catch (err) {
    console.error("Error generating trip:", err);
    return res.status(500).json({ error: "AI generation failed" });
  }
});

// Health check route
app.get("/", (req, res) => {
  res.send("BhramanGuru Backend is running 🚀");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Proxy + AI backend running on http://localhost:${PORT}`);
});




