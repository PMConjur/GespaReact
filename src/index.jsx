import React from "react";
import ReactDOM from "react-dom/client";

import "./assets/css/style.css";
import "./assets/vendor/bootstrap/css/bootstrap.min.css";
import "./assets/vendor/bootstrap-icons/bootstrap-icons.css";
import "https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.slim.min.js";
import "./assets/vendor/boxicons/css/boxicons.min.css";
import "./assets/vendor/quill/quill.snow.css";
import "./assets/vendor/remixicon/remixicon.css";
import "./assets/vendor/simple-datatables/style.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import Login from "./Pages/Login/Login";
import Home from "./Pages/Home/Home";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="*" element={<Navigate to="/" />} />{" "}
        {/* Redirige a Login */}
      </Routes>
    </Router>
  </React.StrictMode>
);
