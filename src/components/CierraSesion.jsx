import { useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import PropTypes from "prop-types"; // Import PropTypes for prop validation
import { BoxArrowLeft } from "react-bootstrap-icons";

const CerrarSesion = ({ setUser, setIdEjecutivo }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Limpiar los datos de usuario
    if (typeof setUser === "function") setUser("");
    if (typeof setIdEjecutivo === "function") setIdEjecutivo("");

    // Limpiar localStorage
    localStorage.removeItem("responseData");

    // Limpiar sessionStorage
    sessionStorage.clear();

    // Limpiar cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // Limpiar caché del navegador
    if ("caches" in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name);
        });
      });
    }

    // Redirigir a la página de login
    navigate("/");
  };

  return (
    <Nav.Link as="button" onClick={handleLogout} className="custom-dropdown-toggle d-flex align-items-center">
            <span className="me-2"><BoxArrowLeft/></span><h5 className="mb-0">Cerrar sesion</h5>
    </Nav.Link>
  );
};

CerrarSesion.propTypes = {
  setUser: PropTypes.func.isRequired,
  setIdEjecutivo: PropTypes.func.isRequired
};

export default CerrarSesion;
