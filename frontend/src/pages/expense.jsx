import { useEffect, useState } from "react";
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

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/expense", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setExpenses(data.expenses || []);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Failed to load expenses");
        setLoading(false);
      });
  }, []);

  /* ---------- CURRENT MONTH FILTER ---------- */
  const now = new Date();
  const monthExpenses = expenses.filter(
    (e) =>
      new Date(e.date).getMonth() === now.getMonth() &&
      new Date(e.date).getFullYear() === now.getFullYear()
  );

  /* ---------- KPIs ---------- */
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const monthExpense = monthExpenses.reduce((sum, e) => sum + e.amount, 0);
  const recurringCount = expenses.filter((e) => e.isRecurring).length;
  const highestExpense =
    expenses.length > 0
      ? Math.max(...expenses.map((e) => e.amount))
      : 0;

  /* ---------- DELETE ---------- */
  const deleteExpense = async (id) => {
    if (!window.confirm("Delete this expense?")) return;

    const res = await fetch(`http://localhost:5000/expense/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.ok) {
      toast.success("Expense is Deleted");
    }else{
      toast.error("Failed to delete expense");
      return;
    }

    setExpenses(expenses.filter((e) => e._id !== id));
  };

  if (loading) {
    return <div className="text-center mt-20">Loading expenses...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-base-200 to-secondary/20 p-6">

      {/* ---------- HEADER ---------- */}
      <div className="max-w-6xl mx-auto mb-10 text-center">
        <h2 className="text-3xl font-bold text-primary mb-2">
          Expense Dashboard
        </h2>
        <p className="text-gray-500">
          Track, analyze, and control your spending
        </p>
      </div>

      {/* ---------- SUMMARY ---------- */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">

        <div className="bg-base-100 rounded-2xl shadow p-6">
          <p className="text-sm text-gray-500">Total Expenses</p>
          <h3 className="text-2xl font-bold text-error">₹ {totalExpense}</h3>
        </div>

        <div className="bg-base-100 rounded-2xl shadow p-6">
          <p className="text-sm text-gray-500">This Month</p>
          <h3 className="text-2xl font-bold text-primary">₹ {monthExpense}</h3>
        </div>

        <div className="bg-base-100 rounded-2xl shadow p-6">
          <p className="text-sm text-gray-500">Recurring</p>
          <h3 className="text-2xl font-bold text-info">{recurringCount}</h3>
        </div>

        <div className="bg-base-100 rounded-2xl shadow p-6">
          <p className="text-sm text-gray-500">Highest Expense</p>
          <h3 className="text-2xl font-bold text-warning">
            ₹ {highestExpense}
          </h3>
        </div>

      </div>

      {/* ---------- ADD ---------- */}
      <div className="text-center mb-10">
        <button
          onClick={() => navigate("/expense/add")}
          className="btn btn-primary px-6"
        >
          Add New Expense
        </button>
      </div>

      {/* ---------- LIST ---------- */}
      {expenses.length === 0 ? (
        <div className="max-w-md mx-auto bg-base-100 shadow rounded-xl p-6 text-center">
          No expense records found
        </div>
      ) : (
        <div className="max-w-6xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {expenses.map((e) => (
            <div
              key={e._id}
              className="relative bg-base-100 rounded-2xl shadow-lg p-6
                         hover:shadow-xl hover:-translate-y-1 transition"
            >
              {/* TAG */}
              <div className="absolute top-3 right-3 text-xs text-gray-400">
                ⏱ {timeAgo(e.createdAt || e.date)}
              </div>

              <h3 className="text-lg font-semibold">{e.title}</h3>

              <div className="text-2xl font-bold text-error my-2">
                ₹ {e.amount}
              </div>

              <div className="text-sm text-gray-500">
                Category: {e.category}
              </div>

              <div className="text-sm text-gray-500">
                Payment: {e.paymentMode}
              </div>

              <div className="text-xs text-gray-400 mt-2">
                {new Date(e.date).toDateString()}
              </div>

              <div className="flex gap-2 mt-4">
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
