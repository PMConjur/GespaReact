import { Modal } from "react-bootstrap";
import TableAditionals from "../../TableAditionals";
import TableGestionesAditionals from "../../TableGestionesAditionals";

const Aditionals = ({ show, handleClose }) => {
    return (
        <Modal 
            show={show} 
            onHide={handleClose} 
            backdrop="static"
            keyboard={false}
            size="xl"
            centered
            scrollable={false}
            contentClassName="modal-content-custom"
            dialogClassName="modal-dialog-custom"
        >
            <Modal.Header closeButton>
                <Modal.Title>Adicionales</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ 
                overflow: 'hidden',
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
            }}>
                <TableAditionals handleCloseAditionals={handleClose} />
                <TableGestionesAditionals />
            </Modal.Body>
        </Modal>
    );
};

export default Aditionals;