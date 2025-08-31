import { Router } from "express";
import { connectDB } from "../config/mongoDBConnection.js";
import Message from "../models/message.js";

const messageRouter = Router();

messageRouter.get("/get-messages-btw-users", async (req, res) => {
  try {
    await connectDB();
    const { sender, receiver } = req.query;
    const messages = await Message.find({
      $or: [
        { senderId: sender, receiverId: receiver },
        { senderId: receiver, receiverId: sender },
      ],
    });
    res.status(200).json({ messages });
  } catch (error) {
    res.status(400).json(error.message);
  }
});

messageRouter.post("/save-message", async (req, res) => {
  try {
    await connectDB();
    const newMessage = req.body;
    const message = await new Message(newMessage);
    await message.save();
    res.status(200).json({ message } || null);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

export default messageRouter;
