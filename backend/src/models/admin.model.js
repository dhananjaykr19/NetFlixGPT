import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const adminSchema = new mongoose.Schema(
    {
        name : {
            type : String,
            required : true,
            trim : true
        },
        email : {
            type : String,
            required : true,
            unique : true,
            lowercase : true
        },
        password : {
            type : String,
            required : true
        },
        role : {
            type : String,
            enum: ["super_admin", "content_manager", "support"],
            default : "content_manager"
        },
        permissions : {
            manageUsers : {
                type : Boolean,
                default : false
            },
            manageMovies : {
                type : Boolean,
                default : false
            },
            manageSubscriptions : {
                type : Boolean,
                default : false
            },
            managePayments : {
                type : Boolean,
                default : false
            },
            manageNotifications : {
                type : Boolean,
                default : false
            }
        },
        lastlogin : {
            type : Date
        },
        isActive : {
            type : Boolean,
            default : true
        }
    },
    {timestamps : true}
);

// Hash password on create/update
adminSchema.pre("save", async function (next) {
    if(!this.isModified("password"))
        return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

adminSchema.methods.comparePassword = function(password){
    return bcrypt.compare(password, this.password);
};

adminSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            id : this._id,
            role : this.role
        },
        process.env.ADMIN_ACCESS_TOKEN_SECRET,
        {
            expiresIn : "1d"
        }
    );
};


export const Admin = mongoose.model("Admin", adminSchema);