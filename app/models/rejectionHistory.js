import mongoose from "mongoose";

const RejectionHistorySchema = new mongoose.Schema(
  {
    email: { type: String, required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reason: { type: String },
    rejectedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rejectedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const RejectionHistory = mongoose.model("RejectionHistory", RejectionHistorySchema);

export default RejectionHistory;
