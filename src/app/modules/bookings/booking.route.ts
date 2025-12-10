import { Router } from "express";

import { checkAuth } from "../../middlewares/checkAuth";

import { BookingsControllers } from "./booking.controller";

const router = Router();

router.post("/", checkAuth("admin"), BookingsControllers.createBookings);

export const BookingsRoutes = router;
