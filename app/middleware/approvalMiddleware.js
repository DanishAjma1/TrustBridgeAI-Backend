import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { connectDB } from "../config/mongoDBConnection.js";


export const checkApprovalStatus = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId || decoded._id;

    await connectDB();
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Admin can always proceed
    if (user.role === "admin") {
      return next();
    }

    // Check approval status for entrepreneur and investor
    if (user.role === "entrepreneur" || user.role === "investor") {
      if (user.approvalStatus === "rejected") {
        return res.status(403).json({ 
          message: "Your account has been rejected",
          reason: user.rejectionReason
        });
      }

      if (user.approvalStatus === "pending") {
        return res.status(403).json({ 
          message: "Your account is pending admin approval. Please wait for approval.",
          status: "pending"
        });
      }

      if (user.approvalStatus === "approved") {
        return next();
      }
    }

    // Other roles can proceed
    next();
  } catch (error) {
    console.error("Approval check error:", error);
    return res.status(401).json({ message: "Token validation failed" });
  }
};


export const adminOnly = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId || decoded._id;

    await connectDB();
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Only admin can access this resource" });
    }

    // Store admin info in request
    req.admin = user;
    next();
  } catch (error) {
    console.error("Admin check error:", error);
    return res.status(401).json({ message: "Token validation failed" });
  }
};
