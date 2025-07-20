import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../models/User.js";

export async function verifyEmail(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { token } = req.query;

  try {
    if (!token) return res.status(400).json({ error: "Missing token" });

 
    const { userId } = jwt.verify(token as string, process.env.EMAIL_SECRET!) as {
      userId: string;
    };

   
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.verified) {
      return res.status(200).json({ message: "Already verified", verified: true });
    }

    
    user.verified = true;
    await user.save();

    return res.status(200).json({
      message: "Email verified successfully!",
      email: user.email,
      name: user.name,
      verified: true,
    });
  } catch (err) {
    console.error("Verification error:", err);
    return res.status(400).json({ error: "Invalid or expired token" });
  }
}