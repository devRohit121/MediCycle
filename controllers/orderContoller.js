const Order = require("../models/order");
const Inventory = require("../models/inventory");
const Notification = require("../models/notification");
const { checkBatchAvailability } = require("../utils/batchValidator");

exports.createOrder = async(req, res) => {
    try {
        const { batchId } = req.params;
        const { quantityOrdered } = req.body;
        const batch = await Inventory.findById(batchId);
        const qty = Number(quantityOrdered);

        if (!qty || qty <= 0) {
            req.flash("error", "Invalid quantity");
            return res.redirect(`/batches/${batch._id}`);
        }

        const error = checkBatchAvailability(batch, qty);
        
        if (error) {
            req.flash("error", error);
            return res.redirect(`/batches/${batch._id}`);
        }

        if (batch.seller.equals(req.user._id)) {
            req.flash("error", "You cannot order your own listing");
            return res.redirect(`/batches/${batch._id}`);
        }
        

    const priceAtOrder = batch.discountedPrice;
    const totalAmount = qty * Number(priceAtOrder);

    const newOrder = new Order({
        buyer: req.user._id,
        seller: batch.seller,
        batch: batch._id,
        quantityOrdered: qty,
        priceAtOrder,
        totalAmount,
        status: "pending"
    });

    await newOrder.save();

    await Notification.create({
        user: batch.seller,
        message: `New order for ${ batch.name }`,
        link: "/orders/seller"
    });

    req.flash("success", "order placed");
    res.redirect("/orders/my");
    } catch(err) {
        console.log(err);
        req.flash("error", "Error while feteching data");
        return res.redirect("/orders/my");
    }
};

exports.myOrder = async(req, res) => {
    try {
        const orders = await Order.find({buyer: req.user._id})
        .populate("batch")
        .populate("seller")
        .sort({ createdAt: -1 });

        const pendingOrders = orders.filter(o => o.status === "pending");
        const processedOrders = orders.filter(o => o.status !== "pending");
        const completedOrders = orders.filter(o => o.status === "completed");

        res.render("orders/myOrders.ejs", { pendingOrders, processedOrders, completedOrders });
    } catch(err) {
        console.log(err);
        req.flash("error", "Error while fetching data");
        res.redirect("/orders/my");
    }
};

exports.getSellerOrders = async (req, res) => {
    try {
        const orders = await Order.find({ seller: req.user._id })
        .populate("buyer")
        .populate("batch")
        .sort({ createdAt: -1 });

        const pendingOrders = orders.filter(o => o.status === "pending");
        const processedOrders = orders.filter(o => o.status !== "pending");
        const completedOrders = orders.filter(o => o.status === "completed");

        const sellerId = req.user._id;

        const pending = await Order.countDocuments({ seller: sellerId, status: "pending" });
        const accepted = await Order.countDocuments({ seller: sellerId, status: "accepted" });
        const rejected = await Order.countDocuments({ seller: sellerId, status: "rejected" });
        const completed = await Order.countDocuments({ seller: sellerId, status: "completed" });

        const revenue = await Order.aggregate([
                { $match: { seller: req.user._id, status: "accepted" } },
                { $group: { _id: null, total: { $sum: "$totalAmount" } } }
]);

        const totalEarning = revenue?.[0]?.total || 0;

        res.render("seller/orders.ejs", { pendingOrders, processedOrders, completedOrders, pending, accepted, rejected, completed, totalEarning });
    } catch(err) {
        console.log(err);
        req.flash("error","Something went wrong");
        res.redirect("/batches")
    }
};

exports.updateOrderStatus = async(req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await Order.findById(id)
        .populate("batch");


        if(!order) {
            req.flash("error", "Order not found");
            return res.redirect("/orders/seller");
        }

        if (!order.seller.equals(req.user._id)) {
            req.flash("error", "Unauthorised");
            return res.redirect("/orders/seller");
        }

        if(order.status !== "pending") {
            req.flash("error", "Order already processed");
            return res.redirect("/orders/seller");
        }


        if (status == "accepted") {
            const updatedBatch = await Inventory.findOneAndUpdate(
                {
                    _id: order.batch._id,
                    quantity: { $gte: order.quantityOrdered },
                    expiryDate: { $gte: new Date() }
                },
                {
                    $inc: { quantity: -order.quantityOrdered }
                },
                { new: true }
            );

            if(!updatedBatch) {
                order.status = "rejected";
                await order.save();

                req.flash("error", "Order expired or stock not available");
                return res.redirect("/orders/seller");
            }

            if (updatedBatch.expiryDate < new Date()) {
                updatedBatch.status = "Expired";
            } else if (updatedBatch.quantity === 0) {
                updatedBatch.status = "Out of Stock";
            } else {
                updatedBatch.status = "Available";
            }

            await updatedBatch.save();

            order.status = "accepted";
            req.flash("success", "order accepted");

        } else if(status == "rejected") {
            order.status = "rejected";
            req.flash("success", "order rejected");
        } else {
            req.flash("error", "Invalid action");
            return res.redirect("/orders/seller");
        }

        await order.save();

        await Notification.create({
            user: order.buyer,
            message: `Your order of ${ order.batch.name }  is ${ order.status}`,
            link: "/orders/my"
        });

        return res.redirect("/orders/seller");

    } catch(err) {
        console.log(err);
        res.redirect("/orders/seller");
    }
};

exports.reorder = async(req,res) => {
    const { id } = req.params;
    const order = await Order.findById(id);
    const batchId = order.batch._id;
    res.redirect(`/batches/${batchId}`);
};

exports.markCompleted = async(req, res) => {
    const { id } = req.params;
    const order = await Order.findById(id)
                    .populate("batch");

    if(!order) {
        req.flash("error", "order not found");
        return res.redirect("/orders/my");
    }

    if(!order.buyer.equals(req.user._id)) {
        req.flash("error", "you are not the order owner");
        return res.redirect("/orders/my");
    }

    order.status = "completed";
    await order.save();

    await Notification.create({
        user: order.seller,
        message: `Your order of ${ order.batch.name } is ${ order.status }`,
        link: "/orders/seller"
    });

    res.redirect("/orders/my");
};

exports.getNotification = async(req, res) => {
    const notifications = await Notification.find({
        user: req.user._id
    }).sort({ createAt: -1});

    res.render("notification/notifications.ejs", { notifications });
};