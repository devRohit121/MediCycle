const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const inventorySchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Ointment']
    },
    manufacturer: {
        type: String,
        required: true,
        trim: true
    },
    batchNo: {
        type: String,
        required: true,
        unique: true
    },
    manufacturingDate: {
        type: Date,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    unitPrice: {
        type: Number,
        required: true,
        min: 1
    },
    discountedPrice: {
        type: Number,
        required: true,
        min: 1
    },
    location: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Available', 'Out of Stock', 'Expired'],
        default: "Available"
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
})

const Inventory = mongoose.model("Inventory", inventorySchema);

module.exports = Inventory;