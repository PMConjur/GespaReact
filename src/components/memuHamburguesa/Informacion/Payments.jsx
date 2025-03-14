import React from "react";
import { Modal, Button } from "react-bootstrap";
import TablePayments from "../../TablePayments";


const Payments = ({ show, handleClose, data }) => {
    return (
        <Modal show={show} onHide={handleClose} size="xl">
            <Modal.Header closeButton>
                <Modal.Title>Pagos</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <TablePayments data={data} />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default Payments;