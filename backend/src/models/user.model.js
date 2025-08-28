import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    userName : {
        type : String,
        required : [true, "Please add a username"],
        unique : true,
        trim : true
    },
    email : {
        type : String,
        required : [true, "Please add an email"],
        unique : true,
        match : [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please add a valid email",
        ],
    },
    password : {
        type : String,
        required : [true, "Please add a password"],
        minlength : [6, "Please add atleast 6 digit password"],
        select : false // hide password in queries
    },
    avatar : {
        type : String,
        default : "https://i.ibb.co/MBtjqXQ/default-profile.png",
    },
    role : {
        type : String,
        enum : ["user", "admin"],
        default : "user"
    },
    status : {
        type : String,
        enum : ["active", "inactive", "banned"],
        default : "active"
    },
    myList : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Movie"
        }
    ],
    subscription : {
        plan : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Subscription"
        },
        startDate : {
            type : Date
        },
        endDate : {
            type : Date
        },
        isActive : {
            type : Boolean,
            default : false
        }
    },
    profiles : [
        {
            name : {
                type : String,
                required : true
            },
            avatar : {
                type : String,
                default : "https://i.ibb.co/MBtjqXQ/default-profile.png"
            },
            maturityLevel : {
                type : String,
                enum : ["Adult", "Kids","Teen"],
                default : "Adult"
            },
            myList : [
                {
                    type : mongoose.Schema.Types.ObjectId,
                    ref : "Movie"
                }
            ]
        }
    ],
    resetPasswordToken: String,
    resetPasswordExpire: Date
},{timestamps : true});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ "subscription.plan": 1 });

// Encrypt password before saving
userSchema.pre("save", async function (next) {
    if(!this.isModified("password"))
        return next();
    this.password = await bcrypt.hash(this.password, 10);
});

// Method to match password during login
userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Method to generate JWT
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            id : this._id,
            email : this.email,
            role : this.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn : "1d"
        }
    );
};

// Method to generate Refress JWT
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            id : this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn : "7d"
        }
    );
};

export const User = mongoose.model("User", userSchema);