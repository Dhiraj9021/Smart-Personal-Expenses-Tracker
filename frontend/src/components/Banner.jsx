import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { FaUsers, FaChartLine, FaMoneyBillWave, FaArrowRight, FaChartPie } from "react-icons/fa";

export default function Banner() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ totalUsers: 0, totalVisits: 0, totalExpenses: 0 });

  useEffect(() => {
    const storedUser = localStorage.getItem("username");
    if (storedUser) setUser(storedUser);

    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:5000/stats", { credentials: "include" });
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-gray-70 ">
      
      {/* Clean Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-secondary/5 to-transparent rounded-full blur-3xl"></div>
        
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="h-full w-full" style={{
            backgroundImage: `linear-gradient(to right, #888 1px, transparent 1px),
                             linear-gradient(to bottom, #888 1px, transparent 1px)`,
            backgroundSize: '80px 80px'
          }}></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-center items-center px-6 lg:px-20 py-12 space-y-16">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl space-y-8">
          {/* Logo/Brand */}
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <FaChartPie className="text-white text-xl" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">ExpenseTracko</h1>
          </div>

          {/* Tagline */}
          <div className="space-y-4">
            <h2 className="text-3xl lg:text-4xl font-semibold text-gray-800 leading-tight">
              Intelligent expense tracking for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                smarter decisions
              </span>
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Track spending, visualize patterns, and achieve financial goals with our streamlined platform.
            </p>
          </div>

          {/* User Status */}
          {user ? (
            <div className="inline-flex items-center gap-4 ">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-2xl text-gray-900">
                Welcome back, <span className="font-bold text-primary">{user}</span>
              </span>
              <NavLink
                to="/dashboard"
                className="ml-2 px-4 py-1.5 bg-primary text-white text-lg font-medium rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-1.5"
              >
                Dashboard <FaArrowRight className="text-xl" />
              </NavLink>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <div className="flex gap-4">
                <NavLink
                  to="/login"
                  className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-lg hover:shadow-md transition-all flex items-center gap-2"
                >
                  Get Started <FaArrowRight className="text-sm" />
                </NavLink>
                <NavLink
                  to="/register"
                  className="px-8 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors"
                >
                  Sign Up Free
                </NavLink>
              </div>
              <p className="text-sm text-gray-500">Track from today</p>
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="w-full max-w-4xl">
          <div className="mb-6 text-center">
            <h3 className="text-xl font-semibold text-gray-700">Trusted by many</h3>
            <p className="text-gray-500 text-sm mt-1">Real-time platform statistics</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <FaUsers />,
                value: stats.totalUsers.toLocaleString(),
                label: "Active Users",
                description: "Managing their finances",
                color: "text-blue-600",
                bgColor: "bg-blue-50"
              },
              {
                icon: <FaChartLine />,
                value: stats.totalVisits.toLocaleString(),
                label: "Monthly Visits",
                description: "Growing community",
                color: "text-purple-600",
                bgColor: "bg-purple-50"
              },
              {
                icon: <FaMoneyBillWave />,
                value: stats.totalExpenses.toLocaleString(),
                label: "Tracked Expenses",
                description: "And counting",
                color: "text-green-600",
                bgColor: "bg-green-50"
              },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor} ${stat.color}`}>
                    {React.cloneElement(stat.icon, { className: "text-xl" })}
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-gray-700 font-medium mt-1">{stat.label}</div>
                    <div className="text-gray-400 text-sm mt-1">{stat.description}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Value Proposition */}
        <div className="max-w-2xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
            <span className="w-2 h-2 bg-primary rounded-full"></span>
            <span className="text-sm font-medium text-gray-700">Why Choose Us</span>
          </div>
          <div className="grid grid-cols-3 bg-blue-50 md:grid-cols-3 gap-6 rounded-xl shadow-sm border border-blue-100 p-4">
            {[
              { title: "Simple Setup", desc: "Start tracking in minutes" },
              { title: "Visual Insights", desc: "Clear spending patterns" },
              { title: "Secure & Private", desc: "Your data is protected" }
            ].map((item, idx) => (
              <div key={idx} className="p-4">
                <div className="text-gray-800 font-semibold">{item.title}</div>
                <div className="text-gray-500 text-sm mt-1">{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}