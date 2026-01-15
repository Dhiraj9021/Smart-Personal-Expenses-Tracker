import React from "react";
import { Routes, Route } from "react-router-dom";  // <-- Remove Router from here

import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import Incomeadd from "./pages/addIncome";
import Expenseadd from "./pages/addExpense";
import IncomeEdit from "./pages/editIncome";
import ExpenseEdit from "./pages/editExpense";
import Income from "./pages/income";
import Expense from "./pages/expense";
import Navbar from "./components/navbar";
import Banner from "./components/Banner";
import Footer from "./components/Footer";
import AiChatBot from "./pages/AiChatBot";
import Analytics from "./pages/Analytics";

function App() {
  return (
    <>
      <Navbar />  {/* Navbar stays here */}
      
      <Routes>
        <Route path="/" element={<Banner />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
         <Route path="/aichat" element={<AiChatBot />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />


        <Route path="/expense" element={<Expense />} />
        <Route path="/expense/add" element={<Expenseadd />} />
        <Route path="/expense/edit/:id" element={<ExpenseEdit />} />

        <Route path="/income" element={<Income />} />
        <Route path="/income/add" element={<Incomeadd />} />
        <Route path="/income/edit/:id" element={<IncomeEdit />} />
      </Routes>
      <Footer/>
    </>
  );
}

export default App;
