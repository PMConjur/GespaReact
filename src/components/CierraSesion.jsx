import { useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import { BoxArrowLeft } from "react-bootstrap-icons";
import { closeSession } from "../services/gespawebServices"; // Importar la función closeSession

const CerrarSesion = () => {
  const navigate = useNavigate();
  const responseData = JSON.parse(localStorage.getItem("responseData"));
  const idLogIngreso = responseData?.ejecutivo?.infoEjecutivo?.idLogIngreso;
  const idEjecutivo = responseData?.ejecutivo?.infoEjecutivo?.idEjecutivo;


  const handleLogout = async () => {
    try {
      // Validar que idEjecutivo e idLogIngreso no sean undefined
      if (!idEjecutivo) {
        throw new Error("El idEjecutivo no está definido.");
      }
      if (!idLogIngreso) {
        throw new Error("El idLogIngreso no está definido.");
      }

      // Llamar a la función closeSession
      const response = await closeSession(idEjecutivo, idLogIngreso);

      console.log("Cierre de sesión exitoso. Respuesta:", response);

      // Limpiar los datos de usuario
      localStorage.removeItem("responseData");
      sessionStorage.clear();

      // Limpiar cookies
      document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      // Redirigir a la página de login
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
      alert(error.message);
    }
  };

  return (
    <Nav.Link as="button" onClick={handleLogout} className="custom-dropdown-toggle d-flex mt-3">
      <span className="me-2"><BoxArrowLeft/></span><h5 className="mb-0">Cerrar sesion</h5>
    </Nav.Link>
  );
};

export default CerrarSesion;
