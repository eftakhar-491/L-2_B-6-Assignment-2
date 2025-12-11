import pool from "../../config/db";
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";

const getAllUsers = async () => {
  const result = await pool.query(
    "SELECT id, name, email, phone, role FROM Users;"
  );

  return result.rows;
};

const updateUser = async (userId: string, payload: any, isAdmin: boolean) => {
  if (payload.password) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Password cannot be updated from this endpoint"
    );
  }

  if (!isAdmin && payload.role) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You are not allowed to change the role"
    );
  }

  // Remove fields not allowed
  delete payload.password;
  if (!isAdmin) delete payload.role;

  const keys = Object.keys(payload);
  const values = Object.values(payload);

  if (keys.length === 0) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "No valid fields provided for update"
    );
  }

  const dataSet = keys.map((key, index) => `${key} = $${index + 1}`).join(", ");

  // Update user
  const query = `
    UPDATE Users 
    SET ${dataSet}
    WHERE id = $${keys.length + 1}
    RETURNING id, name, email, phone, role;
  `;

  const result = await pool.query(query, [...values, userId]);

  if (result.rows.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return result.rows[0];
};

const deleteUser = async (userId: string) => {
  const result = await pool.query(
    `DELETE FROM Users WHERE id = $1 RETURNING id;`,
    [userId]
  );

  if (result.rows.length === 0) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }

  return result;
};

export const UsersService = {
  getAllUsers,
  updateUser,
  deleteUser,
};
