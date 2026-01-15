import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

export default function AddIncome() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    paymentMode: "Cash", // optional
    date: new Date().toISOString().substr(0, 10), // default to today
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/income/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
    if (res.ok) {
            toast.success("income added ");
            navigate("/income");
          } else {
            toast.error(data.message || "Failed to add expense");
          }
        } catch (err) {
          console.error(err);
          toast.error("Server not responding");
        }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-base-200 to-secondary/20 p-6 flex justify-center items-start">
      <div className="bg-base-100 rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-success mb-6 text-center">💰 Add Income</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Income Title */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
              placeholder="Income Title"
              required
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Amount (₹)</label>
            <input
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
              placeholder="Amount"
              required
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
              required
            >
              <option value="">Select Category</option>
              <option>Salary</option>
              <option>Business</option>
              <option>Investment</option>
              <option>Freelance</option>
              <option>Gift</option>
              <option>Other</option>
            </select>
          </div>

        

         
          {/* Buttons */}
          <div className="flex gap-4 mt-4">
            <button
              type="submit"
              className="flex-1 btn btn-success px-4 py-2 font-medium hover:scale-105 transition"
            >
              Add Income
            </button>

            <button
              type="button"
              onClick={() => navigate("/income")}
              className="flex-1 btn btn-outline btn-primary px-4 py-2 font-medium hover:scale-105 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
