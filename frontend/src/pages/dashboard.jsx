import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaMoneyBillWave, FaWallet, FaMoneyCheck,FaRobot } from "react-icons/fa";
import { toast } from "react-toastify";

export default function Dashboard() {
  const navigate = useNavigate();

   const [user, setUser] = useState(() =>
  localStorage.getItem("username")
);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    remaining: 0,
  });

  const [categoryTotals, setCategoryTotals] = useState({});
  const [monthlyIncome, setMonthlyIncome] = useState([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState([]);
  const [aiInsight, setAiInsight] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/dashboard`, {
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to load dashboard");
        return;
      }

      setUser(data.userId || { username: "User" });

      const totalIncome = data.totalIncome || 0;
      const totalExpense = data.totalExpense || 0;

      setSummary({
        totalIncome,
        totalExpense,
        remaining: Math.max(totalIncome - totalExpense, 0),
      });

      setCategoryTotals(data.categoryTotals || {});
      setMonthlyIncome(data.monthlyIncome || []);
      setMonthlyExpenses(data.monthlyExpenses || []);
      setAiInsight(data.aiInsight || "");
    } catch (err) {
      toast.error("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-base-200 to-secondary/20 dark:from-base-300 dark:via-base-200 dark:to-base-300 px-4 sm:px-8 lg:px-40 py-10 space-y-6">

      {/* SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <h6 className="text-2xl font-bold col-span-full text-center text-base-content mb-1">
          Current month Summary
        </h6>
        {[
          { title: "Total Income", amount: summary.totalIncome, color: "text-green-500", icon: <FaMoneyBillWave size={30} /> },
          { title: "Total Expense", amount: summary.totalExpense, color: "text-red-500", icon: <FaWallet size={30} /> },
          { title: "Remaining Balance", amount: summary.remaining, color: "text-blue-500", icon: <FaMoneyCheck size={30} /> },
        ].map((card) => (
          <div
            key={card.title}
            className="bg-base-100/80 dark:bg-base-200 backdrop-blur rounded-2xl p-6 shadow hover:shadow-lg transition"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-base-content opacity-70">{card.title}</h3>
              <div className={card.color}>{card.icon}</div>
            </div>
            <div className={`text-3xl font-bold mt-4 ${card.color}`}>
              ₹ {card.amount}
            </div>
          </div>
        ))}
      </div>

      {/* ACTIONS */}
      <div className="grid grid-cols-4 sm:grid-cols-4 gap-2 rounded-4xl ">
        <button className="btn btn-success sm:p-6" onClick={() => navigate("/income/add")}>Add Income</button>
        <button className="btn btn-error sm:p-6" disabled={summary.remaining <= 0} onClick={() => navigate("/expense/add")}>Add Expense</button>
        <button className="btn btn-info sm:p-6" onClick={() => navigate("/income")}>View Income</button>
        <button className="btn btn-secondary sm:p-6" onClick={() => navigate("/expense")}>View Expenses</button>
      </div>

      {/* CATEGORY SUMMARY */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-base-content">Category Summary</h2>
        {Object.keys(categoryTotals).length ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {Object.keys(categoryTotals).map((cat) => (
              <div
                key={cat}
                className="bg-base-100/70 dark:bg-base-200 p-3 rounded-xl shadow text-center"
              >
                <h4 className="font-semibold text-base-content">{cat}</h4>
                <p className="text-red-500 font-bold">₹ {categoryTotals[cat]}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-base-content opacity-60">No expenses this month</p>
        )}
      </div>

      {/* AI INSIGHTS */}
      {aiInsight && (
        <div className="bg-base-100 bg-blue-100 dark:bg-base-200 border-l-4 border-blue-500 p-6 rounded-2xl shadow">
          
            <div className="flex items-center gap-2   text-xl font-bold text-blue-600">
      <FaRobot size={24} />
       AI Insights
    </div>
          {aiInsight.split("\n").filter(Boolean).map((line, i) => (
            <p key={i} className="text-base-content">{line}</p>
          ))}
        </div>
      )}

      {/* RECENT LISTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* INCOME */}
        <div className="bg-base-100 dark:bg-base-200 rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Recent Income</h2>
          {monthlyIncome.length === 0 ? (
            <p>No income added</p>
          ) : (
            monthlyIncome.slice(0, 5).map((inc, i) => (
              <div key={i} className="flex justify-between p-3 bg-success/10 rounded-xl mb-2">
                <span>{inc.title}</span>
                <span className="text-green-500 font-bold">+ ₹ {inc.amount}</span>
              </div>
            ))
          )}
          <button className="btn btn-success mt-3" onClick={() => navigate("/income")}>View All</button>
        </div>

        {/* EXPENSE */}
        <div className="bg-base-100 dark:bg-base-200 rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Recent Expenses</h2>
          {monthlyExpenses.length === 0 ? (
            <p>No expenses added</p>
          ) : (
            monthlyExpenses.slice(0, 5).map((exp, i) => (
              <div key={i} className="flex justify-between p-3 bg-error/10 rounded-xl mb-2">
                <span>{exp.title}</span>
                <span className="text-red-500 font-bold">- ₹ {Math.abs(exp.amount)}</span>
              </div>
            ))
          )}
          <button className="btn btn-error mt-3" onClick={() => navigate("/expense")}>View All</button>
        </div>
      </div>
    </div>
  );
}
