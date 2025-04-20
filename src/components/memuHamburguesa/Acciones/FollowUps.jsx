import { useState, useEffect } from "react";
import { Modal, Row, Col } from "react-bootstrap";
import TableFollowUps from "../../TableFollowUps";
import FormFollowUps from "./FormFollowUps";

const FollowUps = ({ 
  show, 
  handleClose,
  isFollowUpActive = false
}) => {
  const [hasRegistered, setHasRegistered] = useState(false);

  // Resetear el estado cuando el modal se cierra o cuando isFollowUpActive cambia
  useEffect(() => {
    if (!show) {
      setHasRegistered(false);
    }
  }, [show]);

  // También reseteamos cuando  cambia
  useEffect(() => {
    setHasRegistered(false);
  }, [isFollowUpActive]);

  // Función para manejar el cierre condicional
  const handleConditionalClose = () => {
    if (isFollowUpActive && !hasRegistered) {
      // Aquí puedes mostrar un toast o alerta si lo deseas
      return;
    }
    handleClose();
  };

  return (
    <Modal 
      show={show} 
      onHide={handleConditionalClose} 
      size="xl"
      // backdrop={isFollowUpActive && !hasRegistered ? "static" : true}
      // keyboard={!isFollowUpActive || hasRegistered}
      
      backdrop={!isFollowUpActive ? "static" : (!hasRegistered ? "static" : true)}
      keyboard={!isFollowUpActive ? false : (hasRegistered ? true : false)}
      contentClassName="d-flex flex-column"
      dialogClassName="my-custom-modal"
    >
      <Modal.Header closeButton={!isFollowUpActive || hasRegistered}>
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
              maxHeight: isFollowUpActive ? "700px" : "100%",
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
              <FormFollowUps 
                handleClose={handleClose} 
                isFollowUpsActive={isFollowUpActive}
                onSuccessfulRegister={() => setHasRegistered(true)}
              />
            </Col>
          )}
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default FollowUps;