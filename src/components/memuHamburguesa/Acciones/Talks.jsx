import React from "react";
import { Modal, Button } from "react-bootstrap";
import TableTalks from "../../TableTalks";

const Talks = ({ show, handleClose, dataTalks }) => {
    return (
        <Modal show={show} onHide={handleClose} size="xl">
            <Modal.Header closeButton>
                <Modal.Title>Historial de Negociaciones</Modal.Title>
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

export default Talks;
