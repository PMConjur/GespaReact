import { Modal, Button, Row, Col } from "react-bootstrap";
import TableFollowUps from "../../TableFollowUps";
import FormFollowUps from "./FormFollowUps";

const FollowUps = ({ 
  show, 
  handleClose,
  isFollowUpActive = false // Nueva prop para controlar el modo
}) => {
  const handleFormSubmit = (formData) => {
    console.log("Datos del formulario:", formData);
    // Aquí puedes manejar el envío de datos
  };

  return (
    <Modal show={show} onHide={handleClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>
          {isFollowUpActive ? "Seguimiento Activo" : "Registros de Seguimiento"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          {/* Mostrar siempre la tabla */}
          <Col md={isFollowUpActive ? 6 : 12}>
            <TableFollowUps />
          </Col>
          
          {/* Mostrar el formulario solo cuando isFollowUpActive es true */}
          {isFollowUpActive && (
            <Col md={6}>
              <FormFollowUps />
            </Col>
          )}
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
        {isFollowUpActive && (
          <Button variant="primary" onClick={handleClose}>
            Guardar
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default FollowUps;