import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const username = localStorage.getItem("username");
    setUser(username || null);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      localStorage.removeItem("userId");
      localStorage.removeItem("username");
      setUser(null);
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg transition-all duration-300 ${
      isActive
        ? "bg-blue-600 text-white font-semibold"
        : "hover:bg-blue-50 dark:hover:bg-blue-900 hover:text-blue-600 dark:hover:text-blue-300 text-white-700 dark:text-gray-200"
    }`;

  return (
    <div className="navbar bg-base-100 dark:bg-base-200 shadow-md px-4 sm:px-8">
      {/* LEFT - Logo & Mobile Menu */}
      <div className="navbar-start">
        {/* MOBILE MENU */}
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>

          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content p-2 shadow bg-base-100 dark:bg-base-300 rounded-box w-52"
          >
            {user ? (
              <>
                <li><NavLink to="/dashboard" className={linkClass}>Home</NavLink></li>
                <li><NavLink to="/analytics" className={linkClass}>Analytics</NavLink></li>
                <li><NavLink to="/income" className={linkClass}>Income</NavLink></li>
                <li><NavLink to="/expense" className={linkClass}>Expenses</NavLink></li>
                <li><NavLink to="/aichat" className={linkClass}>AI Guru</NavLink></li>
                <li className="mt-4 pt-4 border-t border-base-300">
                  <div className="flex items-center gap-3 px-2 py-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold uppercase">
                      {user?.charAt(0) || "U"}
                    </div>
                    <div>
                      <div className="font-semibold text-base-content">{user}</div>
                      <button
                        onClick={handleLogout}
                        className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 mt-1"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </li>
              </>
            ) : (
              <>
                <li><NavLink to="/" className={linkClass}>Home</NavLink></li>
                <li><NavLink to="/login" className={linkClass}>Login</NavLink></li>
                <li><NavLink to="/register" className={linkClass}>Sign Up</NavLink></li>
              </>
            )}
          </ul>
        </div>

        {/* LOGO */}
        <NavLink to="/" className="btn btn-ghost text-3xl font-bold text-base-content">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            MyXpenso
          </span>
        </NavLink>
      </div>

      {/* CENTER - Desktop Menu */}
      {user && (
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal gap-2 font-medium">
            <li><NavLink to="/dashboard" className={linkClass}>Home</NavLink></li>
            <li><NavLink to="/analytics" className={linkClass}>Analytics</NavLink></li>
            <li><NavLink to="/income" className={linkClass}>Income</NavLink></li>
            <li><NavLink to="/expense" className={linkClass}>Expenses</NavLink></li>
            <li><NavLink to="/aichat" className={linkClass}>AI Guru</NavLink></li>
          </ul>
        </div>
      )}

      {/* RIGHT - Theme + User */}
      <div className="navbar-end gap-4 flex items-center">
        {/* THEME TOGGLE */}
        <div className="flex-none">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-base-200 dark:bg-base-300 transition-all duration-300 shadow-sm">
            <ThemeToggle />
          </div>
      </div>

        {/* USER PROFILE */}
        {user && (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="flex items-center gap-3 cursor-pointer">
              <div className="hidden sm:block text-right">
                <div className="font-medium text-base-content">{user}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Manage Account</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white flex items-center justify-center font-bold uppercase shadow-md">
                {user?.charAt(0) || "U"}
              </div>
            </label>
            
            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-base-100 dark:bg-base-200 rounded-box w-48 mt-2"
            >
              <li>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 px-4 py-3 rounded-lg"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
