import catchAsyncError from "../middlewares/catchAsyncError.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";

export const getAllUsers = catchAsyncError(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        users
    });
});

export const getMessages = catchAsyncError(async (req, res, next) => {
    const messages = await Message.find();
    res.status(200).json({
        success: true,
        messages
    });
});

export const sendMessage = catchAsyncError(async (req, res, next) => {
    const { content, userId } = req.body;
    const message = await Message.create({
        content,
        user: userId
    });
    res.status(201).json({
        success: true,
        message
    });
});
