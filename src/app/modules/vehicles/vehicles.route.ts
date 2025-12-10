import { NextFunction, Request, Response, Router } from "express";

import { envVars } from "../../config/env";
import { checkAuth } from "../../middlewares/checkAuth";
import { VehiclesControllers } from "./vehicles.controller";

const router = Router();

router.post("/", checkAuth("admin"), VehiclesControllers.addNewVehicles);
router.get("/", VehiclesControllers.getAllVehicles);
router.get("/:vehicleId", VehiclesControllers.getSingleVehicle);
router.put(
  "/:vehicleId",
  checkAuth("admin"),
  VehiclesControllers.updateSingleVehicle
);
router.delete(
  "/:vehicleId",
  checkAuth("admin"),
  VehiclesControllers.deleteSingleVehicle
);

export const VehiclesRoutes = router;
