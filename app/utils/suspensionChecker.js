import User from "../models/user.js";
import { sendUnsuspendMail } from "./suspensionBlockMailService.js";
import { connectDB } from "../config/mongoDBConnection.js";

/**
 * Background task to check for expired suspensions and unsuspend users automatically.
 */
export const checkExpiredSuspensions = async () => {
  try {
    await connectDB();
    const now = new Date();

    // Find users whose suspension has expired
    const expiredUsers = await User.find({
      isSuspended: true,
      suspensionEndDate: { $lte: now }
    });

    if (expiredUsers.length === 0) {
      return;
    }

    console.log(`[SuspensionChecker] Found ${expiredUsers.length} expired suspensions. Processing...`);

    for (const user of expiredUsers) {
      try {
        user.isSuspended = false;
        user.suspensionReason = undefined;
        user.suspensionStartDate = undefined;
        user.suspensionEndDate = undefined;
        user.suspendedBy = undefined;
        
        await user.save();

        // Send unsuspension email
        await sendUnsuspendMail(user.email, user.name, "Automated System");
        
        console.log(`[SuspensionChecker] User ${user.email} has been automatically unsuspended.`);
      } catch (err) {
        console.error(`[SuspensionChecker] Error unsuspending user ${user.email}:`, err);
      }
    }
  } catch (error) {
    console.error("[SuspensionChecker] Error in background task:", error);
  }
};

/**
 * Starts the suspension checker interval.
 * Runs every hour by default.
 */
export const startSuspensionChecker = () => {
  // Run once on startup
  checkExpiredSuspensions();
  
  // Run every hour (3600000 ms)
  // For testing or more precise handling, this could be more frequent (e.g. 15 mins)
  const INTERVAL = 15 * 60 * 1000; // 15 minutes
  setInterval(checkExpiredSuspensions, INTERVAL);
  
  console.log(`[SuspensionChecker] Background task started. Interval: ${INTERVAL / 1000 / 60} minutes.`);
};
