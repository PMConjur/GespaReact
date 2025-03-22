
import { Modal, Button } from "react-bootstrap";
import TablePayments from "../../TablePayments";

const Payments = ({ show, handleClose }) => {
    return (
        <Modal show={show} onHide={handleClose} size="xl">
            <Modal.Header closeButton>
                <Modal.Title>Pagos</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <TablePayments/>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default Payments;