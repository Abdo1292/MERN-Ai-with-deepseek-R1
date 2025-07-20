import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    role:{
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    image: { 
        type: String 
    },
})
const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required: true,
    },

    email:{
        type:String,
        required: true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    verified:{
        type: Boolean,
        default: false,
    },
    isLoggedIn: {
        type:Boolean,
    },
    verificationToken:   {
         type: String 
    },
    verificationExpires: {
         type: Date 
    },
    chats:[chatSchema],
});

export default mongoose.model("User", UserSchema);