import mongoose from "mongoose";

const MessageSchema=new mongoose.Schema({
    sender:{type:mongoose.Schema.ObjectId,ref:'User'},
    recipient:{type:mongoose.Schema.ObjectId,ref:'User'},
    text:String

},{timestamps:true})

const MessageModel=mongoose.model("Message",MessageSchema);

export default MessageModel;