import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { AddTransactionPage } from "./pages/AddTransactionPage";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        {/* Top Navbar */}
        <nav
          className="navbar navbar-dark sticky-top app-topbar flex-md-nowrap p-0 shadow"
          data-bs-theme="dark"
        >
          <NavLink
            to="/"
            className="navbar-brand col-md-3 col-lg-2 me-0 px-3 fs-6 app-brand"
          >
            Finance Tracker
          </NavLink>

          <button
            className="navbar-toggler position-absolute d-md-none collapsed topbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#sidebarMenu"
            aria-controls="sidebarMenu"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </nav>

        <div className="container-fluid">
          <div className="row">
            {/* Sidebar */}
            <nav
              id="sidebarMenu"
              className="col-md-3 col-lg-2 d-md-block sidebar collapse app-sidebar"
            >
              <div className="position-sticky pt-3 sidebar-sticky">
                <ul className="nav flex-column">
                  <li className="nav-item">
                    <NavLink
                      to="/"
                      end
                      className={({ isActive }) =>
                        `nav-link app-nav-link${isActive ? " active" : ""}`
                      }
                    >
                      Dashboard
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink
                      to="/add"
                      className={({ isActive }) =>
                        `nav-link app-nav-link${isActive ? " active" : ""}`
                      }
                    >
                      Add Transaction
                    </NavLink>
                  </li>

                  <li className="nav-item">
                    <NavLink
                      to="/transactions"
                      className={({ isActive }) =>
                        `nav-link app-nav-link${isActive ? " active" : ""}`
                      }
                    >
                      Transactions
                    </NavLink>
                  </li>
                </ul>
              </div>
            </nav>

            {/* Main Content */}
            <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 app-main">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/add" element={<AddTransactionPage />} />
              </Routes>
            </main>
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}