import { useState, useEffect } from "react";
import { Modal, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner"; // Import toast and Toaster
import PropTypes from "prop-types"; // Import PropTypes for prop validation

function ModalChange({
  user,
  password,
  days,
  expire,
  onClose,
  onShowPasswordModal,
  responseData // Receive the response data
}) {
  const [show, setShow] = useState(true);
  const navigate = useNavigate();

  const handleClose = () => {
    setShow(false);
    onClose(); // Call the onClose prop function to reset the showModal state in the parent component
  };
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem(responseData);
    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON);
      if (loggedUser.ejecutivo.token) {
        const token = loggedUser.ejecutivo.token;
        console.log("Token recibido:", token);
        const nombreEjecutivo =
          loggedUser.ejecutivo.infoEjecutivo.nombreEjecutivo;
        const idEjecutivo = loggedUser.ejecutivo.infoEjecutivo.idEjecutivo;
        const user = loggedUser.ejecutivo.infoEjecutivo.user;
        console.log("Nombre ejecutivo:", nombreEjecutivo);
        console.log("ID ejecutivo:", idEjecutivo);
        console.log("Usuario:", user);
      } else {
        console.error("Token no encontrado");
      }
    }
  }, []);

  const handleNoClick = async () => {
    if (expire === true) {
      console.log(expire);
      toast.error("Su contraseña ha expirado", {
        description:
          "por favor cambie su contraseña, da click en el botón de sí para cambiarla"
      });
    } else {
      if (days !== "1") {
        setShow(false);
        navigate("/home", { state: responseData }); // Navigate to home with responseData
      }
    }
  };

  const handleYesClick = () => {
    toast.info("Ingresa los datos para actualizar tu contraseña");
    setShow(false); // Close the current modal
    onShowPasswordModal(user, password); // Pass user and password to the password change modal
  };

  const getExpireMessage = () => {
    if (days > 1 && expire === false) {
      return (
        <>
          Su contraseña expira en <Badge bg="primary">{days}</Badge> días
        </>
      );
    } else if (expire === true) {
      return "Su contraseña expiro";
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Gestor de Cuenta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p id="txtExpire">{getExpireMessage()}</p>
          <h6>¿Deseas cambiarla ahora?</h6>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleNoClick}>
            No
          </Button>
          <Button variant="success" onClick={handleYesClick}>
            Sí
          </Button>
        </Modal.Footer>
      </Modal>
      <Toaster richColors position="top-right" />{" "}
      {/* Add Toaster component for toast visibility */}
    </>
  );
}

ModalChange.propTypes = {
  user: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
  days: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  expire: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onShowPasswordModal: PropTypes.func.isRequired, // Add prop type for the function to show the password modal
  responseData: PropTypes.object // Add prop type for the response data
};

export default ModalChange;
