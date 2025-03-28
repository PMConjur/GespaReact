import React from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import TDropdownProcessesWLP from "../../TDropdownProcessesWLP";

const ProcessesWLP = ({ show, handleCloseProcessesWLP, data, loadingProcessesWLP, errorProcessesWLP }) => {
  return (
    <Modal show={show} onHide={handleCloseProcessesWLP} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>Procesos WLP</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: "700px", overflow: "auto", height: "600px" }}>
        {loadingProcessesWLP ? (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" />
          </div>
        ) : errorProcessesWLP ? (
            <p>Error al cargar los datos. Intente nuevamente.</p>
        ) : (
          <TDropdownProcessesWLP data={data} />
        )}
      </Modal.Body>
      <Modal.Footer>
        {/* Espacio del footer vacío */}
      </Modal.Footer>
    </Modal>
  );
};

export default ProcessesWLP;