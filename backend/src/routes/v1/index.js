/**
 * @file This script serves as the primary router for version 1 of the API.
 * It aggregates all feature-specific routers (like auth, places, trips)
 * and mounts them onto a single parent router. This modular approach keeps
 * the routing logic organized and easy to maintain as the application grows.
 */

// Import the Router factory function from the Express framework.
import { Router } from "express";

// Import the dedicated routers for each distinct feature of the application.
import authRouter from "./auth.routes.js"; // Handles all authentication-related endpoints (e.g., /register, /login).
import placesRouter from "./places.routes.js"; // Handles all endpoints related to geographical places.
import tripsRouter from "./trips.routes.js"; // Handles all endpoints for managing user trips.

// Create a new router instance specifically for the v1 API endpoints.
// This instance will act as the parent for all other v1 feature routers.
export const routerV1 = Router();

//! --- Mount Feature Routers ---
// Use the .use() method to mount the imported routers onto specific path prefixes.
// This creates a hierarchical routing structure.

// Any request that comes to a path starting with "/auth" will be forwarded to the `authRouter`.
// For example, a request to `/api/v1/auth/login` will be handled by the `/login` route inside `authRouter`.
routerV1.use("/auth", authRouter);

// Any request starting with "/places" will be forwarded to the `placesRouter`.
// Example: `/api/v1/places/search`
routerV1.use("/places", placesRouter);

// Any request starting with "/trips" will be forwarded to the `tripsRouter`.
// Example: `/api/v1/trips/create`
routerV1.use("/trips", tripsRouter);
