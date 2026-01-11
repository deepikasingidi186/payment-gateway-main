const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const paymentController = require("../controllers/payment.controller");

router.get("/:paymentId/public", paymentController.getPublicPayment);
router.post("/", auth, paymentController.createPayment);
router.get("/:paymentId", auth, paymentController.getPayment);

module.exports = router;
