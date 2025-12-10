import { catchAsync } from "../../utils/catchAsync";
import { BookingsService } from "./booking.service";

const createBookings = catchAsync(async (req, res) => {
  await BookingsService.createBookings(req.body);
  res.status(200).json({ message: "Booking created successfully" });
});

export const BookingsControllers = { createBookings };
