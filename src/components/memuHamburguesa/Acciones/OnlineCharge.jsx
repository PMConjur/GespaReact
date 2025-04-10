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

  // Resetear estados cuando el modal se cierra
  useEffect(() => {
    if (!show) {
      setHasRegistered(false);
    }
  }, [show]);

  const handleConditionalClose = () => {
    // En modo tabla (isOnlineChargeActive=true) siempre permite cerrar
    // En modo formulario (isOnlineChargeActive=false) solo permite cerrar después de registro
    if (!isOnlineChargeActive && !hasRegistered) {
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
      backdrop={!isOnlineChargeActive && !hasRegistered ? "static" : true}
      keyboard={!(!isOnlineChargeActive && !hasRegistered)}
      contentClassName="d-flex flex-column bg-dark"
      dialogClassName="my-custom-modal"
    >
      <Modal.Header 
        closeButton={isOnlineChargeActive || hasRegistered} // Botón visible solo cuando:
        // - isOnlineChargeActive=true (modo tabla)
        // - O hay registro exitoso (hasRegistered=true)
        className="bg-dark text-white"
      >
        <Modal.Title>
          {isOnlineChargeActive ? "Historial de Cargos" : "Nuevo Cargo en Línea"}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="flex-grow-1 p-0 d-flex flex-column bg-dark" style={{ overflow: "hidden" }}>
        <Row className="flex-grow-1 g-0 m-0" style={{ height: "100%" }}>
          {/* Tabla - siempre visible */}
          <Col 
            md={!isOnlineChargeActive ? 8 : 12} 
            className="h-100 d-flex flex-column p-0" 
            style={{ 
              maxHeight: "700px",
              overflowY: "auto"
            }}
          >
            <TableOnlineCharge />
          </Col>
          
          {/* Formulario - solo visible cuando isOnlineChargeActive es false */}
          {!isOnlineChargeActive && (
            <Col 
              md={4}
              className="h-100 d-flex flex-column p-3 bg-dark text-white"
              style={{ 
                maxHeight: "700px",
                overflowY: "auto",
                borderLeft: "1px solid #444"
              }}
            >
              <FormOnlineCharge 
                onSuccessfulRegister={() => {
                  setHasRegistered(true);
                  toast.success("Registro exitoso. Ahora puede cerrar el modal");
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