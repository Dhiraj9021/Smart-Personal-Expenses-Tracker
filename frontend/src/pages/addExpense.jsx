import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddExpense() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    paymentMethod: "",
    isRecurring: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/expense/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        credentials: "include",
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok) {
        alert("Expense added ");
        navigate("/expense");
      } else {
        alert(data.message || "Failed to add expense");
      }
    } catch (err) {
      console.error(err);
      alert("Server not responding");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-base-200 to-secondary/20 p-6 flex justify-center items-start">
      <div className="bg-base-100 rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-red-500 mb-6 text-center">
           Add Expenses
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-gray-700 mb-1 font-medium">Title</label>
          <input
            type="text"
            name="title"
            placeholder="Title (e.g., Grocery, Salary, Netflix)"
            required
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={handleChange}
          />
          <label className="block text-gray-700 mb-1 font-medium"></label>
          <input
            type="number"
            name="amount"
            placeholder="Amount (₹)"
            required
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={handleChange}
          />
<label className="block text-gray-700 mb-1 font-medium">Category</label>
          <select
            name="category"
            required
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
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
          <label className="block text-gray-700 mb-1 font-medium">Payment Mode</label>
          <select
          
            name="paymentMethod"
            required
            onChange={handleChange}
           
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-success"
          >
            <option value="">Select Payment Mode</option>
            <option>Cash</option>
            <option>UPI</option>
            <option>Card</option>
            <option>NetBanking</option>
          </select>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isRecurring"
              id="isRecurring"
              className="h-4 w-4 accent-blue-500"
              onChange={handleChange}
            />
            <label htmlFor="isRecurring" className="text-gray-700">
              Recurring (Monthly)
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
          >
            Add Expense
          </button>
        </form>

     
      </div>
    </div>
  );
}
