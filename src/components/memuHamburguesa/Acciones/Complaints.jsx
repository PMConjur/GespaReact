import React, { useState, useContext, useEffect } from 'react';
import { Modal, Button, Form, Table, Dropdown } from 'react-bootstrap';
import { fetchComplaints, fetchViewComplaints } from '../../../services/gespawebServices'; // Importar la función fetchComplaints y fetchViewComplaints
import { AppContext } from "../../../pages/Managment";
import { toast } from 'sonner'; // Importar toast de sonner
import "../../../scss/styles.scss"

const Complaints = ({ show, handleClose }) => {
  const { searchResults, idEjecutivo, nombreEjecutivo } = useContext(AppContext);

  const [formData, setFormData] = useState({
    idQueja: '', // Actualizar para reflejar el idQueja
    idInstitucion: '', // Actualizar para reflejar el idInstitucion
    folio: '',
    llamadaEntrada: false,
    comentarios: '',
    titular: false,
    solicitante: ''
  });

  const [complaints, setComplaints] = useState([]);

  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    // Verificar si todos los campos requeridos están llenos
    const isValid = formData.idQueja && formData.idInstitucion && formData.folio && formData.comentarios && formData.solicitante;
    setIsFormValid(isValid);
  }, [formData]);

  useEffect(() => {
    const fetchComplaintsData = async () => {
      if (searchResults.length > 0) {
        const idCuenta = searchResults[0].idCuenta;
        const idCartera = 1; // Ajusta según sea necesario
        try {
          const result = await fetchViewComplaints({ idCartera, idCuenta });
          console.log("Datos recibidos de fetchViewComplaints:", result);
          setComplaints(result);
        } catch (error) {
          toast.error('Error al cargar las quejas');
          console.error('Error al cargar las quejas:', error);
        }
      }
    };
  
    if (show) {
      fetchComplaintsData();
    }
  }, [show, searchResults]);
  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    // Si el checkbox "Titular" está marcado, establecer el valor de "solicitante" a "nombreEjecutivo"
    if (name === 'titular') {
      setFormData((prev) => ({
        ...prev,
        solicitante: value ? nombreEjecutivo : ''
      }));
    }
  };

  const handleReport = async () => {
    const idCuenta = searchResults.length > 0 ? searchResults[0].idCuenta : 'string'; // Obtener idCuenta de searchResults
    const currentTime = new Date().toLocaleTimeString('en-GB', { hour12: false });

    const requestData = {
      idCartera: 1,
      idCuenta: idCuenta, // Usar idCuenta de searchResults
      fechaInsert: new Date().toISOString(),
      segundoInsert: currentTime, // Usar el tiempo actual en formato HH:MM:SS
      folio: formData.folio,
      idEjecutivoInsert: idEjecutivo, // Usar idEjecutivo de searchResults
      idQueja: formData.idQueja, // Usar idQueja del formulario
      idInstitucion: formData.idInstitucion, // Usar idInstitucion del formulario
      solicitante: formData.solicitante,
      llamadaEntrada: formData.llamadaEntrada, // Usar llamadaEntrada del formulario
      numeroTelefonico: 5543397030, // Ajusta según sea necesario
      correoElectronico: 'prueba@gmail.com', // Ajusta según sea necesario
      idDomicilio: 0, // Ajusta según sea necesario
      comentario: formData.comentarios,
      numeroTelefonicoContacto: 5512327708, // Ajusta según sea necesario
      correoElectronicoContacto: 'prueba2@gmail.com' // Ajusta según sea necesario
    };

    try {
        const result = await fetchComplaints(requestData);
        toast.success('Queja guardada exitosamente'); // Mostrar notificación de éxito
        // Actualizar la lista de quejas si es necesario
      } catch (error) {
        toast.error('Error al guardar la queja'); // Mostrar notificación de error
        console.error('Error al guardar la queja:', error);
      }
    };

  return (
    <Modal show={show} onHide={handleClose} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>Quejas - Gespa</Modal.Title>
      </Modal.Header>
      <Modal.Body
        className="d-block d-lg-flex gap-4"
        style={{ maxHeight: "500px", overflowY: "auto" }}
      >
        <Form>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Form.Group className="mb-3" style={{ width: "48%" }}>
              <Form.Label>Tipo de queja</Form.Label>
              <Dropdown onSelect={(value) => handleChange("idQueja", value)}>
                <Dropdown.Toggle variant="primary" id="dropdown-queja">
                  {formData.idQueja || "Seleccionar"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item eventKey="1703">Defunción</Dropdown.Item>
                  <Dropdown.Item eventKey="1701">
                    Aplicación de Pagos
                  </Dropdown.Item>
                  {/* Agregar más opciones según sea necesario */}
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>
            <Form.Group className="mb-3" style={{ width: "48%" }}>
              <Form.Label>Origen</Form.Label>
              <Dropdown
                onSelect={(value) => handleChange("idInstitucion", value)}
              >
                <Dropdown.Toggle variant="primary" id="dropdown-institucion">
                  {formData.idInstitucion || "Seleccionar"}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item eventKey="3401">Conjur</Dropdown.Item>
                  <Dropdown.Item eventKey="3402">Ejemplo</Dropdown.Item>
                  {/* Agregar más opciones según sea necesario */}
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>
          </div>
          <Form.Group className="mb-3">
            <Form.Label>Folio</Form.Label>
            <Form.Control
              type="text"
              name="folio"
              value={formData.folio}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Check
              type="checkbox"
              label="Llamada de entrada"
              name="llamadaEntrada"
              checked={formData.llamadaEntrada}
              onChange={(e) => handleChange(e.target.name, e.target.checked)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Comentarios</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="comentarios"
              value={formData.comentarios}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
            />
          </Form.Group>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Form.Group className="mb-3" style={{ width: "48%" }}>
              <Form.Check
                type="checkbox"
                label="Titular"
                name="titular"
                checked={formData.titular}
                onChange={(e) => handleChange(e.target.name, e.target.checked)}
              />
            </Form.Group>
            <Form.Group className="mb-3" style={{ width: "48%" }}>
              <Form.Label>Solicitante</Form.Label>
              <Form.Control
                type="text"
                name="solicitante"
                value={formData.solicitante}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
              />
            </Form.Group>
          </div>
          <Button
            variant="danger"
            onClick={handleReport}
            style={{ width: "100%" }}
            disabled={!isFormValid}
          >
            Reportar
          </Button>
        </Form>
        <div
          className="scroll-container"
          style={{
            overflow: "auto",
            maxHeight: "500px",
            maxWidth: "800px",
            minWidth: "250px",
          }}
        >
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
                  <td>{complaint.Fecha_Insert || "--"}</td>
                  <td>{complaint.Segundo_Insert || "--"}</td>
                  <td>
                    {typeof complaint.Folio === "object" &&
                    Object.keys(complaint.Folio).length === 0
                      ? "--"
                      : complaint.Folio || "--"}
                  </td>
                  <td>{complaint.idQueja || "--"}</td>
                  <td>{complaint.idInstitución || "--"}</td>
                  <td>{complaint.Solicitante || "--"}</td>
                  <td>
                    {typeof complaint.NúmeroTelefónico === "object" &&
                    Object.keys(complaint.NúmeroTelefónico).length === 0
                      ? "--"
                      : complaint.NúmeroTelefónico || "--"}
                  </td>
                  <td>
                    {typeof complaint.CorreoElectrónico === "object" &&
                    Object.keys(complaint.CorreoElectrónico).length === 0
                      ? "--"
                      : complaint.CorreoElectrónico || "--"}
                  </td>
                  <td>{complaint.Comentario || "--"}</td>
                  <td>
                    {typeof complaint.TeléfonoContacto === "object" &&
                    Object.keys(complaint.TeléfonoContacto).length === 0
                      ? "--"
                      : complaint.TeléfonoContacto || "--"}
                  </td>
                  <td>
                    {typeof complaint.CorreoContacto === "object" &&
                    Object.keys(complaint.CorreoContacto).length === 0
                      ? "--"
                      : complaint.CorreoContacto || "--"}
                  </td>
                  <td>
                    {typeof complaint.idDomicilio === "object" &&
                    Object.keys(complaint.idDomicilio).length === 0
                      ? "--"
                      : complaint.idDomicilio || "--"}
                  </td>
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