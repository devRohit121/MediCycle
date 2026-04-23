function checkBatchAvailability(batch, qty) {
    if (!batch) return "Batch not found";

    if (batch.expiryDate < new Date()) {
        return "This batch is expired";
    }

    if (batch.status != "Available") {
        return "This batch is not available";
        
    }

    if (qty <= 0) {
        return "Quantity must be greater than 0";
    }

    if (batch.quantity <= 0) {
        return "Out of stock";
    }

    if (qty && qty > batch.quantity) {
        return "Not enough stock";
    }

    return null;
}

module.exports = { checkBatchAvailability };