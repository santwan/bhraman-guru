import { Router } from "express";
import { getPlaceImage, getHotelImage } from "../../controllers/places.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const router = Router();

// POST /api/v1/places/place-details
router.post("/place-details", asyncHandler(getPlaceImage));

router.post("/hotel-details", asyncHandler(getHotelImage));

export default router;
