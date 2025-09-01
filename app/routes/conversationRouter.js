import { Router } from "express";
import { connectDB } from "../config/mongoDBConnection.js";
import Conversation from "../models/conversation.js";

const conversationRouter = Router();

conversationRouter.get("/get-conversations-for-user/:id", async (req, res) => {
  try {
    await connectDB();
    const { id } = req.params;
    const filter = { senderId: id };
    const conversation = await Conversation.findOne(filter);
    res.status(200).json({ conversation } || null);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

conversationRouter.post("/add-conversations-for-user", async (req, res) => {
  try {
    await connectDB();
    const con = req.body;

    const filter = { senderId: con.senderId };
    let conversation = await Conversation.findOne(filter);

    if (!conversation) {
      // Create a new conversation
      conversation = new Conversation({
        senderId: con.senderId,
        participants: [con.receiverId],
        lastMessage: con.lastMessage,
      });
    } else {
      // Update existing conversation
      const isAlreadyExist = conversation.participants.find(
        (id) => id === con.receiverId
      );
      if (!isAlreadyExist) {
        conversation.participants.push(con.receiverId);
        conversation.lastMessage = con.lastMessage;
      } else {
        conversation.lastMessage = con.lastMessage;
      }
    }

    await conversation.save();
    res.status(200).json({conversation});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default conversationRouter;
