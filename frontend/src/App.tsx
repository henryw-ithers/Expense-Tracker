import { BrowserRouter, Routes, Route, NavLink, Link } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { TransactionsPage } from "./pages/TransactionPage";
import "./App.css";

function MenuLinks() {
  return (
    <ul className="dropdown-menu app-dropdown-menu">
      <li>
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `dropdown-item app-dropdown-link${isActive ? " active" : ""}`
          }
        >
          Dashboard
        </NavLink>
      </li>

      <li>
        <NavLink
          to="/transactions"
          className={({ isActive }) =>
            `dropdown-item app-dropdown-link${isActive ? " active" : ""}`
          }
        >
          Transactions
        </NavLink>
      </li>
    </ul>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <nav
          className="navbar navbar-dark sticky-top app-topbar shadow-sm"
          data-bs-theme="dark"
        >
          <div className="container-fluid px-3 px-md-4 app-topbar-inner">
            <div className="app-topbar-left">
              <div className="dropdown">
                <button
                  className="app-menu-button"
                  type="button"
                  data-bs-toggle="dropdown"
                  data-bs-auto-close="true"
                  aria-expanded="false"
                  aria-label="Open menu"
                >
                  <span className="app-menu-lines" aria-hidden="true">
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                </button>

                <MenuLinks />
              </div>
            </div>

            <div className="app-topbar-center">
              <Link to="/" className="navbar-brand mb-0 app-brand">
                Finance Tracker
              </Link>
            </div>

            <div className="app-topbar-right"></div>
          </div>
        </nav>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}