require("dotenv").config(); // Make sure path points to backend/.env
const mongoose = require("mongoose");
const data = require("./data.js");
const Expense = require("../models/Expense.js");

const MONGO_URL ="mongodb://localhost:27017/Expense-Tracker";

// 1️⃣ Connect to MongoDB and initialize DB
main()
  .then(()=>{
    console.log("Connected to MongoDB");
  }).catch((err)=>{
    console.error(err);
  });

async function main(){
    await mongoose.connect(MONGO_URL);
};

// 2️⃣ Function to clear and insert sample data
const initDB = async () => {
  await Expense.deleteMany({});
  console.log("Old expenses cleared");

  await Expense.insertMany(data.expenses);
  console.log("Sample expenses saved to database ✅");
};

// 3️⃣ Run everything
initDB();
