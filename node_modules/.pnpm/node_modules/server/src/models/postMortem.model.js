import mongoose from "mongoose";

const postMortemSchema = new mongoose.Schema(
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
    generatedBy: {
      type: String,
      default: "AI",
      enum: ["AI"],
      required: true,
      immutable: true,
    },
    summary: {
      type: String,
      required: true,
    },
    rootCause: {
      type: String,
      required: true,
    },
    whatWorked: {
      type: String,
      required: true,
    },
    recommendations: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const postMortemModel = mongoose.model("PostMortem", postMortemSchema);

export default postMortemModel;