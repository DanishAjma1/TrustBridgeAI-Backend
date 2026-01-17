import { Router } from "express";
import Stripe from "stripe";
import jwt from "jsonwebtoken";
import { connectDB } from "../config/mongoDBConnection.js";
import Campaign from "../models/campaign.js";
import Transaction from "../models/transaction.js";
import User from "../models/user.js";
import Supporter from "../models/supporter.js";

const paymentRouter = Router();

// Use the exact names from .env
const stripe = new Stripe(process.env.Sripe_Secret_key);

// Middleware to optionally get user from token
const getUserIfAvailable = async (req) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId || decoded._id;
    
    await connectDB();
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    return null;
  }
};

// Create Payment Intent
paymentRouter.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, campaignId, guestName, guestPhone, guestEmail } = req.body;
    const user = await getUserIfAvailable(req);

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    if (!user && (!guestName || !guestPhone || !guestEmail)) {
        return res.status(400).json({ message: "Guest details required if not logged in" });
    }

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    const metadata = {
        campaignId: campaignId.toString(),
    };

    if (user) {
        metadata.userId = user._id.toString();
    } else {
        metadata.guestName = guestName;
        metadata.guestPhone = guestPhone;
        metadata.guestEmail = guestEmail;
        metadata.isGuest = "true";
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects cents
      currency: "usd",
      metadata: metadata,
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Confirm and save transaction
paymentRouter.post("/confirm-payment", async (req, res) => {
  try {
    await connectDB();
    const { campaignId, amount, paymentIntentId, guestName, guestPhone, guestEmail } = req.body;
    const user = await getUserIfAvailable(req);

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    let transactionData = {
        campaignId: campaignId,
        amount: amount,
        paymentIntentId: paymentIntentId,
        status: "succeeded",
    };

    let supporterId;
    let isGuest = false;

    if (user) {
        transactionData.userId = user._id;
        transactionData.userName = user.name;
        supporterId = user._id;
    } else {
        if (!guestName || !guestPhone || !guestEmail) {
            return res.status(400).json({ message: "Guest details missing for confirmation" });
        }
        
        // Create or find supporter
        let supporter = await Supporter.findOne({ 
            $or: [{ phoneNumber: guestPhone }, { email: guestEmail }] 
        });

        if (!supporter) {
            supporter = new Supporter({
                name: guestName,
                phoneNumber: guestPhone,
                email: guestEmail
            });
            await supporter.save();
        } else {
            // Update details if changed
            supporter.name = guestName;
            supporter.phoneNumber = guestPhone;
            supporter.email = guestEmail;
            await supporter.save();
        }

        transactionData.supporterId = supporter._id;
        transactionData.userName = guestName;
        supporterId = supporter._id;
        isGuest = true;
    }

    // Create transaction record
    const transaction = new Transaction(transactionData);
    await transaction.save();

    // Update campaign raised amount and supporters
    campaign.raisedAmount += Number(amount);
    
    // Check if supporter already exists in campaign
    let existingSupporterIndex = -1;
    
    if (isGuest) {
         existingSupporterIndex = campaign.supporters.findIndex(
            (s) => s.guestId && s.guestId.toString() === supporterId.toString()
        );
    } else {
         existingSupporterIndex = campaign.supporters.findIndex(
            (s) => s.supporterId && s.supporterId.toString() === supporterId.toString()
        );
    }

    if (existingSupporterIndex > -1) {
      campaign.supporters[existingSupporterIndex].amount += Number(amount);
      campaign.supporters[existingSupporterIndex].date = Date.now();
    } else {
        const newSupporter = {
            amount: Number(amount),
            date: Date.now(),
            isGuest: isGuest
        };
        
        if (isGuest) {
            newSupporter.guestId = supporterId;
        } else {
            newSupporter.supporterId = supporterId;
        }
        
        campaign.supporters.push(newSupporter);
    }

    await campaign.save();

    res.status(200).json({
      message: "Payment confirmed and recorded",
      transaction,
    });
  } catch (error) {
    console.error("Confirmation Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Get all donations/supporters for admin
paymentRouter.get("/all-donations", async (req, res) => {
  try {
    await connectDB();
    
    // Fetch all successful transactions
    const transactions = await Transaction.find({ status: "succeeded" })
      .populate("userId", "name email")
      .populate("supporterId", "name email phoneNumber")
      .populate("campaignId", "title")
      .sort({ createdAt: -1 });

    const formattedDonations = transactions.map(tx => {
      if (tx.userId) {
        return {
          id: tx._id,
          name: tx.userId.name,
          email: tx.userId.email,
          phone: "N/A (Registered)",
          campaign: tx.campaignId ? tx.campaignId.title : "Deleted Campaign",
          amount: tx.amount,
          date: tx.createdAt,
          type: "User"
        };
      } else if (tx.supporterId) {
        return {
          id: tx._id,
          name: tx.supporterId.name,
          email: tx.supporterId.email,
          phone: tx.supporterId.phoneNumber,
          campaign: tx.campaignId ? tx.campaignId.title : "Deleted Campaign",
          amount: tx.amount,
          date: tx.createdAt,
          type: "Guest"
        };
      } else {
        return {
          id: tx._id,
          name: tx.userName || "Unknown",
          email: "N/A",
          phone: "N/A",
          campaign: tx.campaignId ? tx.campaignId.title : "Deleted Campaign",
          amount: tx.amount,
          date: tx.createdAt,
          type: "Guest (Legacy)"
        };
      }
    });

    res.status(200).json(formattedDonations);
  } catch (error) {
    console.error("Fetch Donations Error:", error);
    res.status(500).json({ message: error.message });
  }
});
  
export default paymentRouter;
