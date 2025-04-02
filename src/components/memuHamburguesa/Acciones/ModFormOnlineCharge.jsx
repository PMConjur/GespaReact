import { Modal } from "react-bootstrap";
import FormOnlineCharge from "./FormOnlineCharge";
import { useState } from "react";

const ModFormOnlineCharge = ({ 
  show, 
  handleClose,
  isOnlineChargeActive = false
}) => {
  const [registroRealizado, setRegistroRealizado] = useState(false); // Estado para controlar si se realizó un registro

  const handleRegistroExitoso = () => {
    setRegistroRealizado(true); // Marcar que se realizó un registro
  };

  return (
    <Modal
      show={show}
      onHide={() => {
        if (isOnlineChargeActive && !registroRealizado) {
          toast.error("Debe realizar al menos un registro antes de cerrar el formulario.");
          return;
        }
        handleClose(); // Permitir cerrar solo si se realizó un registro o no está activo
      }}
      size="lg"
      centered
      backdrop={isOnlineChargeActive ? "static" : true} // Evitar cerrar al hacer clic fuera si está activo
      keyboard={!isOnlineChargeActive} // Deshabilitar teclado si está activo
      className="unified-modal"
    >
      <Modal.Header closeButton={!isOnlineChargeActive}>
        <Modal.Title>
          {isOnlineChargeActive ? "Nuevo Cargo en Línea" : "Formulario de Cargo en Línea"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormOnlineCharge handleClose={handleClose} onRegistroExitoso={handleRegistroExitoso} />
      </Modal.Body>
    </Modal>
  );
};

export default ModFormOnlineCharge;
