import dotenv from "dotenv";
dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

if (!process.env.PORT) {
  process.env.PORT = "5173";
}
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "development";
}

if (!process.env.MONGO_URI) {
  if (isProduction) {
    throw new Error("MONGO_URI is not defined in environment variables");
  }
  process.env.MONGO_URI = "mongodb://localhost:27017/resolver";
  console.warn("[config] MONGO_URI unset — using mongodb://localhost:27017/resolver");
}

if (!process.env.JWT_SECRET) {
  if (isProduction) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  process.env.JWT_SECRET = "dev-jwt-secret-change-before-production";
  console.warn("[config] JWT_SECRET unset — using a development placeholder");
}

/* Groq: optional at boot so the API can start; AI routes need a key at runtime */
if (!process.env.GROQ_API_KEY && isProduction) {
  console.warn(
    "[config] GROQ_API_KEY unset — /api/ai and related routes will fail until the key is set",
  );
}

export const config = {
  PORT: process.env.PORT || "5173",
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  NODE_ENV: process.env.NODE_ENV,
  GROQ_API_KEY: process.env.GROQ_API_KEY || "",
  CONTACT_RECEIVER: process.env.CONTACT_RECEIVER || "ankit.dev600@gmail.com",
  SMTP_HOST: process.env.SMTP_HOST || "smtp.gmail.com",
  SMTP_PORT: process.env.SMTP_PORT || "587",
  SMTP_USER: process.env.SMTP_USER || "",
  SMTP_PASS: process.env.SMTP_PASS || "",
};
