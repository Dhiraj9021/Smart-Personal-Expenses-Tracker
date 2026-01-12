// routes/incomeRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  showIncome,
  showEditIncomeForm,
  updateIncome,
  handleAddIncomeForm,
  deleteIncome,
} = require("../controllers/incomeControl");

router.get("/", authMiddleware, showIncome);

// ✅ GET SINGLE INCOME (for edit page)
router.get("/:id", authMiddleware, showEditIncomeForm);

// Add
router.post("/add", authMiddleware, handleAddIncomeForm);

// ✅ UPDATE (React uses PUT)
router.put("/:id", authMiddleware, updateIncome);

// Delete
router.delete("/:id", authMiddleware, deleteIncome);

module.exports = router;








// const express = require("express");
// const router = express.Router();
// const authMiddleware = require("../middleware/authMiddleware");
// const {
//     showIncome,
  
//   showAddIncomeForm,
//   handleAddIncomeForm,
//   showEditIncomeForm,
//   updateIncome,
//   deleteIncome,
// } = require("../controllers/incomeControl");


// router.get("/", authMiddleware, showIncome);   

// // Show form to add income
// router.get("/add", authMiddleware,  showAddIncomeForm);

// // Handle form submission to add income
// router.post("/add", authMiddleware, handleAddIncomeForm);

// // Show form to edit income
// router.get("/edit/:id", authMiddleware, showEditIncomeForm);

// // Handle update income
// router.post("/edit/:id", authMiddleware, updateIncome);

// // Delete income
// router.delete("/:id", authMiddleware,deleteIncome);

// module.exports = router;

