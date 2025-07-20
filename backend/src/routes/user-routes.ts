import { Router } from "express";
import { getAlUsers, userLogin, userLogout, userSignup, verifyUser } from "../controllers/user-controller.js";
import { loginValidator, signUpValidator, validate } from "../utils/validator.js";
import { verifyToken } from "../utils/tokenmanager.js";
import { verifyEmail } from "../utils/tokenmanager.js";
const userRoutes = Router();

userRoutes.get("/", getAlUsers)

userRoutes.post("/signup",validate(signUpValidator), userSignup)
userRoutes.post("/login",  validate(loginValidator), userLogin);
userRoutes.post("/logout", verifyToken, userLogout)
userRoutes.get("/auth-status", verifyToken, verifyUser);
userRoutes.get("/verify-email", verifyEmail);
export default userRoutes;