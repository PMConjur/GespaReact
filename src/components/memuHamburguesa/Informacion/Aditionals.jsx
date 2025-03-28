import { Modal } from "react-bootstrap";
import TableAditionals from "../../TableAditionals";

const Aditionals = ({ show, handleClose}) => {
    return (
        <Modal show={show} onHide={handleClose} size="xl">
            <Modal.Header closeButton>
                <Modal.Title>Adicionales</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <TableAditionals/>
            </Modal.Body>
            <Modal.Footer>
                {/* Espacio del footer vacío */}
            </Modal.Footer>
        </Modal>
    );
};

export default Aditionals;