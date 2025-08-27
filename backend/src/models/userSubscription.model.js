import mongoose from "mongoose";

const userSubscriptionSchema = new mongoose.Schema(
    {
        user : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        },
        subscription : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Subscription",
            required : true,
            unique : true
        },
        startDate : {
            type : Date,
            default : Date.now
        },
        expiryDate : {
            type : Date,
            required : true
        },
        status : {
            type : String,
            enum: ["active", "expired", "cancelled"],
            default : "active"
        },
        autoRenew : {
            type : Boolean,
            default : true
        },
        lastPayment : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Payment",
            required : true
        }
    },
    {timestamps : true}
);

export const UserSubscription = new mongoose.model("UserSubscription", userSubscriptionSchema);