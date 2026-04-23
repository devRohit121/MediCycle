const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [
        {
            batch: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Inventory",
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            }
        }
    ]
});

module.exports = mongoose.model("Cart", cartSchema);