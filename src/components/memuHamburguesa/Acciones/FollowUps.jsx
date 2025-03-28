import { Modal, Row, Col } from "react-bootstrap";
import TableFollowUps from "../../TableFollowUps";
import FormFollowUps from "./FormFollowUps";

const FollowUps = ({ 
  show, 
  handleClose,
  isFollowUpActive = false
}) => {
  return (
    <Modal 
      show={show} 
      onHide={handleClose} 
      size="xl"
      backdrop={isFollowUpActive ? "static" : true}
      keyboard={!isFollowUpActive}
    >
      <Modal.Header closeButton={!isFollowUpActive}>
        <Modal.Title>
          {isFollowUpActive ? "Nuevo Seguimiento" : "Registros de Seguimiento"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={isFollowUpActive ? 6 : 8}>
            <TableFollowUps />
          </Col>
          
          {isFollowUpActive && (
            <Col md={6}>
              <FormFollowUps handleClose={handleClose} />
            </Col>
          )}
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default FollowUps;