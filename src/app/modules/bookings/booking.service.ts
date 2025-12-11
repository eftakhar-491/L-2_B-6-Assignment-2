import pool from "../../config/db";
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";

export const createBookings = async (payload: any) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  if (!customer_id || !vehicle_id || !rent_start_date || !rent_end_date) {
    throw new AppError(httpStatus.BAD_REQUEST, "All fields are required");
  }

  const startDate = new Date(rent_start_date);
  const endDate = new Date(rent_end_date);

  if (endDate <= startDate) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "End date must be after start date"
    );
  }

  const vehicleRes = await pool.query(
    `SELECT id, daily_rent_price, availability_status , vehicle_name
     FROM Vehicles 
     WHERE id = $1`,
    [vehicle_id]
  );

  if (vehicleRes.rowCount === 0) {
    throw new AppError(httpStatus.NOT_FOUND, "Vehicle not found");
  }

  const vehicle = vehicleRes.rows[0];

  if (vehicle.availability_status === "booked") {
    throw new AppError(httpStatus.CONFLICT, "Vehicle is already booked");
  }

  const days =
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);

  const total_price = days * Number(vehicle.daily_rent_price);
  const rentStartDate = new Date(rent_start_date);
  const rentEndDate = new Date(rent_end_date);

  const bookingRes = await pool.query(
    `
      INSERT INTO Bookings (
        customer_id, 
        vehicle_id,
        rent_start_date, 
        rent_end_date,
        total_price, 
        status
      )
      VALUES ($1, $2, $3, $4, $5, 'active')
      RETURNING *
      `,
    [customer_id, vehicle_id, rentStartDate, rentEndDate, total_price]
  );

  if (bookingRes.rowCount === 0) {
    throw new AppError(httpStatus.NOT_FOUND, "booking could not founded");
  }

  await pool.query(
    `UPDATE Vehicles SET availability_status = 'booked' WHERE id = $1`,
    [vehicle_id]
  );

  return {
    ...bookingRes.rows[0],
    vehicle: {
      vehicle_name: vehicle.vehicle_name,
      daily_rent_price: vehicle.daily_rent_price,
    },
  };
};

export const getBookings = async (isAdmin: boolean, userId: number) => {
  if (isAdmin) {
    const bookingsRes = await pool.query(
      `
      SELECT 
      b.id,
      b.customer_id,
      b.vehicle_id,
      b.rent_start_date,
      b.rent_end_date,
      b.total_price,
      b.status,
      json_build_object(
        'name', u.name,
        'email', u.email
        ) AS customer,
      json_build_object(
        'vehicle_name', v.vehicle_name,
        'registration_number', v.registration_number
        ) AS vehicle
      FROM Bookings b
      JOIN Users u ON b.customer_id = u.id
      JOIN Vehicles v ON b.vehicle_id = v.id 
      `
    );

    return bookingsRes.rows;
  } else {
    const bookingsRes = await pool.query(
      `
      SELECT 
      b.id,
      b.vehicle_id,
      b.rent_start_date,
      b.rent_end_date,
      b.total_price,
      b.status,
      json_build_object(
        'vehicle_name', v.vehicle_name,
        'registration_number', v.registration_number,
        'type', v.type
        ) AS vehicle
      FROM Bookings b
      JOIN Users u ON b.customer_id = u.id
      JOIN Vehicles v ON b.vehicle_id = v.id 
      WHERE b.customer_id = $1
      `,
      [userId]
    );

    return bookingsRes.rows;
  }
};

export const updateBookings = async (
  bookingId: number,
  status: "cancelled" | "returned",
  user: { id: number; role: "admin" | "customer" }
) => {
  const bookingRes = await pool.query(`SELECT * FROM Bookings WHERE id = $1`, [
    bookingId,
  ]);

  if (bookingRes.rows.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, "Booking not found");
  }

  const booking = bookingRes.rows[0];

  // Customer restrictions
  if (user.role === "customer") {
    if (status !== "cancelled") {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Customers can only cancel bookings"
      );
    }

    if (booking.customer_id !== user.id) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "You are not allowed to modify this booking"
      );
    }

    const today = new Date();
    const startDate = new Date(booking.rent_start_date);

    if (today >= startDate) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "You cannot cancel after the rental period has started"
      );
    }
  }

  // Admin restrictions
  if (user.role === "admin") {
    if (status !== "returned") {
      throw new AppError(
        httpStatus.FORBIDDEN,
        "Admins can only mark booking as returned"
      );
    }
  }

  const updateBookingRes = await pool.query(
    `
    UPDATE Bookings
    SET status = $1
    WHERE id = $2
    RETURNING *
    `,
    [status, bookingId]
  );

  const updatedBooking = updateBookingRes.rows[0];

  let vehicleUpdate = null;

  if (user.role === "admin" && status === "returned") {
    const vRes = await pool.query(
      `
      UPDATE Vehicles
      SET availability_status = 'available'
      WHERE id = $1
      RETURNING availability_status
      `,
      [booking.vehicle_id]
    );

    vehicleUpdate = vRes.rows[0];
  }

  return {
    ...updatedBooking,
    ...(vehicleUpdate && { vehicle: vehicleUpdate }),
  };
};

export const BookingsService = { createBookings, getBookings, updateBookings };
