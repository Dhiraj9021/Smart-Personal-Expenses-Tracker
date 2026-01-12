const Income = require("../models/Income");

// ✅ Show income entries (JSON)
exports.showIncome = async (req, res) => {
  try {
    const incomes = await Income.find({
      userId: req.session.userId
    }).sort({ date: -1 });

    const now = new Date();

    const monthlyIncome = incomes.filter(
      i =>
        i.date.getMonth() === now.getMonth() &&
        i.date.getFullYear() === now.getFullYear()
    );

    const totalIncome = monthlyIncome.reduce(
      (sum, i) => sum + i.amount,
      0
    );

    // ✅ JSON instead of res.render
    res.json({
      incomes: monthlyIncome,
      totalIncome
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching income" });
  }
};

// ❌ Remove EJS add-income form
exports.showAddIncomeForm = (req, res) => {
  res.status(400).json({ message: "Not supported in API mode" });
};

// ✅ Add income (JSON)
exports.handleAddIncomeForm = async (req, res) => {
  try {
    const income = await Income.create({
      title: req.body.title,
      amount: Number(req.body.amount),
      category: req.body.category || "General",
      date: new Date(),
      userId: req.session.userId,
    });

    // ✅ JSON instead of redirect
    res.status(201).json({
      success: true,
      message: "Income added successfully",
      income
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error saving income" });
  }
};
// GET single income (for edit page)
exports.showEditIncomeForm = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);
    if (!income)
      return res.status(404).json({ message: "Income not found" });

    res.json({ success: true, income });
  } catch (err) {
    res.status(500).json({ message: "Error loading income" });
  }
};

// UPDATE income
exports.updateIncome = async (req, res) => {
  try {
    const updatedIncome = await Income.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        amount: req.body.amount,
        category: req.body.category,
        userId: req.session.userId,
        date: req.body.date || Date.now(),
      },
      { new: true }
    );

    res.json({
      success: true,
      message: "Income updated successfully",
      updatedIncome
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating income" });
  }
};

// // ❌ Remove EJS edit form
// exports.showEditIncomeForm = async (req, res) => {
//   try {
//     const income = await Income.findById(req.params.id);
//     if (!income)
//       return res.status(404).json({ message: "Income not found" });

//     res.json({ income });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Error loading income" });
//   }
// };

// // ✅ Update income (JSON)
// exports.updateIncome = async (req, res) => {
//   try {
//     const updatedIncome = await Income.findByIdAndUpdate(
//       req.params.id,
//       {
//         title: req.body.title,
//         amount: req.body.amount,
//         category: req.body.category,
//         userId: req.session.userId,
//         date: req.body.date || Date.now(),
//       },
//       { new: true }
//     );

//     res.json({
//       success: true,
//       message: "Income updated successfully",
//       updatedIncome
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Error updating income" });
//   }
// };

// ✅ Delete income (already JSON – kept same)
exports.deleteIncome = async (req, res) => {
  try {
    await Income.findByIdAndDelete(req.params.id);
    res.json({ message: "Income deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};




































// const Income = require("../models/Income");

// // Show income entries
// exports.showIncome = async (req, res) => {
//   try {
//     const incomes = await Income.find({ userId: req.session.userId }).sort({ date: -1 });

//     const now = new Date();
//     const monthlyIncome = incomes.filter(
//       i => i.date.getMonth() === now.getMonth() && i.date.getFullYear() === now.getFullYear()
//     );

//     const totalIncome = monthlyIncome.reduce((sum, i) => sum + i.amount, 0);

//     res.render("income", { incomes: monthlyIncome, totalIncome });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error fetching income");
//   }
// };



// // Show add income form
// exports.showAddIncomeForm = (req, res) => {
//   res.render("addIncome"); // create this EJS file similar to addExpense
// };

// // add income 
// exports.handleAddIncomeForm = async (req, res) => {
//   try {
//     await Income.create({
//       title: req.body.title,
//       amount: Number(req.body.amount),
//       category: req.body.category || "General",
//       date: new Date(),
//       userId: req.session.userId,
//     });
//     res.redirect("/dashboard"); // redirect to dashboard after adding
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error saving income");
//   }
// };

// //edit income form
// exports.showEditIncomeForm = async (req, res) => {
//   try {
//     const income = await Income.findById(req.params.id);
//     if (!income) return res.status(404).send("Income not found");

//     res.render("editIncome", { income });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error loading edit form");
//   }
// };

// // Update income
// exports.updateIncome = async (req, res) => {
//   try {
//     await Income.findByIdAndUpdate(req.params.id, {
//       title: req.body.title,
//       amount: req.body.amount,
//       category: req.body.category,
//       userId: req.session.userId,
//       date: req.body.date || Date.now(),
//     });

//     res.redirect("/dashboard");
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error updating income");
//   }
// };

// // Delete income
// exports.deleteIncome = async (req, res) => {
//   try {
//     await Income.findByIdAndDelete(req.params.id);
//     res.json({ message: "Income deleted successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// };
