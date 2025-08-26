import { Router } from "express";
import * as ctrl from "../../controllers/trips.controller.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

const router = Router();

// POST /api/v1/trips/generate
router.post("/generate", asyncHandler(ctrl.generateTrip));

export default router;