const Inventory = require("../models/inventory");
const Cart = require("../models/cartSchema");
const Order = require("../models/order");
const { checkBatchAvailability } = require("../utils/batchValidator");
const mongoose = require("mongoose");

exports.getCart = async(req, res) => {
    const cart = await Cart.findOne({user: req.user._id})
                            .populate("items.batch");
    
    let total = 0;
    if(cart) {
        for (let item of cart.items) {
            total += item.quantity * item.batch.discountedPrice;
        }
    }
    console.log(total);

    res.render("cart/show.ejs", { cart, total })
}

exports.createCart = async(req, res) => {
    const { batchId } = req.params;
    const qty = Number(req.body.quantity);

    const batch = await Inventory.findById(batchId);

    const error = checkBatchAvailability(batch, qty);
    if(error) {
        req.flash("error", error);
        return res.redirect(`/batches/${batchId}`);
    }

    let cart = await Cart.findOne({user: req.user._id});

    if(!cart) {
        cart = new Cart({
            user: req.user._id,
            items: [{batch: batchId, quantity: qty}]
        })
    } else {
        const existingItem = cart.items.find(item => item.batch.toString() === batchId);

        if(existingItem) {
            existingItem.quantity += qty;
        } else {
            cart.items.push({batch: batchId, quantity: qty});
        }
    }

    await cart.save();
    req.flash("success", "Added to Cart");
    res.redirect("/cart");
}

exports.removeCartItem = async(req, res) => {
    const { batchId } = req.params;

    await Cart.updateOne(
        { user: req.user._id },
        { $pull: { items: { batch: new mongoose.Types.ObjectId(batchId) } } }
    );

    res.redirect("/cart");
};

exports.checkout = async(req, res) => {
    const cart = await Cart.findOne({user: req.user._id})
                    .populate("items.batch");
    
    if(!cart || cart.items.length === 0) {
        req.flash("error", "cart is empty");
        return res.redirect("/cart");
    }

    for(let item of cart.items) {
        const batch = item.batch;

        const error = checkBatchAvailability(batch, item.quantity);
        if(error) {
            req.flash("error", error);
            return res.redirect("/cart")
        }

        await Order.create({
            buyer: req.user._id,
            seller: batch.seller,
            batch: batch._id,
            quantityOrdered: item.quantity,
            priceAtOrder: batch.discountedPrice,
            totalAmount: item.quantity * batch.discountedPrice,
            status: "pending"
        });
    }

    cart.items = [];
    await cart.save();

    req.flash("success", "Order Placed");
    res.redirect("/orders/my");
}