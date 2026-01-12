const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { generateAISummary } = require("../services/aiservices");

exports.showDashboard= async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ success: false, message: "Not logged in" });
    }

    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    // 1️⃣ Monthly Income
    const monthlyIncome = await Income.find({
      userId: req.session.userId,
      date: {
        $gte: new Date(year, month, 1),
        $lt: new Date(year, month + 1, 1),
      },
    }).sort({ date: -1 });

    const totalIncome = monthlyIncome.reduce((sum, inc) => sum + inc.amount, 0);

    // 2️⃣ Monthly Expenses
    const monthlyExpenses = await Expense.find({
      userId: req.session.userId,
      date: {
        $gte: new Date(year, month, 1),
        $lt: new Date(year, month + 1, 1),
      },
    }).sort({ date: -1 });

    const totalExpense = monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    const remaining = totalIncome - totalExpense;

    // 3️⃣ Category totals & percentages
    const categoryTotals = {};
    const categoryPercentages = {};
    const overspendAlerts = [];

    monthlyExpenses.forEach((exp) => {
      const cat = exp.category || "Other";
      categoryTotals[cat] = (categoryTotals[cat] || 0) + exp.amount;
    });

    for (let cat in categoryTotals) {
      const percent = totalIncome > 0
        ? ((categoryTotals[cat] / totalIncome) * 100).toFixed(2)
        : 0;

      categoryPercentages[cat] = percent;

      if (percent > 30) {
        overspendAlerts.push(`You are overspending on ${cat} (${percent}%)`);
      }
    }

    // 4️⃣ AI Insight
    let aiInsight = "AI insight is currently unavailable.";

try {
  aiInsight = await generateAISummary({
    totalIncome,
    totalExpense,
    remaining,
    categoryTotals,
  });
} catch (aiErr) {
  console.error("Groq AI Error:", aiErr.message);
    }

    // ✅ Send JSON for React
    res.json({
      success: true,
      username: req.session.username,
      monthlyIncome,
      monthlyExpenses,
      totalIncome,
      totalExpense,
      remaining,
      categoryTotals,
      categoryPercentages,
      overspendAlerts,
      aiInsight,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error loading dashboard" });
  }
};






















// const Income = require("../models/Income");
// const Expense = require("../models/Expense");
// // const { generateAISummary } = require("../services/aiservices"); // optional

// exports.showDashboard = async (req, res) => {
//   try {
//     const now = new Date();
//     const month = now.getMonth();
//     const year = now.getFullYear();

//     // 1️⃣ Monthly Income
//     const monthlyIncome = await Income.find({
//       userId: req.session.userId,
//       date: {
//         $gte: new Date(year, month, 1),
//         $lt: new Date(year, month + 1, 1),
//       },
//     }).sort({ date: -1 });

//     const totalIncome = monthlyIncome.reduce(
//       (sum, inc) => sum + inc.amount,
//       0
//     );

//     // 2️⃣ Monthly Expenses
//     const monthlyExpenses = await Expense.find({
//       userId: req.session.userId, 
//       date: {
//         $gte: new Date(year, month, 1),
//         $lt: new Date(year, month + 1, 1),
//       },
//     }).sort({ date: -1 });

//     const totalExpense = monthlyExpenses.reduce(
//       (sum, exp) => sum + exp.amount,
//       0
//     );

//     const remaining = totalIncome - totalExpense;

//     // 3️⃣ Category totals
//     const categoryTotals = {};
//     const categoryPercentages = {};
//     const overspendAlerts = [];

//     monthlyExpenses.forEach((exp) => {
//       const cat = exp.category || "Other";
//       categoryTotals[cat] = (categoryTotals[cat] || 0) + exp.amount;
//     });

//     // 4️⃣ Percentages + overspend logic
//     for (let cat in categoryTotals) {
//       const percent =
//         totalIncome > 0
//           ? ((categoryTotals[cat] / totalIncome) * 100).toFixed(2)
//           : 0;

//       categoryPercentages[cat] = percent;

//       if (percent > 30) {
//         overspendAlerts.push(
//           `You are overspending on ${cat} (${percent}%)`
//         );
//       }
//     }

//     // 5️⃣ AI Insight (safe, no crash)
//     let aiInsight = "Your spending looks balanced this month.";

//     if (overspendAlerts.length > 0) {
//       aiInsight =
//         "AI Insight: " +
//         overspendAlerts.join(". ") +
//         ". Consider reducing expenses in these categories.";
//     }

//     // Optional real AI (enable later safely)
//     /*
//     try {
//       aiInsight = await generateAISummary({
//         totalIncome,
//         totalExpense,
//         remaining,
//         categoryTotals,
//       });
//     } catch (aiErr) {
//       console.error("AI error:", aiErr.message);
//     }
//     */

//     res.render("dashboard", {
//        userId: {
//     username: req.session.username
//   },
//       monthlyIncome,
//       totalIncome,
//       monthlyExpenses,
//       totalExpense,
//       remaining,
//       categoryTotals,
//       categoryPercentages,
//       overspendAlerts,
//       aiInsight,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Error loading dashboard");
//   }
// };
