import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";

import { verifyToken } from "../utils/jwt";
import pool from "../config/db";

export const checkAuth =
  (...authRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const bearerToken = req.headers.authorization || req.cookies.accessToken;

      const accessToken = bearerToken?.startsWith("Bearer ")
        ? bearerToken.split(" ")[1]
        : bearerToken;

      if (!accessToken) {
        throw new AppError(403, "No Token Recieved");
      }

      const verifiedToken = verifyToken(
        accessToken,
        envVars.JWT_ACCESS_SECRET as string
      ) as JwtPayload;

      const isUserExist = await pool
        .query(
          "SELECT id, name, email, phone, role FROM users WHERE email = $1",
          [verifiedToken.email]
        )
        .then((res) => res.rows[0]);

      console.log("checkAuth", isUserExist);
      if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
      }

      if (!authRoles.includes(verifiedToken.role)) {
        throw new AppError(403, "You are not permitted to view this route!!!");
      }
      req.user = verifiedToken;
      next();
    } catch (error) {
      console.log("jwt error", error);
      next(error);
    }
  };
