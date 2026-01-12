const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");



// handle register
router.post("/register", authController.registerUser);

// handle login
router.post("/login", authController.loginUser);

// logout
router.post("/logout", authController.logoutUser);

module.exports = router;
