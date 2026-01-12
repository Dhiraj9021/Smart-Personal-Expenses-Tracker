const express = require("express");
const router = express.Router();
const statsController = require("../controllers/statsController");

// GET /stats
router.get("/", statsController.getStats);

module.exports = router;
