/**
 * Creates a demo admin user for local testing.
 * Run from apps/backend: npm run seed:demo
 */
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { config } from "../src/config/config.js";
import organizationModel from "../src/models/organization.model.js";
import userModel from "../src/models/user.model.js";

const DEMO_EMAIL = "demo@resolver.local";
const DEMO_PASSWORD = "ResolverDemo1!";

async function main() {
  await mongoose.connect(config.MONGO_URI);

  let org = await organizationModel.findOne({ name: "Demo Organization" });
  if (!org) {
    org = await organizationModel.create({ name: "Demo Organization" });
    console.log("Created organization: Demo Organization");
  }

  const existing = await userModel.findOne({ email: DEMO_EMAIL });
  if (existing) {
    console.log("Demo user already exists:", DEMO_EMAIL);
    await mongoose.disconnect();
    return;
  }

  await userModel.create({
    name: "Demo Admin",
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
    role: "admin",
    organizationId: org._id,
  });

  console.log("");
  console.log("Demo user created. Use these credentials in Resolver Manage:");
  console.log("  Email:   ", DEMO_EMAIL);
  console.log("  Password:", DEMO_PASSWORD);
  console.log("");

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
