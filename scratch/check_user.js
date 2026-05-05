import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "apps/backend/.env" });
import userModel from "../apps/backend/src/models/user.model.js";

async function checkUser() {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/resolver";
  console.log("Connecting to", uri);
  await mongoose.connect(uri);
  const user = await userModel.findOne({ email: "aa@gamail.com" });
  if (user) {
    console.log("User found:", user);
  } else {
    console.log("User NOT found: aa@gamail.com");
    const allUsers = await userModel.find({}, { email: 1 });
    console.log("Existing users:", allUsers.map(u => u.email));
  }
  await mongoose.disconnect();
}

checkUser().catch(console.error);
