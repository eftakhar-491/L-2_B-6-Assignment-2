import pool from "../../config/db";

const addNewVehicles = async (payload: any) => {
  // Logic to add a new vehicle to the database

  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;
  const result = await pool.query(
    `
        INSERT INTO Vehicles (vehicle_name, type, registration_number, daily_rent_price, availability_status)
        VALUES ($1, $2, $3, $4, $5) RETURNING *;
        `,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ]
  );
  console.log("Adding vehicle:", result.rows[0]);

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
  return result.rows[0];
};
const updateSingleVehicle = async (vehicleId: string, payload: any) => {
  const keys = Object.keys(payload);
  const values = Object.values(payload);

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

  return result.rows[0];
};

const deleteSingleVehicle = async (vehicleId: string) => {
  const result = await pool.query(
    `DELETE FROM Vehicles 
    WHERE id = $1 
    RETURNING *;
    `,
    [vehicleId]
  );
  return result.rows[0];
};

export const VehiclesService = {
  addNewVehicles,
  getAllVehicles,
  getSingleVehicle,
  updateSingleVehicle,
  deleteSingleVehicle,
};
