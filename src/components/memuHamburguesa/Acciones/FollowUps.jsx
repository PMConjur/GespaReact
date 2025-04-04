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
      backdrop="static"
      keyboard={true}
      contentClassName="d-flex flex-column"
      dialogClassName="my-custom-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          {isFollowUpActive ? "Nuevo Seguimiento" : "Registros de Seguimiento"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body 
        className="flex-grow-1 p-0 d-flex flex-column"
        style={{
          overflow: "hidden",
        }}
      >
        <Row className="flex-grow-1 g-0" style={{ height: "100%" }}>
          <Col 
            md={isFollowUpActive ? 6 : 12} 
            className="h-100 d-flex flex-column" 
            style={{ 
              maxHeight: isFollowUpActive ? "700px" : "100%", // Ajustar altura al 100% si no está activo
              overflowY: "auto"
            }}
          >
            <TableFollowUps />
          </Col>
          {isFollowUpActive && (
            <Col 
              md={6} 
              className="h-100 d-flex flex-column"
              style={{ 
                maxHeight: "700px",
                overflowY: "auto",
              }}
            >
              <FormFollowUps handleClose={handleClose} />
            </Col>
          )}
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default FollowUps;