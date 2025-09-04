import { ApiError } from "../utils/ApiError.js";

export const isAdmin = (role) => {
    return (req, res, next) => {
        if(req.user && req.user.role === role){
            next();
        }else{
            throw new ApiError(403, `Access denied. Only ${role}s allowed.`);
        }
    };
};