import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "apps/backend/.env" });
import incidentModel from "../apps/backend/src/models/incident.model.js";

async function checkIncidents() {
  const uri = process.env.MONGO_URI || "mongodb://localhost:27017/resolver";
  await mongoose.connect(uri);
  const incidents = await incidentModel.find({});
  console.log("Total incidents:", incidents.length);
  if (incidents.length > 0) {
    console.log("Latest incident:", incidents[0]);
  }
  await mongoose.disconnect();
}

checkIncidents().catch(console.error);
