const express = require("express");
const router = express.Router();

const controller = require("../controllers/cartController");
const { isLoggedIn, isBuyer } = require("../middleware/auth");

router.get("/", controller.getCart);
router.post("/checkout", isLoggedIn, isBuyer, controller.checkout);
router.post("/:batchId", isLoggedIn, isBuyer, controller.createCart);
router.delete("/:batchId", isLoggedIn, isBuyer, controller.removeCartItem);

module.exports = router;