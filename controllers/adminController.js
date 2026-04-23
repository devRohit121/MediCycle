const User = require("../models/user");
const Order = require("../models/order");
const Inventory = require("../models/inventory");

exports.adminDashboard = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ status: "pending" });
        const totalBatches = await Inventory.countDocuments();

        const totalSeller = await User.countDocuments({ role: "seller" });
        const totalBuyer = await User.countDocuments({ role: "buyer" });

        res.render("admin/dashboard", { 
            totalUsers,
            totalOrders,
            pendingOrders,
            totalBatches,
            totalSeller,
            totalBuyer
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

exports.adminUsers = async (req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = 9;

    const totalDocs = await User.countDocuments();
    const totalPages = Math.ceil(totalDocs / limit);

    const safePage = Math.min(page, totalPages || 1);
    const skip = (safePage - 1) * limit;

    let startPage = Math.max(1, safePage - 1);
    let endPage = Math.min(totalPages, safePage + 1);

    if (startPage === 1) endPage = Math.min(3, totalPages);
    if (endPage === totalPages) startPage = Math.max(1, totalPages - 2);

    const users = await User.find()
        .skip(skip)
        .limit(limit)
        .sort({ expiryDate: 1 });

    res.render("admin/users", {
        users,
        currentPage: safePage,
        totalPages,
        startPage,
        endPage
    });
};

exports.deleteUser = async(req, res) => {
    await User.findByIdAndDelete(req.params.id);
    req.flash("success", "User deleted");
    res.redirect("/admin/users");
};

exports.getOrders = async(req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = 9;

    const totalDocs = await User.countDocuments();
    const totalPages = Math.ceil(totalDocs / limit);

    const safePage = Math.min(page, totalPages || 1);
    const skip = (safePage - 1) * limit;

    let startPage = Math.max(1, safePage - 1);
    let endPage = Math.min(totalPages, safePage + 1);

    if (startPage === 1) endPage = Math.min(3, totalPages);
    if (endPage === totalPages) startPage = Math.max(1, totalPages - 2);

    const orders = await Order.find()
                    .populate("buyer")
                    .populate("seller")
                    .populate("batch")
                    .skip(skip)
                    .limit(limit)
                    .sort({ createdAt: -1});

    res.render("admin/orders", { 
        orders,
        currentPage: safePage,
        totalPages,
        startPage,
        endPage
     });
};

exports.getInventory = async(req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = 9;

    const totalDocs = await User.countDocuments();
    const totalPages = Math.ceil(totalDocs / limit);

    const safePage = Math.min(page, totalPages || 1);
    const skip = (safePage - 1) * limit;

    let startPage = Math.max(1, safePage - 1);
    let endPage = Math.min(totalPages, safePage + 1);

    if (startPage === 1) endPage = Math.min(3, totalPages);
    if (endPage === totalPages) startPage = Math.max(1, totalPages - 2);

    const batches = await Inventory.find()
                    .populate("seller")
                    .skip(skip)
                    .limit(limit)
                    .sort({ expiryDate: -1 });
    
    res.render("admin/batches", { 
        batches,
        currentPage: safePage,
        totalPages,
        startPage,
        endPage
     });
}

exports.deleteInventory = async(req, res) => {
    await Inventory.findByIdAndDelete(req.params.id);
    req.flash("success", "Batch Deleted");
    res.redirect("/admin/batches");
};

exports.privacy = (req, res) => {
    res.render("termsAndPrivacy/privacy");
};

exports.terms = (req, res) => {
    res.render("termsAndPrivacy/terms");
}