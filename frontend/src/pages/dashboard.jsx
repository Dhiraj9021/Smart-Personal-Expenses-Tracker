import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaMoneyBillWave, FaWallet,FaMoneyCheck } from "react-icons/fa";
import { toast } from 'react-toastify';

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState({ username: "" });
  const [error, setError] = useState("");

  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    remaining: 0,
  });

  const [categoryTotals, setCategoryTotals] = useState({});
  const [categoryPercentages, setCategoryPercentages] = useState({});
  const [monthlyIncome, setMonthlyIncome] = useState([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState([]);
  const [aiInsight, setAiInsight] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    const now = new Date();
    const monthString =
      now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0");
    setSelectedMonth(monthString);
    fetchDashboardData(monthString);
  }, []);

  const fetchDashboardData = async (month) => {
    try {
      setError("");

      const res = await fetch(`${import.meta.env.VITE_API_URL}/dashboard`, {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to load dashboard");
      }

      setUser(data.userId || { username: "User" });

      const totalIncome = data.totalIncome || 0;
      const totalExpense = data.totalExpense || 0;

      setSummary({
        totalIncome,
        totalExpense,
        remaining: Math.max(totalIncome - totalExpense, 0), // ✅ no negative
      });

      setCategoryTotals(data.categoryTotals || {});
      setCategoryPercentages(data.categoryPercentages || {});
      setMonthlyIncome(data.monthlyIncome || []);
      setMonthlyExpenses(data.monthlyExpenses || []);
      setAiInsight(data.aiInsight || "");
    } catch (err) {
      toast.error(err);
     
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-base-200 to-secondary/20 px-3 sm:px-6 md:px-12 lg:px-40 pt-10 pb-10 space-y-6">

     

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "Total Income", amount: summary.totalIncome, color: "text-green-500", icon: <FaMoneyBillWave size={30} /> },
  { title: "Total Expense", amount: summary.totalExpense, color: "text-red-500", icon: <FaWallet size={30} /> },
  { title: "Remaining Balance", amount: summary.remaining, color: "text-blue-500", icon: <FaMoneyCheck size={30} /> },
        ].map((card) => (
          <div
            key={card.title}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow hover:shadow-lg transition"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-gray-500">{card.title}</h3>
              <div className={`text-2xl ${card.color}`}>{card.icon}</div>
            </div>
            <div className={`text-3xl font-bold mt-4 ${card.color}`}>
              ₹ {card.amount}
            </div>
          </div>
        ))}
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-2xl hover:bg-green-600 transition"
          onClick={() => navigate("/income/add")}
        >
          Add Income
        </button>

        <button
          disabled={summary.remaining <= 0}
          className={`px-4 py-2 rounded-2xl transition text-white
            ${summary.remaining <= 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-500 hover:bg-red-600"
            }`}
          onClick={() => navigate("/expense/add")}
        >
          Add Expense
        </button>

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-2xl hover:bg-blue-600 transition"
          onClick={() => navigate("/income")}
        >
          View Income
        </button>

        <button
          className="bg-purple-500 text-white px-4 py-2 rounded-2xl hover:bg-purple-600 transition"
          onClick={() => navigate("/expense")}
        >
          View Expenses
        </button>
      </div>

      {/* CATEGORY WISE */}
      <div className="md:col-span-2">
          <h2 className="text-lg sm:text-xl font-bold mb-4">Category Summary</h2>
          {Object.keys(categoryTotals).length ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {Object.keys(categoryTotals).map((cat) => (
                <div
                  key={cat}
                  className="bg-white/60 backdrop-blur-sm p-3 rounded-xl shadow text-center"
                >
                  <h4 className="font-semibold text-sm sm:text-base">{cat}</h4>
                  <p className="text-red-500 font-bold text-sm sm:text-base">₹ {categoryTotals[cat]}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No expenses this month</p>
          )}
        </div>

      {/* AI INSIGHTS */}
      {aiInsight && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-semibold text-blue-700 mb-3">
            🤖 AI Financial Insights
          </h3>

          {aiInsight
            .split("\n")
            .filter(Boolean)
            .map((line, i) => (
              <p key={i} className="font-semibold text-gray-800">
                {line}
              </p>
            ))}
        </div>
      )}

      {/* RECENT LISTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* INCOME */}
        <div className="bg-white/80 rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Recent Income</h2>
          {monthlyIncome.length === 0
            ? <p>No income added</p>
            : monthlyIncome.slice(0, 5).map((inc, i) => (
                <div key={i} className="flex justify-between p-3 bg-primary/10 rounded-xl mb-2">
                  <span>{inc.title}</span>
                  <span className="text-green-500 font-bold">+ ₹ {inc.amount}</span>
                </div>
              ))}
                  <button
          className="bg-green-400 text-white ml-50 px-5 py-2 rounded-2xl hover:bg-green-600 transition"
          onClick={() => navigate("/income")}
        >
          View All
        </button>
        </div>

        {/* EXPENSE */}
        <div className="bg-white/80 rounded-2xl shadow p-6">
          <h2 className="text-2xl font-bold mb-4">Recent Expenses</h2>
          {monthlyExpenses.length === 0
            ? <p>No expenses added</p>
            : monthlyExpenses.slice(0, 5).map((exp, i) => (
                <div key={i} className="flex justify-between p-3 bg-red-50 rounded-xl mb-2">
                  <span>{exp.title}</span>
                  <span className="text-red-500 font-bold">- ₹ {Math.abs(exp.amount)}</span>
                  
                </div>
              ))}
               <button
          className="bg-red-400 text-white ml-50 px-5 py-2 rounded-2xl hover:bg-green-600 transition"
          onClick={() => navigate("/expense")}
        >
          View All
        </button>
        </div>
      </div>
    </div>
  );
}
