const express = require("express");
const router = express.Router();

const controller = require("../controllers/sellerController");
const { isLoggedIn, isSeller } = require("../middleware/auth");

router.get("/dashBoard", isLoggedIn, isSeller, controller.sellerDashBoard);

module.exports = router;