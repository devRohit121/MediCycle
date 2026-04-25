const cron = require("node-cron");
const Inventory = require("../models/inventory");

function startExpiryJob() {
    cron.schedule('*/2 * * * *', async () => {
        const now = new Date();

        try {
            // 1. Mark expired
            await Inventory.updateMany(
                { expiryDate: { $lte: now }, status: { $ne: "Expired" } },
                { $set: { status: "Expired" } }
            );

            // 2. Mark out of stock (only if NOT expired)
            await Inventory.updateMany(
                { quantity: { $lte: 0 }, status: { $ne: "Expired" } },
                { $set: { status: "Out of Stock" } }
            );

        } catch (err) {
            console.error("Cron Job Error:", err);
        }
    });
}

module.exports = startExpiryJob;