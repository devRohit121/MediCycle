const express = require("express");
const router = express.Router();
const { inventorySchema, updateInventorySchema } = require('../schemas');
const validate = require('../middleware/validate');

const controller = require("../controllers/batchController");
const { isLoggedIn, isBatchOwner, isSeller } = require("../middleware/auth");

router.get("/", controller.getAllBatches);
router.get("/new", isLoggedIn, isSeller, controller.renderNewForm);
router.post("/", isLoggedIn, isSeller, validate(inventorySchema), controller.createBatch);

router.get("/:id/edit", isLoggedIn, isBatchOwner, controller.renderEditForm);
router.put("/:id", isLoggedIn, isBatchOwner, validate(updateInventorySchema), controller.updateBatch);
router.delete("/:id", isLoggedIn, isBatchOwner, controller.deleteBatch);

router.get("/:id", isLoggedIn, controller.getBatch);

module.exports = router;