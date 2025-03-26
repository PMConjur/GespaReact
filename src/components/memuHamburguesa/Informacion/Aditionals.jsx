
import { Modal, Button } from "react-bootstrap";
import TableAditionals from "../../TableAditionals";

const Aditionals = ({ show, handleClose}) => {
    return (
        <Modal show={show} onHide={handleClose} size="xl">
            <Modal.Header closeButton>
                <Modal.Title>Adicionjales</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <TableAditionals/>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default Aditionals;