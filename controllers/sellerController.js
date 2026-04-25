const Inventory = require("../models/inventory");

exports.sellerDashBoard = async(req, res) => {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = 9;
    
        const totalDocs = await Inventory.countDocuments({ seller: req.user._id });
        const totalPages = Math.ceil(totalDocs / limit);
    
        const safePage = Math.min(page, totalPages || 1);
        const skip = (safePage - 1) * limit;
    
        let startPage = Math.max(1, safePage - 1);
        let endPage = Math.min(totalPages, safePage + 1);
    
        if (startPage === 1) endPage = Math.min(3, totalPages);
        if (endPage === totalPages) startPage = Math.max(1, totalPages - 2);

    let medis = await Inventory.find({ 
        seller: req.user._id,
            })
            .skip(skip)
            .limit(limit);
    res.render("seller/dashBoard.ejs", { 
        medis,
        currentPage: safePage,
        totalPages,
        startPage,
        endPage
     });
};