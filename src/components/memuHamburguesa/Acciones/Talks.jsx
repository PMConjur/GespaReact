import React from "react";
import { Modal, Button } from "react-bootstrap";
import TableTalks from "../../TableTalks";


const Talks = ({ show, handleClose, data }) => {
    return (
        <Modal show={show} onHide={handleClose} size="xl">
            <Modal.Header closeButton>
                <Modal.Title>Negociaciones</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <TableTalks data={data} />
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
