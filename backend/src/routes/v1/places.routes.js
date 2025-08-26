import { Router } from "express";
import * as ctrl from "../../controllers/places.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const router = Router();

// GET /api/v1/places/details?placeName=...
router.get("/details", asyncHandler(ctrl.getPlaceImage));

export default router;
