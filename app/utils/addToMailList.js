// sendMail.js
import nodemailer from "nodemailer";

export default function sendMailToUser(email, message, sub){
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASSWORD,
      },
    });

    const mailOptions = {
      from: "TrustBridge AI <" + process.env.USER_EMAIL + ">",
      to: email,
      subject: sub,
      html: message,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        console.log("Email sent: " + info.response);
        resolve(info);
      }
    });
  });
};
