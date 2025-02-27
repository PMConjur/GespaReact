import { Modal, Button } from "react-bootstrap";
import Productivity from "./Productivity";

const ProductivityModal = ({ show, onHide }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Productividad</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Productivity />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductivityModal;
