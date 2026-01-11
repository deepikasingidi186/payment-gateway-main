const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const statsController = require("../controllers/stats.controller");

router.get("/", auth, statsController.getStats);

module.exports = router;
