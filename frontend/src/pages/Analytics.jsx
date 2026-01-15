import { toast } from 'react-toastify';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";

const COLORS = ["#22c55e", "#ef4444", "#6366f1", "#f59e0b", "#14b8a6", "#f43f5e", "#10b981"];

export default function Analytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:5000/dashboard", {
          credentials: "include",
        });
        const result = await res.json();
        setData(result);
      } catch (err) {
        toast.error(err);
      }
    };
    fetchData();
  }, []);

  if (!data) return <p className="text-center mt-10">Loading analytics...</p>;

  // ===== TRANSFORM DATA =====
  const incomeExpenseData = [
    { name: "Income", value: data.totalIncome },
    { name: "Expense", value: data.totalExpense },
  ];

  const categoryData = Object.keys(data.categoryTotals || {}).map((key) => ({
    name: key,
    value: data.categoryTotals[key],
  }));

  const monthlyData = data.monthlyIncome.map((inc, i) => ({
    month: inc.month,
    income: inc.amount,
    expense: data.monthlyExpenses[i]?.amount || 0,
    recurring: data.monthlyExpenses[i]?.recurring || 0,
    savings: inc.amount - (data.monthlyExpenses[i]?.amount || 0),
  }));

  const categoryTotals = data.categoryTotals || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10 p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8">Financial Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">

        {/* INCOME VS EXPENSE PIE */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow hover:shadow-lg transition">
          <h2 className="font-semibold mb-4 text-lg sm:text-xl">Income vs Expense</h2>
          {data.totalIncome === 0 && data.totalExpense === 0 ? (
            <p className="text-center text-gray-400">No data available</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={incomeExpenseData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {incomeExpenseData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `₹ ${v}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* CATEGORY PIE */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow hover:shadow-lg transition">
          <h2 className="font-semibold mb-4 text-lg sm:text-xl">Category-wise Expenses</h2>
          {categoryData.length === 0 ? (
            <p className="text-center text-gray-400">No expense data</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={40}
                  outerRadius={80}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `₹ ${v}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* CATEGORY GRID */}
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

        {/* MONTHLY INCOME VS EXPENSE */}
        <div className="md:col-span-2 bg-white p-4 sm:p-6 rounded-2xl shadow hover:shadow-lg transition">
          <h2 className="font-semibold mb-4 text-lg sm:text-xl">Monthly Income vs Expense</h2>
          {monthlyData.length === 0 ? (
            <p className="text-center text-gray-400">No monthly records</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData} margin={{ top: 5, right: 15, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(v) => `₹ ${v}`} />
                <Legend />
                <Bar dataKey="income" fill="#22c55e" name="Income" />
                <Bar dataKey="expense" fill="#ef4444" name="Expense" />
                <Bar dataKey="recurring" fill="#f59e0b" name="Recurring" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
