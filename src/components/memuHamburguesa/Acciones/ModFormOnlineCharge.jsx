import { Modal } from "react-bootstrap";
import FormOnlineCharge from "./FormOnlineCharge";

const ModFormOnlineCharge = ({ show, handleClose }) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg" // Asegurar que el tamaño coincida con OnlineCharge
      centered // Centrar el modal
      className="unified-modal" // Clase compartida para estilos unificados
    >
      <Modal.Header closeButton>
        <Modal.Title>Formulario de Cargo en Línea</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormOnlineCharge handleClose={handleClose} />
      </Modal.Body>
    </Modal>
  );
};

export default ModFormOnlineCharge;
