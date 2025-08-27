import jwt from "jsonwebtoken";
import { Admin } from "../models/admin.model.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const protectAdmin = asyncHandler( async(req, _, next) => {
    try {
        const token = req?.cookies?.accessToken || req?.header("Authorization")?.replace("Bearer ","");
        if(!token){
            throw new ApiError(401, "Unauthorized request")
        }
        const decodedToken = jwt.verify(token, process.env.ADMIN_ACCESS_TOKEN_SECRET);
        const admin = await Admin.findById(decodedToken?.id).select("-password");
        if(!admin){
            throw new ApiError(401, "Invalid access token");
        }
        req.admin = admin;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }   
});

export const requireRole = (...roles) => (req, res, next) => {
    if(!req.admin || !roles.includes(req.admin.role)){
        throw new ApiError(403, "Forbidden: insufficient role");
    }
    next();
};
