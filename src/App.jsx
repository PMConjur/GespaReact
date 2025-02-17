import "./App.css";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import ModalChange from "./components/ModalChange";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
<<<<<<< HEAD
import Maintenance from "./pages/Maintenance";
=======
import "./scss/styles.scss"
>>>>>>> HU1.1-Modals

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
<<<<<<< HEAD
        <Route path="/maintenance" element={<Maintenance />} />
=======
        <Route path="/register" element={<Register />} />
        <Route path="/ModalChange" element={<ModalChange />} />
>>>>>>> HU1.1-Modals
      </Routes>
    </Router>
  );
}
export default App;
