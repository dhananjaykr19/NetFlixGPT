import jwt from "jsonwebtoken";

export const generateAdminToken = (adminId) =>{
    return jwt.sign(
        {
            _id : adminId
        },
        process.env.ADMIN_ACCESS_TOKEN_SECRET,
        {
            expiresIn : "7d"
        }
    );
};
