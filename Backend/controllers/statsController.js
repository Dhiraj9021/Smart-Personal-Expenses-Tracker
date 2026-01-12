const User = require("../models/Users");
const Visit = require("../models/Visit");
const Expense = require("../models/Expense");

exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalVisits = await Visit.countDocuments();
    const totalExpenses = await Expense.countDocuments();

    res.json({ totalUsers, totalVisits, totalExpenses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
