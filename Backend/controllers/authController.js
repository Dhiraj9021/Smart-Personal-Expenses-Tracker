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
    username: username.trim(),
    email: email.toLowerCase().trim(),
    password: hashedPassword
  });

  // ✅ SESSION
  req.session.userId = user._id.toString();
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

  const user = await User.findOne({ email: email.toLowerCase().trim() });
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

  // ✅ SESSION
  req.session.userId = user._id.toString();
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
      return res.status(500).json({
        success: false,
        message: "Logout failed"
      });
    }

    // ✅ IMPORTANT: cookie options must match session config
    res.clearCookie("connect.sid", {
      path: "/",
      sameSite: "none",
      secure: true
    });

    res.json({
      success: true,
      message: "Logged out successfully"
    });
  });
});
