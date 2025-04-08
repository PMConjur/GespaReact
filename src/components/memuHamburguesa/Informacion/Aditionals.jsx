
import { Modal, Button } from "react-bootstrap";
import TableAditionals from "../../TableAditionals";

const Aditionals = ({ show, handleClose}) => {
    return (
        <Modal 
        show={show} 
        onHide={handleClose} 
        backdrop="static"
        size="xl">
            <Modal.Header closeButton>
                <Modal.Title>Adicionales</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <TableAditionals/>
            </Modal.Body>
        </Modal>
    );
};

export default Aditionals;