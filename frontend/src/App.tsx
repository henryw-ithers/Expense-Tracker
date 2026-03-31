import { Route, Routes } from "react-router-dom";
import { DashboardPage } from "./pages/DashboardPage";
import { AddTransactionPage } from "./pages/AddTransactionPage";
import { CategoriesPage } from "./pages/CategoriesPage";
import "./App.css";

export default function App() {
  return (
      <div>
        <header className="navbar navbar-dark sticky-top bg-dark shadow px-3">
          <div className="container-fluid d-flex align-items-center justify-content-between">
            <a className="navbar-brand mb-0" href="#">
              Finance Tracker
            </a>

            <button
              className="navbar-toggler d-md-none"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#sidebarMenu"
              aria-controls="sidebarMenu"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>
        </header>

        <div className="container-fluid">
          <div className="row">
            <nav
              id="sidebarMenu"
              className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse"
            >
              <div className="position-sticky pt-3">
                <ul className="nav flex-column">
                  <li className="nav-item">
                    <a className="nav-link" href="/">
                      Dashboard
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/add">
                      Add Transaction
                    </a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/categories">
                      Categories
                    </a>
                  </li>
                </ul>
              </div>
            </nav>

            <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
              <Routes>
                <Route path="/" element={<DashboardPage />} />
                <Route path="/add" element={<AddTransactionPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
              </Routes>
            </main>
          </div>
        </div>
      </div>
  );
}