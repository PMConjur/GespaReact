import React, { useState, useContext, useEffect } from 'react';
import { Modal, Button, Form, Table, Dropdown, Col, FloatingLabel} from 'react-bootstrap';
import { fetchComplaints, fetchViewComplaints, fetchOriginComplaints, fetchDdComplaints} from '../../../services/gespawebServices';
import { AppContext } from "../../../pages/Managment";
import { toast } from 'sonner';
import "../../../scss/styles.scss";

const Complaints = ({ show, handleClose }) => {
  const { searchResults, idEjecutivo, nombreEjecutivo } = useContext(AppContext);

  const [formData, setFormData] = useState({
    idQueja: '',
    idInstitucion: '',
    folio: '',
    llamadaEntrada: false,
    comentarios: '',
    titular: false,
    solicitante: ''
  });

  const [complaints, setComplaints] = useState([]);
  const [originComplaints, setOriginComplaints] = useState([]); // Estado para almacenar los datos del endpoint
  const [isFormValid, setIsFormValid] = useState(false);
  const [ddComplaints, setDdComplaints] = useState([]);

  // Validar el formulario
  useEffect(() => {
    const isValid = formData.idQueja && formData.idInstitucion && formData.folio && formData.comentarios && formData.solicitante;
    setIsFormValid(isValid);
  }, [formData]);

  // Cargar las quejas
  useEffect(() => {
    const fetchComplaintsData = async () => {
      if (searchResults.length > 0) {
        const idCuenta = searchResults[0].idCuenta;
        const idCartera = 1;
        try {
          const result = await fetchViewComplaints({ idCartera, idCuenta });
          console.log("Datos recibidos de fetchViewComplaints:", result);
          setComplaints(result);
        } catch (error) {
          toast.error('Error 408: Error al cargar las quejas');
          console.error('Error al cargar las quejas:', error);
        }
      }
    };

    if (show) {
      fetchComplaintsData();
    }
  }, [show, searchResults]);

  // Cargar los orígenes de quejas
  useEffect(() => {
    const fetchOriginData = async () => {
      try {
        console.log("Llamando a fetchOriginComplaints");
        const result = await fetchOriginComplaints();
        console.log("Datos recibidos de fetchOriginComplaints:", result);
        

        // Mapear los datos para extraer idValor y Valor
        const mappedData = result.map((item) => ({
          id: item.idValor,
          descripcion: item.Valor,
        }));
        setOriginComplaints(mappedData); // Guardar los datos mapeados en el estado
      } catch (error) {
        toast.error("Error al cargar los orígenes de quejas");
        console.error("Error al cargar los orígenes de quejas:", error);
      }
    };

    fetchOriginData();
  }, []);

  // Cargar los tipos de quejas
  useEffect(() => {
    const fetchDdComplaintsData = async () => {
      try {
        console.log("Llamando a fetchDdComplaints");
        const result = await fetchDdComplaints();
        console.log("Datos recibidos de fetchDdComplaints:", result);

        // Mapear los datos para extraer idValor y Valor
        const mappedData = result.map((item) => ({
          id: item.idValor,
          descripcion: item.Valor,
        }));
        setDdComplaints(mappedData); // Guardar los datos mapeados en el estado
      } catch (error) {
        toast.error("Error al cargar los tipos de quejas");
        console.error("Error al cargar los tipos de quejas:", error);
      }
    };

    fetchDdComplaintsData();
  }, []);

  // Manejar cambios en el formulario
  const handleChange = (name, value) => {
    console.log("Cambio detectado:", name, value); // Verifica si los espacios se capturan
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "titular" && { solicitante: value ? nombreEjecutivo : "" }),
    }));
  };

  // Manejar el envío del formulario
  const handleReport = async () => {
    const idCuenta =
      searchResults.length > 0 ? searchResults[0].idCuenta : "string";
    const currentTime = new Date().toLocaleTimeString("en-GB", {
      hour12: false,
    });

    const requestData = {
      idCartera: 1,
      idCuenta: idCuenta,
      fechaInsert: new Date().toISOString(),
      segundoInsert: currentTime,
      folio: formData.folio,
      idEjecutivoInsert: idEjecutivo,
      idQueja: formData.idQueja,
      idInstitucion: formData.idInstitucion,
      solicitante: formData.solicitante,
      llamadaEntrada: formData.llamadaEntrada,
      numeroTelefonico: 0,
      correoElectronico: "",
      idDomicilio: 0,
      comentario: formData.comentarios,
      numeroTelefonicoContacto: 0,
      correoElectronicoContacto: "",
    };

    try {
      const result = await fetchComplaints(requestData);
      toast.success("Queja guardada exitosamente");
    } catch (error) {
      toast.error("Error al guardar la queja");
      console.error("Error al guardar la queja:", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="xl" >
      <Modal.Header closeButton>
        <Modal.Title>Quejas</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-block d-lg-flex gap-1">
        <Col>
          <div
            className="scroll-container"
            style={{ maxHeight: '70vh', overflowY: "auto" }}
          >
            <Form>
              <div style={{ justifyContent: "space-between" }}>
                <Form.Group className="mb-3">
                  <Form.Label>Tipo de queja</Form.Label>
                  <Dropdown
                    onSelect={(value) => {
                      const selectedComplaint = ddComplaints.find(
                        (complaint) => complaint.id === parseInt(value)
                      );
                      handleChange("idQueja", value); // Actualizar el idQueja
                      handleChange(
                        "tipoQuejaDescripcion",
                        selectedComplaint?.descripcion || ""
                      ); // Actualizar el texto seleccionado
                    }}
                  >
                    <Dropdown.Toggle
                      className="w-100"
                      variant="primary"
                      id="dropdown-queja"
                    >
                      {formData.tipoQuejaDescripcion || "Seleccionar"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu
                      style={{
                        maxHeight: "300px",
                        maxWidth: "300px",
                        overflowY: "auto", // Habilitar scroll vertical
                      }}
                    >
                      {ddComplaints.length > 0 ? (
                        ddComplaints.map((complaint) => (
                          <Dropdown.Item
                            key={complaint.id}
                            eventKey={complaint.id}
                          >
                            {complaint.descripcion}
                          </Dropdown.Item>
                        ))
                      ) : (
                        <Dropdown.Item disabled>
                          No hay datos disponibles
                        </Dropdown.Item>
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                </Form.Group>
                <Form.Group className="mb-1" style={{ width: "100%" }}>
                  <Form.Label>Origen</Form.Label>
                  <Dropdown
                    onSelect={(value) => {
                      const selectedOrigin = originComplaints.find(
                        (origin) => origin.id === parseInt(value)
                      );
                      handleChange("idInstitucion", value); // Actualizar el idInstitucion
                      handleChange(
                        "institucionDescripcion",
                        selectedOrigin?.descripcion || ""
                      ); // Actualizar el texto seleccionado
                    }}
                  >
                    <Dropdown.Toggle
                      className="w-100"
                      variant="primary"
                      id="dropdown-institucion"
                    >
                      {formData.institucionDescripcion || "Seleccionar"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu
                      style={{
                        maxHeight: "300px", // Altura máxima del menú desplegable
                        overflowY: "auto", // Habilitar scroll vertical
                      }}
                    >
                      {originComplaints.length > 0 ? (
                        originComplaints.map((origin) => (
                          <Dropdown.Item key={origin.id} eventKey={origin.id}>
                            {origin.descripcion}
                          </Dropdown.Item>
                        ))
                      ) : (
                        <Dropdown.Item disabled>
                          No hay datos disponibles
                        </Dropdown.Item>
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                </Form.Group>
              </div>
              <Form.Group className="mb-1">
                <Form.Label>Folio</Form.Label>
                <Form.Control
                  type="text"
                  name="folio"
                  value={formData.folio}
                  onChange={(e) => handleChange(e.target.name, e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Check
                  type="checkbox"
                  label="Llamada de entrada"
                  name="llamadaEntrada"
                  checked={formData.llamadaEntrada}
                  onChange={(e) =>
                    handleChange(e.target.name, e.target.checked)
                  }
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Comentarios</Form.Label>
                <textarea
                  className="form-control"
                  rows={3}
                  name="comentarios"
                  placeholder="Escribe un comentario aquí"
                  value={formData.comentarios}
                  onChange={(e) => {
                    console.log("Valor del textarea:", e.target.value); // Verifica el valor en tiempo real
                    handleChange(e.target.name, e.target.value); // Pasa el valor sin modificaciones
                  }}
                />
              </Form.Group>
              <div style={{ display: "", justifyContent: "space-between" }}>
                <Form.Group className="mb-1 mt-2" style={{ width: "48%" }}>
                  <Form.Check
                    type="checkbox"
                    label="Titular"
                    name="titular"
                    checked={formData.titular}
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.checked)
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3 w-100" style={{ width: "48%" }}>
                  <Form.Label>Solicitante</Form.Label>
                  <Form.Control
                    className="w-100"
                    type="text"
                    name="solicitante"
                    value={formData.solicitante}
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.value)
                    }
                  />
                </Form.Group>
              </div>
              <Button
                className="mt-3"
                variant="danger"
                onClick={handleReport}
                style={{ width: "100%" }}
                disabled={!isFormValid}
              >
                Reportar
              </Button>
            </Form>
          </div>
        </Col>
        <div
          className="scroll-container"
          style={{
            overflow: "auto",
            maxHeight: '70vh',
            maxWidth: "800px",
            minWidth: "250px",
          }}
        >
          <h5 className="">Quejas</h5>
          <Table striped bordered hover variant="dark" className="sticky-header-table">
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
      <Modal.Footer>
        {/* Espacio del footer vacío */}
      </Modal.Footer>
    </Modal>
  );
};

export default Complaints;