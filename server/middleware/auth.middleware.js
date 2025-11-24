import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js";
import { catchAsyncError } from "./catchAsyncError.js";

export const isAuthenticated = catchAsyncError(async (req, res, next) => {

    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "User is not logged in. Please login to access this resource"
        });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY);
  

    req.user = await User.findById(decodedData.id);
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "User not found. Please login again."
        });
    }

    next();
});
