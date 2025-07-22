import { NextFunction, Request, Response } from "express"
import User from "../models/User.js"
import  { hash, compare } from 'bcrypt'
import { createToken } from "../utils/tokenmanager.js"
import { COOKIE_NAME} from "../utils/constants.js"
import { sendVerficationEmail } from "../utils/sendVerficationMail.js"

export const getAlUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
    ) => {
    try{
       const users = await User.find()
       

       return res.status(200).json({ message: "Ok" , users })
    }catch(err){
        console.log(err)
        return res.status(500).send({ message: "Error", cause:err.message })
    }
}

export const userSignup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).send("user already exists");
    }

    const hashedPassword = await hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, verified: false });
    await user.save();

    try {
      await sendVerficationEmail(user._id.toString(), email);
    } catch (emailErr) {
      console.error("Failed to send verification email:", emailErr);
      return res.status(500).send("couldn't send verification email");
    }


    return res.status(200).json({
      message: "Ok",
      name: user.name,
      email: user.email,
      isLoggedIn: false,
      verified: false
    });
  } catch (err) {
    console.error("Signup error:", err);
    return res.status(500).send({ message: 'could not signup' });
  }
};



export const userLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const { email, password } = req.body;
    console.log("Email:", email);
    const user = await User.findOne({ email });
    
    console.log("LOGIN HIT");
    console.log("Request body:", req.body);

    if (!user) {
      return res.status(401).json({ error: "User not registered" });
    }

    if (!email || !password) {
      return res.status(400).json({ error: "Email or password is undefined" });
    }

    const isPasswordCorrect = await compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(403).json({ error: "Incorrect password" });
    }

    if (!user.verified) {
      return res.status(401).json({ error: "Email not verified" });
    }

    

    

    // Clear any old cookie
    res.clearCookie(COOKIE_NAME, {
      path: "/",
      httpOnly: true,
      signed: true,
      secure: false, // change to true if using HTTPS
      domain: "localhost",
    });

    // Create and set new auth token cookie
    const token = createToken(user._id.toString(), user.email, 7000);
    const expires = new Date()
    expires.setDate(expires.getDate() + 7);

    res.cookie(COOKIE_NAME, token, {
      path: "/",
      httpOnly: true,
      signed: true,
      secure: false, // true if HTTPS
      domain: "localhost",
      expires,
    });

    return res.status(200).json({
      message: "Ok",
      name: user.name,
      email: user.email,
      isLoggedIn: true,
      verified: user.verified,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const userLogout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = res.locals.jwtData?.id;
      if (!userId) return res.status(401).json({ message: "Unauthorized" });
  
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      res.clearCookie(COOKIE_NAME, {
        path: '/',
        httpOnly: true,
        signed: true,
      });
  
      return res.status(200).json({
        message: "Logged out successfully",
        name: user.name,
        email: user.email,
      });
    } catch (err: any) {
      console.error(err);
      return res.status(500).json({ message: "Server error", cause: err.message });
    }
  };


export const verifyUser = async (
    req: Request,
    res: Response,
    next: NextFunction
    ) => {
    try{

      // user token check
       const user = await User.findById( res.locals?.jwtData.id );
       if(!user) {
        return res.status(401).send("user not registered OR token malfunctioned");
       }
       console.log(user._id.toString(), res.locals?.jwtData.id)
       if(user._id.toString() !== res.locals?.jwtData.id){
        return res.status(401).send("permissions did not match ");
       }

       return res.status(200)
       .json( { message: "Ok", name: user.name, email: user.email, verified: user.verified });
      }catch(err){
       console.log(err)
       return res.status(401).json({ message: "ERROR", cause: err.message });
     }
}
