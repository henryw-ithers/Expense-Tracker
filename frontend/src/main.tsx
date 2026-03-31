import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Bootstrap (layout + components)
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Global styles (your theme + font)
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
