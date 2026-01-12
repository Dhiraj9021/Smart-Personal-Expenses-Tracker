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

// View all
router.get("/", authMiddleware, showExpenses);

// Add
router.post("/add", authMiddleware, handleAddExpenseForm);

// ✅ Edit (React)
router.get("/:id", authMiddleware, getExpenseById);
router.put("/:id", authMiddleware, updateExpense);

// Delete
router.delete("/:id", authMiddleware, deleteExpense);

module.exports = router;









// const express = require("express");
// const router = express.Router();
// const authMiddleware = require("../middleware/authMiddleware");
// const {
//   showAddExpenseForm,
//   handleAddExpenseForm,
//   showExpenses,
//   deleteExpense,
//   showEditExpenseForm,
//   updateExpense,
// } = require("../controllers/expenseController");

// // Add
// router.get("/add",authMiddleware , showAddExpenseForm);
// router.post("/add",authMiddleware , handleAddExpenseForm);

// // View
// router.get("/", authMiddleware ,showExpenses);

// // Edit
// router.get("/edit/:id", authMiddleware, showEditExpenseForm);
// router.post("/edit/:id", authMiddleware, updateExpense);

// // Delete
// router.delete("/:id", authMiddleware, deleteExpense);
// module.exports = router;
