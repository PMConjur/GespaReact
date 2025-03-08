import React from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import "../../../scss/styles.scss";

const AccionamientosTable = ({ data }) => {
  return (
    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
      <Table striped bordered hover className="custom-table" variant='dark'>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Acercamiento</th>
            <th>Entregado</th>
            <th>Mensaje</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.Fecha_Insert}</td>
              <td>{item.idAcercamiento}</td>
              <td>{item._Entregado ? 'Sí' : 'No'}</td>
              <td>{item.Mensaje}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

const AccionamientosModal = ({ show, handleClose, data }) => {
  return (
    <Modal show={show} onHide={handleClose} size="lg" dialogClassName="dark-modal">
      <Modal.Header closeButton>
        <Modal.Title>Accionamientos - Gespa</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Tabla dentro del modal */}
        <AccionamientosTable data={data} />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AccionamientosModal;