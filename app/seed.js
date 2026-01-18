import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/user.js"; // adjust path
import Investor from "./models/investor.js";
import Enterprenuer from "./models/enterpreneur.js";

const MONGO_URI = "mongodb://localhost:27017/fullstackNexus"; // change db name

async function createDummyUsers() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const hashedPassword = await bcrypt.hash("123", 10);

    // Investor User
    const investorUser = await User.create({
      name: "Test Investor",
      email: "in@gmail.com",
      password: hashedPassword,
      role: "investor",
      approvalStatus: "approved",
    });

    await Investor.create({
      userId: investorUser._id,
      totalInvestments: 0,
      approvalStatus: "approved",
    });

    // Entrepreneur User
    const entrepreneurUser = await User.create({
      name: "Test Entrepreneur",
      email: "en@gmail.com",
      password: hashedPassword,
      role: "entrepreneur",
      approvalStatus: "approved",
    });

    await Enterprenuer.create({
      userId: entrepreneurUser._id,
      startupName: "Demo Startup",
      fundingNeeded: 50000,
      approvalStatus: "approved",
    });

    console.log("Dummy Investor & Entrepreneur created successfully!");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

createDummyUsers();
