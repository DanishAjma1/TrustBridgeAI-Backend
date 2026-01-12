import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",  
  pool: true, 
  maxConnections: 5,
  maxMessages: 100,
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD,
  },
});

const LOGO_URL = process.env.LOGO_URL || "https://mzain4321.github.io/TrustBridge-logo/TrustBridge-logo.png";

// Helper function to generate protected logo HTML
const getProtectedLogoHTML = (size = "large") => {
  const width = size === "small" ? "200px" : "300px";
  const height = size === "small" ? "80px" : "100px";
  const marginBottom = size === "small" ? "10px" : "15px";

  return `
    <!-- Protected Logo Section -->
    <div style="text-align: center; margin-bottom: ${size === 'small' ? '30px' : '35px'};">
      <div style="
        width: ${width};
        height: ${height};
        margin: 0 auto ${marginBottom} auto;
        background-color: #ffffff;
        background-image: url('${LOGO_URL}');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        border-radius: 4px;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        pointer-events: none;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
      "></div>
      ${size === 'small'
      ? '<h2 style="color: #2d3748; margin-top: 10px; margin-bottom: 0;">TrustBridge AI</h2>'
      : '<h1 style="color: #2d3748; margin-top: 15px; margin-bottom: 5px;">TrustBridge AI</h1><p style="color: #718096; font-size: 14px; margin-top: 0;">Building Trust in AI</p>'
    }
    </div>
  `;
};

// Helper to calculate suspension end date
const calculateSuspensionEndDate = (days) => {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + days);
  return endDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Send suspension notification email to user
 * @param {string} email - User's email address
 * @param {string} userName - User's name
 * @param {string} reason - Reason for suspension
 * @param {number} suspensionDays - Number of days suspended
 * @returns {Promise} Promise resolving to email info
 */
export const sendSuspensionMail = (email, userName, reason, suspensionDays) => {
  return new Promise((resolve, reject) => {
    const suspensionEndDate = calculateSuspensionEndDate(suspensionDays);
    const supportEmail = "support@trustbridge.ai";

    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #fff8eb; padding: 20px; border-radius: 8px;">
          ${getProtectedLogoHTML("large")}
          
          <h2 style="color: #d97706; margin-bottom: 20px; text-align: center; border-bottom: 2px solid #fbbf24; padding-bottom: 10px;">
            Account Suspension Notice ⚠️
          </h2>
          
          <div style="background-color: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); border-left: 4px solid #d97706;">
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
              Dear <strong style="color: #2d3748;">${userName}</strong>,
            </p>
            
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
              This email is to inform you that your TrustBridge AI account has been <strong style="color: #d97706;">temporarily suspended</strong> 
              for violating our platform's terms of service or community guidelines.
            </p>
            
            <!-- Suspension Details -->
            <div style="background-color: #fffbeb; padding: 20px; border-radius: 6px; margin: 25px 0; border: 1px solid #fde68a;">
              <h3 style="color: #92400e; margin-top: 0; margin-bottom: 15px; font-size: 18px;">Suspension Details</h3>
              
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr>
                  <td style="padding: 10px 0; color: #78350f; width: 160px;"><strong>Suspension Period:</strong></td>
                  <td style="padding: 10px 0; color: #92400e; font-weight: bold;">
                    ${suspensionDays} day(s) (Until ${suspensionEndDate})
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #78350f;"><strong>Reason for Suspension:</strong></td>
                  <td style="padding: 10px 0; color: #92400e;">
                    ${reason}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #78350f;"><strong>Suspension Start:</strong></td>
                  <td style="padding: 10px 0; color: #92400e;">
                    ${new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}
                  </td>
                </tr>
              </table>
            </div>
            
            <!-- What This Means -->
            <div style="background-color: #f7fafc; padding: 15px; border-radius: 6px; margin: 25px 0;">
              <p style="color: #2d3748; font-weight: bold; margin-top: 0;">During this suspension period:</p>
              <ul style="color: #4a5568; padding-left: 20px;">
                <li>You will not be able to access your account</li>
                <li>Your profile will be temporarily hidden from other users</li>
                <li>You cannot send or receive messages</li>
                <li>Any active connections will be paused</li>
              </ul>
            </div>
            
            <!-- Reactivation Information -->
            <div style="background-color: #f0fdf4; padding: 15px; border-radius: 6px; margin: 25px 0; border-left: 4px solid #10b981;">
              <p style="color: #065f46; font-weight: bold; margin-top: 0;">Account Reactivation:</p>
              <p style="color: #047857; font-size: 14px; line-height: 1.5;">
                Your account will be automatically reactivated on <strong>${suspensionEndDate}</strong>. 
                You will receive an email notification when your suspension is lifted.
              </p>
              <p style="color: #047857; font-size: 14px; line-height: 1.5; margin-top: 10px;">
                After reactivation, we encourage you to review our 
                <a href="${process.env.FRONTEND_URL}/terms" style="color: #059669; font-weight: bold;">Terms of Service</a> 
                and <a href="${process.env.FRONTEND_URL}/community-guidelines" style="color: #059669; font-weight: bold;">Community Guidelines</a> 
                to avoid future suspensions.
              </p>
            </div>
            
            <!-- Appeal Information -->
            <div style="background-color: #eff6ff; padding: 15px; border-radius: 6px; margin: 25px 0;">
              <p style="color: #1e40af; font-weight: bold; margin-top: 0;">Need to Appeal?</p>
              <p style="color: #1c51b9; font-size: 14px; line-height: 1.5;">
                If you believe this suspension was applied in error, you may submit an appeal by contacting our support team at:
                <br>
                <strong><a href="mailto:${supportEmail}" style="color: #3b82f6;">${supportEmail}</a></strong>
              </p>
              <p style="color: #1c51b9; font-size: 12px; margin-top: 10px;">
                Please include your account email and any relevant information in your appeal.
              </p>
            </div>
            
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
              We value you as a member of our community and hope to welcome you back after the suspension period.
            </p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 25px 0;">
          
          <div style="text-align: center; color: #718096; font-size: 12px;">
            <p>TrustBridge AI Compliance Team<br>
            <a href="mailto:${supportEmail}" style="color: #4299e1;">${supportEmail}</a></p>
            <p style="font-size: 11px; margin-top: 15px;">
              © ${new Date().getFullYear()} TrustBridge AI. All rights reserved.<br>
              This is an automated system notification. Please do not reply to this email.
            </p>
          </div>
        </div>
      </div>
    `;

    const mailOptions = {
      from: "TrustBridge AI Compliance <" + process.env.USER_EMAIL + ">",
      to: email,
      subject: `Account Suspended: TrustBridge AI Account Temporarily Restricted`,
      html: htmlMessage,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Suspension Email Error:", error);
        reject(error);
      } else {
        console.log("Suspension Email sent: " + info.response);
        resolve(info);
      }
    });
  });
};

/**
 * Send block notification email to user
 * @param {string} email - User's email address
 * @param {string} userName - User's name
 * @param {string} reason - Reason for blocking
 * @returns {Promise} Promise resolving to email info
 */
export const sendBlockMail = (email, userName, reason) => {
  return new Promise((resolve, reject) => {
    const supportEmail = "support@trustbridge.ai";
    const appealEmail = "appeals@trustbridge.ai";

    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px;">
          ${getProtectedLogoHTML("large")}
          
          <h2 style="color: #dc2626; margin-bottom: 20px; text-align: center; border-bottom: 2px solid #f87171; padding-bottom: 10px;">
            Account Permanently Blocked ❌
          </h2>
          
          <div style="background-color: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); border-left: 4px solid #dc2626;">
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
              Dear <strong style="color: #2d3748;">${userName}</strong>,
            </p>
            
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
              After careful review by our compliance team, your TrustBridge AI account has been 
              <strong style="color: #dc2626;">permanently blocked</strong> due to severe violations of our platform's terms of service.
            </p>
            
            <!-- Block Details -->
            <div style="background-color: #fef2f2; padding: 20px; border-radius: 6px; margin: 25px 0; border: 1px solid #fecaca;">
              <h3 style="color: #991b1b; margin-top: 0; margin-bottom: 15px; font-size: 18px;">Blocking Details</h3>
              
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr>
                  <td style="padding: 10px 0; color: #7f1d1d; width: 160px;"><strong>Action Taken:</strong></td>
                  <td style="padding: 10px 0; color: #b91c1c; font-weight: bold;">
                    Permanent Account Block
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #7f1d1d;"><strong>Block Reason:</strong></td>
                  <td style="padding: 10px 0; color: #b91c1c;">
                    ${reason}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #7f1d1d;"><strong>Effective Date:</strong></td>
                  <td style="padding: 10px 0; color: #b91c1c;">
                    ${new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #7f1d1d;"><strong>Reference ID:</strong></td>
                  <td style="padding: 10px 0; color: #b91c1c; font-family: monospace;">
                    TBA-${Date.now().toString().slice(-8)}
                  </td>
                </tr>
              </table>
            </div>
            
            <!-- Immediate Consequences -->
            <div style="background-color: #fecaca; padding: 15px; border-radius: 6px; margin: 25px 0;">
              <p style="color: #7f1d1d; font-weight: bold; margin-top: 0; font-size: 15px;">Immediate Consequences:</p>
              <ul style="color: #7f1d1d; padding-left: 20px;">
                <li>Permanent loss of account access</li>
                <li>All profile data and content permanently removed</li>
                <li>Inability to create new accounts with this email</li>
                <li>Termination of all active connections and communications</li>
                <li>Forfeiture of any premium features or credits</li>
              </ul>
            </div>
            
            <!-- Important Warning -->
            <div style="background-color: #ffedd5; padding: 15px; border-radius: 6px; margin: 25px 0; border-left: 4px solid #ea580c;">
              <p style="color: #9a3412; font-weight: bold; margin-top: 0;">
                ⚠️ IMPORTANT LEGAL NOTICE
              </p>
              <p style="color: #9a3412; font-size: 13px; line-height: 1.5;">
                Any attempt to circumvent this block by creating new accounts, using alternate email addresses, 
                or accessing the platform through unauthorized means will be considered a violation of our 
                Terms of Service and may result in legal action.
              </p>
            </div>
            
            <!-- Data & Appeal Information -->
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; margin: 25px 0;">
              <h4 style="color: #1e293b; margin-top: 0; margin-bottom: 10px;">Data Privacy & Appeal Process</h4>
              
              <p style="color: #475569; font-size: 14px; line-height: 1.5;">
                <strong>Data Retention:</strong> In accordance with our privacy policy, your account data will be 
                retained for 30 days before permanent deletion. You may request a copy of your data during this period.
              </p>
              
              <p style="color: #475569; font-size: 14px; line-height: 1.5; margin-top: 10px;">
                <strong>Appeal Process:</strong> If you believe this decision was made in error, you have the right to 
                submit a formal appeal within 14 days. Appeals will be reviewed by our senior compliance team.
              </p>
              
              <div style="margin-top: 15px; padding: 10px; background-color: #e0f2fe; border-radius: 4px;">
                <p style="color: #0369a1; font-size: 13px; margin: 0;">
                  <strong>To appeal or request data:</strong><br>
                  Email: <a href="mailto:${appealEmail}" style="color: #0284c7; font-weight: bold;">${appealEmail}</a><br>
                  Include your full name and reference ID in all communications.
                </p>
              </div>
            </div>
            
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; text-align: center; font-style: italic;">
              This decision is final and binding. Thank you for your understanding.
            </p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 25px 0;">
          
          <div style="text-align: center; color: #718096; font-size: 12px;">
            <p>TrustBridge AI Compliance & Legal Department<br>
            <a href="mailto:${supportEmail}" style="color: #4299e1;">${supportEmail}</a> | 
            <a href="mailto:${appealEmail}" style="color: #4299e1;">${appealEmail}</a></p>
            <p style="font-size: 11px; margin-top: 15px;">
              © ${new Date().getFullYear()} TrustBridge AI. All rights reserved.<br>
              This is an automated legal notification. Please do not reply to this email.
            </p>
          </div>
        </div>
      </div>
    `;

    const mailOptions = {
      from: "TrustBridge AI Legal Department <" + process.env.USER_EMAIL + ">",
      to: email,
      subject: `URGENT: Account Permanently Blocked - TrustBridge AI`,
      html: htmlMessage,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Block Email Error:", error);
        reject(error);
      } else {
        console.log("Block Email sent: " + info.response);
        resolve(info);
      }
    });
  });
};

/**
 * Send account reactivation email after suspension period
 * @param {string} email - User's email address
 * @param {string} userName - User's name
 * @returns {Promise} Promise resolving to email info
 */
export const sendReactivationMail = (email, userName) => {
  return new Promise((resolve, reject) => {
    const loginLink = `${process.env.FRONTEND_URL}/login`;

    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px;">
          ${getProtectedLogoHTML("large")}
          
          <h2 style="color: #059669; margin-bottom: 20px; text-align: center; border-bottom: 2px solid #34d399; padding-bottom: 10px;">
            Account Reactivated Successfully! ✅
          </h2>
          
          <div style="background-color: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); border-left: 4px solid #059669;">
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
              Dear <strong style="color: #2d3748;">${userName}</strong>,
            </p>
            
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
              We're pleased to inform you that your TrustBridge AI account suspension has been lifted. 
              Your account is now <strong style="color: #059669;">fully reactivated</strong> and you can access all platform features.
            </p>
            
            <!-- Welcome Back Section -->
            <div style="text-align: center; margin: 30px 0;">
              <div style="background-color: #d1fae5; width: 80px; height: 80px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                <span style="font-size: 36px; color: #059669;">✓</span>
              </div>
              <h3 style="color: #065f46; margin-bottom: 15px;">Welcome Back!</h3>
              <p style="color: #047857; max-width: 400px; margin: 0 auto;">
                We're glad to have you back in our community. Your access has been fully restored.
              </p>
            </div>
            
            <!-- Action Button -->
            <div style="margin: 30px 0; text-align: center;">
              <a href="${loginLink}" style="
                background-color: #059669;
                color: white;
                padding: 14px 35px;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                display: inline-block;
                font-size: 16px;
                transition: background-color 0.3s;
              ">
                Login to Your Account
              </a>
              <p style="color: #718096; font-size: 12px; margin-top: 10px;">
                Or visit: ${loginLink}
              </p>
            </div>
            
            <!-- Important Reminder -->
            <div style="background-color: #fef3c7; padding: 15px; border-radius: 6px; margin: 25px 0; border-left: 4px solid #f59e0b;">
              <p style="color: #92400e; font-weight: bold; margin-top: 0;">Important Reminder:</p>
              <p style="color: #92400e; font-size: 14px; line-height: 1.5;">
                To avoid future account restrictions, please ensure you comply with our 
                <a href="${process.env.FRONTEND_URL}/terms" style="color: #d97706; font-weight: bold;">Terms of Service</a> 
                and <a href="${process.env.FRONTEND_URL}/community-guidelines" style="color: #d97706; font-weight: bold;">Community Guidelines</a>.
              </p>
            </div>
            
            <!-- Support Information -->
            <div style="background-color: #eff6ff; padding: 15px; border-radius: 6px; margin: 25px 0;">
              <p style="color: #1e40af; font-weight: bold; margin-top: 0;">Need Assistance?</p>
              <p style="color: #1c51b9; font-size: 14px; line-height: 1.5;">
                If you experience any issues accessing your account or have questions about platform policies, 
                our support team is here to help:
                <br>
                <strong><a href="mailto:support@trustbridge.ai" style="color: #3b82f6;">support@trustbridge.ai</a></strong>
              </p>
            </div>
            
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
              We look forward to seeing you back on TrustBridge AI!
            </p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 25px 0;">
          
          <div style="text-align: center; color: #718096; font-size: 12px;">
            <p>TrustBridge AI Support Team<br>
            <a href="mailto:support@trustbridge.ai" style="color: #4299e1;">support@trustbridge.ai</a></p>
            <p style="font-size: 11px; margin-top: 15px;">
              © ${new Date().getFullYear()} TrustBridge AI. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    `;

    const mailOptions = {
      from: "TrustBridge AI Support <" + process.env.USER_EMAIL + ">",
      to: email,
      subject: "Account Reactivated - Welcome Back to TrustBridge AI!",
      html: htmlMessage,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Reactivation Email Error:", error);
        reject(error);
      } else {
        console.log("Reactivation Email sent: " + info.response);
        resolve(info);
      }
    });
  });
};

/**
 * Send unblock notification email to user - Account fully restored
 * @param {string} email - User's email address
 * @param {string} userName - User's name
 * @param {string} adminName - Admin who performed the action
 * @returns {Promise} Promise resolving to email info
 */
export const sendUnblockMail = (email, userName, adminName) => {
  return new Promise((resolve, reject) => {
    const loginLink = `${process.env.FRONTEND_URL}/login`;
    const supportEmail = "support@trustbridge.ai";

    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px;">
          ${getProtectedLogoHTML("large")}
          
          <h2 style="color: #059669; margin-bottom: 20px; text-align: center; border-bottom: 2px solid #34d399; padding-bottom: 10px;">
            Account Fully Restored! ✅
          </h2>
          
          <div style="background-color: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); border-left: 4px solid #059669;">
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
              Dear <strong style="color: #2d3748;">${userName}</strong>,
            </p>
            
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
              Great news! After reviewing your case, our admin team has decided to 
              <strong style="color: #059669;">fully restore your account</strong>. 
              Your TrustBridge AI account has been unblocked and is now accessible with all previous data intact.
            </p>
            
            <!-- Success Message -->
            <div style="text-align: center; margin: 30px 0;">
              <div style="background-color: #d1fae5; width: 80px; height: 80px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                <span style="font-size: 36px; color: #059669;">🔓</span>
              </div>
              <h3 style="color: #065f46; margin-bottom: 15px;">Access Restored!</h3>
              <p style="color: #047857; max-width: 400px; margin: 0 auto;">
                Your account has been completely unblocked. You can now log in using your existing credentials.
              </p>
            </div>
            
            <!-- Account Details -->
            <div style="background-color: #f7fafc; padding: 15px; border-radius: 6px; margin: 25px 0; border: 1px solid #e2e8f0;">
              <h4 style="color: #1e293b; margin-top: 0; margin-bottom: 15px;">Account Restoration Details</h4>
              
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr>
                  <td style="padding: 10px 0; color: #4a5568; width: 140px;"><strong>Action:</strong></td>
                  <td style="padding: 10px 0; color: #2d3748; font-weight: bold;">
                    Account Unblock & Full Restoration
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #4a5568;"><strong>Restored By:</strong></td>
                  <td style="padding: 10px 0; color: #2d3748;">
                    ${adminName} (Admin Team)
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #4a5568;"><strong>Effective Date:</strong></td>
                  <td style="padding: 10px 0; color: #2d3748;">
                    ${new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #4a5568;"><strong>Status:</strong></td>
                  <td style="padding: 10px 0; color: #2d3748;">
                    <span style="background-color: #d1fae5; color: #065f46; padding: 4px 12px; border-radius: 20px; font-size: 13px; font-weight: bold;">
                      Active & Fully Restored
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #4a5568;"><strong>Data Status:</strong></td>
                  <td style="padding: 10px 0; color: #2d3748;">
                    All your previous data, connections, and settings have been preserved
                  </td>
                </tr>
              </table>
            </div>
            
            <!-- Login Button -->
            <div style="margin: 30px 0; text-align: center;">
              <a href="${loginLink}" style="
                background-color: #059669;
                color: white;
                padding: 14px 35px;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                display: inline-block;
                font-size: 16px;
                transition: background-color 0.3s;
              ">
                Login to Your Account
              </a>
              <p style="color: #718096; font-size: 12px; margin-top: 10px;">
                Use your existing email and password: ${email}
              </p>
            </div>
            
            <!-- Important Guidelines -->
            <div style="background-color: #fef3c7; padding: 15px; border-radius: 6px; margin: 25px 0; border-left: 4px solid #f59e0b;">
              <p style="color: #92400e; font-weight: bold; margin-top: 0;">Important Guidelines:</p>
              <ul style="color: #92400e; font-size: 14px; padding-left: 20px; line-height: 1.6;">
                <li>Your account is now in good standing</li>
                <li>Please review our <a href="${process.env.FRONTEND_URL}/terms" style="color: #d97706; font-weight: bold;">Terms of Service</a></li>
                <li>Future violations may result in permanent termination</li>
                <li>We encourage positive participation in our community</li>
              </ul>
            </div>
            
            <!-- Support Information -->
            <div style="background-color: #eff6ff; padding: 15px; border-radius: 6px; margin: 25px 0;">
              <p style="color: #1e40af; font-weight: bold; margin-top: 0;">Need Help?</p>
              <p style="color: #1c51b9; font-size: 14px; line-height: 1.5;">
                If you experience any issues logging in or have questions:
                <br>
                <strong><a href="mailto:${supportEmail}" style="color: #3b82f6;">${supportEmail}</a></strong>
              </p>
            </div>
            
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; text-align: center;">
              Welcome back to TrustBridge AI! We're glad to have you return to our community.
            </p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 25px 0;">
          
          <div style="text-align: center; color: #718096; font-size: 12px;">
            <p>TrustBridge AI Support Team<br>
            <a href="mailto:${supportEmail}" style="color: #4299e1;">${supportEmail}</a></p>
            <p style="font-size: 11px; margin-top: 15px;">
              © ${new Date().getFullYear()} TrustBridge AI. All rights reserved.<br>
              This decision reflects our commitment to fair review and community standards.
            </p>
          </div>
        </div>
      </div>
    `;

    const mailOptions = {
      from: "TrustBridge AI Support <" + process.env.USER_EMAIL + ">",
      to: email,
      subject: "Account Unblocked - Full Access Restored | TrustBridge AI",
      html: htmlMessage,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Unblock Email Error:", error);
        reject(error);
      } else {
        console.log("Unblock Email sent: " + info.response);
        resolve(info);
      }
    });
  });
};

/**
 * Send unsuspend notification email to user
 * @param {string} email - User's email address
 * @param {string} userName - User's name
 * @param {string} adminName - Admin who performed the action
 * @returns {Promise} Promise resolving to email info
 */
export const sendUnsuspendMail = (email, userName, adminName) => {
  return new Promise((resolve, reject) => {
    const loginLink = `${process.env.FRONTEND_URL}/login`;

    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px;">
          ${getProtectedLogoHTML("large")}
          
          <h2 style="color: #059669; margin-bottom: 20px; text-align: center; border-bottom: 2px solid #34d399; padding-bottom: 10px;">
            Account Suspension Lifted! ✅
          </h2>
          
          <div style="background-color: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); border-left: 4px solid #059669;">
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
              Dear <strong style="color: #2d3748;">${userName}</strong>,
            </p>
            
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
              Good news! Your TrustBridge AI account has been <strong style="color: #059669;">unsuspended</strong> by our admin team. 
              Your account is now fully accessible and all restrictions have been removed.
            </p>
            
            <!-- Action Details -->
            <div style="background-color: #ecfdf5; padding: 20px; border-radius: 6px; margin: 25px 0; border-left: 4px solid #10b981;">
              <h3 style="color: #065f46; margin-top: 0; margin-bottom: 15px; font-size: 18px;">Account Status Update</h3>
              
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr>
                  <td style="padding: 10px 0; color: #065f46; width: 160px;"><strong>New Status:</strong></td>
                  <td style="padding: 10px 0; color: #065f46; font-weight: bold;">
                    <span style="background-color: #d1fae5; color: #065f46; padding: 4px 12px; border-radius: 20px; font-size: 13px;">
                      Active
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #065f46;"><strong>Action By:</strong></td>
                  <td style="padding: 10px 0; color: #065f46;">
                    ${adminName} (Admin Team)
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; color: #065f46;"><strong>Effective Date:</strong></td>
                  <td style="padding: 10px 0; color: #065f46;">
                    ${new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}
                  </td>
                </tr>
              </table>
            </div>
            
            <!-- Welcome Back Message -->
            <div style="text-align: center; margin: 30px 0;">
              <div style="background-color: #d1fae5; width: 80px; height: 80px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
                <span style="font-size: 36px; color: #059669;">🎉</span>
              </div>
              <h3 style="color: #065f46; margin-bottom: 15px;">Welcome Back!</h3>
              <p style="color: #047857; max-width: 400px; margin: 0 auto;">
                Your account access has been fully restored. You can now log in and resume using all platform features.
              </p>
            </div>
            
            <!-- Login Button -->
            <div style="margin: 30px 0; text-align: center;">
              <a href="${loginLink}" style="
                background-color: #059669;
                color: white;
                padding: 14px 35px;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                display: inline-block;
                font-size: 16px;
                transition: background-color 0.3s;
              ">
                Login to Your Account
              </a>
              <p style="color: #718096; font-size: 12px; margin-top: 10px;">
                Or copy this link: ${loginLink}
              </p>
            </div>
            
            <!-- Important Note -->
            <div style="background-color: #fef3c7; padding: 15px; border-radius: 6px; margin: 25px 0; border-left: 4px solid #f59e0b;">
              <p style="color: #92400e; font-weight: bold; margin-top: 0;">Important Note:</p>
              <p style="color: #92400e; font-size: 14px; line-height: 1.5;">
                Please ensure you review our 
                <a href="${process.env.FRONTEND_URL}/terms" style="color: #d97706; font-weight: bold;">Terms of Service</a> 
                and <a href="${process.env.FRONTEND_URL}/community-guidelines" style="color: #d97706; font-weight: bold;">Community Guidelines</a> 
                to maintain your account in good standing.
              </p>
            </div>
            
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6; text-align: center;">
              We're glad to have you back in our community!
            </p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 25px 0;">
          
          <div style="text-align: center; color: #718096; font-size: 12px;">
            <p>TrustBridge AI Support Team<br>
            <a href="mailto:support@trustbridge.ai" style="color: #4299e1;">support@trustbridge.ai</a></p>
            <p style="font-size: 11px; margin-top: 15px;">
              © ${new Date().getFullYear()} TrustBridge AI. All rights reserved.<br>
              This is an automated notification from our account management system.
            </p>
          </div>
        </div>
      </div>
    `;

    const mailOptions = {
      from: "TrustBridge AI Support <" + process.env.USER_EMAIL + ">",
      to: email,
      subject: "Account Unsuspended - Access Restored | TrustBridge AI",
      html: htmlMessage,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Unsuspend Email Error:", error);
        reject(error);
      } else {
        console.log("Unsuspend Email sent: " + info.response);
        resolve(info);
      }
    });
  });
};