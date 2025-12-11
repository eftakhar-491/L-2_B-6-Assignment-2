import pool from "../../config/db";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";

const addNewVehicles = async (payload: any) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  // Basic validation
  if (
    !vehicle_name ||
    !type ||
    !registration_number ||
    !daily_rent_price ||
    !availability_status
  ) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "All vehicle fields are required"
    );
  }

  const result = await pool.query(
    `
        INSERT INTO Vehicles (
          vehicle_name, 
          type, 
          registration_number, 
          daily_rent_price, 
          availability_status
        )
        VALUES ($1, $2, $3, $4, $5) 
        RETURNING *;
        `,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );

  if (!result.rows.length) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Vehicle creation failed"
    );
  }

  return result.rows[0];
};

const getAllVehicles = async () => {
  const result = await pool.query("SELECT * FROM Vehicles;");
  return result.rows;
};

const getSingleVehicle = async (vehicleId: string) => {
  const result = await pool.query("SELECT * FROM Vehicles WHERE id = $1;", [
    vehicleId,
  ]);

  if (!result.rows.length) {
    throw new AppError(httpStatus.NOT_FOUND, "Vehicle not found");
  }

  return result.rows[0];
};

const updateSingleVehicle = async (vehicleId: string, payload: any) => {
  const keys = Object.keys(payload);
  const values = Object.values(payload);

  if (keys.length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "No fields provided for update");
  }

  const data = keys.map((key, index) => `${key} = $${index + 1}`).join(", ");

  const result = await pool.query(
    `
        UPDATE Vehicles 
        SET ${data} 
        WHERE id = $${keys.length + 1} 
        RETURNING *;
        `,
    [...values, vehicleId]
  );

  if (!result.rows.length) {
    throw new AppError(httpStatus.NOT_FOUND, "Vehicle not found");
  }

  return result.rows[0];
};

const deleteSingleVehicle = async (vehicleId: string) => {
  const result = await pool.query(
    `
    DELETE FROM Vehicles 
    WHERE id = $1 
    RETURNING *;
    `,
    [vehicleId]
  );

  if (!result.rows.length) {
    throw new AppError(httpStatus.NOT_FOUND, "Vehicle not found");
  }

  return result.rows[0];
};

export const VehiclesService = {
  addNewVehicles,
  getAllVehicles,
  getSingleVehicle,
  updateSingleVehicle,
  deleteSingleVehicle,
};
