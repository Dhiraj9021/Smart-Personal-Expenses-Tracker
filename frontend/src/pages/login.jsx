import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
         localStorage.setItem("userId", data.userId);
         localStorage.setItem("username", data.username);
        navigate("/dashboard");
        window.location.reload();
      } else {
        toast.warning(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-base-200 to-secondary/20 px-4">
      
      <div className="w-full max-w-md bg-base-100 rounded-2xl shadow-xl p-8">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-primary">Welcome Back </h2>
          <p className="text-sm text-gray-500 mt-1">
            Login to manage your expenses
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="label">
              <span className="label-text font-medium">Email</span>
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input input-bordered w-full focus:input-primary"
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text font-medium">Password</span>
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input input-bordered w-full focus:input-primary"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full text-base tracking-wide"
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-6 text-sm">
          <span className="text-gray-500">New user?</span>{" "}
          <Link
            to="/register"
            className="text-primary font-medium hover:underline"
          >
            Create Account
          </Link>
        </div>

      </div>
    </div>
  );
}
