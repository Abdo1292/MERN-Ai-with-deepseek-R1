import { Router } from "express";
import { verifyToken } from "../utils/tokenmanager.js";
import { chatCompletionValidator, validate } from "../utils/validator.js";
import { deleteUserchats, generateChatCompletion, sendChatsToUser } from "../controllers/chat-controllers.js";

//protected API
const chatRoutes = Router();
chatRoutes.post(
    "/new",
     validate(chatCompletionValidator), 
     verifyToken,
    generateChatCompletion 
   );

   chatRoutes.get("/all-chats", verifyToken, sendChatsToUser);
   chatRoutes.delete("/delete-all-chats", verifyToken, deleteUserchats);
   

export default chatRoutes;