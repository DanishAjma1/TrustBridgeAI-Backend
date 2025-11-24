const mongoose = require("mongoose");

const investmentSchema = new mongoose.Schema({
  ent_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  investor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required,
  },

  fundAmount: {
    type: Number,
    required: true,
  },

  // new: document verification
  documentsStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },

  // new: date of investment
  investedAt: {
    type: Date,
    default: Date.now,
  },
});

const Investment = mongoose.model("Investment", investmentSchema);
export default Investment;
