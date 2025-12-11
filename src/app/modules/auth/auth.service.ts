import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import { envVars } from "../../config/env";

type IUser = {
  email: string;
  password: string;
  role: string;
  name: string;
  phone: string;
};

import AppError from "../../errorHelpers/AppError";

import pool from "../../config/db";

const signup = async (payload: IUser) => {
  const { email, password, role, name, phone } = payload as Partial<IUser>;

  const isUserExist = await pool.query(`SELECT * FROM Users WHERE email = $1`, [
    email,
  ]);

  if (isUserExist.rows.length > 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist");
  }

  const hashedPassword = await bcryptjs.hash(
    password as string,
    Number(envVars.BCRYPT_SALT_ROUND)
  );

  const user = await pool.query(
    `INSERT INTO Users (email, password, role, name, phone)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, email, role, name, phone`,
    [email, hashedPassword, role, name, phone]
  );

  if (!user.rows.length) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "User creation failed"
    );
  }

  return user.rows[0];
};

const signin = async (payload: Partial<IUser>) => {
  const { email, password } = payload;

  if (!email || !password) {
    throw new AppError(httpStatus.BAD_REQUEST, "Email and password required");
  }

  const userResult = await pool.query(
    `
    SELECT id, email, role, name, phone, password 
    FROM users
    WHERE email = $1
    `,
    [email]
  );

  if (userResult.rows.length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid email or password");
  }

  const user = userResult.rows[0];

  const isPasswordMatched = await bcryptjs.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid email or password");
  }

  const { password: _, ...userWithoutPassword } = user;

  return userWithoutPassword;
};

export const AuthServices = {
  signup,
  signin,
};
