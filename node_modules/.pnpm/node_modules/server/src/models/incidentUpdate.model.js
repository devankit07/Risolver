import mongoose from "mongoose";

const incidentUpdateSchema = new mongoose.Schema(
  {
    incidentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Incident",
      required: true,
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    postedBy: {
      type: String,
      enum: ["admin", "manager", "creator", "responder"],
      required: true,
    },
    status: {
        type: String,
        enum: ["open", 'assigned', "in_progress", "resolved"],
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const incidentUpdateModel = mongoose.model("IncidentUpdate", incidentUpdateSchema);

export default incidentUpdateModel;
