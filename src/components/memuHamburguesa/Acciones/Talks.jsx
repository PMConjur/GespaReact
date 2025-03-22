import React from "react";
import { Modal, Button } from "react-bootstrap";
import TableTalks from "../../TableTalks";
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Bank } from "react-bootstrap-icons";


const Talks = ({ show, handleClose, dataTalks }) => {
    return (
        <Modal show={show} onHide={handleClose} size="xl">
            <Modal.Header closeButton>
                <Modal.Title>
                    <i className="bi bi-bank me-2"></i> {/* Ícono con margen derecho */}
                    Historial de Negociaciones
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <TableTalks dataTalks={dataTalks} />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet"></link>

export default Talks;