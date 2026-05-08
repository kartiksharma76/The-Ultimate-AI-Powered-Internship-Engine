import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOTP = async (email: string, otp: string) => {
  const mailOptions = {
    from: `"Career OS" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Your OTP for Career OS Registration",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; rounded: 10px;">
        <h2 style="color: #4f46e5; text-align: center;">Welcome to Career OS</h2>
        <p>Hello,</p>
        <p>Thank you for registering. Please use the following One-Time Password (OTP) to verify your account:</p>
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1f2937;">${otp}</span>
        </div>
        <p>This OTP is valid for 10 minutes. Do not share it with anyone.</p>
        <hr style="border: 0; border-top: 1px solid #e0e0e0; margin: 20px 0;" />
        <p style="font-size: 12px; color: #6b7280; text-align: center;">If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[MAILER] OTP sent to ${email}`);
    return true;
  } catch (error) {
    console.error("[MAILER] Error sending email:", error);
    throw error; // Throw to be caught by the route handler
  }
};
