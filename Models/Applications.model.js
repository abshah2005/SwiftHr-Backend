import mongoose, { Schema } from "mongoose";

const applicationSchema = new Schema(
  {
    ApplicantId: {
      type: Schema.Types.ObjectId,
      ref: "Applicants",
      required: true,
    },
    positionId: {
      type: Schema.Types.ObjectId,
      ref: "Positions",
      required: true,
    },
    appliedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["Applied", "Interview", "Offered", "Rejected","Assessment Required"],
      default: "Applied",
    },
    trackingId: {
      type: String,
    },
    userAction: {
      type: Map,
      of: String,
    }
  },
  { timestamps: true }
);

export const Applications = mongoose.model("Applications", applicationSchema);

// Rj0001
// Py0002
// UI0003
