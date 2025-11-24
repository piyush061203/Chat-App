import { catchAsyncError } from "../middleware/catchAsyncError.js";
import {User} from "../models/user.model.js";
import { generateToken } from "../utils/jwtToken.js";
import bcrypt from "bcryptjs";
import {v2 as cloudinary} from "cloudinary";


export const signup = catchAsyncError(async (req, res, next) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please enter all fields"
        });
    }

    const emailRegex= /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Please enter a valid email"
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 6 characters long"
        });
    }

    const findEmail= await User.findOne({ email });
    if (findEmail) {
        return res.status(400).json({
            success: false,
            message: "Email already exists"
        });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        fullName,   
        email,
        password: hashedPassword,
        avatar: {
            public_id: "",
            url: ""
        }

    });
    generateToken(user, "User created successfully", 201, res);
})

export const signin = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please enter all fields"
        });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({
            success: false,
            message: "Invalid email or password"
        });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({
            success: false,
            message: "Invalid email or password"
        });
    }

    generateToken(user, "User logged in successfully", 200, res);
})
export const signout = catchAsyncError(async (req, res, next) => {
    res.cookie("token", "", {
        expires: new Date(0), 
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV !== "development" ? true:false,
    });

    res.status(200).json({
        success: true,
        message: "User logged out successfully"
    });
});

export const getUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    return res.status(200).json({
        success: true,
        user
    });
})
export const updateuser = catchAsyncError(async (req, res, next) => {
    const { fullName, email } = req.body;

   if (!fullName || !email || fullName.trim() === "" || email.trim() === "") {
    return res.status(400).json({
        success: false,
        message: "Please enter all fields"
    });
}

    const avatar = req?.files?.avatar;
    let avatarData = {};
    if (avatar) {
        try{
            const oldAvatar = req.user?.avatar?.public_id;
            if (oldAvatar && oldAvatar.length  > 0) {
              await cloudinary.uploader.destroy(oldAvatar);
            }
            avatarData = await cloudinary.uploader.upload(avatar.tempFilePath, {
                folder: "Chat-App",
                transformation: [
                    {
                        width: 300,
                        height: 300,
                        crop: "limit",
                    },{ quality: "auto" },
                    {
                        fetch_format: "auto",
                        quality: "auto",
                    }
                ],
            });

        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message: "Error uploading avatar",
            });
        }
    }

    let data={
        fullName,
        email,
    }

    if(avatar && avatarData?.public_id && avatarData?.url) {
        data.avatar = {
            public_id: avatarData.public_id,
            url: avatarData.url
        }
    }

    let user = await User.findByIdAndUpdate(req.user._id, data, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        });
    }

    return res.status(200).json({
        success: true,
        message: "User updated successfully",
        user    
    });
})
