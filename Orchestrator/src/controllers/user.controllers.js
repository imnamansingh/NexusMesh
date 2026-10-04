import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { meshClient } from "../utils/GrpcClient.js"
import { ethers } from "ethers";
import crypto from "node:crypto";
import jwt from "jsonwebtoken"

const getNonce = asyncHandler( async (req, res) => {

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

    await req.session.save();

    return res.status(200).json( new ApiResponse(200, "nonce generated and sent successfully", {
        message
    }));
   
});

const authenticateUser = asyncHandler( async (req, res) => {

    const challenge = req.session.authChallenge;

    const { message, signature } = req.body;

    if(!challenge){
        throw new ApiError(400, "Authentication challenge not found")
    }

    if(message != challenge.message){
        throw new ApiError(400, "Invalid Request: message not matched")
    }

    if(Date.now() > challenge.expiresAt){
        throw new ApiError(400, "Authentication challenge expired: try to initiate the login process again")
    }

    if(!signature){
        throw new ApiError(400, "Bad Request: signature not found")
    }

    const recoveredAddress = await ethers.verifyMessage(challenge.message, signature);

    if(recoveredAddress.toLowerCase() !== challenge.walletAddress.toLowerCase()){
        throw new ApiError(400, "Unauthorized Request: wallet address is invalid")
    }

    delete req.session.authChallenge;

    const accessToken = jwt.sign(
        {
            walletAddress: recoveredAddress
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    );

    const options = {
        httpOnly: true,
        secure: false,
        maxAge: parseInt(process.env.ACCESS_TOKEN_COOKIE_MAXAGE)
    }

    return res
    .status(200)
    .cookie("AccessToken", accessToken, options)
    .json( new ApiResponse( 200, "user logged in successfully", {
        message: "User authenticated",
        walletAddress: recoveredAddress
    }));
    
});

const getSessionHistory = asyncHandler( async (req, res) => {

    const userWalletAddress = req.user;

    //URLSearchParams is a builtin JavaScript class for creating and reading URL query strings
    const params = new URLSearchParams({
        userWalletAddress
    });

    const ledgerURL = process.env.LEDGER_SERVICE_URL || "http://localhost:5000"

    const url = `${ledgerURL}?${params}`

    const historyResponse = await fetch(url,{
        method: 'GET',
        headers: { Accept: 'application/json' }
    })

    if(!historyResponse.ok){

        throw new ApiError(500, "Internal Server Error: Unable to fetch the data from the DB")
    }

    const history = historyResponse.json()

    return res.status(200).json( new ApiResponse(200, "History fetched successfully", {history}))

})

const logoutUser = asyncHandler( async (req, res) => {

    const options = {
        httpOnly: true,
        secure: false,
        maxAge: parseInt(process.env.ACCESS_TOKEN_COOKIE_MAXAGE)
    }

    return res
    .status(200)
    .clearCookie("AccessToken", options)
    .json( new ApiResponse(200, "user logged out successfully", {
        walletAddress: req.user?.walletAddress || undefined
    }))
})

const getConnection = asyncHandler( async (req, res) => {
    const user = req.body;


})

const terminateConnection = asyncHandler( async (req, res) => {

    //we somehow need to track the bandwidth requested and the path occupied by the user, maybe through session cookie or whatever becuase this is the request object for remove user method
    //message RemoveUser {
        //int64 bandwidth_occupied = 1;
        //repeated int64 path_occupied = 2;
    //}
    //handle session persistence here by creating fake data
})

export {
    getNonce,
    authenticateUser,
    getSessionHistory,
    logoutUser,
    getConnection,
    terminateConnection
}