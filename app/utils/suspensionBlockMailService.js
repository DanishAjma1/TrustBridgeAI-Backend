// accountManagementMailService.js
import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

// Email configuration
const EMAIL_CONFIG = {
  service: "gmail",
  pool: true,
  maxConnections: 5,
  maxMessages: 100,
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD,
  },
};

// Brand configuration
const BRAND_CONFIG = {
  name: "TrustBridge AI",
  tagline: "Building Trust in AI",
  logoUrl:
    process.env.LOGO_URL ||
    "https://mzain4321.github.io/TrustBridge-logo/TrustBridge-logo.png",
  supportEmail: "aitrustbridge@gmail.com",
  appealEmail: "aitrustbridge@gmail.com",
  complianceEmail: "aitrustbridge@gmail.com",
  frontendUrl: process.env.FRONTEND_URL,
  colors: {
    warning: "#d97706",
    error: "#dc2626",
    success: "#059669",
    info: "#3b82f6",
    primary: "#2F38C2",
    neutral: "#718096",
  },
};

// Initialize transporter
const transporter = nodemailer.createTransport(EMAIL_CONFIG);

// Utility functions
const UTILS = {
  // Logo HTML generator
  getLogo: (size = "large") => {
    const dimensions = {
      small: { width: "200px", height: "80px", marginBottom: "10px" },
      large: { width: "300px", height: "100px", marginBottom: "15px" },
    };
    const { width, height, marginBottom } =
      dimensions[size] || dimensions.large;

    return `
      <div style="text-align: center; margin-bottom: ${
        size === "small" ? "30px" : "35px"
      };">
        <div style="
          width: ${width};
          height: ${height};
          margin: 0 auto ${marginBottom} auto;
          background-color: #ffffff;
          background-image: url('${BRAND_CONFIG.logoUrl}');
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
            ? `<h2 style="color: #2d3748; margin-top: 10px; margin-bottom: 0;">${BRAND_CONFIG.name}</h2>`
            : `<h1 style="color: #2d3748; margin-top: 15px; margin-bottom: 5px;">${BRAND_CONFIG.name}</h1>
             <p style="color: ${BRAND_CONFIG.colors.neutral}; font-size: 14px; margin-top: 0;">${BRAND_CONFIG.tagline}</p>`
        }
      </div>
    `;
  },

  // Calculate suspension end date
  calculateSuspensionEndDate: (days) => {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);
    return endDate.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  },

  // Format current date/time
  formatCurrentDateTime: () => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  },

  // Generate reference ID
  generateReferenceId: () => {
    return `TBA-${Date.now().toString().slice(-8)}`;
  },

  // Email wrapper
  getWrapper: (content, options = {}) => {
    const {
      backgroundColor = "#f0f4f8",
      borderColor,
      padding = "20px",
    } = options;

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: ${padding};">
        <div style="
          background-color: ${backgroundColor};
          padding: 20px;
          border-radius: 8px;
          ${borderColor ? `border-left: 4px solid ${borderColor};` : ""}
        ">
          ${content}
        </div>
      </div>
    `;
  },

  // Content card
  getCard: (content, options = {}) => {
    const {
      backgroundColor = "white",
      padding = "25px",
      borderColor,
      shadow = true,
    } = options;

    return `
      <div style="
        background-color: ${backgroundColor};
        padding: ${padding};
        border-radius: 8px;
        ${shadow ? "box-shadow: 0 2px 8px rgba(0,0,0,0.05);" : ""}
        ${borderColor ? `border-left: 4px solid ${borderColor};` : ""}
        margin: 20px 0;
      ">
        ${content}
      </div>
    `;
  },

  // Button component
  getButton: (text, link, options = {}) => {
    const {
      backgroundColor = BRAND_CONFIG.colors.primary,
      color = "white",
      padding = "14px 35px",
      showLinkCopy = false,
    } = options;

    return `
      <div style="margin: 30px 0; text-align: center;">
        <a href="${link}" style="
          background-color: ${backgroundColor};
          color: ${color};
          padding: ${padding};
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
          display: inline-block;
          font-size: 16px;
          transition: background-color 0.3s ease;
          border: none;
          cursor: pointer;
        ">
          ${text}
        </a>
        ${
          showLinkCopy
            ? `
          <p style="color: ${BRAND_CONFIG.colors.neutral}; font-size: 12px; margin-top: 10px;">
            Or copy this link: ${link}
          </p>
        `
            : ""
        }
      </div>
    `;
  },

  // Footer component
  getFooter: (department = "Team", additionalInfo = "") => `
    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 25px 0;">
    <div style="text-align: center; color: ${
      BRAND_CONFIG.colors.neutral
    }; font-size: 12px;">
      <p>${BRAND_CONFIG.name} ${department}<br>
      <a href="mailto:${
        BRAND_CONFIG.supportEmail
      }" style="color: #4299e1; text-decoration: none;">${
    BRAND_CONFIG.supportEmail
  }</a></p>
      ${
        additionalInfo
          ? `<p style="font-size: 11px; margin-top: 10px;">${additionalInfo}</p>`
          : ""
      }
      <p style="font-size: 11px; margin-top: 15px;">
        © ${new Date().getFullYear()} ${BRAND_CONFIG.name}. All rights reserved.
      </p>
    </div>
  `,

  // Info box component
  getInfoBox: (title, items, options = {}) => {
    const {
      backgroundColor = "#f7fafc",
      borderColor = "#e2e8f0",
      textColor = "#4a5568",
      titleColor = "#2d3748",
    } = options;

    const itemsList = items
      .map(
        (item) =>
          `<li style="margin-bottom: 8px; color: ${textColor}; line-height: 1.5;">${item}</li>`
      )
      .join("");

    return `
      <div style="
        background-color: ${backgroundColor};
        padding: 15px;
        border-radius: 6px;
        margin: 25px 0;
        border: 1px solid ${borderColor};
      ">
        <p style="color: ${titleColor}; font-weight: bold; margin-top: 0;">${title}</p>
        <ul style="color: ${textColor}; padding-left: 20px; margin: 0;">
          ${itemsList}
        </ul>
      </div>
    `;
  },

  // Status badge component
  getStatusBadge: (text, type = "info") => {
    const colors = {
      warning: { bg: "#fef3c7", text: "#92400e", border: "#f59e0b" },
      error: { bg: "#fee2e2", text: "#991b1b", border: "#ef4444" },
      success: { bg: "#d1fae5", text: "#065f46", border: "#10b981" },
      info: { bg: "#e0f2fe", text: "#0369a1", border: "#0ea5e9" },
    };

    const color = colors[type] || colors.info;

    return `
      <span style="
        background-color: ${color.bg};
        color: ${color.text};
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 13px;
        font-weight: bold;
        border: 1px solid ${color.border};
        display: inline-block;
      ">
        ${text}
      </span>
    `;
  },

  // Table row component
  getTableRow: (label, value, options = {}) => {
    const {
      labelWidth = "160px",
      labelColor = "#4a5568",
      valueColor = "#2d3748",
    } = options;

    return `
      <tr>
        <td style="padding: 10px 0; color: ${labelColor}; width: ${labelWidth}; vertical-align: top;">
          <strong>${label}:</strong>
        </td>
        <td style="padding: 10px 0; color: ${valueColor};">
          ${value}
        </td>
      </tr>
    `;
  },
};

// Suspension Email
export const sendSuspensionMail = (email, userName, reason, suspensionDays) => {
  return new Promise((resolve, reject) => {
    const suspensionEndDate = UTILS.calculateSuspensionEndDate(suspensionDays);
    const loginLink = `${BRAND_CONFIG.frontendUrl}/login`;
    const termsLink = `${BRAND_CONFIG.frontendUrl}/terms`;
    const guidelinesLink = `${BRAND_CONFIG.frontendUrl}/guidelines`;

    const content = `
      ${UTILS.getLogo("large")}
      
      <h2 style="color: ${
        BRAND_CONFIG.colors.warning
      }; margin-bottom: 20px; text-align: center; border-bottom: 2px solid #fbbf24; padding-bottom: 10px;">
        Account Suspension Notice ⚠️
      </h2>
      
      ${UTILS.getCard(
        `
        <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
          Dear <strong style="color: #2d3748;">${userName}</strong>,
        </p>
        
        <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
          This email is to inform you that your ${
            BRAND_CONFIG.name
          } account has been 
          <strong style="color: ${
            BRAND_CONFIG.colors.warning
          };">temporarily suspended</strong> 
          for violating our platform's terms of service or community guidelines.
        </p>
        
        <!-- Suspension Details -->
        ${UTILS.getCard(
          `
          <h3 style="color: #92400e; margin-top: 0; margin-bottom: 15px; font-size: 18px;">Suspension Details</h3>
          
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            ${UTILS.getTableRow(
              "Suspension Period",
              `${suspensionDays} day(s) (Until ${suspensionEndDate})`,
              { valueColor: "#92400e", labelColor: "#78350f" }
            )}
            ${UTILS.getTableRow("Reason for Suspension", reason, {
              valueColor: "#92400e",
              labelColor: "#78350f",
            })}
            ${UTILS.getTableRow(
              "Suspension Start",
              UTILS.formatCurrentDateTime(),
              { valueColor: "#92400e", labelColor: "#78350f" }
            )}
          </table>
        `,
          {
            backgroundColor: "#fffbeb",
            borderColor: "#fde68a",
            shadow: false,
          }
        )}
        
        <!-- What This Means -->
        ${UTILS.getInfoBox(
          "During this suspension period:",
          [
            "You will not be able to access your account",
            "Your profile will be temporarily hidden from other users",
            "You cannot send or receive messages",
            "Any active connections will be paused",
          ],
          {
            backgroundColor: "#f7fafc",
            textColor: "#4a5568",
          }
        )}
        
        <!-- Reactivation Information -->
        ${UTILS.getCard(
          `
          <p style="color: #065f46; font-weight: bold; margin-top: 0;">Account Reactivation:</p>
          <p style="color: #047857; font-size: 14px; line-height: 1.5;">
            Your account will be automatically reactivated on <strong>${suspensionEndDate}</strong>. 
            You will receive an email notification when your suspension is lifted.
          </p>
          <p style="color: #047857; font-size: 14px; line-height: 1.5; margin-top: 10px;">
            After reactivation, we encourage you to review our 
            <a href="${termsLink}" style="color: #059669; font-weight: bold;">Terms of Service</a> 
            and <a href="${guidelinesLink}" style="color: #059669; font-weight: bold;">Community Guidelines</a> 
            to avoid future suspensions.
          </p>
        `,
          {
            backgroundColor: "#f0fdf4",
            borderColor: BRAND_CONFIG.colors.success,
            shadow: false,
          }
        )}
        
        <!-- Appeal Information -->
        ${UTILS.getCard(
          `
          <p style="color: #1e40af; font-weight: bold; margin-top: 0;">Need to Appeal?</p>
          <p style="color: #1c51b9; font-size: 14px; line-height: 1.5;">
            If you believe this suspension was applied in error, you may submit an appeal by contacting our support team at:
            <br>
            <strong><a href="mailto:${BRAND_CONFIG.supportEmail}" style="color: ${BRAND_CONFIG.colors.info};">${BRAND_CONFIG.supportEmail}</a></strong>
          </p>
          <p style="color: #1c51b9; font-size: 12px; margin-top: 10px;">
            Please include your account email and any relevant information in your appeal.
          </p>
        `,
          {
            backgroundColor: "#eff6ff",
            shadow: false,
          }
        )}
        
        <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
          We value you as a member of our community and hope to welcome you back after the suspension period.
        </p>
      `,
        { borderColor: BRAND_CONFIG.colors.warning }
      )}
      
      ${UTILS.getFooter(
        "Compliance Team",
        "This is an automated system notification. Please do not reply to this email."
      )}
    `;

    const mailOptions = {
      from: `${BRAND_CONFIG.name} Compliance <${process.env.USER_EMAIL}>`,
      to: email,
      subject: `Account Suspended: ${BRAND_CONFIG.name} Account Temporarily Restricted`,
      html: UTILS.getWrapper(content, {
        backgroundColor: "#fff8eb",
        borderColor: BRAND_CONFIG.colors.warning,
      }),
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Suspension Email Error:", error);
        reject(error);
      } else {
        console.log("Suspension Email sent to:", email);
        resolve(info);
      }
    });
  });
};

// Block Email
export const sendBlockMail = (email, userName, reason) => {
  return new Promise((resolve, reject) => {
    const referenceId = UTILS.generateReferenceId();

    const content = `
      ${UTILS.getLogo("large")}
      
      <h2 style="color: ${
        BRAND_CONFIG.colors.error
      }; margin-bottom: 20px; text-align: center; border-bottom: 2px solid #f87171; padding-bottom: 10px;">
        Account Permanently Blocked ❌
      </h2>
      
      ${UTILS.getCard(
        `
        <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
          Dear <strong style="color: #2d3748;">${userName}</strong>,
        </p>
        
        <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
          After careful review by our compliance team, your ${
            BRAND_CONFIG.name
          } account has been 
          <strong style="color: ${
            BRAND_CONFIG.colors.error
          };">permanently blocked</strong> due to severe violations of our platform's terms of service.
        </p>
        
        <!-- Block Details -->
        ${UTILS.getCard(
          `
          <h3 style="color: #991b1b; margin-top: 0; margin-bottom: 15px; font-size: 18px;">Blocking Details</h3>
          
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            ${UTILS.getTableRow("Action Taken", "Permanent Account Block", {
              valueColor: "#b91c1c",
              labelColor: "#7f1d1d",
            })}
            ${UTILS.getTableRow("Block Reason", reason, {
              valueColor: "#b91c1c",
              labelColor: "#7f1d1d",
            })}
            ${UTILS.getTableRow(
              "Effective Date",
              UTILS.formatCurrentDateTime(),
              { valueColor: "#b91c1c", labelColor: "#7f1d1d" }
            )}
            ${UTILS.getTableRow(
              "Reference ID",
              `<span style="font-family: monospace; font-weight: bold;">${referenceId}</span>`,
              { valueColor: "#b91c1c", labelColor: "#7f1d1d" }
            )}
          </table>
        `,
          {
            backgroundColor: "#fef2f2",
            borderColor: "#fecaca",
            shadow: false,
          }
        )}
        
        <!-- Immediate Consequences -->
        ${UTILS.getInfoBox(
          "Immediate Consequences:",
          [
            "All profile data and content permanently hided from the platform",
            "Inability to create new accounts with this email",
            "Termination of all active connections and communications",
          ],
          {
            backgroundColor: "#fecaca",
            textColor: "#7f1d1d",
            titleColor: "#7f1d1d",
            borderColor: "#fca5a5",
          }
        )}
        
        <!-- Legal Warning -->
        ${UTILS.getCard(
          `
          <p style="color: #9a3412; font-weight: bold; margin-top: 0;">
            ⚠️ IMPORTANT LEGAL NOTICE
          </p>
          <p style="color: #9a3412; font-size: 13px; line-height: 1.5;">
            Any attempt to circumvent this block by creating new accounts, using alternate email addresses, 
            or accessing the platform through unauthorized means will be considered a violation of our 
            Terms of Service and may result in legal action.
          </p>
        `,
          {
            backgroundColor: "#ffedd5",
            borderColor: "#ea580c",
            shadow: false,
          }
        )}
        
        <!-- Data & Appeal Information -->
        ${UTILS.getCard(
          `
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
              Email: <a href="mailto:${BRAND_CONFIG.appealEmail}" style="color: #0284c7; font-weight: bold;">${BRAND_CONFIG.appealEmail}</a><br>
              Include your full name and reference ID (${referenceId}) in all communications.
            </p>
          </div>
        `,
          {
            backgroundColor: "#f8fafc",
            shadow: false,
          }
        )}
        
        <p style="color: #4a5568; font-size: 16px; line-height: 1.6; text-align: center; font-style: italic;">
          This decision is final and binding. Thank you for your understanding.
        </p>
      `,
        { borderColor: BRAND_CONFIG.colors.error }
      )}
      
      ${UTILS.getFooter(
        "Compliance & Legal Department",
        `This is an automated legal notification. Please do not reply to this email.`
      )}
    `;

    const mailOptions = {
      from: `${BRAND_CONFIG.name} Legal Department <${process.env.USER_EMAIL}>`,
      to: email,
      subject: `URGENT: Account Permanently Blocked - ${BRAND_CONFIG.name}`,
      html: UTILS.getWrapper(content, {
        backgroundColor: "#fef2f2",
        borderColor: BRAND_CONFIG.colors.error,
      }),
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Block Email Error:", error);
        reject(error);
      } else {
        console.log("Block Email sent to:", email);
        resolve(info);
      }
    });
  });
};

// Reactivation Email
export const sendReactivationMail = (email, userName) => {
  return new Promise((resolve, reject) => {
    const loginLink = `${BRAND_CONFIG.frontendUrl}/login`;
    const termsLink = `${BRAND_CONFIG.frontendUrl}/terms`;
    const guidelinesLink = `${BRAND_CONFIG.frontendUrl}/community-guidelines`;

    const content = `
      ${UTILS.getLogo("large")}
      
      <h2 style="color: ${
        BRAND_CONFIG.colors.success
      }; margin-bottom: 20px; text-align: center; border-bottom: 2px solid #34d399; padding-bottom: 10px;">
        Account Reactivated Successfully! ✅
      </h2>
      
      ${UTILS.getCard(
        `
        <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
          Dear <strong style="color: #2d3748;">${userName}</strong>,
        </p>
        
        <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
          We're pleased to inform you that your ${
            BRAND_CONFIG.name
          } account suspension has been lifted. 
          Your account is now <strong style="color: ${
            BRAND_CONFIG.colors.success
          };">fully reactivated</strong> and you can access all platform features.
        </p>
        
        <!-- Welcome Back Section -->
        <div style="text-align: center; margin: 30px 0;">
          <div style="background-color: #d1fae5; width: 80px; height: 80px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <span style="font-size: 36px; color: ${
              BRAND_CONFIG.colors.success
            };">✓</span>
          </div>
          <h3 style="color: #065f46; margin-bottom: 15px;">Welcome Back!</h3>
          <p style="color: #047857; max-width: 400px; margin: 0 auto;">
            We're glad to have you back in our community. Your access has been fully restored.
          </p>
        </div>
        
        <!-- Action Button -->
        ${UTILS.getButton("Login to Your Account", loginLink, {
          backgroundColor: BRAND_CONFIG.colors.success,
          showLinkCopy: true,
        })}
        
        <!-- Important Reminder -->
        ${UTILS.getCard(
          `
          <p style="color: #92400e; font-weight: bold; margin-top: 0;">Important Reminder:</p>
          <p style="color: #92400e; font-size: 14px; line-height: 1.5;">
            To avoid future account restrictions, please ensure you comply with our 
            <a href="${termsLink}" style="color: #d97706; font-weight: bold;">Terms of Service</a> 
            and <a href="${guidelinesLink}" style="color: #d97706; font-weight: bold;">Community Guidelines</a>.
          </p>
        `,
          {
            backgroundColor: "#fef3c7",
            borderColor: "#f59e0b",
            shadow: false,
          }
        )}
        
        <!-- Support Information -->
        ${UTILS.getCard(
          `
          <p style="color: #1e40af; font-weight: bold; margin-top: 0;">Need Assistance?</p>
          <p style="color: #1c51b9; font-size: 14px; line-height: 1.5;">
            If you experience any issues accessing your account or have questions about platform policies, 
            our support team is here to help:
            <br>
            <strong><a href="mailto:${BRAND_CONFIG.supportEmail}" style="color: ${BRAND_CONFIG.colors.info};">${BRAND_CONFIG.supportEmail}</a></strong>
          </p>
        `,
          {
            backgroundColor: "#eff6ff",
            shadow: false,
          }
        )}
        
        <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
          We look forward to seeing you back on ${BRAND_CONFIG.name}!
        </p>
      `,
        { borderColor: BRAND_CONFIG.colors.success }
      )}
      
      ${UTILS.getFooter("Support Team")}
    `;

    const mailOptions = {
      from: `${BRAND_CONFIG.name} Support <${process.env.USER_EMAIL}>`,
      to: email,
      subject: `Account Reactivated - Welcome Back to ${BRAND_CONFIG.name}!`,
      html: UTILS.getWrapper(content, {
        backgroundColor: "#f0fdf4",
        borderColor: BRAND_CONFIG.colors.success,
      }),
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Reactivation Email Error:", error);
        reject(error);
      } else {
        console.log("Reactivation Email sent to:", email);
        resolve(info);
      }
    });
  });
};

// Unblock Email
export const sendUnblockMail = (email, userName, adminName) => {
  return new Promise((resolve, reject) => {
    const loginLink = `${BRAND_CONFIG.frontendUrl}/login`;
    const termsLink = `${BRAND_CONFIG.frontendUrl}/terms`;

    const content = `
      ${UTILS.getLogo("large")}
      
      <h2 style="color: ${
        BRAND_CONFIG.colors.success
      }; margin-bottom: 20px; text-align: center; border-bottom: 2px solid #34d399; padding-bottom: 10px;">
        Account Fully Restored! ✅
      </h2>
      
      ${UTILS.getCard(
        `
        <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
          Dear <strong style="color: #2d3748;">${userName}</strong>,
        </p>
        
        <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
          Great news! After reviewing your case, our admin team has decided to 
          <strong style="color: ${
            BRAND_CONFIG.colors.success
          };">fully restore your account</strong>. 
          Your ${
            BRAND_CONFIG.name
          } account has been unblocked and is now accessible with all previous data intact.
        </p>
        
        <!-- Success Message -->
        <div style="text-align: center; margin: 30px 0;">
          <div style="background-color: #d1fae5; width: 80px; height: 80px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <span style="font-size: 36px; color: ${
              BRAND_CONFIG.colors.success
            };">🔓</span>
          </div>
          <h3 style="color: #065f46; margin-bottom: 15px;">Access Restored!</h3>
          <p style="color: #047857; max-width: 400px; margin: 0 auto;">
            Your account has been completely unblocked. You can now log in using your existing credentials.
          </p>
        </div>
        
        <!-- Account Details -->
        ${UTILS.getCard(
          `
          <h4 style="color: #1e293b; margin-top: 0; margin-bottom: 15px;">Account Restoration Details</h4>
          
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            ${UTILS.getTableRow("Action", "Account Unblock & Full Restoration")}
            ${UTILS.getTableRow("Restored By", `${adminName} (Admin Team)`)};
            ${UTILS.getTableRow(
              "Effective Date",
              UTILS.formatCurrentDateTime()
            )};
            ${UTILS.getTableRow(
              "Status",
              UTILS.getStatusBadge("Active & Fully Restored", "success")
            )}
            ${UTILS.getTableRow(
              "Data Status",
              "All your previous data, connections, and settings have been preserved"
            )}
          </table>
        `,
          {
            backgroundColor: "#f7fafc",
            borderColor: "#e2e8f0",
            shadow: false,
          }
        )}
        
        <!-- Login Button -->
        ${UTILS.getButton("Login to Your Account", loginLink, {
          backgroundColor: BRAND_CONFIG.colors.success,
          showLinkCopy: false,
        })}
        <p style="color: ${
          BRAND_CONFIG.colors.neutral
        }; font-size: 12px; text-align: center; margin-top: -15px;">
          Use your existing email and password: ${email}
        </p>
        
        <!-- Important Guidelines -->
        ${UTILS.getInfoBox(
          "Important Guidelines:",
          [
            "Your account is now in good standing",
            `Please review our <a href="${termsLink}" style="color: #d97706; font-weight: bold;">Terms of Service</a>`,
            "Future violations may result in permanent termination",
            "We encourage positive participation in our community",
          ],
          {
            backgroundColor: "#fef3c7",
            textColor: "#92400e",
            titleColor: "#92400e",
            borderColor: "#f59e0b",
          }
        )}
        
        <!-- Support Information -->
        ${UTILS.getCard(
          `
          <p style="color: #1e40af; font-weight: bold; margin-top: 0;">Need Help?</p>
          <p style="color: #1c51b9; font-size: 14px; line-height: 1.5;">
            If you experience any issues logging in or have questions:
            <br>
            <strong><a href="mailto:${BRAND_CONFIG.supportEmail}" style="color: ${BRAND_CONFIG.colors.info};">${BRAND_CONFIG.supportEmail}</a></strong>
          </p>
        `,
          {
            backgroundColor: "#eff6ff",
            shadow: false,
          }
        )}
        
        <p style="color: #4a5568; font-size: 16px; line-height: 1.6; text-align: center;">
          Welcome back to ${
            BRAND_CONFIG.name
          }! We're glad to have you return to our community.
        </p>
      `,
        { borderColor: BRAND_CONFIG.colors.success }
      )}
      
      ${UTILS.getFooter(
        "Support Team",
        "This decision reflects our commitment to fair review and community standards."
      )}
    `;

    const mailOptions = {
      from: `${BRAND_CONFIG.name} Support <${process.env.USER_EMAIL}>`,
      to: email,
      subject: `Account Unblocked - Full Access Restored | ${BRAND_CONFIG.name}`,
      html: UTILS.getWrapper(content, {
        backgroundColor: "#f0fdf4",
        borderColor: BRAND_CONFIG.colors.success,
      }),
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Unblock Email Error:", error);
        reject(error);
      } else {
        console.log("Unblock Email sent to:", email);
        resolve(info);
      }
    });
  });
};

// Unsuspend Email
export const sendUnsuspendMail = (email, userName, adminName) => {
  return new Promise((resolve, reject) => {
    const loginLink = `${BRAND_CONFIG.frontendUrl}/login`;
    const termsLink = `${BRAND_CONFIG.frontendUrl}/terms`;
    const guidelinesLink = `${BRAND_CONFIG.frontendUrl}/community-guidelines`;

    const content = `
      ${UTILS.getLogo("large")}
      
      <h2 style="color: ${
        BRAND_CONFIG.colors.success
      }; margin-bottom: 20px; text-align: center; border-bottom: 2px solid #34d399; padding-bottom: 10px;">
        Account Suspension Lifted! ✅
      </h2>
      
      ${UTILS.getCard(
        `
        <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
          Dear <strong style="color: #2d3748;">${userName}</strong>,
        </p>
        
        <p style="color: #4a5568; font-size: 16px; line-height: 1.6;">
          Good news! Your ${BRAND_CONFIG.name} account has been 
          <strong style="color: ${
            BRAND_CONFIG.colors.success
          };">unsuspended</strong> by our admin team. 
          Your account is now fully accessible and all restrictions have been removed.
        </p>
        
        <!-- Action Details -->
        ${UTILS.getCard(
          `
          <h3 style="color: #065f46; margin-top: 0; margin-bottom: 15px; font-size: 18px;">Account Status Update</h3>
          
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            ${UTILS.getTableRow(
              "New Status",
              UTILS.getStatusBadge("Active", "success"),
              { valueColor: "#065f46", labelColor: "#065f46" }
            )}
            ${UTILS.getTableRow("Action By", `${adminName} (Admin Team)`, {
              valueColor: "#065f46",
              labelColor: "#065f46",
            })}
            ${UTILS.getTableRow(
              "Effective Date",
              UTILS.formatCurrentDateTime(),
              { valueColor: "#065f46", labelColor: "#065f46" }
            )}
          </table>
        `,
          {
            backgroundColor: "#ecfdf5",
            borderColor: "#10b981",
            shadow: false,
          }
        )}
        
        <!-- Welcome Back Message -->
        <div style="text-align: center; margin: 30px 0;">
          <div style="background-color: #d1fae5; width: 80px; height: 80px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 20px;">
            <span style="font-size: 36px; color: ${
              BRAND_CONFIG.colors.success
            };">🎉</span>
          </div>
          <h3 style="color: #065f46; margin-bottom: 15px;">Welcome Back!</h3>
          <p style="color: #047857; max-width: 400px; margin: 0 auto;">
            Your account access has been fully restored. You can now log in and resume using all platform features.
          </p>
        </div>
        
        <!-- Login Button -->
        ${UTILS.getButton("Login to Your Account", loginLink, {
          backgroundColor: BRAND_CONFIG.colors.success,
          showLinkCopy: true,
        })}
        
        <!-- Important Note -->
        ${UTILS.getCard(
          `
          <p style="color: #92400e; font-weight: bold; margin-top: 0;">Important Note:</p>
          <p style="color: #92400e; font-size: 14px; line-height: 1.5;">
            Please ensure you review our 
            <a href="${termsLink}" style="color: #d97706; font-weight: bold;">Terms of Service</a> 
            and <a href="${guidelinesLink}" style="color: #d97706; font-weight: bold;">Community Guidelines</a> 
            to maintain your account in good standing.
          </p>
        `,
          {
            backgroundColor: "#fef3c7",
            borderColor: "#f59e0b",
            shadow: false,
          }
        )}
        
        <p style="color: #4a5568; font-size: 16px; line-height: 1.6; text-align: center;">
          We're glad to have you back in our community!
        </p>
      `,
        { borderColor: BRAND_CONFIG.colors.success }
      )}
      
      ${UTILS.getFooter(
        "Support Team",
        "This is an automated notification from our account management system."
      )}
    `;

    const mailOptions = {
      from: `${BRAND_CONFIG.name} Support <${process.env.USER_EMAIL}>`,
      to: email,
      subject: `Account Unsuspended - Access Restored | ${BRAND_CONFIG.name}`,
      html: UTILS.getWrapper(content, {
        backgroundColor: "#f0fdf4",
        borderColor: BRAND_CONFIG.colors.success,
      }),
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Unsuspend Email Error:", error);
        reject(error);
      } else {
        console.log("Unsuspend Email sent to:", email);
        resolve(info);
      }
    });
  });
};

// Export all functions and utilities
export default {
  sendSuspensionMail,
  sendBlockMail,
  sendReactivationMail,
  sendUnblockMail,
  sendUnsuspendMail,
  BRAND_CONFIG,
  UTILS,
  testConnection: () => {
    return new Promise((resolve, reject) => {
      transporter.verify((error, success) => {
        if (error) {
          console.error("Email connection test failed:", error);
          reject(error);
        } else {
          console.log("Account Management Email server is ready");
          resolve(success);
        }
      });
    });
  },
};
