import { config } from "./config.js";
import mongoose from "mongoose";

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 3000;

export const connectDB = async (retries = MAX_RETRIES) => {
  try {
    await mongoose.connect(config.MONGO_URI, {
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 10000,
    });
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error(`❌ MongoDB connection failed: ${err.message}`);

    if (retries > 0) {
      console.log(`🔄 Retrying in ${RETRY_DELAY_MS / 1000}s… (${retries} attempts left)`);
      await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
      return connectDB(retries - 1);
    }

    console.error("💥 Could not connect to MongoDB after multiple retries. Exiting.");
    process.exit(1);
  }
};
