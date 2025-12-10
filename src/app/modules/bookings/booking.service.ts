import pool from "../../config/db";

export const createBookings = async (payload: any) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  if (!customer_id || !vehicle_id || !rent_start_date || !rent_end_date) {
    throw new Error("All fields are required");
  }

  const startDate = new Date(rent_start_date);
  const endDate = new Date(rent_end_date);

  if (endDate <= startDate) {
    throw new Error("End date must be after start date");
  }

  const vehicleRes = await pool.query(
    `SELECT id, daily_rate, status FROM Vehicles WHERE id = $1`,
    [vehicle_id]
  );

  if (vehicleRes.rowCount === 0) {
    throw new Error("Vehicle not found");
  }

  const vehicle = vehicleRes.rows[0];

  if (vehicle.status === "booked") {
    throw new Error("Vehicle is already booked");
  }

  const days =
    (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);

  const total_price = days * Number(vehicle.daily_rate);

  try {
    await pool.query("BEGIN");

    const bookingRes = await pool.query(
      `
      INSERT INTO Bookings (
        customer_id, vehicle_id,
        rent_start_date, rent_end_date,
        total_price, status
      )
      VALUES ($1, $2, $3, $4, $5, 'active')
      RETURNING *
      `,
      [
        customer_id,
        vehicle_id,
        rent_start_date,
        rent_end_date,
        total_price.toFixed(2),
      ]
    );

    await pool.query(`UPDATE Vehicles SET status = 'booked' WHERE id = $1`, [
      vehicle_id,
    ]);

    await pool.query("COMMIT");

    return bookingRes.rows[0];
  } catch (err) {
    await pool.query("ROLLBACK");
    console.log(err);
  }
};

export const BookingsService = { createBookings };
