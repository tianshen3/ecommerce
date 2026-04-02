import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const authUser = asyncHandler(async(req, res, next)=>{

    const {token} = req.headers;
    if(!token){
        throw new ApiError(402, "Unauthorized Login Attempt");
    }

    try {
        
        const token_decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.body._id = token_decoded._id;
        next();

    } catch (error) {
        throw new ApiError(401, error?.message);
    }
});

export default authUser;