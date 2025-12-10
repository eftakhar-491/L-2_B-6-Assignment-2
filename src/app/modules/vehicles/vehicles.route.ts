import { NextFunction, Request, Response, Router } from "express";

import { envVars } from "../../config/env";
import { checkAuth } from "../../middlewares/checkAuth";
import { VehiclesControllers } from "./vehicles.controller";

const router = Router();

router.post("/", VehiclesControllers.addNewVehicles);
router.get("/", VehiclesControllers.viewAllVehicles);

export const VehiclesRoutes = router;
