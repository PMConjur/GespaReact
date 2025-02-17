import "./App.css";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Maintenance from "./pages/Maintenance";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/maintenance" element={<Maintenance />} />
      </Routes>
    </Router>
  );
}
export default App;
