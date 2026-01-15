const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  title: {
    type: String,
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  // AI detected category
  category: {
    type: String,
    default: "Other"
  },

  // How user paid
  paymentMode: {
    type: String,
    enum: ["Cash", "UPI", "Card", "NetBanking"],
    default: "UPI"
  },

  // Recurring expense (subscriptions)
  isRecurring: {
    type: Boolean,
    default: false
  },

  // AI confidence (0–100)
  aiConfidence: {
    type: Number,
    default: 0
  },

  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Expense", expenseSchema);
