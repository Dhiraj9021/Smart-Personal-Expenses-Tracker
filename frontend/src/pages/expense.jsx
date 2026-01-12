import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/expense", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setExpenses(data.expenses || []))
      .catch(() => alert("Failed to load expenses"));
  }, []);

  /* ---------- Calculations (Financial KPIs) ---------- */
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const recurringCount = expenses.filter((e) => e.isRecurring).length;
  const highestExpense = Math.max(...expenses.map((e) => e.amount), 0);

  const deleteExpense = async (id) => {
    if (!window.confirm("Delete this expense?")) return;

    await fetch(`http://localhost:5000/expense/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    setExpenses(expenses.filter((e) => e._id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-base-200 to-secondary/20 p-6">

      {/* ---------- PAGE HEADER ---------- */}
      <div className="max-w-6xl mx-auto mb-10 text-center">
        <h2 className="text-3xl font-bold text-primary mb-2">
          💸 Expense Dashboard
        </h2>
        <p className="text-gray-500">
          Track, analyze, and control your spending
        </p>
      </div>

      {/* ---------- SUMMARY CARDS (FINANCIAL STYLE) ---------- */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

        <div className="bg-base-100 rounded-2xl shadow p-6">
          <p className="text-sm text-gray-500">Total Expenses</p>
          <h3 className="text-2xl font-bold text-error mt-1">
            ₹ {totalExpense}
          </h3>
        </div>

        <div className="bg-base-100 rounded-2xl shadow p-6">
          <p className="text-sm text-gray-500">This Month</p>
          <h3 className="text-2xl font-bold text-primary mt-1">
            ₹ {totalExpense}
          </h3>
        </div>

        <div className="bg-base-100 rounded-2xl shadow p-6">
          <p className="text-sm text-gray-500">Recurring Expenses</p>
          <h3 className="text-2xl font-bold text-info mt-1">
            {recurringCount}
          </h3>
        </div>

        <div className="bg-base-100 rounded-2xl shadow p-6">
          <p className="text-sm text-gray-500">Highest Expense</p>
          <h3 className="text-2xl font-bold text-warning mt-1">
            ₹ {highestExpense}
          </h3>
        </div>

      </div>

      {/* ---------- ADD BUTTON ---------- */}
      <div className="text-center mb-10">
        <button
          onClick={() => navigate("/expense/add")}
          className="btn btn-primary px-6"
        >
           Add New Expense
        </button>
      </div>

      {/* ---------- EMPTY STATE ---------- */}
      {expenses.length === 0 ? (
        <div className="max-w-md mx-auto bg-base-100 shadow-lg rounded-xl p-6 text-center">
          <p className="text-gray-500">No expense records found</p>
        </div>
      ) : (
        /* ---------- EXPENSE CARDS ---------- */
        <div className="max-w-6xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {expenses.map((e) => (
            <div
              key={e._id}
              className="relative bg-base-100 rounded-2xl shadow-lg p-6
                         hover:shadow-xl hover:-translate-y-1 transition"
            >
              {/* STATUS + TIME */}
              <div className="absolute top-3 right-3 text-right">
                <span
                  className={`text-xs px-3 py-1 rounded-full font-semibold
                  ${
                    e.isRecurring
                      ? "bg-info/15 text-info"
                      : "bg-base-200 text-gray-500"
                  }`}
                >
                  {e.isRecurring ? "🔁 Recurring" : "One-Time"}
                </span>

                <div className="text-[11px] text-gray-400 mt-1">
                  ⏱ {timeAgo(e.createdAt || e.date)}
                </div>
              </div>

              {/* TITLE */}
              <h3 className="text-lg font-semibold mb-1">
                {e.title}
              </h3>

              {/* AMOUNT (MOST IMPORTANT) */}
              <div className="text-2xl font-bold text-error mb-3">
                ₹ {e.amount}
              </div>

              {/* META INFO */}
              <div className="text-sm text-gray-500">
                Category: {e.category}
              </div>

              <div className="text-sm text-gray-500 mb-4">
                Payment: {e.paymentMode}
              </div>

              <div className="text-xs text-gray-400 mb-5">
                {new Date(e.date).toDateString()}
              </div>

              {/* ACTION BUTTONS (SAME AS INCOME) */}
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/expense/edit/${e._id}`)}
                  className="btn btn-sm btn-outline btn-primary flex-1"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteExpense(e._id)}
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

export default Expenses;
