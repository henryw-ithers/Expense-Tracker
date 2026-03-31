import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { AddTransactionPage } from "./pages/AddTransactionPage";
import "./App.css";

function SidebarLinks() {
  return (
    <ul className="nav flex-column gap-1">
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
              <button
                className="app-menu-button d-md-none"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#mobileSidebar"
                aria-controls="mobileSidebar"
                aria-label="Toggle navigation"
              >
                <span className="app-menu-lines" aria-hidden="true">
                  <span></span>
                  <span></span>
                  <span></span>
                </span>
              </button>
            </div>

            <div className="app-topbar-center">
              <NavLink to="/" className="navbar-brand mb-0 app-brand">
                Finance Tracker
              </NavLink>
            </div>

            <div className="app-topbar-right"></div>
          </div>
        </nav>

        <div className="container-fluid">
          <div className="row flex-nowrap">
            <aside className="col-md-3 col-lg-2 d-none d-md-block app-sidebar">
              <div className="sidebar-sticky p-3">
                <SidebarLinks />
              </div>
            </aside>

            <main className="col-12 col-md-9 col-lg-10 app-main">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/add" element={<AddTransactionPage />} />
              </Routes>
            </main>
          </div>
        </div>

        <div
          className="offcanvas offcanvas-start app-offcanvas d-md-none"
          tabIndex={-1}
          id="mobileSidebar"
          aria-labelledby="mobileSidebarLabel"
        >
          <div className="offcanvas-header border-bottom">
            <h5
              className="offcanvas-title app-offcanvas-title"
              id="mobileSidebarLabel"
            >
              Menu
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>

          <div className="offcanvas-body p-3">
            <SidebarLinks />
          </div>
        </div>
      </div>
    </BrowserRouter>
  );
}