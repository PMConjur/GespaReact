import { Modal, Button } from "react-bootstrap";
import TableOnlineCharge from "../../TableOnlineCharge";



const OnlineCharge = ({ show, handleClose }) => {
    return (
        <Modal show={show} onHide={handleClose} size="xl">
            <Modal.Header closeButton>
                <Modal.Title>Cargos en Linea</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <TableOnlineCharge/>
            </Modal.Body>
            <Modal.Footer>
              {/* Espacio del footer vacío */}
            </Modal.Footer>
        </Modal>
    );
};

export default OnlineCharge;