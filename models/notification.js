const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String,
        required: true
    },
    link: {
        type: String
    },
    isRead: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);