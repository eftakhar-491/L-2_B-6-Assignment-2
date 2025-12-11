import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const initDB = async () => {
  await pool.query(`
    DROP SCHEMA public CASCADE;
    CREATE SCHEMA public;
    `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS Users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'customer'))
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS Vehicles (
    id SERIAL PRIMARY KEY,
    vehicle_name VARCHAR(100) NOT NULL,
    type varchar(50) NOT NULL CHECK (type IN ('car', 'bike', 'van' , 'SUV')),
    registration_number VARCHAR(100) NOT NULL UNIQUE,
    daily_rent_price NUMERIC(10,2) NOT NULL CHECK (daily_rent_price > 0),
    availability_status VARCHAR(20) NOT NULL CHECK (availability_status IN ('available', 'booked' ))
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS Bookings (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES Users(id) ON DELETE CASCADE,
    vehicle_id INTEGER REFERENCES Vehicles(id) ON DELETE CASCADE,
    rent_start_date DATE NOT NULL,
    rent_end_date DATE NOT NULL CHECK (rent_end_date > rent_start_date),
    total_price NUMERIC(10,2) NOT NULL CHECK (total_price > 0),
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'cancelled', 'returned'))
    );
  `);
};
export default pool;
