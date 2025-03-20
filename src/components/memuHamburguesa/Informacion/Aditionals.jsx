import React from "react";
import { Modal, Button } from "react-bootstrap";
import TableAditionals from "../../TableAditionals";

const Aditionals = ({ show, handleClose, data }) => {
    return (
        <Modal show={show} onHide={handleClose} size="xl">
            <Modal.Header closeButton>
                <Modal.Title>Aditionales</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <TableAditionals data={data} />
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