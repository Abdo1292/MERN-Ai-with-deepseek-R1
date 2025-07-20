import { Request, Response, NextFunction } from "express";
import User from "../models/User.js";


export async function mustBeVerified  (req:Request,res:Response,next:NextFunction)  
{
   const userId = res.locals?.id
   const user = await User.findById(userId)

   
  if (!user?.verified) {
    return res.status(403).send("Please verify your email first.");
  }

  next();

}