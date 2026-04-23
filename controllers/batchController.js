const Inventory = require("../models/inventory");

exports.getAllBatches = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = 12;

    const { search, category } = req.query;
    const query = {
        expiryDate: { $gte: new Date() }
    };

    if (search) {
        query.name = {
            $regex: search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
            $options: "i"
        };
    }

    if (category) {
        query.category = category.trim();
    }

    const totalDocs = await Inventory.countDocuments( query );
    const totalPages = Math.ceil(totalDocs/limit);
    const safePage = Math.min(page, totalPages || 1);

    const skip = (safePage - 1) * limit;
    
    let startPage = Math.max(1, safePage-1);
    let endPage = Math.min(totalPages, safePage+1);

    if (startPage === 1) {
        endPage = Math.min(3, totalPages);
    }

    if (endPage === totalPages) {
        startPage = Math.max(1, totalPages-2);
    }

    let allBatches = await Inventory.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ expiryDate: 1 }); 

    res.render("batches/show.ejs", 
        { 
            allBatches, 
            totalPages, 
            currentPage: safePage   ,
            startPage,
            endPage,
            search,
            category
        });
};

exports.renderNewForm = (req, res) => {
    res.render("batches/new.ejs");
};

exports.createBatch = async (req, res) => {
    try {
        const data = req.body.batch || req.body;
        const newBatch = new Inventory(data);

        if (Number(newBatch.discountedPrice) >= Number(newBatch.unitPrice)) {
            req.flash("error", "Discounted Price cannot be greater than Unit Price");
            return res.redirect("/batches/new");
        }

        if (new Date(newBatch.expiryDate) <= new Date(newBatch.manufacturingDate)) {
            req.flash("error", "Expiry Date must be after manufacturing date");
            return res.redirect("/batches/new");
        }
        
        newBatch.seller = req.user._id;
        await newBatch.save();
        res.redirect("/batches");
    } catch(err) {
        console.log(err);
        req.flash("error", "Error while saving");
        return res.redirect("/batches");
    }
};

exports.getBatch = async (req, res) => {
    let { id } = req.params;
    const batch = await Inventory.findById(id);

    if (!batch) {
        req.flash("error", "Batch not found");
        return res.redirect("/batches");
    }

    if (batch.expiryDate < new Date()) {
        req.flash("error", "This batch is expired");
        return res.redirect("/batches");
    }

    res.render("batches/view.ejs", { batch });
};

exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const batch = await Inventory.findById(id);
    res.render("batches/edit.ejs", { batch });
};

exports.updateBatch = async (req, res) => {
    try {
        let { id } = req.params;
        const batch = req.body.batch || req.body;

        if (!batch) {
            req.flash("error", "Invalid data");
            return res.redirect(`/batches/${id}`);
        }

        if (new Date(batch.expiryDate) <= new Date(batch.manufacturingDate)) {
            req.flash("error", "Expiry must be after manufacturing date")
            return res.redirect(`/batches/${id}`);
        }
        
        if (Number(batch.unitPrice) < Number(batch.discountedPrice)) {
            req.flash("error", "Discounted price cannot be greater than unit price");
            return res.redirect(`/batches/${id}`);
        }

        if (new Date(batch.expiryDate) < new Date()) {
            batch.status = "Expired"
        } else if (Number(batch.quantity) === 0) {
            batch.status = "Out of Stock"
        } else {
            batch.status = "Available"
        }

        await Inventory.findByIdAndUpdate(id, batch, {
        new: true,
        runValidators: true
    })
    res.redirect("/seller/dashBoard");
    } catch (err) {
        console.log(err);
        req.flash("error", "Error while updating");
        res.redirect("/seller/dashBoard");
    }
};

exports.deleteBatch = async(req, res) => {
    let { id } = req.params;
    await Inventory.findByIdAndDelete(id);
    res.redirect("/batches");
};