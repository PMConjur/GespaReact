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
      size="xl" // Puedes cambiarlo a "lg" o eliminar para personalizar el ancho
      style={{

        maxHeight: "880px",
      }}
      backdrop={isFollowUpActive ? "static" : true}
      keyboard={!isFollowUpActive}
      contentClassName="d-flex flex-column"
      dialogClassName="my-custom-modal" // Clase para personalizar el contenedor del modal
    >
      <Modal.Header closeButton={!isFollowUpActive}>
        <Modal.Title>
          {isFollowUpActive ? "Nuevo Seguimiento" : "Registros de Seguimiento"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body 
        className="flex-grow-1 p-0 d-flex flex-column"
        style={{
          overflow: "hidden", // Evita desbordamiento del contenido
        }}
      >
        <Row className="flex-grow-1 g-0" style={{ height: "100%" }}>
          <Col 
            md={isFollowUpActive ? 6 : 12} 
            className="h-100 d-flex flex-column" 
            style={{ 
              maxHeight: "700px",
              overflowY: "auto", // Scroll interno si el contenido excede
            }}
          >
            <TableFollowUps />
          </Col>
          
          {isFollowUpActive && (
            <Col 
              md={6} 
              className="h-100 d-flex flex-column"
              style={{ 
                maxHeight: "680px",
                overflowY: "auto", // Scroll interno para el formulario
              }}
            >
              <FormFollowUps handleClose={handleClose} />
            </Col>
          )}
        </Row>
      </Modal.Body>
      <Modal.Footer>
        {/* Espacio del footer vacío */}
      </Modal.Footer>
    </Modal>
  );
};

export default FollowUps;
