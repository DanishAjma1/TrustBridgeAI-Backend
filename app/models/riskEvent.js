import mongoose from "mongoose";

const RiskEventSchema = new mongoose.Schema({
  eventType: {
    type: String,
    required: true,
    enum: [
      "failed_login",
      "multiple_time_failed_login",
      "multiple_withdraw_attempts",
      "other",
    ],
  },

  email: {
    type: String,
    required: true,
  },

  riskScore: { type: Number, default: 0 },
  isFraud: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now, index: true },
});

const RiskEvent = mongoose.model("RiskEvent", RiskEventSchema);
export default RiskEvent;
