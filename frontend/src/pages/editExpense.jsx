import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function EditExpense() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/expense/${id}`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        if (!data.success) throw new Error();
        setExpense(data.expense);
      })
      .catch(() => alert("Failed to load expense"))
      .finally(() => setLoading(false));
  }, [id]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/expense/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(expense),
      });
      const data = await res.json();
      if (data.success) {
        alert("Expense updated successfully!");
        navigate("/expense");
      } else {
        alert(data.message || "Update failed");
      }
    } catch {
      alert("Server error");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!expense) return <p className="text-center mt-10 text-red-500">Expense not found</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-error/20 via-base-200 to-primary/20 p-6 flex justify-center items-start">
      <div className="bg-base-100 rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-error mb-6 text-center">Edit Expense</h2>

        <form onSubmit={submitHandler} className="space-y-4">

          {/* Title */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Title</label>
            <input
              type="text"
              value={expense.title}
              onChange={e => setExpense({ ...expense, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-error"
              required
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Amount (₹)</label>
            <input
              type="number"
              value={expense.amount}
              onChange={e => setExpense({ ...expense, amount: Number(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-error"
              required
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Category</label>
            <select
              value={expense.category || ""}
              onChange={e => setExpense({ ...expense, category: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-error"
              required
            >
              <option value="">Select Category</option>
              <option>Food & Drinks</option>
              <option>Groceries</option>
              <option>Shopping</option>
              <option>Transport</option>
              <option>Entertainment</option>
              <option>Utilities</option>
              <option>Health & Fitness</option>
              <option>Others</option>
            </select>
          </div>

          {/* Payment Mode Dropdown */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Payment Mode</label>
            <select
              value={expense.paymentMode || ""}
              onChange={e => setExpense({ ...expense, paymentMode: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-error"
              required
            >
              <option value="">Select Payment Mode</option>
              <option>Cash</option>
              <option>UPI</option>
              <option>Card</option>
              <option>NetBanking</option>
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Date</label>
            <input
              type="date"
              value={expense.date ? new Date(expense.date).toISOString().substr(0, 10) : ""}
              onChange={e => setExpense({ ...expense, date: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-error"
              required
            />
          </div>

        

          {/* Buttons */}
          <div className="flex gap-4 mt-4">
            <button
              type="submit"
              className="flex-1 btn btn-error px-4 py-2 font-medium hover:scale-105 transition"
            >
              Update
            </button>

            <button
              type="button"
              onClick={() => navigate("/expense")}
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
