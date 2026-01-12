const express = require("express");
const router = express.Router();

const Expense = require("../models/Expense");
const Income = require("../models/Income");
const { generateAISummary } = require("../services/aiservices");

async function getUserFinanceData(userId) {
  const expenses = await Expense.find({ userId });
  const incomes = await Income.find({ userId });

  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
  const totalIncome = incomes.reduce((s, i) => s + i.amount, 0);

  const categoryTotals = {};
  expenses.forEach((e) => {
    categoryTotals[e.category] =
      (categoryTotals[e.category] || 0) + e.amount;
  });

  return {
    totalIncome,
    totalExpense,
    remaining: totalIncome - totalExpense,
    categoryTotals,
    expenseCount: expenses.length,
    recurringCount: expenses.filter(e => e.isRecurring).length,
  };
}

router.post("/", async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.json({ reply: "Please login to view AI insights." });
    }

    const financeData = await getUserFinanceData(req.session.userId);
    const aiReply = await generateAISummary(financeData);

    res.json({ reply: aiReply });
  } catch (err) {
    console.error(err);
    res.json({ reply: "AI service is currently unavailable." });
  }
});

module.exports = router;
