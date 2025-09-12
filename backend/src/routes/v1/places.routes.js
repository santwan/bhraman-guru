import { Router } from "express";
import { getPlaceImage, getHotelImage } from "../../controllers/places.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const router = Router();

// POST /api/v1/places/details
router.post("/places/place-details", asyncHandler(getPlaceImage));

router.post("/places/hotel-details", asyncHandler(getHotelImage));

export default router;
