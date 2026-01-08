import jwt from "jsonwebtoken";
import speakeasy from "speakeasy";
import qrcode from "qrcode";
import User from "../models/user.js";
import { connectDB } from "../config/mongoDBConnection.js";
import crypto from "crypto";
class TwoFactorAuth {
  // Generate 2FA secret for user
  static async generateSecret(userId) {
    try {
      await connectDB();
      const user = await User.findById(userId);
      
      if (!user) {
        throw new Error("User not found");
      }
      
      // Generate secret
      const secret = speakeasy.generateSecret({
        name: `TrustBridge AI (${user.email})`,
        issuer: "TrustBridge AI"
      });
      
      // Generate QR code
      const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);
      
      return {
        secret: secret.base32,
        qrCodeUrl,
        otpauth_url: secret.otpauth_url
      };
    } catch (error) {
      console.error("Error generating 2FA secret:", error);
      throw error;
    }
  }
  
  // Verify 2FA token
  static async verifyToken(userId, token, deviceInfo = null) {
    try {
      await connectDB();
      const user = await User.findById(userId).select('+twoFactorSecret');
      
      if (!user) {
        throw new Error("User not found");
      }
      
      if (!user.twoFactorSecret) {
        throw new Error("2FA not set up for user");
      }
      
      // Verify token
      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: token,
        window: 1 // Allow 30-second window before/after
      });
      
      if (verified && deviceInfo && user.securitySettings.rememberTrustedDevices) {
        // Add device to trusted devices if verification successful
        user.addTrustedDevice(deviceInfo);
        await user.save();
      }
      
      return verified;
    } catch (error) {
      console.error("Error verifying 2FA token:", error);
      throw error;
    }
  }
  
  // Generate backup codes
  static generateBackupCodes() {
    const codes = [];
    for (let i = 0; i < 10; i++) {
      const code = Array(10)
        .fill(0)
        .map(() => Math.random().toString(36).charAt(2))
        .join('')
        .toUpperCase()
        .replace(/[0OI1]/g, 'X'); // Avoid confusing characters
      codes.push(code);
    }
    return codes;
  }
  
  // Verify backup code
  static async verifyBackupCode(userId, code) {
    try {
      await connectDB();
      const user = await User.findById(userId).select('+backupCodes');
      
      if (!user || !user.backupCodes) {
        return false;
      }
      
      const index = user.backupCodes.indexOf(code);
      if (index > -1) {
        // Remove used backup code
        user.backupCodes.splice(index, 1);
        await user.save();
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error verifying backup code:", error);
      return false;
    }
  }
  
  // Check if 2FA is required for login
  static async is2FARequired(userId, deviceId) {
    try {
      await connectDB();
      const user = await User.findById(userId);
      
      if (!user) {
        return true; // Require 2FA if user not found
      }
      
      if (!user.twoFactorEnabled) {
        return false; // No 2FA required if not enabled
      }
      
      // Check if device is trusted
      if (deviceId && user.isDeviceTrusted(deviceId)) {
        return false; // No 2FA required for trusted device
      }
      
      return true; // Require 2FA
    } catch (error) {
      console.error("Error checking 2FA requirement:", error);
      return true; // Default to requiring 2FA on error
    }
  }
  
  // Enable 2FA for user
  static async enable2FA(userId, secret, token) {
    try {
      await connectDB();
      
      // First verify the token
      const verified = speakeasy.totp.verify({
        secret: secret,
        encoding: 'base32',
        token: token
      });
      
      if (!verified) {
        throw new Error("Invalid verification code");
      }
      
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      
      // Generate backup codes
      const backupCodes = this.generateBackupCodes();
      
      // Update user with 2FA settings
      user.twoFactorEnabled = true;
      user.twoFactorSecret = secret;
      user.backupCodes = backupCodes;
      
      await user.save();
      
      return backupCodes;
    } catch (error) {
      console.error("Error enabling 2FA:", error);
      throw error;
    }
  }
  
  // Disable 2FA for user
  static async disable2FA(userId) {
    try {
      await connectDB();
      const user = await User.findById(userId);
      
      if (!user) {
        throw new Error("User not found");
      }
      
      user.twoFactorEnabled = false;
      user.twoFactorSecret = null;
      user.backupCodes = [];
      
      await user.save();
      return true;
    } catch (error) {
      console.error("Error disabling 2FA:", error);
      throw error;
    }
  }
  
  // Remove trusted device
  static async removeTrustedDevice(userId, deviceId) {
    try {
      await connectDB();
      const user = await User.findById(userId);
      
      if (!user) {
        throw new Error("User not found");
      }
      
      user.trustedDevices = user.trustedDevices.filter(
        device => device.deviceId !== deviceId
      );
      
      await user.save();
      return true;
    } catch (error) {
      console.error("Error removing trusted device:", error);
      throw error;
    }
  }
  // Delete all trusted devices for a user
static async clearAllTrustedDevices(userId) {
  try {
    await connectDB();

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    
    user.trustedDevices = [];

    await user.save();
    return true;
  } catch (error) {
    console.error("Error clearing all trusted devices:", error);
    throw error;
  }
}

  
    // Get device info from request
  static getDeviceInfo(req) {
    const userAgent = req.headers['user-agent'] || '';
    const ipAddress = req.ip || req.connection.remoteAddress;
    
    // Parse user agent
    let browser = 'Unknown';
    let os = 'Unknown';
    
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';
    else if (userAgent.includes('Opera')) browser = 'Opera';
    
    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iOS') || userAgent.includes('iPhone')) os = 'iOS';
    
    // Generate device ID (combination of user agent and IP hash)
    const deviceId = crypto
      .createHash('md5')
      .update(`${userAgent}-${ipAddress}`)
      .digest('hex');
    
    return {
      deviceId,
      deviceName: `${os} - ${browser}`,
      browser,
      os,
      ipAddress,
      userAgent,
      location: this.getLocationFromIP(ipAddress)
    };
  }
  
   static getLocationFromIP(ip) {
    // In production, use a geolocation service
    // For now, return generic location based on IP pattern
    if (ip === '127.0.0.1' || ip === '::1') {
      return 'Localhost';
    }
    
    // Simple IP-based location (for demo purposes)
    // In production, use a service like ipinfo.io or MaxMind
    const ipParts = ip.split('.');
    if (ipParts.length === 4) {
      const firstOctet = parseInt(ipParts[0]);
      if (firstOctet >= 192 && firstOctet <= 223) {
        return 'Private Network';
      }
    }
    
    return 'Unknown Location';
  }
}

export default TwoFactorAuth;