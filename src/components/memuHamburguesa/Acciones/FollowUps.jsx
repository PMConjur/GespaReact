import React from "react";
import { Modal, Button } from "react-bootstrap";
import TableFollowUps from "../../TableFollowUps";


const FollowUps = ({ show, handleClose, data }) => {
    return (
        <Modal show={show} onHide={handleClose} size="xl">
            <Modal.Header closeButton>
                <Modal.Title>Seguimiento</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <TableFollowUps data={data} />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default FollowUps;