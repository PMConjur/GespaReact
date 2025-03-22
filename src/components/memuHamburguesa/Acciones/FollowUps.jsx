
import { Modal, Button } from "react-bootstrap";
import TableFollowUps from "../../TableFollowUps";


const FollowUps = ({ show, handleClose }) => {


  

  return (
    <Modal show={show} onHide={handleClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Seguimiento</Modal.Title>
      </Modal.Header>
      <Modal.Body>

        <TableFollowUps />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FollowUps;
