import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ethers } from "ethers";
import crypto from "node:crypto"

const getNonce = asyncHandler ( async ( req, res ) => {

    //create 32 random bytes (256 bits) and then convert them into a hexadecimal string (containing 64 hexadecimal characters)
    const nonce = crypto.randomBytes(32).toString("hex");

    const walletAddress = req.query.walletAddress;

    if(!walletAddress){
        throw new ApiError(400, "Bad Request: wallet address is mandatory")
    }

    //toISOString changes date object to string maintaining ISO format of date object
    const message = `Sign in to NexusMesh
    Wallet: ${walletAddress}
    Nonce: ${nonce}
    Expires: ${new Date(Date.now() + 5 * 60 * 1000).toISOString()}`;

    req.session.authChallenge = {
        walletAddress,
        message,
        expiresAt: Date.now() + 5 * 60 * 1000

    }

    req.session.save((error) => {
        if (error) {
            throw new ApiError(500, "Server Error: could not save session")
        }
    });

    return res.status(200).json( new ApiResponse(200, "nonce generated and sent successfully", {
        message
    }));
   
});

const authenticateUser = asyncHandler ( async (req, res) => {

    const challenge = req.session.authChallenge;

    if(!challenge){
        throw new ApiError(400, "Authentication challenge not found, try to initaite the login process again")
    }

    if(message != challenge.message){
        throw new ApiError(400, "Invalid Request: message not matched")
    }

    if(Date.now() > challenge.expiresAt){
        throw new ApiError(400, "Authentication challenge expired: try to initiate the login process again")
    }

    const {signature} = req.body;

    if(!signature){
        throw new ApiError(400, "Bad Request: signature not found")
    }

    const recoveredAddress = await ethers.verifyMessage(challenge.message, signature);

    if(recoveredAddress.toLowerCase() !== challenge.walletAddress.toLowerCase()){
        throw new ApiError(400, "Unauthorized Request: wallet address is invalid")
    }

    req.session.user = {
        walletAddress: recoveredAddress.toLowerCase()
    };

    delete req.session.authChallenge;

    return res.status(200).json( new ApiResponse( 200, "user logged in successfully", {
        message: "User authenticated",
        walletAddress: recoveredAddress
    }));
    
});

export {
    getNonce,
    authenticateUser
}