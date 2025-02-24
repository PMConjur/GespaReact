import { useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import PropTypes from "prop-types"; // Import PropTypes for prop validation

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
    <Nav.Link as="button" onClick={handleLogout} style={{ textAlign: "left" }}>
      <h5>Cerrar Sesion</h5>
    </Nav.Link>
  );
};

CerrarSesion.propTypes = {
  setUser: PropTypes.func.isRequired,
  setIdEjecutivo: PropTypes.func.isRequired
};

export default CerrarSesion;
