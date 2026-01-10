const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const orderController = require("../controllers/order.controller");

router.post("/", auth, orderController.createOrder);
router.get("/:orderId", auth, orderController.getOrder);

module.exports = router;
