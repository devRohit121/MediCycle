const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    seller: {
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    batch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Inventory",
        required: true
    },
    quantityOrdered: {
        type: Number,
        required: true,
        min: 1
    },
    priceAtOrder: {
        type: Number,
        required: true,
        min: 1
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 1
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected", "completed"],
        default: "pending"
    }
}, {timestamps: true}
)

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;