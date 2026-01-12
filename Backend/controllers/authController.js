const User = require("../models/Users");
const bcrypt = require("bcryptjs");

/* REGISTER */
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
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

    // ✅ Session
    req.session.userId = user._id;
    req.session.username = user.username;

    // ✅ SEND USER DATA TO REACT
    return res.status(200).json({
      success: true,
      message: "Registered successfully",
      userId: user._id,
      username: user.username
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Registration failed"
    });
  }
};

/* LOGIN */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // ✅ Session
    req.session.userId = user._id;
    req.session.username = user.username;

    // ✅ SEND USER DATA TO REACT
    return res.status(200).json({
      success: true,
      message: "Login successful",
      userId: user._id,
      username: user.username
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Login failed"
    });
  }
};

/* LOGOUT */
exports.logoutUser = (req, res) => {
 req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ success: false, message: "Logout failed" });
    }

    res.clearCookie("connect.sid"); // very important
    return res.json({ success: true, message: "Logged out successfully" });
  });
};






// const User = require("../models/Users");
// const bcrypt = require("bcryptjs");

// /* REGISTER */
// exports.registerUser = async (req, res) => {
//   try {
//     const { username, email, password } = req.body;

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.render("/auth/register", { error: "User already exists" });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);

//     await User.create({
//       username,
//       email,
//       password: hashedPassword
//     });

//     res.redirect("/auth/login");
//   } catch (err) {
//     console.error(err);
//     res.render("register", { error: "Registration failed" });
//   }
// };

// /* LOGIN */
// exports.loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.render("login", { error: "Invalid credentials" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.render("login", { error: "Invalid credentials" });
//     }

//     req.session.userId = user._id;
//     req.session.userName = user.username;

//     res.redirect("/dashboard");
//   } catch (err) {
//     console.error(err);
//     res.render("login", { error: "Login failed" });
//   }
// };

// /* LOGOUT */
// exports.logoutUser = (req, res) => {
//   req.session.destroy(() => {
//     res.redirect("/auth/login");
//   });
// };
