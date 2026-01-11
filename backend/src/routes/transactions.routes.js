const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const controller = require("../controllers/transactions.controller");

router.get("/", auth, controller.getTransactions);

module.exports = router;
