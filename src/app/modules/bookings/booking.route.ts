import { Router } from "express";

import { checkAuth } from "../../middlewares/checkAuth";

import { BookingsControllers } from "./booking.controller";

const router = Router();

router.post(
  "/",
  checkAuth("admin", "customer"),
  BookingsControllers.createBookings
);
router.get(
  "/",
  checkAuth("admin", "customer"),
  BookingsControllers.getBookings
);
router.put(
  "/:bookingId",
  checkAuth("admin", "customer"),
  BookingsControllers.updateBookings
);

export const BookingsRoutes = router;
