const mongoose = require("mongoose");  
const Income = require("../models/Income");
const Expense = require("../models/Expense");
const wrapAsync = require("../utils/wrapAsync");

/* ================= GET MONTHLY INCOME ================= */
exports.showIncome = wrapAsync(async (req, res) => {
  if (!req.session.userId) {
    const err = new Error("Unauthorized");
    err.status = 401;
    throw err;
  }

  const incomes = await Income.find({
    userId: req.session.userId
  }).sort({ date: -1 });

  const now = new Date();

  const monthlyIncome = incomes.filter(
    (i) =>
      i.date.getMonth() === now.getMonth() &&
      i.date.getFullYear() === now.getFullYear()
  );

  const totalIncome = monthlyIncome.reduce(
    (sum, i) => sum + i.amount,
    0
  );

  res.json({
    success: true,
    incomes: monthlyIncome,
    totalIncome
  });
});

/*  EJS NOT SUPPORTED */
exports.showAddIncomeForm = (req, res) => {
  res.status(400).json({
    success: false,
    message: "Not supported in API mode"
  });
};

/* ================= ADD INCOME ================= */
exports.handleAddIncomeForm = wrapAsync(async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  let { title, amount, category } = req.body;

  if (!title || amount === undefined) {
    return res.status(422).json({ success: false, message: "Title and amount are required" });
  }

  amount = Number(amount);

  if (isNaN(amount) || amount <= 0) {
    return res.status(422).json({
      success: false,
      message: "Amount must be a positive number",
    });
  }

  const income = await Income.create({
    title,
    amount, // guaranteed positive
    category: category || "General",
    date: new Date(),
    userId: req.session.userId,
  });

  res.status(201).json({
    success: true,
    message: "Income added successfully",
    income,
  });
});

/* ================= GET SINGLE INCOME ================= */
exports.showEditIncomeForm = wrapAsync(async (req, res) => {
  if (!req.session.userId) {
    const err = new Error("Unauthorized");
    err.status = 401;
    throw err;
  }

  const income = await Income.findOne({
    _id: req.params.id,
    userId: req.session.userId
  });

  if (!income) {
    const err = new Error("Income not found");
    err.status = 404;
    throw err;
  }

  res.json({
    success: true,
    income
  });
});

/* ================= UPDATE INCOME ================= */
exports.updateIncome = wrapAsync(async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  let { title, amount, category, date } = req.body;

  if (!title || amount === undefined) {
    return res.status(422).json({ success: false, message: "Title and amount are required" });
  }

  amount = Number(amount);

  if (isNaN(amount) || amount <= 0) {
    return res.status(422).json({
      success: false,
      message: "Amount must be a positive number",
    });
  }

  const updatedIncome = await Income.findOneAndUpdate(
    { _id: req.params.id, userId: req.session.userId },
    {
      title,
      amount,
      category: category || "General",
      date: date ? new Date(date) : undefined
    },
    { new: true }
  );

  if (!updatedIncome) {
    return res.status(404).json({ success: false, message: "Income not found" });
  }

  res.json({
    success: true,
    message: "Income updated successfully",
    updatedIncome,
  });
});



/*========== DELETE INCOME ================= */

exports.deleteIncome = wrapAsync(async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const userId = req.session.userId; // keep as string
  const incomeId = req.params.id;    // keep as string

  //  Find income to delete
  const incomeToDelete = await Income.findOne({ _id: incomeId, userId });
  if (!incomeToDelete) {
    return res.status(404).json({ success: false, message: "Income not found" });
  }

  //  Calculate monthly income excluding this one
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const monthlyIncome = await Income.find({
    userId,
    date: { $gte: startDate, $lt: endDate },
    _id: { $ne: incomeId } // exclude the income being deleted
  });

  const totalIncome = monthlyIncome.reduce((sum, inc) => sum + Number(inc.amount), 0);

  //  Calculate monthly expenses
  const monthlyExpenses = await Expense.find({
    userId,
    date: { $gte: startDate, $lt: endDate }
  });

  const totalExpense = monthlyExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0);

  //  Check if deletion is safe
  if (totalIncome < totalExpense) {
    return res.status(400).json({
      success: false,
      message: `Cannot delete this income.Your Income become less than Expense.`
    });
  }

  //  Safe to delete
  await Income.deleteOne({ _id: incomeId });

  res.json({ success: true, message: "Income deleted successfully" });
});