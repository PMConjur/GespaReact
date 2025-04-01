import { Modal, Row, Col } from "react-bootstrap";
import TableOnlineCharge from "../../TableOnlineCharge";

const OnlineCharge = ({ show, handleClose }) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg" // Cambiar tamaño para que coincida con ModFormOnlineCharge
      centered // Centrar el modal
      className="unified-modal" // Clase compartida para estilos unificados
    >
      <Modal.Header closeButton>
        <Modal.Title>Cargos en Línea</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={12}>
            <TableOnlineCharge />
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default OnlineCharge;
