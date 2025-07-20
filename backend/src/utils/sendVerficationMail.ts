import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import User from "../models/User.js"; 





export const sendVerficationEmail = async (userId: string, email: string) => {
  try {
    console.log("📨 Preparing to send verification email to:", email);
     

    
    const token = jwt.sign({ userId }, process.env.EMAIL_SECRET!, {
      expiresIn: "1h",
    });
    // 2. Save token to user
    await User.findByIdAndUpdate(userId, {
      verificationToken: token,
      verificationExpires: Date.now() + 60 * 60 * 1000, // 1 hour
    });

    const link = `${process.env.BASE_URL}/verify-email?token=${token}`;
    console.log("🔗 Verification link:", link);

    // 3. Configure transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // 4. Verify SMTP connection
    await transporter.verify();
    console.log("✅ SMTP connection verified");

    // 5. Send the email
    const info = await transporter.sendMail({
      from: `"MERN-SEEK Support" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Verify your email",
      html: `<p>Please verify your email by clicking the link below:</p>
             <a href="${link}">${link}</a>
             <p>This link expires in 1 hour.</p>`,
    });

    console.log("✅ Verification email sent. Message ID:", info.messageId);
  } catch (err) {
    console.error("❌ Error sending verification email:", err);
    throw err;
  }
};

