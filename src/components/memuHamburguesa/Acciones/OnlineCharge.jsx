import { Modal, Row, Col } from "react-bootstrap";
import TableOnlineCharge from "../../TableOnlineCharge";
import FormOnlineCharge from "./FormOnlineCharge"; // Importar el formulario

const OnlineCharge = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Cargos en Línea</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={8}>
            <TableOnlineCharge />
          </Col>
          <Col md={4}>
            <FormOnlineCharge handleClose={handleClose} />
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default OnlineCharge;
