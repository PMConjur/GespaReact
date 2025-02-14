import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner"; // Import toast and Toaster

function ModalChange({ user, password, days, expire, onClose }) {
  const [show, setShow] = useState(true);
  const navigate = useNavigate();

  const handleClose = () => {
    setShow(false);
    onClose(); // Call the onClose prop function to reset the showModal state in the parent component
  };

  const handleNoClick = async () => {
    if (expire === true) {
      toast.error("Su contraseña ha expirado", {
        description:
          "por favor cambie su contraseña, da click en el botón de sí para cambiarla"
      });
    } else {
      if (days !== "1") {
        setShow(false);
        navigate("/home");
      }
    }
  };

  const handleYesClick = () => {
    toast.success("Redirigiendo a la página de cambio de contraseña...");
    // Add logic to navigate to the password change page
  };

  const getExpireMessage = () => {
    if (days != "1") {
      return `Su contraseña expira en ${days} días`;
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
          <p>¿Deseas cambiar ahora?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="info" onClick={handleNoClick}>
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

export default ModalChange;
