import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const adminAuth = asyncHandler(async(req, res, next) =>{
    try{

        const {token} = req.headers;
        if(!token){
            throw new ApiError(402, "Unauthorized login attempt");
        }

        //decoding the token
        const decoded_token = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        //now checking if the token matces its constituents or not
        if(decoded_token !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD){
            throw new ApiError(402, "Unauthorized login attempt");
        }

        //calling the callback function if credentilas match then
        next();
    } catch(err){
        throw new ApiError(401, err?.message)
    }
});