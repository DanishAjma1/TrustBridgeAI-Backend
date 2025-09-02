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

conversationRouter.post("/update-conversations-for-user", async (req, res) => {
  try {
    await connectDB();
    const { senderId, receiverId, lastMessage } = req.body;

    const filterForSender = { senderId: senderId };
    const filterForReceiver = { senderId: receiverId };

    let conversationForSender = await Conversation.findOne(filterForSender);
    let conversationForReceiver = await Conversation.findOne(filterForReceiver);

    if (!conversationForSender) {
      // Create a new conversationForSender
      conversationForSender = new Conversation({
        senderId: senderId,
        participants: [{ receiverId, lastMessage: { ...lastMessage } }],
      });
    } else {
      // Update existing conversation
      const senderIndex = conversationForSender.participants.findIndex(
        (partner) => partner.receiverId === receiverId
      );
      if (senderIndex === -1) {
        conversationForSender.participants.push({
          senderId: receiverId,
          lastMessage: { ...lastMessage },
        });
      } else {
        conversationForSender.participants[senderIndex].lastMessage = {
          ...lastMessage,
        };
      }
    }

    if (!conversationForReceiver) {
      // Create a new conversation For Receiver
      conversationForReceiver = new Conversation({
        senderId: receiverId,
        participants: [{ receiverId: senderId, lastMessage: { ...lastMessage } }],
      });
    } else {
      // Update existing conversation For Receiver
      const receiverIndex = conversationForReceiver.participants.findIndex(
        (partner) => partner.receiverId === senderId
      );
      if (receiverIndex === -1) {
        conversationForReceiver.participants.push({
          senderId: senderId,
          lastMessage: { ...lastMessage },
        });
      } else {
        conversationForReceiver.participants[receiverIndex].lastMessage = {
          ...lastMessage,
        };
      }
    }

    await conversationForSender.save();
    await conversationForReceiver.save();
    res.status(200).json({ conversationForSender });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default conversationRouter;
