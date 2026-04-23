const express = require("express");
const router = express.Router();
const { orderSchema, orderStatusSchema } = require('../schemas');
const validate = require('../middleware/validate');

const controller = require("../controllers/orderContoller");
const { isLoggedIn, isBuyer, isSeller } = require("../middleware/auth");

router.post("/:batchId", isLoggedIn, isBuyer, validate(orderSchema), controller.createOrder);
router.get("/my", isLoggedIn, isBuyer, controller.myOrder);
router.get("/notifications", isLoggedIn, controller.getNotification);
router.get("/seller", isLoggedIn, isSeller, controller.getSellerOrders);
router.put("/:id/status", isLoggedIn, isSeller, validate(orderStatusSchema), controller.updateOrderStatus);
router.get("/:id/reorder", isLoggedIn, isBuyer, controller.reorder);
router.put("/:id/completed", isLoggedIn, isBuyer, controller.markCompleted);

module.exports = router;