import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { router } from "./app/routes";

import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import { initDB } from "./app/config/db";

export const app = express();

app.use(express.json());

app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [""],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  initDB();
  res.send({
    message: "Welcome to the APP, this is a ride sharing service",
    success: true,
  });
});

app.use("/api/v1", router);

app.use(globalErrorHandler);

app.use(notFound);
