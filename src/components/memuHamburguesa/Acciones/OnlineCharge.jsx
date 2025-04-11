import { useState, useEffect } from "react";
import { Modal, Row, Col } from "react-bootstrap";
import TableOnlineCharge from "../../TableOnlineCharge";
import FormOnlineCharge from "./FormOnlineCharge";
import { toast } from "sonner";
import { AppContext } from "../../../pages/Managment";
import { useContext } from "react";

const OnlineCharge = ({ show, handleClose }) => {
  const { isOnlineChargeActive, setOnlineChargeActive } = useContext(AppContext);
  const [refreshTable, setRefreshTable] = useState(false);

  // Resetear estados cuando el modal se cierra
  useEffect(() => {
    if (!show) {
      setRefreshTable(false);
    }
  }, [show]);

  const handleRegistrationSuccess = () => {
    setRefreshTable(prev => !prev); // Forzar actualización de la tabla
    toast.success("Operación completada con éxito");
  };

  return (
    <Modal 
      show={show} 
      onHide={handleClose} 
      size="xl"
      backdrop="static"
      keyboard={false}
      contentClassName="d-flex flex-column bg-dark"
      dialogClassName="my-custom-modal"
    >
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title>
          {isOnlineChargeActive ? "Nuevo Cargo en Línea" : "Historial de Cargos"}
        </Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="flex-grow-1 p-0 d-flex flex-column bg-dark" style={{ overflow: "hidden" }}>
        <Row className="flex-grow-1 g-0 m-0" style={{ height: "100%" }}>
          {/* Tabla - siempre visible */}
          <Col 
            md={isOnlineChargeActive ? 8 : 12} 
            className="h-100 d-flex flex-column p-0" 
            style={{ 
              maxHeight: "700px",
              overflowY: "auto"
            }}
          >
            <TableOnlineCharge refresh={refreshTable} />
          </Col>
          
          {/* Formulario - solo visible cuando isOnlineChargeActive es true */}
          {isOnlineChargeActive && (
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
                handleClose={() => {
                  handleRegistrationSuccess();
                  setOnlineChargeActive(false);
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