import dotenv from "dotenv";
dotenv.config();

const envVars = {
  PORT: process.env.PORT as string,
  FRONTEND_URL: process.env.FRONTEND_URL as string,
  DATABASE_URL: process.env.DATABASE_URL as string,
  BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
  JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
  JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES as string,
  NODE_ENV: process.env.NODE_ENV as string,
};

export { envVars };
