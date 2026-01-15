const User = require("../models/Users");
const bcrypt = require("bcryptjs");
const wrapAsync = require("../utils/wrapAsync");

/* ================= REGISTER ================= */
exports.registerUser = wrapAsync(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(422).json({
      success: false,
      message: "All fields are required"
    });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "User already exists"
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password: hashedPassword
  });

  // Session
  req.session.userId = user._id;
  req.session.username = user.username;

  res.status(201).json({
    success: true,
    message: "Registered successfully",
    userId: user._id,
    username: user.username
  });
});

/* ================= LOGIN ================= */
exports.loginUser = wrapAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({
      success: false,
      message: "Email and password are required"
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials"
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials"
    });
  }

  // success
  req.session.userId = user._id;
  req.session.username = user.username;

  res.status(200).json({
    success: true,
    message: "Login successful",
    userId: user._id,
    username: user.username
  });
});


/* ================= LOGOUT ================= */
exports.logoutUser = wrapAsync(async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      const error = new Error("Logout failed");
      error.status = 500;
      throw error;
    }

    res.clearCookie("connect.sid");
    res.json({
      success: true,
      message: "Logged out successfully"
    });
  });
});
