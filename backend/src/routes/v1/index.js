import { Router } from "express";
import placesRouter from "./places.routes.js";
import tripsRouter from "./trips.routes.js";

export const routerV1 = Router();

routerV1.use("/places", placesRouter);
routerV1.use("/trips", tripsRouter);