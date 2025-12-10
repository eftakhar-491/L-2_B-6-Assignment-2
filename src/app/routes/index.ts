import { Router } from "express";

import { AuthRoutes } from "../modules/auth/auth.route";
import { VehiclesRoutes } from "../modules/vehicles/vehicles.route";
import { UsersRoutes } from "../modules/users/user.route";
import { BookingsRoutes } from "../modules/bookings/booking.route";

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
  {
    path: "/users",
    route: UsersRoutes,
  },
  {
    path: "/bookings",
    route: BookingsRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
