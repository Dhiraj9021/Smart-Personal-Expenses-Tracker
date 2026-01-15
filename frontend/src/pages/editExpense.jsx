import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';

export default function EditExpense() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);


  /* ================= FETCH EXPENSE ================= */
  useEffect(() => {
    fetch(`http://localhost:5000/expense/${id}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.success) throw new Error(data.message);
        setExpense(data.expense);
      })
      .catch((err) => {
        toast.error(err.message || "Failed to load expense");
      })
      .finally(() => setLoading(false));
  }, [id]);

  /* ================= SUBMIT ================= */
  const submitHandler = async (e) => {
  e.preventDefault();
  setSaving(true);

  try {
    const res = await fetch(`http://localhost:5000/expense/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(expense),
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      toast.error(data.message || "Update failed");
      return;
    }

    toast.success("Expense updated successfully");
    navigate("/expense");
  } catch (err) {
    toast.error(err.message || "Server error");
  } finally {
    setSaving(false);
  }
};


  /* ================= STATES ================= */
  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (!expense) {
    return (
      <p className="text-center mt-10 text-red-500">
        Expense not found
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-error/20 via-base-200 to-primary/20 p-6 flex justify-center">
      <div className="bg-base-100 rounded-2xl shadow-lg p-8 w-full max-w-md">

        <h2 className="text-2xl font-bold text-error mb-4 text-center">
          Edit Expense
        </h2>

     
        <form onSubmit={submitHandler} className="space-y-4">

          {/* TITLE */}
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={expense.title}
              onChange={(e) =>
                setExpense({ ...expense, title: e.target.value })
              }
              className="w-full input input-bordered"
              required
            />
          </div>

          {/* AMOUNT */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Amount (₹)
            </label>
            <input
              type="number"
              min="1"
              value={expense.amount}
              onChange={(e) =>
                setExpense({
                  ...expense,
                  amount: Number(e.target.value),
                })
              }
              className="w-full input input-bordered"
              required
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Category
            </label>
            <select
              value={expense.category || ""}
              onChange={(e) =>
                setExpense({ ...expense, category: e.target.value })
              }
              className="w-full select select-bordered"
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

          {/* PAYMENT MODE */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Payment Mode
            </label>
            <select
              value={expense.paymentMode || ""}
              onChange={(e) =>
                setExpense({
                  ...expense,
                  paymentMethod: e.target.value,
                })
              }
              className="w-full select select-bordered"
              required
            >
              <option value="">Select Payment Mode</option>
              <option>Cash</option>
              <option>UPI</option>
              <option>Card</option>
              <option>NetBanking</option>
            </select>
          </div>

          {/* DATE */}
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              value={
                expense.date
                  ? new Date(expense.date).toISOString().slice(0, 10)
                  : ""
              }
              onChange={(e) =>
                setExpense({ ...expense, date: e.target.value })
              }
              className="w-full input input-bordered"
              required
            />
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 pt-3">
            <button
              type="submit"
              disabled={saving}
              className="btn btn-error flex-1"
            >
              {saving ? "Updating..." : "Update"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/expense")}
              className="btn btn-outline flex-1"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
