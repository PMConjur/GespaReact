import { Modal, Row, Col } from "react-bootstrap";
import TableOnlineCharge from "../../TableOnlineCharge";
import ModFormOnlineCharge from "./ModFormOnlineCharge";

const OnlineCharge = ({ 
  show, 
  handleClose, 
  isOnlineChargeActive = false 
}) => {
  return (
    <Modal 
      show={show} 
      onHide={handleClose} 
      size="xl" // Ajusta el tamaño del modal
      backdrop={isOnlineChargeActive ? "static" : true} // Evita cerrar al hacer clic fuera si está activo
      keyboard={!isOnlineChargeActive} // Deshabilita el teclado si está activo
      contentClassName="d-flex flex-column"
      dialogClassName="my-custom-modal"
    >
      <Modal.Header closeButton={!isOnlineChargeActive}>
        <Modal.Title>
          {isOnlineChargeActive ? "Nuevo Cargo en Línea" : "Registros de Cargos en Línea"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body 
        className="flex-grow-1 p-0 d-flex flex-column"
        style={{ overflow: "hidden" }}
      >
        <Row className="flex-grow-1 g-0" style={{ height: "100%" }}>
          <Col 
            md={isOnlineChargeActive ? 6 : 12} 
            className="h-100 d-flex flex-column" 
            style={{ 
              maxHeight: "700px",
              overflowY: "auto" // Scroll interno si el contenido excede
            }}
          >
            <TableOnlineCharge />
          </Col>
          
          {isOnlineChargeActive && (
            <Col 
              md={6} 
              className="h-100 d-flex flex-column"
              style={{ 
                maxHeight: "680px",
                overflowY: "auto" // Scroll interno para el formulario
              }}
            >
              <ModFormOnlineCharge 
                show={show} 
                handleClose={handleClose} 
                isOnlineChargeActive={isOnlineChargeActive}
              />
            </Col>
          )}
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default OnlineCharge;
