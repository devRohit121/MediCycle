const cron = require("node-cron");
const Inventory = require("../models/inventory");

function startExpiryJob() {
    cron.schedule('0 * * * *', async() => {
        const now = new Date();

        await Inventory.updateMany(
            { expiryDate: { $lte: now }, status: { $ne: "expired" } },
            { $set: { status: "expired" } }
        );
    });
};

module.exports = startExpiryJob;