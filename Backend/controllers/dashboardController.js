const mongoose = require("mongoose");
const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { generateAISummary } = require("../services/aiservices");
const wrapAsync = require("../utils/wrapAsync");

exports.showDashboard = wrapAsync(async (req, res) => {
  // 🔐 Auth check
  if (!req.session.userId) {
    const err = new Error("Not logged in");
    err.status = 401;
    throw err;
  }

  const userId = new mongoose.Types.ObjectId(req.session.userId);
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 1);

  /* ================= INCOME ================= */
  const monthlyIncome = await Income.find({
    userId,
    date: { $gte: startDate, $lt: endDate },
  }).sort({ date: -1 });

  const totalIncome = monthlyIncome.reduce((sum, inc) => sum + inc.amount, 0);

  /* ================= EXPENSE ================= */
  const monthlyExpenses = await Expense.find({
    userId,
    date: { $gte: startDate, $lt: endDate },
  }).sort({ date: -1 });

  const totalExpense = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  /* ================= SAFE REMAINING ================= */
  const remaining = Math.max(totalIncome - totalExpense, 0);

  /* ================= ALERT LOGIC ================= */
  const alerts = [];
  if (totalIncome === 0) alerts.push("No income added for this month.");
  if (totalExpense > totalIncome) alerts.push("Expenses exceeded income. Add income to continue.");
  if (totalIncome > 0 && totalExpense / totalIncome >= 0.9) alerts.push("Warning: You have used 90% of your income.");

  /* ================= CATEGORY ANALYSIS ================= */
  const categoryTotals = {};
  const categoryPercentages = {};
  const overspendAlerts = [];

  monthlyExpenses.forEach((exp) => {
    const cat = exp.category || "Other";
    categoryTotals[cat] = (categoryTotals[cat] || 0) + exp.amount;
  });

  for (const cat in categoryTotals) {
    const percent = totalIncome > 0 ? Number(((categoryTotals[cat] / totalIncome) * 100).toFixed(2)) : 0;
    categoryPercentages[cat] = percent;
    if (percent > 30) overspendAlerts.push(`You are overspending on ${cat} (${percent}%)`);
  }

  /* ================= AI INSIGHT ================= */
  let aiInsight = "AI insight is currently unavailable.";
  try {
    aiInsight = await generateAISummary({
      totalIncome,
      totalExpense,
      remaining,
      categoryTotals,
    });
  } catch (aiErr) {
    console.error("🤖 AI Error:", aiErr.message);
    // ❗ Do NOT throw → dashboard must still load
  }

  /* ================= RESPONSE ================= */
  res.status(200).json({
    success: true,
    username: req.session.username,
    month,
    year,
    monthlyIncome,
    monthlyExpenses,
    totalIncome,
    totalExpense,
    remaining,
    alerts,
    categoryTotals,
    categoryPercentages,
    overspendAlerts,
    aiInsight,
  });
});
