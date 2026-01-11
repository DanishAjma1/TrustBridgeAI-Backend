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

const LOGO_URL = process.env.LOGO_URL || "https://yourdomain.com/logo.png";

// Helper function to generate protected logo HTML with white background
const getProtectedLogoHTML = (size = "large") => {
  const width = size === "small" ? "200px" : "300px";
  const height = size === "small" ? "80px" : "100px";
  const marginBottom = size === "small" ? "10px" : "15px";

  return `
    <!-- Protected Logo Section - CSS Background Method with White Background -->
    <div style="text-align: center; margin-bottom: ${
      size === "small" ? "30px" : "35px"
    };">
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
      ${
        size === "small"
          ? '<h2 style="color: #2d3748; margin-top: 10px; margin-bottom: 0;">TrustBridge AI</h2>'
          : '<h1 style="color: #2d3748; margin-top: 15px; margin-bottom: 5px;">TrustBridge AI</h1><p style="color: #718096; font-size: 14px; margin-top: 0;">Building Trust in AI</p>'
      }
    </div>
  `;
};

export const sendApprovalMail = (email, userName, role, approvalToken) => {
  return new Promise((resolve, reject) => {
    const approvalLink = `${process.env.FRONTEND_URL}/login`;

    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #f0f4f8; padding: 20px; border-radius: 8px;">
          ${getProtectedLogoHTML("large")}
          
          <h2 style="color: #2d3748; margin-bottom: 20px; text-align: center;">Account Approved! 🎉</h2>
          
          <div style="background-color: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
              Dear <strong style="color: #2d3748;">${userName}</strong>,
            </p>
            
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
              Congratulations! Your <strong>${role}</strong> account has been <strong style="color: #48bb78;">approved</strong> by our admin team. 
              You now have full access to the TrustBridge AI platform.
            </p>
            
            <div style="margin: 30px 0; text-align: center;">
              <a href="${approvalLink}" style="
                background-color: #48bb78;
                color: white;
                padding: 14px 35px;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                display: inline-block;
                font-size: 16px;
                transition: background-color 0.3s;
              ">
                Access Your Dashboard
              </a>
              <p style="color: #718096; font-size: 12px; margin-top: 10px;">
                Or copy this link: ${approvalLink}
              </p>
            </div>
            
            <div style="background-color: #f7fafc; padding: 15px; border-radius: 6px; margin: 25px 0;">
              <p style="color: #2d3748; font-weight: bold; margin-top: 0;">What you can do now:</p>
              <ul style="color: #4a5568; padding-left: 20px;">
                <li>Access your personalized dashboard</li>
                <li>Start exploring AI tools and resources</li>
                <li>Connect with other professionals</li>
                <li>Set up your profile</li>
              </ul>
            </div>
            
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
              We're excited to have you on board and can't wait to see what you'll accomplish!
            </p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 25px 0;">
          
          <div style="text-align: center; color: #718096; font-size: 12px;">
            <p>TrustBridge AI Team<br>
            <a href="mailto:support@trustbridge.ai" style="color: #4299e1;">support@trustbridge.ai</a></p>
            <p style="font-size: 11px; margin-top: 15px;">
              © ${new Date().getFullYear()} TrustBridge AI. All rights reserved.
            </p>
          </div>
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
          ${getProtectedLogoHTML("large")}
          
          <h2 style="color: #c53030; margin-bottom: 20px; text-align: center;">Account Application Decision</h2>
          
          <div style="background-color: white; padding: 25px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
              Dear <strong style="color: #2d3748;">${userName}</strong>,
            </p>
            
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
              Thank you for applying to join TrustBridge AI as a <strong>${role}</strong>. After careful review by our admin team, 
              we regret to inform you that your application has been <strong style="color: #c53030;">rejected</strong>.
            </p>
            
            <div style="background-color: #fed7d7; padding: 15px; border-left: 4px solid #c53030; margin: 20px 0; border-radius: 4px;">
              <p style="color: #742a2a; margin: 0; font-weight: bold; font-size: 14px;">Reason for Rejection:</p>
              <p style="color: #742a2a; margin: 5px 0; font-size: 14px;">
                ${rejectionReason}
              </p>
            </div>
            
            <div style="background-color: #f7fafc; padding: 15px; border-radius: 6px; margin: 25px 0;">
              <p style="color: #2d3748; font-weight: bold; margin-top: 0;">What you can do:</p>
              <ul style="color: #4a5568; padding-left: 20px;">
                <li>Address the issues mentioned above</li>
                <li>Contact support for clarification</li>
                <li>Reapply in the future with updated information</li>
                <li>Check our guidelines for application requirements</li>
              </ul>
            </div>
            
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
              If you believe this decision was made in error or would like to provide additional information, 
              please contact our support team at <strong><a href="mailto:support@trustbridge.ai" style="color: #4299e1;">support@trustbridge.ai</a></strong>.
            </p>
            
            <p style="color: #4a5568; font-size: 14px; line-height: 1.6;">
              We appreciate your interest and hope you'll consider applying again in the future.
            </p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 25px 0;">
          
          <div style="text-align: center; color: #718096; font-size: 12px;">
            <p>TrustBridge AI Team<br>
            <a href="mailto:support@trustbridge.ai" style="color: #4299e1;">support@trustbridge.ai</a></p>
            <p style="font-size: 11px; margin-top: 15px;">
              © ${new Date().getFullYear()} TrustBridge AI. All rights reserved.
            </p>
          </div>
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
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        ${getProtectedLogoHTML("small")}
        
        <div style="background-color: #f8fafc; padding: 25px; border-radius: 8px; border-left: 4px solid #2F38C2;">
          <h3 style="color: #2d3748; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #e2e8f0;">
            New User Registration Requires Review
          </h3>
          
          <div style="background-color: white; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
            <p style="color: #2d3748; font-size: 16px; margin-bottom: 15px;">
              A new user has registered and requires your approval:
            </p>
            
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr>
                <td style="padding: 8px 0; color: #4a5568; width: 100px;"><strong>Name:</strong></td>
                <td style="padding: 8px 0; color: #2d3748; font-weight: bold;">${userName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #4a5568;"><strong>Email:</strong></td>
                <td style="padding: 8px 0; color: #2d3748;">${userEmail}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #4a5568;"><strong>Role:</strong></td>
                <td style="padding: 8px 0; color: #2d3748;">
                  <span style="background-color: #e6fffa; color: #234e52; padding: 4px 8px; border-radius: 4px; font-size: 13px;">
                    ${role}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #4a5568;"><strong>Time:</strong></td>
                <td style="padding: 8px 0; color: #2d3748;">${new Date().toLocaleString()}</td>
              </tr>
            </table>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${approvalLink}" style="
              background-color: #2F38C2;
              color: white;
              padding: 14px 35px;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              display: inline-block;
              font-size: 16px;
              transition: background-color 0.3s;
            ">
              Review Pending Approvals
            </a>
          </div>
          
          <p style="color: #718096; font-size: 13px; text-align: center;">
            This is an automated notification. Please log in to the admin dashboard to review and take action.
          </p>
        </div>
        
        <div style="text-align: center; color: #718096; font-size: 12px; margin-top: 25px;">
          <p>TrustBridge AI Admin System<br>
          <a href="mailto:admin@trustbridge.ai" style="color: #4299e1;">admin@trustbridge.ai</a></p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: "TrustBridge AI Admin <" + process.env.USER_EMAIL + ">",
      to: adminEmail,
      subject: "Action Required: New User Registration - TrustBridge AI",
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

// Notify user that their registration is successful and under review
export const sendUserRegistrationNotification = (email, userName, role) => {
  return new Promise((resolve, reject) => {
    const htmlMessage = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        ${getProtectedLogoHTML("small")}
        
        <div style="background-color: #f0f9ff; padding: 25px; border-radius: 8px; border-left: 4px solid #3182ce;">
          <h2 style="color: #2c5282; margin-bottom: 20px; text-align: center;">Registration Successful! 🚀</h2>
          
          <div style="background-color: white; padding: 25px; border-radius: 6px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
              Dear <strong style="color: #2d3748;">${userName}</strong>,
            </p>
            
            <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
              Thank you for registering with TrustBridge AI as ${role}. We have received your application.
            </p>
            
            <div style="background-color: #ebf8ff; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="color: #2c5282; margin: 0; font-weight: bold; font-size: 15px;">
                Status: <span style="color: #d69e2e;">Under Review</span>
              </p>
              <p style="color: #4a5568; font-size: 14px; margin-top: 5px;">
                Our admin team reviews all new accounts to ensure the quality and security of our platform.
              </p>
            </div>
            
            <p style="color: #4a5568; font-size: 15px; line-height: 1.6;">
              You will receive another email once your account has been approved or if we need more information. This typically takes 24-48 hours.
            </p>
          </div>
          
          <p style="color: #718096; font-size: 13px; text-align: center;">
            If you have any questions, please contact <a href="mailto:support@trustbridge.ai" style="color: #4299e1;">support@trustbridge.ai</a>.
          </p>
        </div>
        
        <div style="text-align: center; color: #718096; font-size: 12px; margin-top: 25px;">
            <p>TrustBridge AI<br>
            <p style="font-size: 11px; margin-top: 5px;">
              © ${new Date().getFullYear()} TrustBridge AI. All rights reserved.
            </p>
        </div>
      </div>
    `;

    const mailOptions = {
      from: "TrustBridge AI <" + process.env.USER_EMAIL + ">",
      to: email,
      subject: "Registration Successful - Account Under Review",
      html: htmlMessage,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("User welcome email error:", error);
        reject(error);
      } else {
        console.log("User welcome email sent:", info.response);
        resolve(info);
      }
    });
  });
};
