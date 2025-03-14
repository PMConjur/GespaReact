import React from "react";
import { Modal, Button } from "react-bootstrap";
import TableOnlineCharge from "../../TableOnlineCharge";


const Onlinecharge = ({ show, handleClose, data }) => {
    return (
        <Modal show={show} onHide={handleClose} size="xl">
            <Modal.Header closeButton>
                <Modal.Title>Cargos en Linea</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <TableOnlineCharge data={data} />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default Onlinecharge;