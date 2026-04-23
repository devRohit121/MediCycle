const express = require("express");
const router = express.Router();

const controller = require("../controllers/adminController");
const { isAdmin, isLoggedIn } = require("../middleware/auth");

router.get("/", isAdmin, controller.adminDashboard);
router.get("/users", isLoggedIn, isAdmin, controller.adminUsers);
router.get("/orders", isLoggedIn, isAdmin, controller.getOrders);
router.get("/batches", isLoggedIn, isAdmin, controller.getInventory);
router.get("/privacy", controller.privacy);
router.get("/terms", controller.terms);

router.delete("/users/:id", isLoggedIn, isAdmin, controller.deleteUser);
router.delete("/batches/:id", isLoggedIn, isAdmin, controller.deleteInventory);

module.exports = router;