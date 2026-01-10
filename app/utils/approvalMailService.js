// approvalMailService.js
import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD,
  },
});
console.log("MAIL USER:", process.env.USER_EMAIL);
console.log("MAIL PASS EXISTS:", !!process.env.USER_PASSWORD);

export const sendApprovalMail = (email, userName, role, approvalToken) => {
  return new Promise((resolve, reject) => {
    const approvalLink = `${process.env.FRONTEND_URL}/login`;
    
    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f0f4f8; padding: 20px; border-radius: 8px;">
          <h2 style="color: #2d3748; margin-bottom: 20px;">Account Approved! 🎉</h2>
          
          <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
            Dear <strong>${userName}</strong>,
          </p>
          
          <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
            Congratulations! Your ${role} account has been <strong>approved</strong> by our admin team. 
            You now have full access to the TrustBridge AI platform.
          </p>
          
          <div style="margin: 30px 0;">
            <a href="${approvalLink}" style="
              background-color: #48bb78;
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              display: inline-block;
            ">
              Access Your Dashboard
            </a>
          </div>
          
          <p style="color: #4a5568; font-size: 14px; line-height: 1.6;">
            You can now login to your dashboard and start exploring opportunities.
          </p>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
          
          <p style="color: #718096; font-size: 12px;">
            TrustBridge AI Team
          </p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: "TrustBridge AI <" + process.env.USER_EMAIL + ">",
      to: email,
      subject: "Account Approved - Welcome to TrustBridge AI!",
      html: htmlMessage,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Approval Email Error:", error);
        reject(error);
      } else {
        console.log("Approval Email sent: " + info.response);
        resolve(info);
      }
    });
  });
};

export const sendRejectionMail = (email, userName, role, rejectionReason) => {
  return new Promise((resolve, reject) => {
    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #fff5f5; padding: 20px; border-radius: 8px;">
          <h2 style="color: #c53030; margin-bottom: 20px;">Account Application Decision</h2>
          
          <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
            Dear <strong>${userName}</strong>,
          </p>
          
          <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
            Thank you for applying to join TrustBridge AI as a ${role}. After careful review by our admin team, 
            we regret to inform you that your application has been <strong>rejected</strong>.
          </p>
          
          <div style="background-color: #fed7d7; padding: 15px; border-left: 4px solid #c53030; margin: 20px 0; border-radius: 4px;">
            <p style="color: #742a2a; margin: 0; font-weight: bold;">Reason:</p>
            <p style="color: #742a2a; margin: 5px 0; font-size: 14px;">
              ${rejectionReason}
            </p>
          </div>
          
          <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
            If you believe this decision was made in error or would like to provide additional information, 
            please contact our support team at <strong>support@trustbridge.ai</strong>.
          </p>
          
          <p style="color: #4a5568; font-size: 14px; line-height: 1.6;">
            We appreciate your interest and hope you'll consider applying again in the future.
          </p>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
          
          <p style="color: #718096; font-size: 12px;">
            TrustBridge AI Team
          </p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: "TrustBridge AI <" + process.env.USER_EMAIL + ">",
      to: email,
      subject: "Application Decision - TrustBridge AI",
      html: htmlMessage,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Rejection Email Error:", error);
        reject(error);
      } else {
        console.log("Rejection Email sent: " + info.response);
        resolve(info);
      }
    });
  });
};

// Notify admin when a new user registers
export const sendAdminNewUserNotification = (userEmail, userName, role) => {
  return new Promise((resolve, reject) => {
    const adminEmail = process.env.ADMIN_EMAIL || "aitrustbridge@gmail.com";
     const approvalLink = `${process.env.FRONTEND_URL}/login`;
    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; max-width:600px; margin:0 auto; color:#2d3748;">
        <h3 style="margin-bottom:8px;">New User Registered</h3>
        <p><strong>Name:</strong> ${userName}</p>
        <p><strong>Email:</strong> ${userEmail}</p>
        <p><strong>Role:</strong> ${role}</p>
        <p style="margin-top:12px;">Visit the admin dashboard to review pending approvals.</p>
        <div style="margin: 30px 0;">
            <a href="${approvalLink}" style="
              background-color: #2F38C2;
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              display: inline-block;
            ">
              Access Your Dashboard
            </a>
          </div>
      </div>
    `;

    const mailOptions = {
      from: "TrustBridge AI <" + process.env.USER_EMAIL + ">",
      to: adminEmail,
      subject: "New user registration - action may be required",
      html: htmlMessage,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Admin notification email error:", error);
        reject(error);
      } else {
        console.log("Admin notification sent:", info.response);
        resolve(info);
      }
    });
  });
};
