import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js"

export const verifyJWT = asyncHandler ( async (req, _, next) => {
    const token = req.cookie?.AccessToken
    
    if(!token){
        throw new ApiError(400, "Authentication Failed!: Access Token not found")
    }

    const loggedUser = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if(!loggedUser){

        throw new ApiError(400, "Invalid Access Token")

    }

    req.user = loggedUser;
    next();

})