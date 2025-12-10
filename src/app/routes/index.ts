import { Router } from "express";

import { AuthRoutes } from "../modules/auth/auth.route";
import { VehiclesRoutes } from "../modules/vehicles/vehicles.route";

export const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/vehicles",
    route: VehiclesRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
