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
        const res = await fetch(`${import.meta.env.VITE_API_URL}/dashboard`, {
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
  <div className="min-h-screen bg-gradient-to-br 
    from-primary/10 via-base-200 to-secondary/10 
    dark:from-base-300 dark:via-base-200 dark:to-base-300
    p-4 sm:p-6">

    <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-base-content">
      Financial Analytics
    </h1>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">

      {/* INCOME VS EXPENSE PIE */}
      <div className="bg-base-100 dark:bg-base-200 p-6 rounded-2xl shadow-md text-base-content">
        <h2 className="font-semibold mb-4 text-lg">Income vs Expense</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={incomeExpenseData}
              dataKey="value"
              nameKey="name"
              outerRadius={80}
              label
            >
              {incomeExpenseData.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Tooltip formatter={(v) => `₹ ${v}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* CATEGORY PIE */}
      <div className="bg-base-100 dark:bg-base-200 p-6 rounded-2xl shadow-md text-base-content">
        <h2 className="font-semibold mb-4 text-lg">Category-wise Expenses</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={categoryData}
              dataKey="value"
              nameKey="name"
              innerRadius={40}
              outerRadius={80}
              label
            >
              {categoryData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(v) => `₹ ${v}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* CATEGORY GRID */}
      <div className="md:col-span-2">
        <h2 className="text-lg font-bold mb-4 text-base-content">
          Category Summary
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {Object.keys(categoryTotals).map((cat) => (
            <div
              key={cat}
              className="bg-base-100 dark:bg-base-200 p-3 rounded-xl shadow text-center"
            >
              <h4 className="font-semibold">{cat}</h4>
              <p className="text-error font-bold">₹ {categoryTotals[cat]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* MONTHLY BAR CHART */}
      <div className="md:col-span-2 bg-base-100 dark:bg-base-200 p-6 rounded-2xl shadow-md text-base-content">
        <h2 className="font-semibold mb-4 text-lg">Monthly Income vs Expense</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(v) => `₹ ${v}`} />
            <Legend />
            <Bar dataKey="income" fill="#22c55e" />
            <Bar dataKey="expense" fill="#ef4444" />
            <Bar dataKey="recurring" fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  </div>
);
}