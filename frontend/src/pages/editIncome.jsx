import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from 'react-toastify';

export default function EditIncome() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [income, setIncome] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch income details
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/income/${id}`, {
      credentials: "include",
    })
      .then(res => res.json())
      .then(data => {
        if (!data.success) throw new Error();
        setIncome(data.income);
      })
      .catch(() => toast.error("Failed to load income"))
      .finally(() => setLoading(false));
  }, [id]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/income/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(income),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Income updated successfully!");
        navigate("/income");
      } else {
        toast.error(data.message || "Failed to update income");
      }
    } catch (err) {
      toast.error("Server error");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!income) return <p className="text-center mt-10 text-red-500">Income not found</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-success/20 via-base-200 to-primary/20 p-6 flex justify-center items-start">
      <div className="bg-base-100 rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-success mb-6 text-center">Edit Income</h2>

        <form onSubmit={submitHandler} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Title</label>
            <input
              type="text"
              value={income.title}
              onChange={e => setIncome({ ...income, title: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
              required
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Amount (₹)</label>
            <input
              type="number"
              value={income.amount}
              onChange={e => setIncome({ ...income, amount: Number(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Category</label>
            <input
              type="text"
              value={income.category || ""}
              onChange={e => setIncome({ ...income, category: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-gray-700 mb-1 font-medium">Date</label>
            <input
              type="date"
              value={income.date ? new Date(income.date).toISOString().substr(0, 10) : ""}
              onChange={e => setIncome({ ...income, date: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 mt-4">
            <button
              type="submit"
              className="flex-1 btn btn-success px-4 py-2 font-medium hover:scale-105 transition"
            >
              Update
            </button>

            <button
              type="button"
              onClick={() => navigate("/income")}
              className="flex-1 btn btn-outline btn-error px-4 py-2 font-medium hover:scale-105 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
