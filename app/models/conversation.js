import mongoose from "mongoose";

const conversationScehma = mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  participants: [
    {
      receiverId: { type: String, required: true },
      lastMessage: { type: Object },
    },
  ],
  lastModified: {
    type: Date,
    default: Date.now,
  },
});

const Conversation = mongoose.model("Conversation", conversationScehma);
export default Conversation;
