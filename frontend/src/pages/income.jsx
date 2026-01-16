import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaBriefcase,
  FaMoneyBillWave,
  FaUniversity,
  FaGift,
  FaTag,
} from "react-icons/fa";

/* ---------- Time Ago Helper ---------- */
const timeAgo = (date) => {
  if (!date) return "—";
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);

  const intervals = [
    { label: "yr", value: 31536000 },
    { label: "mo", value: 2592000 },
    { label: "day", value: 86400 },
    { label: "hr", value: 3600 },
    { label: "min", value: 60 },
  ];

  for (const i of intervals) {
    const count = Math.floor(seconds / i.value);
    if (count >= 1) return `${count}${i.label} ago`;
  }
  return "Just now";
};

/* ---------- CATEGORY ICON ---------- */
const incomeIcon = (category) => {
  switch (category?.toLowerCase()) {
    case "salary":
      return <FaBriefcase className="text-success" />;
    case "business":
      return <FaMoneyBillWave className="text-green-600" />;
    case "investment":
      return <FaUniversity className="text-indigo-500" />;
    case "gift":
      return <FaGift className="text-pink-500" />;
    default:
      return <FaTag className="text-gray-400" />;
  }
};

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/income`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setIncomes(data.incomes || []))
      .catch(() => toast.error("Failed to load income data"));
  }, []);

  /* ---------- KPIs ---------- */
  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
  const highestIncome = Math.max(...incomes.map((i) => i.amount), 0);
  const incomeSources = new Set(incomes.map((i) => i.category)).size;

  /* ---------- DELETE ---------- */
  const deleteIncome = async (id) => {
    if (!window.confirm("Delete this income?")) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/income/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error(data.message || "Failed to delete income");
        return;
      }

      toast.success("Income deleted successfully");
      setIncomes((prev) => prev.filter((i) => i._id !== id));
    } catch {
      toast.error("Server error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-base-200 to-success/20 p-6">

      {/* ---------- HEADER ---------- */}
      <div className="max-w-6xl mx-auto mb-10 text-center">
        <h2 className="text-3xl font-bold text-success mb-2">
          Income Dashboard
        </h2>
        <p className="text-gray-500">
          Monitor your earnings and growth
        </p>
      </div>

      {/* ---------- SUMMARY ---------- */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="bg-base-100 rounded-2xl shadow p-6">
          <p className="text-sm text-gray-500">Total Income</p>
          <h3 className="text-2xl font-bold text-success">₹ {totalIncome}</h3>
        </div>

        <div className="bg-base-100 rounded-2xl shadow p-6">
          <p className="text-sm text-gray-500">This Month</p>
          <h3 className="text-2xl font-bold text-primary">₹ {totalIncome}</h3>
        </div>

        <div className="bg-base-100 rounded-2xl shadow p-6">
          <p className="text-sm text-gray-500">Income Sources</p>
          <h3 className="text-2xl font-bold text-info">{incomeSources}</h3>
        </div>

        <div className="bg-base-100 rounded-2xl shadow p-6">
          <p className="text-sm text-gray-500">Highest Income</p>
          <h3 className="text-2xl font-bold text-warning">₹ {highestIncome}</h3>
        </div>
      </div>

      {/* ---------- ADD BUTTON ---------- */}
      <div className="text-center mb-10">
        <button
          onClick={() => navigate("/income/add")}
          className="btn btn-success px-6 shadow-md hover:scale-105 transition"
        >
          Add New Income
        </button>
      </div>

      {/* ---------- LIST ---------- */}
      {incomes.length === 0 ? (
        <div className="max-w-md mx-auto bg-base-100 shadow rounded-xl p-6 text-center">
          No income records found
        </div>
      ) : (
        <div className="max-w-6xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {incomes.map((i) => (
            <div
              key={i._id}
              className="relative bg-base-100 rounded-2xl shadow-lg p-6
                         hover:shadow-xl hover:-translate-y-1 transition"
            >
              {/* TIME */}
              <div className="absolute top-3 right-3 text-xs text-gray-400">
                ⏱ {timeAgo(i.createdAt || i.date)}
              </div>

              {/* TITLE */}
              <h3 className="text-lg font-semibold flex items-center gap-2">
                {incomeIcon(i.category)}
                <span className="truncate">{i.title}</span>
              </h3>

              {/* AMOUNT */}
              <div className="text-2xl font-bold text-success my-2">
                ₹ {i.amount}
              </div>

              {/* CATEGORY */}
              <span className="inline-block text-xs px-2 py-1 rounded-full bg-success/10 text-success">
                {i.category}
              </span>

              <div className="text-xs text-gray-400 mt-2">
                {new Date(i.date).toDateString()}
              </div>

              {/* ACTIONS */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => navigate(`/income/edit/${i._id}`)}
                  className="btn btn-sm btn-outline btn-primary flex-1 hover:scale-105 transition"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteIncome(i._id)}
                  className="btn btn-sm btn-outline btn-error flex-1 hover:scale-105 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Income;
