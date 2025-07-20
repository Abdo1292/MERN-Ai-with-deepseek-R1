import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken'
import { COOKIE_NAME } from './constants.js';
import User from '../models/User.js';

export const createToken = (id: string, email: string, expiresInDays: number) => {
  const payload = { id, email };
  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: `${expiresInDays}d`, 
  });
  return token;
};
export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
 ) => {
  const token = req.signedCookies[COOKIE_NAME];

  if (!token || token.trim() === '') {
    return res.status(401).json({ message: "Token not received" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
    };

    res.locals.jwtData = decoded; // attach to res.locals
    next(); 
  } catch (err) {
    return res.status(401).json({ message: "Token expired or invalid" });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { token } = req.query;

  if (!token || typeof token !== "string") {
    return res.status(400).send("Missing token");
  }

  try {
    const { userId } = jwt.verify(token, process.env.EMAIL_SECRET!) as {
      userId: string;
    };

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).send("User not found.");
    }

    // Already verified
    if (user.verified) {
      return res.status(200).send("Email already verified.");
    }

    // Check token and expiration manually
    if (
      user.verificationToken !== token ||
      !user.verificationExpires ||
      user.verificationExpires.getTime() < Date.now()
    ) {
      return res.status(400).send("Invalid or expired token.");
    }

    // Mark as verified
    user.verified = true;
    user.verificationToken = undefined;
    user.verificationExpires = undefined;

    await user.save();

    return res.status(200).json({
      message:"Email verified. You can now log in.",
      name: user.name,
      email:user.email,
      verified: user.verified,
      isLoggedIn: user.isLoggedIn
      });
  } catch (err) {
    console.error("❌ Verification error:", err);
    return res.status(400).send("Token verification failed.");
  }
};
