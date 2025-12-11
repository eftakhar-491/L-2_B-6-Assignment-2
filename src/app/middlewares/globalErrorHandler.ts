import { NextFunction, Request, Response } from "express";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (envVars.NODE_ENV === "development") {
    console.log("🔥 Global Error Handler:", err);
  }

  let statusCode = 500;
  let message = "Something went wrong!";
  let errors: string = message;

  if (err.code === "23505") {
    statusCode = 400;
    message = "Duplicate value entered";
    errors = err.detail || message;
  } else if (err.code === "22P02") {
    statusCode = 400;
    message = "Invalid input format";
    errors = err.message;
  } else if (err.code === "23503") {
    statusCode = 400;
    message = "Invalid reference (foreign key violation)";
    errors = err.detail;
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.message;
  } else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;
    errors = err.message;
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    ...(envVars.NODE_ENV === "development" && {
      stack: err.stack,
      error: err,
    }),
  });
};
