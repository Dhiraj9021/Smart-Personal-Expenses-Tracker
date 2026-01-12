import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: "" });
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
      const res = await fetch(`http://localhost:5000/dashboard`, {
        credentials: "include",
      });
      const data = await res.json();

      setUser(data.userId || { username: "User" });
      setSummary({
        totalIncome: data.totalIncome || 0,
        totalExpense: data.totalExpense || 0,
        remaining: data.remaining || 0,
      });
      setCategoryTotals(data.categoryTotals || {});
      setCategoryPercentages(data.categoryPercentages || {});
      setMonthlyIncome(data.monthlyIncome || []);
      setMonthlyExpenses(data.monthlyExpenses || []);
      setAiInsight(data.aiInsight || "");
    } catch (err) {
      console.error(err);
      alert("Failed to fetch dashboard data");
    }
  };

  const handleMonthChange = (e) => setSelectedMonth(e.target.value);
  const handleFilter = (e) => {
    e.preventDefault();
    fetchDashboardData(selectedMonth);
  };

  return (
    <div className="min-s-screen bg-gradient-to-br from-primary/20 via-base-200 to-secondary/20  px-3 sm:px-6 md:px-12 lg:px-40 sm:px-6 pt-10 pb-10 space-y-6">

      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "Total Income", amount: summary.totalIncome, color: "text-green-500", icon: "💰" },
          { title: "Total Expense", amount: summary.totalExpense, color: "text-red-500", icon: "💸" },
          { title: "Remaining Balance", amount: summary.remaining, color: "text-blue-500", icon: "⚖️" },
        ].map((card) => (
          <div
            key={card.title}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow hover:shadow-lg transition"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-gray-500">{card.title}</h3>
              <div className={`text-2xl ${card.color}`}>{card.icon}</div>
            </div>
            <div className={`text-3xl font-bold mt-4 ${card.color}`}>₹ {card.amount}</div>
            <p className="text-gray-400 mt-1">Trend info</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-10">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded-2xl hover:bg-green-600 transition"
          onClick={() => navigate("/income/add")}
        >
           Add Income
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded-2xl hover:bg-red-600 transition"
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
          className="bg-purple-500 text-white px-4 py-2 rounded-2xl over:bg-purple-600 transition"
          onClick={() => navigate("/expense")}
        >
          View Expenses
        </button>
      </div>

      {/* Category-wise Expenses */}
      <div>
        <h2 className="text-xl font-bold mb-6">Category-wise Expenses</h2>
        {Object.keys(categoryTotals).length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.keys(categoryTotals).map((cat) => (
              <div
                key={cat}
                className="bg-white/60 backdrop-blur-sm p-2 rounded-xl shadow hover:shadow-lg transition text-center"
              >
                <h4 className="font-semibold">{cat}</h4>
                <p className="text-red-500 font-bold">₹ {categoryTotals[cat]}</p>
                <p className="text-gray-400">{categoryPercentages[cat]}%</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No expenses this month</p>
        )}
      </div>

      {/* AI Insights */}
     <div className="bg-gradient-to-br from-blue-50 to-indigo-50 
                border-l-4 border-blue-500 
                p-6 rounded-2xl shadow-sm">

  <h3 className="text-lg font-semibold text-blue-700 mb-3 flex items-center gap-2">
    🤖 AI Financial Insights
  </h3>

  <div className="space-y-2 font-semibold text-gray-800">
    {aiInsight
      ?.split("\n")
      .filter(line => line.trim() !== "")
      .map((line, index) => (
        <p key={index} className="leading-relaxed">
          {line.startsWith("•") ? "👉 " + line.slice(1) : line}
        </p>
      ))}
  </div>

</div>


      {/* Recent Income & Expenses in Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Income */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow p-6 space-y-4">
          <h2 className="text-2xl font-bold mb-4">Recent Income</h2>
          {monthlyIncome.length === 0 ? (
            <p>No income added this month</p>
          ) : (
            monthlyIncome.slice(0, 5).map((inc, i) => (
              <div
                key={i}
                className="flex justify-between p-4 bg-primary/10 rounded-xl shadow hover:shadow-lg transition"
              >
                <div>
                  <div className="font-semibold text-gray-800">{inc.title}</div>
                  <div className="text-gray-500 text-sm flex gap-2">
                    <span>{inc.category}</span>
                    <span> {new Date(inc.date).toDateString()}</span>
                    {inc.paymentMethod && <span>💳 {inc.paymentMethod}</span>}
                  </div>
                </div>
                <div className="text-green-500 font-bold text-lg">+ ₹ {inc.amount}</div>
              </div>
            ))
          )}
            <button
          className=" text-base px-30 py-1 rounded-2xl  transition underline"
          onClick={() => navigate("/income")}
        >View all</button>
        </div>

        {/* Recent Expenses */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow p-6 space-y-4">
          <h2 className="text-2xl font-bold mb-4">Recent Expenses</h2>
          {monthlyExpenses.length === 0 ? (
            <p>No expenses added this month</p>
          ) : (
            monthlyExpenses.slice(0, 5).map((exp, i) => (
              <div
                key={i}
                className="flex justify-between p-4 bg-red-50 rounded-xl shadow hover:shadow-lg transition"
              >
                <div>
                  <div className="font-semibold text-gray-800">{exp.title}</div>
                  <div className="text-gray-500 text-sm flex gap-2">
                    <span>{exp.category}</span>
                    <span>{new Date(exp.date).toDateString()}</span>
                    {exp.paymentMethod && <span>💳 {exp.paymentMethod}</span>}
                  </div>
                </div>
                <div className="text-red-500 font-bold text-lg">- ₹ {exp.amount}</div>
              
              </div>
              
            ))
            
          )}
            <button
          className=" text-base px-30 py-1 rounded-2xl  transition underline"
          onClick={() => navigate("/expense")}
        >
          View all
        </button>
        </div>
      </div>
    </div>
  );
}
