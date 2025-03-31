import { Modal, Button, Spinner } from "react-bootstrap";
import TDropdownProcessesWLP from "../../TDropdownProcessesWLP";

const ProcessesWLP = ({ show, handleCloseProcessesWLP, loadingProcessesWLP }) => {
  return (
    <Modal show={show} onHide={handleCloseProcessesWLP} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>Procesos WLP</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ maxHeight: "600px", overflow: "auto", height: "500px" }}>
        {loadingProcessesWLP ? (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" />
          </div>
        ) : (
          <TDropdownProcessesWLP />
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ProcessesWLP;