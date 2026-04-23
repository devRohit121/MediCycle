exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.flash("error", "You must be logged in first");
        return res.redirect("/login")
    }
    next();
}

exports.isSeller = (req, res, next) => {
    if (!req.isAuthenticated() || req.user.role !== 'seller') {
        req.flash("error", "Only seller can access this route");
        return res.redirect("/batches");
    }
    next();
}

exports.isBuyer = (req, res, next) => {
    if (!req.isAuthenticated()) {
    return res.redirect("/login");
    }

    if (!req.user || req.user.role !== "buyer") {
        req.flash("error", "Access denied: Only buyers allowed");
        return res.redirect("/batches");
    }
    next();
}

const Inventory = require("../models/inventory");

exports.isBatchOwner = async(req, res, next) => {
    try {
        let { id } = req.params;
        const batch = await Inventory.findById(id);

         if (!batch) {
            req.flash("error", "Batch not found");
            return res.redirect("/batches");
        }

        if (!batch.seller) {
            req.flash("error", "Batch has no owner");
            return res.redirect("/batches");
        }   

        if (!batch.seller.equals(req.user._id)) {
            req.flash("error", "You are not the owner of this batch");
            return res.redirect("/batches");
        }

        next();
    } catch (err) {
        console.log(err);
        req.flash("error", "Something went wrong");
        res.redirect("/batches");
    }
};

exports.isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === "admin") {
        return next();
    }

    req.flash("error", "Admin only");
    return res.redirect("/login");
};