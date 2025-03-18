import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Table, Col} from 'react-bootstrap';

const Addresses = ({ show, handleClose }) => {
  const [formData, setFormData] = useState({
    calle: '',
    numExt: '',
    numInt: '',
    codigoPostal: '',
    colonia: '',
    delegacion: '',
    estado: '',
    origen: 'Oficina'
  });

  const [addresses, setAddresses] = useState([
    { fecha: '15/01/2024', hora: '11:51 a. m.', contacto: 'John Doe', situacion: 'Pendiente', causaNoPago: 'N/A', nombre: 'John Doe', parentesco: 'N/A', sucursal: 'Oficina', colorFad: 'N/A' },
    { fecha: '15/01/2024', hora: '09:32 a. m.', contacto: 'Jane Doe', situacion: 'Completado', causaNoPago: 'N/A', nombre: 'Jane Doe', parentesco: 'N/A', sucursal: 'Oficina', colorFad: 'N/A' },
    { fecha: '27/07/2023', hora: '07:01 p. m.', contacto: 'Alice', situacion: 'Pendiente', causaNoPago: 'N/A', nombre: 'Alice', parentesco: 'N/A', sucursal: 'Oficina', colorFad: 'N/A' },
    { fecha: '27/07/2023', hora: '06:58 p. m.', contacto: 'Bob', situacion: 'Completado', causaNoPago: 'N/A', nombre: 'Bob', parentesco: 'N/A', sucursal: 'Oficina', colorFad: 'N/A' },
    { fecha: '26/04/2023', hora: '02:14 p. m.', contacto: 'Charlie', situacion: 'Pendiente', causaNoPago: 'N/A', nombre: 'Charlie', parentesco: 'N/A', sucursal: 'Oficina', colorFad: 'N/A' }
  ]);

  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const isValid = formData.calle && formData.numExt && formData.codigoPostal && formData.colonia && formData.delegacion && formData.estado;
    setIsFormValid(isValid);
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAddresses((prev) => [...prev, formData]);
    setFormData({
      calle: '',
      numExt: '',
      numInt: '',
      codigoPostal: '',
      colonia: '',
      delegacion: '',
      estado: '',
      origen: 'Oficina'
    });
  };

  return (
    <Modal show={show} onHide={handleClose} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>Domicilios - Gespa</Modal.Title>
      </Modal.Header>
      <Modal.Body className='d-block d-lg-flex gap-3' style={{maxHeight: '400px', overflowY: 'auto'}}>
        <Col>
        <Form onSubmit={handleSubmit} className='w-auto' style={{ maxHeight: '400px', overflowY: 'auto'}}>
          <Form.Group className="mb-3">
            <Form.Label>Calle</Form.Label>
            <Form.Control type="text" name="calle" value={formData.calle} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Num Ext</Form.Label>
            <Form.Control type="text" name="numExt" value={formData.numExt} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Num Int</Form.Label>
            <Form.Control type="text" name="numInt" value={formData.numInt} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Código Postal</Form.Label>
            <Form.Control type="text" name="codigoPostal" value={formData.codigoPostal} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Colonia / Localidad</Form.Label>
            <Form.Control type="text" name="colonia" value={formData.colonia} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Delegación / Municipio</Form.Label>
            <Form.Control type="text" name="delegacion" value={formData.delegacion} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Estado</Form.Label>
            <Form.Control type="text" name="estado" value={formData.estado} onChange={handleChange} required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Origen</Form.Label>
            <Form.Control as="select" name="origen" value={formData.origen} onChange={handleChange} required>
              <option value="Oficina">Oficina</option>
              <option value="Casa">Casa</option>
              <option value="Otro">Otro</option>
            </Form.Control>
          </Form.Group>
          <Button variant="primary" type="submit" disabled={!isFormValid}>
            Nuevo
          </Button>
        </Form>
        </Col>
        <div className='scroll-container' style={{ maxHeight: '400px', overflowY: 'auto', maxWidth: '800px'}}>
        <h5 className="mt-4">Visitas</h5>
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Contacto</th>
              <th>Situación</th>
              <th>CausaNoPago</th>
              <th>Nombre</th>
              <th>Parentesco</th>
              <th>Sucursal</th>
              <th>ColorFad</th>
            </tr>
          </thead>
          <tbody>
            {addresses.map((address, index) => (
              <tr key={index}>
                <td>{address.fecha}</td>
                <td>{address.hora}</td>
                <td>{address.contacto}</td>
                <td>{address.situacion}</td>
                <td>{address.causaNoPago}</td>
                <td>{address.nombre}</td>
                <td>{address.parentesco}</td>
                <td>{address.sucursal}</td>
                <td>{address.colorFad}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Addresses;