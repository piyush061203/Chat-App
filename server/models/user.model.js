import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },  
    password: {
        type: String,
        required: true,
    },
    avatar: {
        public_id: {
            type: String,
            
        },
        url: {
            type: String,
            
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
}, {
    timestamps: true,
}); 

const User = mongoose.model("User", userSchema);

export default User;
