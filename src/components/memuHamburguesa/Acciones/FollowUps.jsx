import { Modal, Button, Row, Col } from "react-bootstrap";
import TableFollowUps from "../../TableFollowUps";
import FormFollowUps from "./FormFollowUps";

const FollowUps = ({ show, handleClose }) => {
  const handleFormSubmit = (formData) => {
    console.log("Datos del formulario:", formData);
    // Aquí puedes manejar el envío de datos
  };

  return (
    <Modal show={show} onHide={handleClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Seguimiento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={6}>
            <TableFollowUps />
          </Col>
          <Col md={6}>
            <FormFollowUps onSubmit={handleFormSubmit} />
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FollowUps;
