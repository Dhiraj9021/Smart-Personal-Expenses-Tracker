import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FaShoppingCart,
  FaUtensils,
  FaBus,
  FaHeartbeat,
  FaTag,
  FaSyncAlt,
  FaFileInvoiceDollar
} from "react-icons/fa";

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
  const [category, setCategory] = useState("all");
  const [recurring, setRecurring] = useState("all");
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [monthExpense, setMonthExpense] = useState(0);

  const navigate = useNavigate();

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ category, recurring, month, year });
      const res = await fetch(`${import.meta.env.VITE_API_URL}/expense?${params}`, { credentials: "include" });
      const data = await res.json();
      setExpenses(data.expenses || []);
      setMonthExpense(data.monthExpense || 0);
    } catch (err) {
      toast.error("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
  const recurringCount = expenses.filter(e => e.isRecurring).length;
  const highestExpense = expenses.length > 0 ? Math.max(...expenses.map(e => e.amount)) : 0;

  const deleteExpense = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    const res = await fetch(`${import.meta.env.VITE_API_URL}/expense/${id}`, { method: "DELETE", credentials: "include" });
    if (res.ok) {
      toast.success("Expense deleted");
      setExpenses(expenses.filter(e => e._id !== id));
      fetchExpenses();
    } else toast.error("Failed to delete");
  };

  const categoryIcon = (category) => {
    switch (category?.toLowerCase()) {
      case "food & drinks": return <FaUtensils className="text-orange-500" />;
      case "shopping": return <FaShoppingCart className="text-pink-500" />;
      case "transport": return <FaBus className="text-blue-500" />;
      case "utilities": return <FaFileInvoiceDollar className="text-purple-500" />;
      case "health & fitness": return <FaHeartbeat className="text-yellow-500" />;
      default: return <FaTag className="text-gray-400" />;
    }
  };

  if (loading) return <div className="text-center mt-20">Loading expenses...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-base-200 to-secondary/20 p-6">

      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-10 text-center">
        <h2 className="text-3xl font-bold text-primary mb-2">Expense Dashboard</h2>
        <p className="text-gray-500">Track, analyze, and control your spending</p>
      </div>

      {/* FILTERS */}
      <div className="max-w-6xl mx-auto flex flex-wrap gap-3 mb-8 justify-center">
        <select className="select select-bordered" value={category} onChange={e => setCategory(e.target.value)}>
          <option value="all">All Categories</option>
          <option value="Food & Drinks">Food & Drinks</option>
          <option value="Shopping">Shopping</option>
          <option value="Transport">Transport</option>
          <option value="Utilities">Utilities</option>
          <option value="Health & Fitness">Health & Fitness</option>
        </select>

        <select className="select select-bordered" value={recurring} onChange={e => setRecurring(e.target.value)}>
          <option value="all">All</option>
          <option value="true">Recurring</option>
          <option value="false">Non-Recurring</option>
        </select>

        <input type="month" className="input input-bordered"
          value={`${year}-${String(month + 1).padStart(2, "0")}`}
          onChange={e => { const [y,m] = e.target.value.split("-"); setYear(y); setMonth(m-1); }}
        />

        <button onClick={fetchExpenses} className="btn btn-primary">Apply Filter</button>
      </div>

      {/* SUMMARY */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-base-100 rounded-2xl shadow p-6">
          <p className="text-sm text-gray-500">Total Expenses</p>
          <h3 className="text-2xl font-bold text-error">₹ {totalExpense}</h3>
        </div>
        <div className="bg-base-100 rounded-2xl shadow p-6">
          <p className="text-sm text-gray-500">Filtered Month</p>
          <h3 className="text-2xl font-bold text-primary">₹ {monthExpense}</h3>
        </div>
        <div className="bg-base-100 rounded-2xl shadow p-6">
          <p className="text-sm text-gray-500">Recurring</p>
          <h3 className="text-2xl font-bold text-info">{recurringCount}</h3>
        </div>
        <div className="bg-base-100 rounded-2xl shadow p-6">
          <p className="text-sm text-gray-500">Highest Expense</p>
          <h3 className="text-2xl font-bold text-warning">₹ {highestExpense}</h3>
        </div>
      </div>

      {/* ADD NEW */}
      <div className="text-center mb-10">
        <button onClick={() => navigate("/expense/add")} className="btn btn-primary px-6">Add New Expense</button>
      </div>

      {/* LIST */}
      {expenses.length === 0 ? (
        <div className="max-w-md mx-auto bg-base-100 shadow rounded-xl p-6 text-center">No expense records found</div>
      ) : (
        <div className="max-w-6xl mx-auto grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {expenses.map(e => (
            <div key={e._id} className="relative bg-base-100 rounded-2xl shadow-lg p-6 hover:shadow-xl hover:-translate-y-1 transition">
              <div className="absolute top-3 right-3 flex-col items-center gap-2 text-xs text-gray-400">
                {e.isRecurring && (
                  <span className="flex items-center gap-1 text-info font-medium">
                    <FaSyncAlt className="text-xs" /> Recurring
                  </span>
                )}
                <span>⏱ {timeAgo(e.createdAt || e.date)}</span>
              </div>
              <h3 className="text-lg font-semibold flex items-center gap-2">{categoryIcon(e.category)}<span className="truncate">{e.title}</span></h3>
              <div className="text-2xl font-bold text-error my-2">₹ {e.amount}</div>
              <div className="text-sm text-gray-500">Category: {e.category}</div>
              <div className="text-sm text-gray-500">Payment: {e.paymentMode}</div>
              <div className="text-xs text-gray-400 mt-2">{new Date(e.date).toDateString()}</div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => navigate(`/expense/edit/${e._id}`)} className="btn btn-sm btn-outline btn-primary flex-1">Edit</button>
                <button onClick={() => deleteExpense(e._id)} className="btn btn-sm btn-outline btn-error flex-1">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Expenses;
