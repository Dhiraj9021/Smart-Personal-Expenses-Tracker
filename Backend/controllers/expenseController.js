// controllers/expenseController.js
const Expense = require("../models/Expense");
const Income = require("../models/Income");
const wrapAsync = require("../utils/wrapAsync");

/* ================= ADD EXPENSE ================= */
exports.handleAddExpenseForm = wrapAsync(async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized. Please login."
    });
  }

  let { title, amount, category, isRecurring, paymentMode} = req.body;

  if (!title || !amount) {
    return res.status(422).json({
      success: false,
      message: "Title and amount are required"
    });
  }

  amount = Number(amount);
  if (isNaN(amount) || amount <= 0) {
    return res.status(422).json({
      success: false,
      message: "Amount must be a positive number"
    });
  }

  // ================= GET CURRENT MONTH INCOME =================
  const now = new Date();
  const monthIncomeRecords = await Income.find({
    userId: req.session.userId,
    date: {
      $gte: new Date(now.getFullYear(), now.getMonth(), 1),
      $lte: new Date(now.getFullYear(), now.getMonth() + 1, 0)
    }
  });

  const totalIncome = monthIncomeRecords.reduce((sum, i) => sum + i.amount, 0);

  // ================= GET CURRENT MONTH EXPENSES =================
  const monthExpenses = await Expense.find({
    userId: req.session.userId,
    date: {
      $gte: new Date(now.getFullYear(), now.getMonth(), 1),
      $lte: new Date(now.getFullYear(), now.getMonth() + 1, 0)
    }
  });

  const totalExpense = monthExpenses.reduce((sum, e) => sum + e.amount, 0);

  const remaining = totalIncome - totalExpense;

  // ================= CHECK BALANCE =================
  if (amount > remaining) {
    return res.status(400).json({
      success: false,
      message: `Insufficient balance. Remaining ₹${remaining}`
    });
  }

  // ================= CREATE EXPENSE =================
  const expense = await Expense.create({
    title,
    amount,
    category: category || "General",
    date: new Date(),
    userId: req.session.userId,
    isRecurring: isRecurring === true || isRecurring === "true",
    paymentMode: paymentMode || "UPI"
  });

  res.status(201).json({
    success: true,
    message: "Expense added successfully",
    expense
  });
});

/* ================= GET ALL EXPENSES ================= */
exports.showExpenses = wrapAsync(async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const expenses = await Expense.find({ userId: req.session.userId }).sort({ date: -1 });
  const incomes = await Income.find({ userId: req.session.userId });

  const now = new Date();
  const monthExpenses = expenses.filter(
    e => e.date.getMonth() === now.getMonth() && e.date.getFullYear() === now.getFullYear()
  );

  const monthIncomes = incomes.filter(
    i => i.date.getMonth() === now.getMonth() && i.date.getFullYear() === now.getFullYear()
  );

  const totalIncome = monthIncomes.reduce((sum, i) => sum + i.amount, 0);
  const totalExpense = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = totalIncome - totalExpense;

  res.json({
    success: true,
    expenses,
    totalIncome,
    totalExpense,
    remaining
  });
});

/* ================= GET SINGLE EXPENSE ================= */
exports.getExpenseById = wrapAsync(async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const expense = await Expense.findOne({
    _id: req.params.id,
    userId: req.session.userId
  });

  if (!expense) {
    return res.status(404).json({ success: false, message: "Expense not found" });
  }

  res.json({ success: true, expense });
});

/* ================= UPDATE EXPENSE ================= */
exports.updateExpense = wrapAsync(async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const updatedExpense = await Expense.findOneAndUpdate(
    { _id: req.params.id, userId: req.session.userId },
    {
      title: req.body.title,
      amount: req.body.amount,
      category: req.body.category,
      paymentMode: req.body.paymentMode,
      date: req.body.date ? new Date(req.body.date) : undefined,
      isRecurring: req.body.isRecurring
    },
    { new: true }
  );

  if (!updatedExpense) {
    return res.status(404).json({ success: false, message: "Expense not found" });
  }

  res.json({
    success: true,
    message: "Expense updated successfully",
    updatedExpense
  });
});

/* ================= DELETE EXPENSE ================= */
exports.deleteExpense = wrapAsync(async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const deleted = await Expense.findOneAndDelete({
    _id: req.params.id,
    userId: req.session.userId
  });

  if (!deleted) {
    return res.status(404).json({ success: false, message: "Expense not found" });
  }

  res.json({ success: true, message: "Expense deleted successfully" });
});
