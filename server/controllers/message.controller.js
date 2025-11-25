import {catchAsyncError} from "../middleware/catchAsyncError.js";
import {User} from "../models/user.model.js";
import {Message} from "../models/message.model.js";
import {v2 as cloudinary} from "cloudinary";
import { getReceiverSocketId, io } from "../utils/socket.js";

export const getAllUsers = catchAsyncError(async (req, res, next) => {
    const userId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: userId } }).select("-password -email -createdAt -updatedAt -__v");
    res.status(200).json({
        success: true,
        users: filteredUsers
    });
});

export const getMessages = catchAsyncError(async (req, res, next) => {
   const receiverid = req.params.id;
   const senderid = req.user._id;
   const receiver=await User.findById(receiverid);
    if(!receiver){
        return res.status(404).json({
            success: false,
            message: "Receiver not found"
        });
    }
    const messages = await Message.find({
        $or: [
            { senderID: senderid, receiverID: receiverid },
            { senderID: receiverid, receiverID: senderid }
        ]
    }).sort({ createdAt: 1 });  
    res.status(200).json({
        success: true,
        messages
    });
});

export const sendMessage = catchAsyncError(async (req, res, next) => {
    const { text } = req.body;
    const media = req?.files?.media ;
    const { id: receiverid } = req.params;
    const senderid = req.user._id;
    const receiver=await User.findById(receiverid);
    if(!receiver){
        return res.status(404).json({
            success: false,
            message: "Receiver not found"
        });
    }
    const sanitizeText=text?.trim()|| "";
    if(!media && sanitizeText===""){
        return res.status(400).json({
            success: false,
            message: "Message content is empty"
        });
    }

    let mediaUrl="";
    if(media){
       try{
         const uploadResponse=await cloudinary.uploader.upload(media.tempFilePath,{
            folder:"chatApp/media",
            resource_type:"auto",
            transformation:[{width:1080, height:1080, crop:"limit"},{quality:"auto"},{fetch_format:"auto"}]
        });
        mediaUrl=uploadResponse?.secure_url;
       }catch(error){
        return res.status(500).json({
            success:false,
            message:"Failed to upload media"
        });
       }
    }
     
 


    const message = await Message.create({
        text: sanitizeText,
        media: mediaUrl,
        senderID: senderid,
        receiverID: receiverid,
    });

    const receiverSocketId = getReceiverSocketId(receiverid);
    if (receiverSocketId && io) {
        io.to(receiverSocketId).emit("newMessage", message);
    }

    res.status(201).json({
        success: true,
        message
    });
});