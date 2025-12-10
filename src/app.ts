import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { router } from "./app/routes";

export const app = express();

app.use(express.json());

// app.use(
//   expressSession({
//     secret: envVars.EXPRESS_SESSION_SECRET as string,
//     resave: false,
//     saveUninitialized: false,
//   })
// );

app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [""],
    credentials: true,
  })
);
app.get("/", (req, res) => {
  res.send({
    message: "Welcome to the APP, this is a ride sharing service",
    success: true,
  });
});
app.use("/api/v1", router);

// app.use(globalErrorHandler);
// app.use(notFound);
