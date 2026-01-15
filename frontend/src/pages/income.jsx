import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
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

const Income = () => {
  const [incomes, setIncomes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/income", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setIncomes(data.incomes || []))
      .catch(() => toast.error("Failed to load income data"));
  }, []);

  /* ---------- FINANCIAL KPIs ---------- */
  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
  const highestIncome = Math.max(...incomes.map((i) => i.amount), 0);
  const incomeSources = new Set(incomes.map((i) => i.category)).size;

  const deleteIncome = async (id) => {
  if (!window.confirm("Delete this income?")) return;

  try {
    const res = await fetch(`http://localhost:5000/income/${id}`, {
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
  } catch (err) {
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

      {/* ---------- SUMMARY CARDS ---------- */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">

        <div className="bg-base-100 rounded-2xl shadow p-6">
          <p className="text-sm text-gray-500">Total Income</p>
          <h3 className="text-2xl font-bold text-success mt-1">
            ₹ {totalIncome}
          </h3>
        </div>

        <div className="bg-base-100 rounded-2xl shadow p-6">
          <p className="text-sm text-gray-500">This Month</p>
          <h3 className="text-2xl font-bold text-primary mt-1">
            ₹ {totalIncome}
          </h3>
        </div>

        <div className="bg-base-100 rounded-2xl shadow p-6">
          <p className="text-sm text-gray-500">Income Sources</p>
          <h3 className="text-2xl font-bold text-info mt-1">
            {incomeSources}
          </h3>
        </div>

        <div className="bg-base-100 rounded-2xl shadow p-6">
          <p className="text-sm text-gray-500">Highest Income</p>
          <h3 className="text-2xl font-bold text-warning mt-1">
            ₹ {highestIncome}
          </h3>
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

      {/* ---------- EMPTY STATE ---------- */}
      {incomes.length === 0 ? (
        <div className="max-w-md mx-auto bg-base-100 shadow-lg rounded-xl p-6 text-center">
          <p className="text-gray-500">No income records found</p>
        </div>
      ) : (
        /* ---------- INCOME CARDS ---------- */
        <div className="max-w-6xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {incomes.map((i) => (
            <div
              key={i._id}
              className="relative bg-base-100 rounded-2xl shadow-lg p-6
                         hover:shadow-xl hover:-translate-y-1 transition"
            >
              {/* TIME BADGE */}
              <span className="absolute top-3 right-3 text-xs font-semibold
                               bg-success/15 text-success px-3 py-1 rounded-full">
                ⏱ {timeAgo(i.createdAt || i.date)}
              </span>

              {/* TITLE */}
              <h3 className="text-lg font-semibold mb-1">
                {i.title}
              </h3>

              {/* AMOUNT */}
              <div className="text-2xl font-bold text-success mb-3">
                ₹ {i.amount}
              </div>

              {/* META */}
              <p className="text-sm text-gray-500">
                Category: {i.category}
              </p>

              <p className="text-xs text-gray-400 mb-4">
                {new Date(i.date).toDateString()}
              </p>

              {/* ACTIONS */}
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/income/edit/${i._id}`)}
                  className="btn btn-sm btn-outline btn-primary flex-1"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteIncome(i._id)}
                  className="btn btn-sm btn-outline btn-error flex-1"
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
