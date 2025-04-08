import { Modal, Row, Col } from "react-bootstrap";
import TableOnlineCharge from "../../TableOnlineCharge";
import FormOnlineCharge from "./FormOnlineCharge";

const OnlineCharge = ({ 
  show, 
  handleClose, 
  isOnlineChargeActive = false,
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
          {isOnlineChargeActive ? "Registros de Cargos en Línea" : "Registros y Nuevo Cargo en Línea"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body 
        className="flex-grow-1 p-0 d-flex flex-column"
        style={{ overflow: "hidden" }}
      >
        <Row className="flex-grow-1 g-0" style={{ height: "100%" }}>
          <Col 
            md={isOnlineChargeActive ? 12 : 6} 
            className="h-100 d-flex flex-column" 
            style={{ 
              maxHeight: "700px",
              overflowY: "auto"
            }}
          >
            <TableOnlineCharge />
          </Col>
          {!isOnlineChargeActive && (
            <Col 
              md={6} 
              className="h-100 d-flex flex-column"
              style={{ 
                maxHeight: "700px",
                overflowY: "auto"
              }}
            >
              <FormOnlineCharge handleClose={handleClose} />
            </Col>
          )}
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default OnlineCharge;
