import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";

import { envVars } from "../../config/env";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { setAuthCookie } from "../../utils/setCookie";
import { createUserTokens } from "../../utils/userTokens";
import { AuthServices } from "./auth.service";
import AppError from "../../errorHelpers/AppError";

const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await AuthServices.signup(req.body);
    if (!user) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        "User creation failed"
      );
    }

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "User registered successfully",
      data: user,
    });
  }
);
const signin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //
    const user = await AuthServices.signin(req.body);
    console.log("User from controller:", user);
    const userTokens = await createUserTokens(user);

    setAuthCookie(res, userTokens);

    if (!user) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Invalid email or password");
    }

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Login successful",
      data: { token: userTokens.accessToken, user },
    });
  }
);
export const AuthControllers = {
  signup,
  signin,
};
