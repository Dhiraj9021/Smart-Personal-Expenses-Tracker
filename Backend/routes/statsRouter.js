const express = require("express");
const router = express.Router();
const statsController = require("../controllers/statsController");

const visitLogger = require("../middleware/visitLogger");

// GET /stats
router.get("/",visitLogger, statsController.getStats);

module.exports = router;
