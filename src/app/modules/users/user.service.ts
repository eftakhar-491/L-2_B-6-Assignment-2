import pool from "../../config/db";

const getAllUsers = async () => {
  const result = await pool.query(
    "SELECT id, name, email, phone, role FROM Users;"
  );
  return result.rows;
};
const updateUser = async (userId: string, payload: any, isAdmin: boolean) => {
  delete payload.password;
  if (!isAdmin) delete payload.role;

  const keys = Object.keys(payload);
  const values = Object.values(payload);

  const dataSet = keys.map((key, index) => `${key} = $${index + 1}`).join(", ");
  if (isAdmin) {
    const result = await pool.query(
      `UPDATE Users 
      SET ${dataSet} 
      WHERE id = $${keys.length + 1} 
      RETURNING id, name, email, phone, role;
      `,
      [...values, userId]
    );
    return result.rows[0];
  } else {
    const result = await pool.query(
      `UPDATE Users 
      SET ${dataSet} 
      WHERE id = $${keys.length + 1}
      RETURNING id, name, email, phone, role;
      `,
      [...values, userId]
    );
    return result.rows[0];
  }
};
const deleteUser = async (userId: string) => {
  const result = await pool.query(
    `
    DELETE FROM Users 
    WHERE id = $1;
    `,
    [userId]
  );
  return result.rows[0];
};

export const UsersService = {
  getAllUsers,
  updateUser,
  deleteUser,
};
