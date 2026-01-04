// routes/contact.js (Express example)
import express from "express";
import sendMailToUser from "../utils/addToMailList.js";

const contactRouter = express.Router();

contactRouter.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const subject = `New Contact Form Message from ${name}`;
    const htmlMessage = `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `;

    await sendMailToUser("aitrustbridge@gmail.com", htmlMessage, subject); 

    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

export default contactRouter;
