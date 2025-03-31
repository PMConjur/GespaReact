import { useState, useEffect, useContext } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import { fetchDrives } from '../../../services/gespawebServices';
import { AppContext } from '../../../pages/Managment';
import { toast } from 'sonner'; // Importar toast de sonner
import "../../../scss/styles.scss";

const AccionamientosTable = ({ data }) => {
  return (
    <div className='scroll-container' style={{ maxHeight: '70vh', overflowY: 'auto' }}>
      <Table striped bordered hover className="custom-table" variant='dark'>
        <thead>
          <tr>
            <th style={{ textAlign: "center" }}>Fecha</th>
            <th style={{ textAlign: "center" }}>Acercamiento</th>
            <th style={{ textAlign: "center" }}>Entregado</th>
            <th style={{ textAlign: "center" }}>Mensaje</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td style={{ textAlign: "left" }}>{item.Fecha_Insert.split("T")[0]}</td> {/* Solo muestra la fecha antes de la "T" */}
              <td style={{ textAlign: "left" }}>{item.Acercamiento}</td>
              <td style={{ textAlign: "left" }}>
                {typeof item._Entregado === "boolean" ? (item._Entregado ? "Sí" : "No") : ""}
              </td> {/* Maneja booleanos y valores no válidos */}
              <td style={{ textAlign: "left" }}>{item.Mensaje || ""}</td> {/* Muestra "--" si no hay mensaje */}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

const AccionamientosModal = ({ show, handleClose, data }) => {
  return (
    <Modal show={show} onHide={handleClose} size="xl" dialogClassName="dark-modal">
      <Modal.Header closeButton>
        <Modal.Title>Accionamientos</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <AccionamientosTable data={data} />
      </Modal.Body>
    </Modal>
  );
};

const Drives = ({ showModal, handleCloseModal }) => {
  const [accionamientosData, setAccionamientosData] = useState([]);
  const { searchResults } = useContext(AppContext);

  useEffect(() => {
    const fetchData = async () => {
      if (!searchResults || searchResults.length === 0) {
        toast.error("Error 428: Primero debes buscar una Cuenta"); // Mostrar notificación de error
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
        toast.success("Datos de accionamientos obtenidos exitosamente"); // Mostrar notificación de éxito
      } catch (error) {
        toast.error("Error al obtener los datos de accionamientos"); // Mostrar notificación de error
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