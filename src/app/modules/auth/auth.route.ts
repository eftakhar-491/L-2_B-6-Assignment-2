import { NextFunction, Request, Response, Router } from "express";

import { envVars } from "../../config/env";
import { checkAuth } from "../../middlewares/checkAuth";

import { AuthControllers } from "./auth.controller";

const router = Router();

router.post("/signup", AuthControllers.signup);
router.post("/signin", AuthControllers.signin);

export const AuthRoutes = router;
