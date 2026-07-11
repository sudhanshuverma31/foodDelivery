import nodemailer from "nodemailer";

// Create a transporter using SMTP - credentials are loaded from .env
const getTransporter = () => {
  const email = process.env.SMTP_EMAIL;
  const password = process.env.SMTP_PASS;

  if (!email || !password) {
    console.error("❌ Missing SMTP credentials in .env file (SMTP_EMAIL or SMTP_PASS)");
  }

  return nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
      user: email,
      pass: password,
    },
  });
};

export const sendOTPEmail = async (to: string, otp: number) => {
  try {
    const transporter = getTransporter();
    
    const info = await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: to,
      subject: "Reset your password",
      html: `<p>Your OTP for password reset is <b>${otp}</b></p>`,
    });

    console.log("✅ OTP email sent successfully");
    console.log("Message ID:", info.messageId);
  } catch (error) {
    console.error("❌ Error sending OTP email:", error);
    throw error;
  }
};