import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const protectedUser = asyncHandler(async(req, res, next) => {
    try {
        const token = req?.cookies?.userToken || req?.header("Authorization")?.replace("Bearer ","");
        if(!token){
            throw new ApiError(401, "Unauthorized Request");
        }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const user = await User.findById(decoded?.id).select("-password");
        if(!user){
            throw new ApiError(401, "Invalid access token");
        }
        req.user = user;
        next();
    } catch (error) {
        throw new ApiError(401, "Invalid access token");
    }
});