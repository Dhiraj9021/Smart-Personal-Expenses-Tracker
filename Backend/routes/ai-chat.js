const express = require("express");
const router = express.Router();

const Expense = require("../models/Expense");
const Income = require("../models/Income");
const { generateAISummary, generateAiChatReply } = require("../services/aiservices");

// Helper to get user's finance data
async function getUserFinanceData(userId) {
  const expenses = await Expense.find({ userId });
  const incomes = await Income.find({ userId });

  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
  const totalIncome = incomes.reduce((s, i) => s + i.amount, 0);

  const categoryTotals = {};
  expenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  return {
    totalIncome,
    totalExpense,
    remaining: totalIncome - totalExpense,
    categoryTotals,
    expenseCount: expenses.length,
    recurringCount: expenses.filter((e) => e.isRecurring).length,
  };
}

// Route for AI Chat Bot
router.post("/", async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ reply: "Please login to use AI Assistant." });

    const { message } = req.body;
    if (!message || !message.trim())
      return res.status(400).json({ reply: "Message cannot be empty." });

    // Get user's finance data
    const financeData = await getUserFinanceData(userId);

    // Generate AI reply based on user's message & financial data
    const aiReply = await generateAiChatReply(message, financeData);

    // Optionally, also generate dashboard summary if message asks for it
    // For example, you can detect if the user wants "summary"
    
      const summary = await generateAISummary(financeData);
    

    // Send a single response with both AI reply and optional summary
    res.json({ reply: aiReply, summary });

  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "AI service is currently unavailable." });
  }
});

module.exports = router;
