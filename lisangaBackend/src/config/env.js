import dotenv from "dotenv";

dotenv.config();

const requiredVars = [
  "DATABASE_URL",
  "JWT_ACCESS_SECRET",
  "JWT_REFRESH_SECRET",
];

const missing = requiredVars.filter((key) => !process.env[key]);
if (missing.length > 0) {
  console.error(
    `❌ Variables d'environnement manquantes : ${missing.join(", ")}`
  );
  process.exit(1);
}

export const env = {
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DATABASE_URL: process.env.DATABASE_URL,
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  ACCESS_TOKEN_TTL: process.env.ACCESS_TOKEN_TTL || "15m",
  REFRESH_TOKEN_TTL: process.env.REFRESH_TOKEN_TTL || "7d",
};
