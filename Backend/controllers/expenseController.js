const Expense = require("../models/Expense");

// ❌ REMOVE EJS FORM RENDER (React handles UI now)
exports.showAddExpenseForm = (req, res) => {
  res.status(400).json({ message: "Not supported in API mode" });
};

// ✅ Add expense or income (JSON)
exports.handleAddExpenseForm = async (req, res) => {
  try {
    // 🔐 session check
    if (!req.session.userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Please login again."
      });
    }

    const expense = await Expense.create({
      title: req.body.title,
      amount: Number(req.body.amount),
      category: req.body.category || "General",
      expenseType: req.body.expenseType || "expense",
      date: new Date(),
      userId: req.session.userId,
      isRecurring:
        req.body.isRecurring === true ||
        req.body.isRecurring === "true",
      paymentMethod: req.body.paymentMethod || "UPI", // ✅ FIXED
    });

    res.status(201).json({
      success: true,
      message: "Expense added successfully",
      expense
    });

  } catch (err) {
    console.error("SAVE ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Error saving expense"
    });
  }
};


// ✅ Show expenses with totals (JSON)
exports.showExpenses = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ success: false, message: "Not logged in" });
    }

    const expenses = await Expense.find({
      userId: req.session.userId
    }).sort({ date: -1 });

    const now = new Date();

    const monthExpenses = expenses.filter(
      e =>
        e.date.getMonth() === now.getMonth() &&
        e.date.getFullYear() === now.getFullYear()
    );

    const totalIncome = monthExpenses
      .filter(e => e.expenseType === "income")
      .reduce((sum, e) => sum + e.amount, 0);

    const totalExpense = monthExpenses
      .filter(e => e.expenseType === "expense")
      .reduce((sum, e) => sum + e.amount, 0);

    const remaining = totalIncome - totalExpense;

    // ✅ JSON instead of res.render
    res.json({
      expenses,
      totalIncome,
      totalExpense,
      remaining
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching expenses" });
  }
};

// ✅ GET single expense (for edit page)
exports.getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      userId: req.session.userId,
    });

    if (!expense)
      return res.status(404).json({ success: false, message: "Expense not found" });

    res.json({ success: true, expense });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error loading expense" });
  }
};

// ✅ UPDATE expense
exports.updateExpense = async (req, res) => {
  try {
    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.session.userId },
      {
        title: req.body.title,
        amount: req.body.amount,
        category: req.body.category,
        expenseType: req.body.expenseType,
        paymentMode: req.body.paymentMode,
        date: req.body.date ? new Date(req.body.date) : undefined,
        isRecurring: req.body.isRecurring,

      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Expense updated successfully",
      updatedExpense,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating expense" });
  }
};

// // ❌ REMOVE EJS EDIT FORM
// exports.showEditExpenseForm = async (req, res) => {
//   try {
//     const expense = await Expense.findById(req.params.id);
//     if (!expense)
//       return res.status(404).json({ message: "Expense not found" });

//     res.json({ expense });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Error loading expense" });
//   }
// };

// // ✅ UPDATE expense (JSON)
// exports.updateExpense = async (req, res) => {
//   try {
//     const expense = await Expense.findById(req.params.id);
//     if (!expense) return res.status(404).json({ message: "Expense not found" });
//     if (expense.userId.toString() !== req.session.userId)
//       return res.status(403).json({ message: "Forbidden" });

//     const updatedExpense = await Expense.findByIdAndUpdate(
//       req.params.id,
//       {
//         title: req.body.title,
//         amount: req.body.amount,
//         category: req.body.category,
//         expenseType: req.body.expenseType || expense.expenseType,
//         date: req.body.date ? new Date(req.body.date) : expense.date,
//         paymentMethod: req.body.paymentMethod || expense.paymentMethod,
//         isRecurring: req.body.isRecurring ?? expense.isRecurring,
//       },
//       { new: true }
//     );

//     res.json({ success: true, message: "Expense updated", updatedExpense });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Error updating expense" });
//   }
// };

// ✅ Delete Expense (already JSON – kept same)
exports.deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};































// const Expense = require("../models/Expense");

// // Show add-expense form (GET)
// exports.showAddExpenseForm = (req, res) => {
//   res.render("addExpense");
// };


// // Add expense or income
// exports.handleAddExpenseForm = async (req, res) => {
//   try {
//     await Expense.create({
//       title: req.body.title,
//       amount: Number(req.body.amount),
//       category: req.body.category || "General",
//      expenseType: req.body.expenseType , // DEFAULT
//       date: new Date(),
//       userId: req.session.userId,
//       isRecurring: req.body.isRecurring === "true",
//       paymentMode: req.body.paymentMode || "UPI",
//     });

//     res.redirect("/test/expenses");
//   } catch (err) {
//     console.error("SAVE ERROR:", err);
//     res.status(500).send("Error saving expense");
//   }
// };


// // Show expenses with total income and remaining balance
// exports.showExpenses = async (req, res) => {
//   try {
//     const expenses = await Expense.find({ userId: req.session.userId }).sort({ date: -1 });
     
//     // Filter current month
//     const now = new Date();
//     const monthExpenses = expenses.filter(
//       e => e.date.getMonth() === now.getMonth() && e.date.getFullYear() === now.getFullYear()
//     );

//     const totalIncome = monthExpenses
//       .filter(e => e.expenseType === "income")
//       .reduce((sum, e) => sum + e.amount, 0);

//     const totalExpense = monthExpenses
//       .filter(e => e.expenseType=== "expense")
//       .reduce((sum, e) => sum + e.amount, 0);

//     const remaining = totalIncome - totalExpense;

//     res.render("expenses", { expenses, totalIncome, totalExpense, remaining });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error fetching expenses");
//   }
// };




// // SHOW EDIT FORM
// exports.showEditExpenseForm = async (req, res) => {
//   try {
//     const expense = await Expense.findById(req.params.id);
//     if (!expense) return res.status(404).send("Expense not found");

//     res.render("editExpense", { expense });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error loading edit form");
//   }
// };

// // HANDLE UPDATE
// exports.updateExpense = async (req, res) => {
//   try {
//     await Expense.findByIdAndUpdate(req.params.id, {
//       title: req.body.title,
//       amount: req.body.amount,
//       category: req.body.category,
//       type: req.body.type,
//       date: req.body.date || Date.now(),
//     });

//     res.redirect("/test/expenses");
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error updating expense");
//   }
// };


// // Delete Expense (for API or AJAX)
// exports.deleteExpense = async (req, res) => {
//   try {
//     await Expense.findByIdAndDelete(req.params.id);
//     res.json({ message: "Expense deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
