import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { meshClient } from "../utils/GrpcClient.js"
import { ethers } from "ethers";
import crypto from "node:crypto";
import jwt from "jsonwebtoken"
import { WifiNode } from "../models/wifi_node.models.js";

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
    .clearCookie("connect.sid")
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

    const url = `${ledgerURL}/getHistory?${params}`

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

    const userWalletAddress = req.user;

    if(!userWalletAddress){

        throw new ApiError(400, "Unauthorised Request")

    }

    const user = req.body;

    if (!user || typeof user !== "object") {
        throw new ApiError(400, "Request body must be an object");
    }

    if (typeof user.lat !== "number" || user.lat < -90 || user.lat > 90) {
        throw new ApiError(400, "lat must be a number between -90 and 90");
    }

    if (typeof user.lon !== "number" || user.lon < -180 || user.lon > 180) {
        throw new ApiError(400, "lon must be a number between -180 and 180");
    }

    if (typeof user.required_bandwidth !== "number" || user.required_bandwidth <= 0 || user.required_bandwidth > 300) {

        throw new ApiError(400, "required_bandwidth must be a positive number");
    }

    if (!Number.isInteger(user.max_latency) || user.max_latency < 0 || user.max_latency > 50) {

        throw new ApiError(400, "max_latency must be a positive integer");
    }

    const requiredBandwidth = BigInt(user.required_bandwidth);

    const requestObject = {
        lat: user.lat,
        lon: user.lon,
        required_bandwidth: requiredBandwidth,
        max_latency: user.max_latency
    }

    const connectionResponse = await meshClient.getShortestPath(requestObject);

    if(connectionResponse.status !== 0 || connectionResponse.path_list.length === 0){

        throw new ApiError(500, "Internal Server Error: Connection not found")
    }

    //we are saving this response in session cookie and not in access cookie because access cookie is sent during login process and it can expire mid connection but session cookie will be sent with this response (because session cookie dont exists yet) with a lifetime of one day and every connection is strictly implemented to get timed out after 1 hour at the frontend, so a session cookie will not expire mid connection rather we will clear it by ourselves.

    const sessionStartTime = Date.now()

    req.session.connectionResponse = {
        sessionStartTime,
        userLat: user.lat,
        userLon: user.lon,
        userWalletAddress,
        bandwidthOccupied: requiredBandwidth,
        pathOccupied: connectionResponse.path_list
    }

    await req.session.save();

    return res.status(200).json( new ApiResponse(200, "Coonection established successfully", {connectionResponse}) );

})

const terminateConnection = asyncHandler( async (req, res) => {

    const userWalletAddress = req.user;
    if(!userWalletAddress){

        throw new ApiError(400, "Unauthorised Request")

    }

    //you can have keys of js object in double quotes, single quotes or without quotes, but JSON keys should always be in double quotes
    //you can access the value of a key of js object via dot notation or like obj["key"]
    //if you got a key name with a dot in between like connect.sid, you should always access it with bigbrackets becuase the dot will be misinterpreted for the dot notation
    //if you are doing optional chaining, the dot should be there after question mark even if you are accessing the key with bigbrackets
    const hasSessionCookie = Boolean(req.cookies?.["connect.sid"]);

    if(!hasSessionCookie){
        
        throw new ApiError(400, "No existing connection found for this User")

    }

    const {

        sessionStartTime,
        userLat,
        userLon,
        userWalletAddressFromSessionCookie,
        bandwidthOccupied,
        pathOccupied

    } = req.session.connectionResponse;

    if(userWalletAddress.toLowerCase() !== userWalletAddressFromSessionCookie.toLowerCase()){

        throw new ApiError(400, "User Wallet Address is invalid")

    }

    const requestObject = {
        bandwidth_occupied: BigInt(bandwidthOccupied),
        path_occupied: pathOccupied
    }

    const removeUserResponse = await meshClient(requestObject);

    if(removeUserResponse.status !== 0){

        throw new ApiError(500, `Internal Server Error: ${removeUserResponse.status_message}`)

    }

    const sessionEndTime = Date.now()
    //crypto.randomInt(a,b) generates random integers from a up to, but not including, b
    const totalBandwidthUsed = crypto.randomInt(1, 2001) / 100;

    const nodeId = pathOccupied[0];
    const nodeData = await WifiNode.findOne({
        id: nodeId
    })

    if(!nodeData){

        throw new ApiError(500, "Internal Server Error: DB query failed!")

    }

    const sessionPayload = {
        sessionStartTime,
        sessionEndTime,
        totalBandwidthUsed,
        userLat,
        userLon,
        nodeLat: nodeData.lat,
        nodeLon: nodeData.lon,
        userWalletAddress,
        nodeWalletAddress: nodeData.walletAddress
    }

    const ledgerURL = LEDGER_SERVICE_URL || "http://localhost:5000";
    const url = `${ledgerURL}/settleSession`

    const settleSessionResponse = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionPayload)
    })

    if(!settleSessionResponse.ok){

        throw new ApiError(500, "Internal Server Error: Fetch call to Ledger Service failed!")
    }

    const { sessionEntry } = settleSessionResponse.json()

    return res.status(200).json( new ApiResponse(200, "Connection terminated successfully", sessionEntry) ) 
})

export {
    getNonce,
    authenticateUser,
    getSessionHistory,
    logoutUser,
    getConnection,
    terminateConnection
}
