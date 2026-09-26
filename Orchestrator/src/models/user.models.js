import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    walletAddress: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    refreshToken: {
        type: String

    }
},{timestamps: true});

export const User = mongoose.model("User", userSchema);