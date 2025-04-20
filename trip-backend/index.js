// index.js
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1) Restrict CORS to your frontend only
app.use(cors({
  origin: process.env.FRONTEND_URL,   // e.g. "https://your-app-url.com"
  optionsSuccessStatus: 200
}));

// 2) Add basic rate‑limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                 // limit each IP to 100 requests per window
  message: { error: "Too many requests, please try again later." }
});
app.use(limiter);

// 3) Place‑details endpoint
app.get("/api/place-details", async (req, res) => {
  const { placeName } = req.query;
  if (!placeName) {
    return res.status(400).json({ error: "Missing placeName parameter" });
  }

  try {
    // a) Find the place ID
    const findResp = await axios.get(
      `https://maps.googleapis.com/maps/api/place/findplacefromtext/json`, {
        params: {
          input: placeName,
          inputtype: "textquery",
          fields: "place_id",
          key: process.env.GOOGLE_API_KEY,
        }
      }
    );

    const placeId = findResp.data.candidates?.[0]?.place_id;
    if (!placeId) {
      return res.status(404).json({ error: "Place ID not found" });
    }

    // b) Fetch the photo reference
    const detailsResp = await axios.get(
      `https://maps.googleapis.com/maps/api/place/details/json`, {
        params: {
          place_id: placeId,
          fields: "photos",
          key: process.env.GOOGLE_API_KEY,
        }
      }
    );

    const photoRef = detailsResp.data.result?.photos?.[0]?.photo_reference;
    if (!photoRef) {
      return res.status(404).json({ error: "No photo reference found" });
    }

    // c) Construct the image URL
    const imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoRef}&key=${process.env.GOOGLE_API_KEY}`;
    return res.json({ imageUrl });

  } catch (err) {
    console.error("Error in /api/place-details:", err.message);
    return res.status(500).json({ error: "Failed to fetch place image" });
  }
});

// 4) Start server
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});
