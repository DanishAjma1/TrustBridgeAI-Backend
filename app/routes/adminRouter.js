import { Router } from "express";
import { connectDB } from "../config/mongoDBConnection.js";
import Enterprenuer from "../models/enterpreneur.js";
import Investor from "../models/investor.js";
import Campaign from "../models/campaign.js";
import multer from "multer";
import moment from "moment";
const adminRouter = Router();
import fs from "fs";
import User from "../models/user.js";
import RiskEvent from "../models/riskEvent.js";
const uploadDir = "uploads";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

adminRouter.get("/dashboard", async (req, res) => {
  try {
    await connectDB();

    const totalStartups = await User.countDocuments({ role: "entrepreneur" });
    const totalInvestors = await User.countDocuments({ role: "investor" });
    const totalSupporters = await User.countDocuments({ role: "supporter" });
    const totalCampaigns = await Campaign.countDocuments();

    const flaggedUsers = await User.countDocuments({ isFlagged: true });
    const flaggedCampaigns = await Campaign.countDocuments({ isFlagged: true });
    const flaggedCount = flaggedUsers + flaggedCampaigns;

    res.status(200).json({
      startups: totalStartups,
      investors: totalInvestors,
      supporters: totalSupporters,
      campaigns: totalCampaigns,
      flagged: flaggedCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch dashboard data", error });
  }
});

adminRouter.get("/get-users", async (req, res) => {
  try {
    await connectDB();
    const users = await User.find({
      $or: [{ role: "entrepreneur" }, { role: "investor" }],
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error });
  }
});

adminRouter.delete("/user/:id", async (req, res) => {
  try {
    await connectDB();
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    await Enterprenuer.deleteOne({ userId: id });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete user", error });
  }
});

adminRouter.post("/campaigns", upload.array("images", 5), async (req, res) => {
  try {
    await connectDB();
    res.status(200).send("Campaign route OK");
    const { title, description, goalAmount, startDate, endDate, category } =
      req.body;

    if (!title || !description || !goalAmount || !startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided." });
    }

    const imagePaths =
      req.files?.map((file) => `/uploads/${file.filename}`) || [];

    const newCampaign = new Campaign({
      createdBy: null,
      title,
      description,
      goalAmount,
      startDate,
      endDate,
      category,
      images: imagePaths,
      status: "active",
    });

    await newCampaign.save();

    res.status(201).json({
      message: "Campaign created successfully!",
      campaign: newCampaign,
    });
  } catch (error) {
    console.error("CAMPAIGN CREATION ERROR:", error);
    res
      .status(500)
      .json({ message: "Failed to create campaign", error: error.message });
  }
});

adminRouter.get("/campaigns", async (req, res) => {
  try {
    await connectDB();
    const campaigns = await Campaign.find().populate("createdBy", "name email");
    res.status(200).json(campaigns);
  } catch (error) {
    console.error("FAILED TO FETCH CAMPAIGNS:", error.message);
    res.status(500).json({ message: error.message });
  }
});

adminRouter.put("/campaigns/:id/status", async (req, res) => {
  try {
    await connectDB();
    const { id } = req.params;
    const { status } = req.body;

    const updated = await Campaign.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update campaign status", error });
  }
});

adminRouter.get("/users/entrepreneurs", async (req, res) => {
  try {
    await connectDB();
    const entrepreneurs = await User.find(
      { role: "entrepreneur" },
      "-password"
    );
    res.status(200).json(entrepreneurs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch entrepreneurs", error });
  }
});
adminRouter.get("/users/investors", async (req, res) => {
  try {
    await connectDB();
    const investors = await User.find({ role: "investor" }, "-password");
    res.status(200).json(investors);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch investors", error });
  }
});

adminRouter.get("/users/users-last-year", async (req, res) => {
  try {
    await connectDB();
    const last12Months = [...Array(12)]
      .map((_, i) => moment().subtract(i, "months").format("MMM"))
      .reverse();

    const users = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: moment().subtract(12, "months").toDate(),
          },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            role: "$role",
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          role: "$_id.role",
          count: 1,
        },
      },
      { $sort: { month: 1 } },
    ]);

    const finalData = last12Months.map((monthName, index) => {
      const monthNumber = index + 1;

      const investorData = users.find(
        (d) => d.month === monthNumber && d.role === "investor"
      );
      const entrepreneurData = users.find(
        (d) => d.month === monthNumber && d.role === "entrepreneur"
      );

      return {
        month: monthName,
        investor: investorData ? investorData.count : 0,
        entrepreneur: entrepreneurData ? entrepreneurData.count : 0,
      };
    });

    res.json(finalData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

adminRouter.get("/users/startup-by-industry", async (req, res) => {
  try {
    await connectDB();
    const users = await Enterprenuer.aggregate([
      {
        $group: {
          _id: "$industry",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          industry: "$_id",
          count: 1,
        },
      },
    ]);

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

adminRouter.get("/get-investor-stages", async (req, res) => {
  await connectDB();
  const investors = await Investor.aggregate({});
});

// =====================
//  GET FLAGS SUMMARY
// =====================
adminRouter.get("/risk-detection-flags", async (req, res) => {
  try {
    await connectDB();
    const summary = await RiskEvent.aggregate([
      {
        $group: {
          _id: "$eventType",
          email: { $first: "$email" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          eventType: "$_id",
          count: 1,
          email: 1,
        },
      },
    ]);

    // monthly count for chart
    const last12Months = [...Array(12)]
      .map((_, i) => moment().subtract(i, "months").format("MMM"))
      .reverse();

    const finalData = await RiskEvent.aggregate([
      {
        $match: {
          createdAt: {
            $gte: moment().subtract(12, "months").toDate(),
          },
        },
      },
      {
        $group: {
          _id: "$eventType",
          riskScore: { $first: "$riskScore" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          eventType: "$_id",
          count: 1,
          riskScore: 1,
        },
      },
    ]);

    res.json({ summary, finalData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching risk flags" });
  }
});

export const logRiskEvent = async ({
  email,
  eventType,
  riskScore,
  isFraud = false,
}) => {
  try {
    await RiskEvent.create({
      email,
      eventType,
      riskScore,
      isFraud,
    });
    console.log("risk detected");
  } catch (err) {
    console.error("Risk Event Log Error:", err);
  }
};

export default adminRouter;
