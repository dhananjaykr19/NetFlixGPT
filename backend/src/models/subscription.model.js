import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
        unique : true
    },
    price : {
        type : Number,
        required : true
    },
    quality : {
        type : String,
        enum : ["SD", "HD", "Ultra HD"],
        default : "HD"
    },
    screens : {
        type : Number,
        default : 1
    },
    downloadsAllowed : {
        type : Boolean,
        default : true
    },
    description: {
        type: String,
    }
},{timestamps : true});

export const Subscription = mongoose.model("Subscription", subscriptionSchema);