import React, { useState, useContext } from 'react';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import { fetchComplaints } from '../../../services/gespawebServices'; // Importar la función fetchComplaints
import { AppContext } from "../../../pages/Managment";
import "../../../scss/styles.scss"

const Complaints = ({ show, handleClose }) => {
  const { searchResults, idEjecutivo, nombreEjecutivo } = useContext(AppContext);

  const [formData, setFormData] = useState({
    idQueja: '', // Actualizar para reflejar el idQueja
    idInstitucion: '', // Actualizar para reflejar el idInstitucion
    folio: '',
    llamadaEntrada: false,
    comentarios: '',
    titular: '',
    solicitante: ''
  });

  const [complaints, setComplaints] = useState([
    { fecha: '20/01/2021', hora: '08:52 p. m.', folio: '01', queja: 'Defunción', institucion: 'Conjur', solicitante: 'Prueba', telefono: 'XXX-XXX-4050' },
    { fecha: '23/04/2022', hora: '10:16 a. m.', folio: '5684', queja: 'Aplicación de Pagos', institucion: 'Conjur', solicitante: 'Prueba', telefono: 'XXX-XXX-4050' },
    { fecha: '10/03/2025', hora: '06:07 p. m.', folio: '2110', queja: 'Defunción', institucion: 'Conjur', solicitante: 'Bruno', telefono: 'XXX-XXX-7030' },
    { fecha: '11/03/2025', hora: '05:55 a. m.', folio: '2110', queja: 'Defunción', institucion: 'Conjur', solicitante: 'Bruno', telefono: 'XXX-XXX-7030' },
    { fecha: '11/03/2025', hora: '03:55 a. m.', folio: '2110', queja: 'Defunción', institucion: 'Conjur', solicitante: 'Bruno', telefono: 'XXX-XXX-7030' }
  ]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleReport = async () => {
    const idCuenta = searchResults.length > 0 ? searchResults[0].idCuenta : 'string'; // Obtener idCuenta de searchResults


    const requestData = {
      idCartera: 1,
      idCuenta: idCuenta, // Usar idCuenta de searchResults
      fechaInsert: new Date().toISOString(),
      segundoInsert: "00:00:20", // Ajusta según sea necesario
      folio: formData.folio,
      idEjecutivoInsert: idEjecutivo, // Usar idEjecutivo de searchResults
      idQueja: formData.idQueja, // Usar idQueja del formulario
      idInstitucion: formData.idInstitucion, // Usar idInstitucion del formulario
      solicitante: nombreEjecutivo,
      llamadaEntrada: true, // Usar llamadaEntrada del formulario
      numeroTelefonico: 5543397030, // Ajusta según sea necesario
      correoElectronico: 'prueba@gmail.com', // Ajusta según sea necesario
      idDomicilio: 0, // Ajusta según sea necesario
      comentario: formData.comentarios,
      numeroTelefonicoContacto: 5512327708, // Ajusta según sea necesario
      correoElectronicoContacto: 'prueba2@gmail.com' // Ajusta según sea necesario
    };

    try {
      const result = await fetchComplaints(requestData);
      console.log('Queja guardada:', result);
      // Actualizar la lista de quejas si es necesario
    } catch (error) {
      console.error('Error al guardar la queja:', error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>Quejas - Gespa</Modal.Title>
      </Modal.Header>
      <Modal.Body className='d-block d-lg-flex gap-4'>
        <Form>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Form.Group className="mb-3" style={{ width: '48%' }}>
              <Form.Label>Tipo de queja</Form.Label>
              <Form.Control as="select" name="idQueja" value={formData.idQueja} onChange={handleChange}>
                <option value="">Seleccionar</option>
                <option value="1703">Defunción</option>
                <option value="1701">Aplicación de Pagos</option>
                {/* Agregar más opciones según sea necesario */}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3" style={{ width: '48%' }}>
              <Form.Label>Origen</Form.Label>
              <Form.Control as="select" name="idInstitucion" value={formData.idInstitucion} onChange={handleChange}>
                <option value="">Seleccionar</option>
                <option value="3401">Conjur</option>
                <option value="3402">Ejemplo</option>
                {/* Agregar más opciones según sea necesario */}
              </Form.Control>
            </Form.Group>
          </div>
          <Form.Group className="mb-3">
            <Form.Label>Folio</Form.Label>
            <Form.Control type="text" name="folio" value={formData.folio} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Llamada de entrada"
              name="llamadaEntrada"
              checked={formData.llamadaEntrada}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Comentarios</Form.Label>
            <Form.Control as="textarea" rows={3} name="comentarios" value={formData.comentarios} onChange={handleChange} />
          </Form.Group>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Form.Group className="mb-3" style={{ width: '48%' }}>
              <Form.Check
                type="checkbox"
                label="Titular"
                name="titular"
                checked={formData.titular}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" style={{ width: '48%' }}>
              <Form.Label>Solicitante</Form.Label>
              <Form.Control type="text" name="solicitante" value={formData.solicitante} onChange={handleChange} />
            </Form.Group>
          </div>
          <Button variant="danger" onClick={handleReport} style={{ width: '100%' }}>
            Reportar
          </Button>
        </Form>   
        <div className="scroll-container" style={{ overflow: 'auto', maxHeight: '500px', maxWidth: '800px', minWidth: '250px'}}>
        <h5 className="mt-4">Quejas</h5>
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Folio</th>
              <th>Queja</th>
              <th>Institución</th>
              <th>Solicitante</th>
              <th>Teléfono</th>
              <th>CorreoElectronico</th>
              <th>Comentario</th>
              <th>TelefonoContacto</th>
              <th>CorreoContacto</th>
              <th>Domicilio</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((complaint, index) => (
              <tr key={index}>
                <td>{complaint.fecha}</td>
                <td>{complaint.hora}</td>
                <td>{complaint.folio}</td>
                <td>{complaint.queja}</td>
                <td>{complaint.institucion}</td>
                <td>{complaint.solicitante}</td>
                <td>{complaint.telefono}</td>
                <td>{complaint.correoElectronico}</td>
                <td>{complaint.comentario}</td>
                <td>{complaint.telefonoContacto}</td>
                <td>{complaint.CorreoContacto}</td>
                <td>{complaint.Domicilio}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Complaints;