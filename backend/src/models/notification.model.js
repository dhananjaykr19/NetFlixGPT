import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        user : {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User",
            required : true
        },
        type : {
            type : String,
            enum: ["subscription", "payment", "reminder", "new_release", "general"],
            default : "general"
        },
        title : {
            type : String,
            required : true
        },
        message : {
            type : String,
            required : true
        },
        isRead : {
            type : Boolean,
            default : false
        },
        sentAt : {
            type : Date,
            default : Date.now
        }
    },
    {timestamps : true}
);

export const Notification = mongoose.model("Notification", notificationSchema);