import React, { useState, useEffect, useContext } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import { fetchDrives } from '../../../services/gespawebServices';
import { AppContext } from '../../../pages/Managment';
import "../../../scss/styles.scss";

const AccionamientosTable = ({ data }) => {
  return (
    <div className='scroll-container' style={{ maxHeight: '400px', overflowY: 'auto' }}>
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

const Drives = ({ showModal, handleCloseModal }) => {
  const [accionamientosData, setAccionamientosData] = useState([]);
  const { searchResults } = useContext(AppContext);

  useEffect(() => {
    const fetchData = async () => {
      if (!searchResults || searchResults.length === 0) {
        console.error("No hay resultados de búsqueda disponibles");
        return;
      }

      try {
        const drives = await Promise.all(
          searchResults.map(async (result) => {
            const idCuenta = result.idCuenta.trim();
            return await fetchDrives(1, idCuenta);
          })
        );

        setAccionamientosData(drives.flat());
      } catch (error) {
        console.error("Error al obtener los datos de accionamientos:", error);
      }
    };

    if (showModal) {
      fetchData();
    }
  }, [showModal, searchResults]);

  return (
    <AccionamientosModal show={showModal} handleClose={handleCloseModal} data={accionamientosData} />
  );
};

export default Drives;