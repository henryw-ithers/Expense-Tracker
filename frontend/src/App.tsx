import { Link, Route, Routes } from "react-router-dom";
import { DashboardPage } from "./pages/DashboardPage";
import { AddTransactionPage } from "./pages/AddTransactionPage";
import { CategoriesPage } from "./pages/CategoriesPage";
import "./App.css";

export default function App() {
  return (
    <div className="app">
      <nav className="nav">
        <Link to="/">Dashboard</Link>
        <Link to="/transactions/new">Add Transaction</Link>
        <Link to="/categories">Categories</Link>
      </nav>

      <main className="container">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/transactions/new" element={<AddTransactionPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
        </Routes>
      </main>
    </div>
  );
}