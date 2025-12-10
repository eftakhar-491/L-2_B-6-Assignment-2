import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";

import { generateToken, verifyToken } from "./jwt";
import AppError from "../errorHelpers/AppError";
import pool from "../config/db";

export const createUserTokens = (user: Partial<IUser>) => {
  const jwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };
  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET as string,
    envVars.JWT_ACCESS_EXPIRES as string
  );

  const refreshToken = generateToken(
    jwtPayload,
    envVars.JWT_REFRESH_SECRET as string,
    envVars.JWT_REFRESH_EXPIRES as string
  );

  return {
    accessToken: `${accessToken}`,
    refreshToken: `${refreshToken}`,
  };
};

export const createNewAccessTokenWithRefreshToken = async (
  refreshToken: string
) => {
  const verifiedRefreshToken = verifyToken(
    refreshToken,
    envVars.JWT_REFRESH_SECRET as string
  ) as JwtPayload;

  const isUserExist = (await pool.query(
    `SELECT * FROM Users WHERE email = $1`,
    [verifiedRefreshToken.email]
  )) as any;

  if (!isUserExist.rows.length) {
    throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
  }
  // if (
  //   isUserExist.isActive === IsActive.BLOCK ||
  //   isUserExist.isActive === IsActive.INACTIVE
  // ) {
  //   throw new AppError(
  //     httpStatus.BAD_REQUEST,
  //     `User is ${isUserExist.isActive}`
  //   );
  // }
  // if (isUserExist.rows[0].isDeleted) {
  //   throw new AppError(httpStatus.BAD_REQUEST, "User is deleted");
  // }

  const jwtPayload = {
    userId: isUserExist.rows[0].id,
    email: isUserExist.rows[0].email,
    role: isUserExist.rows[0].role,
  };
  const accessToken = generateToken(
    jwtPayload,
    envVars.JWT_ACCESS_SECRET as string,
    envVars.JWT_ACCESS_EXPIRES as string
  );

  return accessToken;
};
