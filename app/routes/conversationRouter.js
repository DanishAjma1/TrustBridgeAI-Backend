import { Router } from "express";
import { connectDB } from "../config/mongoDBConnection.js";
import Conversation from "../models/conversation.js";

const conversationRouter = Router();

conversationRouter.get("/get-conversations-for-user/:id", async (req, res) => {
  try {
    await connectDB();
    const { id } = req.params;
    const filter = { senderId: id };
    const conversations = await Conversation.find(filter);
    res.status(200).json({conversations} || null);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

export default conversationRouter;
