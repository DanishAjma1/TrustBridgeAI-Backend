import mongoose from "mongoose";

const NotificationSchema = mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ["registration", "approval", "rejection", "suspension", "general"],
    default: "general",
  },
  isRead: { type: Boolean, default: false },
  link: String,
  createdAt: { type: Date, default: Date.now },
});

const Notification = mongoose.model("Notification", NotificationSchema);
export default Notification;
