import mongoose from "mongoose";

const wifiNodeSchema = new mongoose.Schema({
    id: {
        type: Number,
        unique: true,
        required: true
    },
    walletAddress: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    ipAddress: {
        type: String,
        required: true,
        unique: true
    },
    lat: {
        type: Number,
        required: true
    },
    lon: {
        type: Number,
        required: true
    },
    totalBandwidth: {
        type: Number,
        required: true
    },
    availableBandwidth: {
        type: Number
    },
    isGateway: {
        type: Boolean,
        required: true
    },
    maxLatency: {
        type: Number,
        required: true
    },
    registeredAt: {
        type: Number
    }

},{timestamps: true});

export const WifiNode = mongoose.model("WifiNode", wifiNodeSchema);