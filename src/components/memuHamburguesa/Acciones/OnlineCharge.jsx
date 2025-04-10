import { useState, useEffect } from "react";
import { Modal, Row, Col } from "react-bootstrap";
import TableOnlineCharge from "../../TableOnlineCharge";
import FormOnlineCharge from "./FormOnlineCharge";
import { toast } from "sonner";

const OnlineCharge = ({ 
  show, 
  handleClose, 
  isOnlineChargeActive = false 
}) => {
  const [hasRegistered, setHasRegistered] = useState(false);

  // Resetear estados cuando el modal se cierra o cambia el modo
  useEffect(() => {
    if (!show) {
      setHasRegistered(false);
    }
  }, [show]);

  useEffect(() => {
    setHasRegistered(false);
  }, [isOnlineChargeActive]);

  const handleConditionalClose = () => {
    if (isOnlineChargeActive && !hasRegistered) {
      toast.warning("Complete al menos un registro antes de cerrar");
      return;
    }
    handleClose();
  };

  return (
    <Modal 
      show={show} 
      onHide={handleConditionalClose} 
      size="xl"
      backdrop={isOnlineChargeActive && !hasRegistered ? "static" : true}
      keyboard={!(isOnlineChargeActive && !hasRegistered)}
      contentClassName="d-flex flex-column"
      dialogClassName="my-custom-modal"
    >
      <Modal.Header closeButton={!isOnlineChargeActive || hasRegistered}>
        <Modal.Title>
          {isOnlineChargeActive ? "Nuevo Cargo en Línea" : "Historial de Cargos"}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="flex-grow-1 p-0 d-flex flex-column" style={{ overflow: "hidden" }}>
        <Row className="flex-grow-1 g-0" style={{ height: "100%" }}>
          {/* Tabla - siempre visible */}
          <Col 
            md={isOnlineChargeActive ? 8 : 12} 
            className="h-100 d-flex flex-column" 
            style={{ 
              maxHeight: "700px",
              overflowY: "auto"
            }}
          >
            <TableOnlineCharge />
          </Col>
          
          {/* Formulario - solo visible cuando isOnlineChargeActive es true */}
          {isOnlineChargeActive && (
            <Col 
              md={4}
              className="h-100 d-flex flex-column bg-light p-3"
              style={{ 
                maxHeight: "700px",
                overflowY: "auto",
                borderLeft: "1px solid #dee2e6"
              }}
            >
              <FormOnlineCharge 
                onSuccessfulRegister={() => {
                  setHasRegistered(true);
                  toast.success("Registro exitoso. Ahora puede cerrar el modal si lo desea");
                }}
              />
            </Col>
          )}
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default OnlineCharge;