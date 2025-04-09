
import { Modal } from "react-bootstrap";
import TableTalks from "../../TableTalks";
// import 'bootstrap-icons/font/bootstrap-icons.css';


const Talks = ({ show, handleClose }) => {
    return (
        <Modal 
        show={show} 
        onHide={handleClose} 
        backdrop="static" 
        size="xl"
        keyboard={true}
        contentClassName="d-flex flex-column"
        dialogClassName="my-custom-modal"
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    <i className="bi bi-bank me-2"></i> {/* Ícono con margen derecho */}
                    Historial de Negociaciones
                </Modal.Title>
            </Modal.Header>
            <Modal.Body
            className="flex-grow-1 p-0 d-flex flex-column">
                <TableTalks/>
            </Modal.Body>
        </Modal>
    );
};

<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet"></link>

export default Talks;