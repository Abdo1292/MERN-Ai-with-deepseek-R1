import { NextFunction, Request, Response } from "express";
import User from '../models/User.js';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
  image?: string;
}

export const generateChatCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { message, image } = req.body;  // Expect image here from frontend

  try {
    const user = await User.findById(res.locals?.jwtData?.id);
    if (!user) {
      return res.status(401).json({ message: "User not registered OR token malfunctioned" });
    }

    // Prepare chat history, preserving images only on user messages
    const chats: ChatMessage[] = user.chats.map(chat => ({
      role: chat.role as 'user' | 'assistant' | 'system',
      content: chat.content,
      ...(chat.role === 'user' && chat.image ? { image: chat.image } : {})
    }));

    // Add new user message with image if provided
    const newUserMessage: ChatMessage = {
      role: 'user',
      content: message,
      ...(image ? { image } : {})
    };

    chats.push(newUserMessage);
    user.chats.push(newUserMessage);

    // Call AI API, sending messages with images appended as text (if any)
    const response = await fetch(process.env.DEEPSEEK_URL || "https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.DEEPSEEK_URL,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-0528:free",
        messages: chats.map(msg => ({
          role: msg.role,
          content: msg.content + (msg.image ? `\n[User attached image: ${msg.image}]` : "")
        }))
      })
    });

    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.error?.message || 'API request failed');
    }

    // Assistant's response has no image
    const assistantMessage: ChatMessage = {
      role: 'assistant',
      content: responseData.choices[0].message.content
    };

    user.chats.push(assistantMessage);
    await user.save();

    return res.status(200).json({ chats: user.chats });
  } catch (err) {
    console.error('Error in generateChatCompletion:', err);
    return res.status(500).json({
      message: 'Something went wrong',
      error: err instanceof Error ? err.message : 'Unknown error'
    });
  }
};
export const sendChatsToUser = async (
  req: Request,
  res: Response,
  next: NextFunction
  ) => {
  try{

    // user token check
     const user = await User.findById( res.locals.jwtData.id );
     if(!user) {
      return res.status(401).send("user not registered OR token malfunctioned");
     }
     console.log(user._id.toString(), res.locals.jwtData.id)
     if(user._id.toString() !== res.locals.jwtData.id){
      return res.status(401).send("permissions did not match ");
     }

     return res.status(200)
     .json( { message: "Ok", chats:user.chats });
    }catch(err){
     console.log(err)
     return res.status(400).json({ message: "ERROR", cause: err.message });
   }
}

export const deleteUserchats = async (
  req: Request,
  res: Response,
  next: NextFunction
  ) => {
  try{

    // user token check
     const user = await User.findById( res.locals.jwtData.id );
     if(!user) {
      return res.status(401).send("user not registered OR token malfunctioned");
     }
     console.log(user._id.toString(), res.locals.jwtData.id)
     if(user._id.toString() !== res.locals.jwtData.id){
      return res.status(401).send("permissions did not match ");
     }

  
       
    const deletedChats =  await user.updateOne(
      { $set: { chats: [] } }
    );


     return res.status(200)
     .json( { message: "Ok", chats: deletedChats });

    }catch(err){
     console.log(err)
     return res.status(400).json({ message: "ERROR", cause: err.message });
   }
}

