import { StatusCodes } from "http-status-codes";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { BookingsService } from "./booking.service";

const createBookings = catchAsync(async (req, res) => {
  const bookedData = await BookingsService.createBookings(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Booking created successfully",
    data: bookedData,
  });
});

const getBookings = catchAsync(async (req, res) => {
  const isAdmin = req.user?.role === "admin";
  const bookings = await BookingsService.getBookings(isAdmin, req.user?.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Bookings retrieved successfully",
    data: bookings,
  });
});

const updateBookings = catchAsync(async (req, res) => {
  const bookingId = parseInt(req.params.bookingId);
  const user = { id: req.user?.id, role: req.user?.role };
  const updatedBooking = await BookingsService.updateBookings(
    bookingId,
    req.body.status,
    user
  );
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message:
      req.body.status === "cancelled"
        ? "Booking cancelled successfully"
        : "Booking marked as returned. Vehicle is now available",
    data: updatedBooking,
  });
});

export const BookingsControllers = {
  createBookings,
  getBookings,
  updateBookings,
};
