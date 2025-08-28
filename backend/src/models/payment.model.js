import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        user : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        },
        subscription : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Subscription",
            required : true
        },
        amount : {
            type : Number,
            required : true
        },
        currency: {
            type: String,
            default: "INR", // or USD depending on region
        },
        paymentMethod : {
            type : String,
            enum: ["card", "upi", "netbanking", "paypal"],
            required: true,
        },
        status : {
            type : String,
            enum: ["pending", "success", "failed", "refunded"],
            default: "pending",
        },
        transactionId : {
            type : String,
            unique : true,
            required : true
        },
        purchasedAt : {
            type : Date,
            default : Date.now
        },
        expiryDate: {
        type: Date, // auto-calc based on plan duration
        },
    },
    {timestamps : true}
);

export const Payment = mongoose.model("Payment", paymentSchema);