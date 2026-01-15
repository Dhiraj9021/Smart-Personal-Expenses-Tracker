// routes/expenseRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getExpenseById,
  updateExpense,
  deleteExpense,
  handleAddExpenseForm,
  showExpenses,
} = require("../controllers/expenseController");

// View all expenses
router.get("/", authMiddleware, showExpenses);

// Add new expense/income
router.post("/add", authMiddleware, handleAddExpenseForm);

// Get single expense
router.get("/:id", authMiddleware, getExpenseById);

// Update expense
router.put("/:id", authMiddleware, updateExpense);

// Delete expense
router.delete("/:id", authMiddleware, deleteExpense);

module.exports = router;
