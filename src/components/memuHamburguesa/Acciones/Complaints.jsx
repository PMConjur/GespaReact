import { useState, useContext, useEffect } from 'react';
import { Modal, Button, Form, Table, Dropdown, Col, Spinner} from 'react-bootstrap';
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
  const [isLoading, setIsLoading] = useState(false); // Estado para la animación de carga

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
    console.log(`Cambio detectado en ${name}:`, value);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "titular" && { solicitante: value ? nombreEjecutivo : "" }),
    }));
  };

  const handleFolioChange = (e) => {
    const { name, value } = e.target;
    const regex = /^[0-9]*$/; // Solo permite números
  
    if (regex.test(value)) {
      handleChange(name, value); // Actualiza el estado si el valor es válido
    } else {
      toast.warning("Solo se permiten números en el folio."); // Muestra un mensaje de advertencia
    }
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
      setIsLoading(true); // Inicia la animación de carga
      const result = await fetchComplaints(requestData);
      toast.success("Queja guardada exitosamente");

      // Limpia el formulario después de guardar
      setFormData({
        idQueja: '',
        idInstitucion: '',
        folio: '',
        llamadaEntrada: false,
        comentarios: '',
        titular: false,
        solicitante: ''
      });

      // Actualiza la tabla de quejas
      const updatedComplaints = await fetchViewComplaints({
        idCartera: 1,
        idCuenta,
      });
      setComplaints(updatedComplaints);
    } catch (error) {
      toast.error("Error al guardar la queja");
      console.error("Error al guardar la queja:", error);
    } finally {
      setIsLoading(false); // Finaliza la animación de carga
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Quejas</Modal.Title>
      </Modal.Header>
      <Modal.Body className="d-block d-lg-flex gap-1">
        <Col>
          <div
            className="scroll-container"
            style={{ maxHeight: "70vh", overflowY: "auto" }}
          >
            <Form>
              <div className="mb-3">
                <Form.Group className="mb-3">
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
                      {formData.tipoQuejaDescripcion || "Tipo de queja"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="dropdown-menu">
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
                <Form.Group className="mb-1 full-width">
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
                      {formData.institucionDescripcion || "Origen"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="dropdown-menu">
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

                <Form.Control
                  type="text"
                  name="folio"
                  placeholder='Folio'
                  value={formData.folio}
                  onChange={handleFolioChange} // Usa la función específica para manejar el cambio
                />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Check
                  key={formData.llamadaEntrada} // Fuerza el re-renderizado cuando cambia el estado
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
                <textarea
                  className="form-control"
                  rows={3}
                  name="comentarios"
                  placeholder="Escribir comentario"
                  value={formData.comentarios}
                  onChange={(e) => {
                    console.log("Valor del textarea:", e.target.value); // Verifica el valor en tiempo real
                    handleChange(e.target.name, e.target.value); // Pasa el valor sin modificaciones
                  }}
                  onKeyDown={(e) => e.key === ' ' && e.stopPropagation()}
                />
              </Form.Group>
              <div className="">
                <Form.Group className="mb-1 mt-2 half-width">
                  <Form.Check
                    key={formData.titular} // Fuerza el re-renderizado cuando cambia el estado
                    type="checkbox"
                    label="Titular"
                    name="titular"
                    checked={formData.titular}
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.checked)
                    }
                  />
                </Form.Group>
                <Form.Group className="mb-3 w-100 half-width">
                  <Form.Control
                    className="w-100"
                    type="text"
                    name="solicitante"
                    placeholder="Solicitante"
                    value={formData.solicitante}
                    onChange={(e) =>
                      handleChange(e.target.name, e.target.value)
                    }
                  />
                </Form.Group>
              </div>
              <Button
                className="mt-3 full-width"
                variant="danger"
                onClick={handleReport}
                disabled={!isFormValid || isLoading} // Deshabilita el botón mientras carga
              >
                {isLoading ? "Guardando..." : "Reportar"}{" "}
                {/* Cambia el texto durante la carga */}
              </Button>
            </Form>
            <style jsx>{`
              .form-row {
                display: flex;
                justify-content: space-between;
              }
              .full-width {
                width: 100%;
              }
              .half-width {
                width: 48%;
              }
              .dropdown-menu {
                max-height: 300px;
                overflow-y: auto;
              }
            `}</style>
          </div>
        </Col>
        <div
          className="table-responsive custom-scrollbar"
          style={{
            maxHeight: "70vh",
            maxWidth: "800px",
            minWidth: "250px",
            overflowY: "auto", // Habilitar scroll vertical
          }}
        >
          <Table
            striped
            bordered
            hover
            variant="dark"
            style={{ tableLayout: "auto", whiteSpace: "nowrap" }} // Ajusta el ancho al contenido y evita el salto de línea
          >
            <thead
              style={{
                position: "sticky",
                top: 0,
                backgroundColor: "#343a40",
                zIndex: 1,
              }}
            >
              <tr>
                <th style={{ textAlign: "center" }}>Fecha</th>
                <th style={{ textAlign: "center" }}>Hora</th>
                <th style={{ textAlign: "center" }}>Folio</th>
                <th style={{ textAlign: "center" }}>Queja</th>
                <th style={{ textAlign: "center" }}>Institución</th>
                <th style={{ textAlign: "center" }}>Solicitante</th>
                <th style={{ textAlign: "center" }}>Teléfono</th>
                <th style={{ textAlign: "center" }}>CorreoElectronico</th>
                <th style={{ textAlign: "center" }}>Comentario</th>
                <th style={{ textAlign: "center" }}>TelefonoContacto</th>
                <th style={{ textAlign: "center" }}>CorreoContacto</th>
                <th style={{ textAlign: "center" }}>Domicilio</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="12" className="text-center">
                    <Spinner animation="border" />
                  </td>
                </tr>
              ) : (
                complaints.map((complaint, index) => (
                  <tr key={index}>
                    <td style={{ textAlign: "left" }}>
                      {complaint.Fecha_Insert?.split("T")[0] || "--"}
                    </td>{" "}
                    {/* Solo muestra la fecha antes de la 'T' */}
                    <td style={{ textAlign: "left" }}>
                      {complaint.Segundo_Insert || "--"}
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {typeof complaint.Folio === "object" &&
                      Object.keys(complaint.Folio).length === 0
                        ? "--"
                        : complaint.Folio || "--"}
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {complaint.Queja || "--"}
                    </td>{" "}
                    {/* Muestra el valor de Queja */}
                    <td style={{ textAlign: "left" }}>
                      {complaint.Institución || "--"}
                    </td>{" "}
                    {/* Muestra el valor de Institución */}
                    <td style={{ textAlign: "left" }}>
                      {complaint.Solicitante || "--"}
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {typeof complaint.NúmeroTelefónico === "object" &&
                      Object.keys(complaint.NúmeroTelefónico).length === 0
                        ? "--"
                        : complaint.NúmeroTelefónico || "--"}
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {typeof complaint.CorreoElectrónico === "object" &&
                      Object.keys(complaint.CorreoElectrónico).length === 0
                        ? "--"
                        : complaint.CorreoElectrónico || "--"}
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {complaint.Comentario || "--"}
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {typeof complaint.TeléfonoContacto === "object" &&
                      Object.keys(complaint.TeléfonoContacto).length === 0
                        ? "--"
                        : complaint.TeléfonoContacto || "--"}
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {typeof complaint.CorreoContacto === "object" &&
                      Object.keys(complaint.CorreoContacto).length === 0
                        ? "--"
                        : complaint.CorreoContacto || "--"}
                    </td>
                    <td style={{ textAlign: "left" }}>
                      {typeof complaint.idDomicilio === "object" &&
                      Object.keys(complaint.idDomicilio).length === 0
                        ? "--"
                        : complaint.idDomicilio || "--"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Complaints;