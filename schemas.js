const Joi = require('joi');

const inventorySchema = Joi.object({
        name: Joi.string().trim().required(),
        category: Joi.string().valid('Tablet', 'Capsule', 'Syrup', 'Injection', 'Ointment').required(),
        manufacturer: Joi.string().trim().required(),
        batchNo: Joi.string().required(),
        manufacturingDate: Joi.date().required(),
        expiryDate: Joi.date().greater(Joi.ref('manufacturingDate')).required(),
        quantity: Joi.number().min(0).required(),
        unitPrice: Joi.number().min(1).required(),
        discountedPrice: Joi.number().min(1).max(Joi.ref('unitPrice')).required(),
        location: Joi.string().required(),
        status: Joi.string().valid('Available', 'Out of Stock', 'Expired').default('Available'),
});


const orderSchema = Joi.object({
    quantityOrdered: Joi.number().min(1).required(),
    status: Joi.string()
        .valid("pending", "accepted", "rejected", "completed")
        .default("pending")
});

const userSchema = Joi.object({
        email: Joi.string().email().required(),
        username: Joi.string().min(3).max(30).allow('', null),
        role: Joi.string().valid('seller', 'buyer', 'admin').default('seller'),
        organizationName: Joi.string().trim().required(),
        phone: Joi.string().pattern(/[0-9]{10}$/).required(),

    password: Joi.string()
        .required()
});

const orderStatusSchema = Joi.object({
        status: Joi.string().valid("pending", "accepted", "rejected", "completed").required()
});

const updateInventorySchema = Joi.object({
    name: Joi.string().trim(),
    category: Joi.string().valid('Tablet', 'Capsule', 'Syrup', 'Injection', 'Ointment'),
    manufacturer: Joi.string().trim(),
    batchNo: Joi.string(),
    manufacturingDate: Joi.date(),
    expiryDate: Joi.date(),
    quantity: Joi.number().min(0),
    unitPrice: Joi.number().min(1),
    discountedPrice: Joi.number().min(1),
    location: Joi.string(),
    status: Joi.string().valid('Available', 'Out of Stock', 'Expired')
});

module.exports = {
    inventorySchema,
    orderSchema,
    userSchema,
    orderStatusSchema,
    updateInventorySchema
};