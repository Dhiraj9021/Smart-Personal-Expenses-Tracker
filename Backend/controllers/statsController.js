const User = require("../models/Users");
const Visit = require("../models/Visit");
const Expense = require("../models/Expense");
const wrapAsync = require("../utils/wrapAsync");

/* ================= GLOBAL STATS ================= */
exports.getStats = wrapAsync(async (req, res) => {
  const [totalUsers, totalVisits, totalExpenses] = await Promise.all([
    User.countDocuments(),
    Visit.countDocuments(),
    Expense.countDocuments()
  ]);

  res.status(200).json({
    success: true,
    totalUsers,
    totalVisits,
    totalExpenses
  });
});
