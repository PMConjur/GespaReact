import React, { useContext, useState, useEffect, useRef } from "react"; // Asegúrate de importar useRef
import { Modal, Table, Button, Card, Form, Col, Spinner} from "react-bootstrap";
import {
  fetchAccoutStatements,
  fetchSaveAccount,
  fetchEmailsCharging
} from "../../../services/gespawebServices";
import { AppContext } from "../../../pages/Managment";
import { toast } from "sonner";
import "../../../scss/styles.scss";

const EstadoCuentaModal = ({ show, handleClose }) => {
  const [accountData, setAccountData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: "",
    endDate: ""
  });
  const [selectedEmail, setSelectedEmail] = useState("");
  const [selectedOption, setSelectedOption] = useState(false);
  const [selectedOptionEnvio, setSelectedOptionEnvio] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [validEmails, setValidEmails] = useState([]);
  const responseData =
    location.state || JSON.parse(localStorage.getItem("responseData"));

  const { searchResults } = useContext(AppContext);

  // Referencias para los inputs de fecha
  const startDateInputRef = useRef(null);
  const endDateInputRef = useRef(null);


  useEffect(() => {
    const isValid =
      selectedDateRange.startDate &&
      selectedDateRange.endDate &&
      (selectedOptionEnvio ? selectedEmail : true);
    setIsFormValid(isValid);
  }, [selectedDateRange, selectedEmail, selectedOptionEnvio]);

  const handleAccountStatement = async () => {
    if (!searchResults || searchResults.length === 0) {
      toast.error("Primero debes buscar una Cuenta");
      return;
    }

    setLoading(true);
    try {
      const accounts = await Promise.all(
        searchResults.map(async (result) => {
          const idCuenta = result.idCuenta.trim();
          return await fetchAccoutStatements(1, idCuenta);
        })
      );

      setAccountData(accounts.flat());
    } catch (error) {
      toast.error("Error 408: No se obtuvo respuesta:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (show) {
      handleAccountStatement();
    }
  }, [show, searchResults]);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setSelectedDateRange(prev => ({ ...prev, [name]: value }));
  };

  const handleEmailChange = (e) => {
    setSelectedEmail(e.target.value);
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.checked);
  };

  const handleEnvioSwitchChange = async (e) => {
    const isChecked = e.target.checked;
    setSelectedOptionEnvio(isChecked);

    if (isChecked) {
      if (!searchResults || searchResults.length === 0) {
        toast.error("Error 428: Primero debes buscar una Cuenta");
        return;
      }

      try {
        const idCartera = 1;
        const idCuenta = searchResults?.[0]?.idCuenta?.trim();
        const emails = await fetchEmailsCharging(idCartera, idCuenta);

        const extractedEmails = emails.map((emailObj) => emailObj.CorreoElectrónico);
        setValidEmails(extractedEmails || []);

        if (extractedEmails.length > 0) {
          setSelectedEmail(extractedEmails[0]);
        }
      } catch (error) {
        console.error("Error al obtener los correos válidos:", error);
        toast.error("Error al cargar los correos válidos.");
      }
    }
  };

  const validateDates = () => {
    const { startDate, endDate } = selectedDateRange;

    if (startDate && endDate && startDate > endDate) {
      toast.warning("La fecha inicial no puede ser posterior a la final");
      return false;
    }

    if (startDate && endDate && endDate < startDate) {
      toast.warning("La fecha final no puede ser anterior a la inicial");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateDates()) {
      return;
    }

    if (!isFormValid) {
      toast.error("Por favor, complete todos los campos requeridos.");
      return;
    }

    const idEjecutivo = responseData?.ejecutivo?.infoEjecutivo?.idEjecutivo;
    const requestData = {
      idCartera: 1,
      idCuenta: searchResults?.[0]?.idCuenta.trim() || "string",
      idEjecutivo: idEjecutivo,
      fechaInicial: selectedDateRange.startDate,
      fechaFinal: selectedDateRange.endDate,
      consulta: selectedOption,
      correoElectrónico: selectedEmail
    };

    try {
      const response = await fetchSaveAccount(requestData);
      toast.success("Solicitud enviada correctamente.");

      setSelectedDateRange({ startDate: "", endDate: "" });
      setSelectedEmail("");
      setSelectedOption(false);
      setSelectedOptionEnvio(false);

      await handleAccountStatement();
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      toast.error("Hubo un error al enviar la solicitud.");
    }
  };

  // Función para abrir el calendario nativo al hacer clic en el icono
  const handleCalendarIconClick = (inputRef) => {
    if (inputRef.current) {
      inputRef.current.showPicker(); // Este método es la clave
    }
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Estado de Cuenta</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto", position: "relative" }}>
        <div className="d-block d-lg-flex w-100">
          <div>
            <div className="flex-grow-1 scroll-container" style={{ overflow: "auto", maxWidth: "800px", marginBottom: "auto", maxHeight: "70vh" }}>
              {loading ? (
                <div className="vw-100 vh-100 d-flex justify-content-center align-items-center">
                  <span><Spinner animation="border" /></span>
                </div>
              ) : accountData.length > 0 ? (
                <div>
                  <Table striped bordered hover variant="dark" className="custom-table-account" style={{ tableLayout: "auto", whiteSpace: "nowrap" }}>
                    <thead style={{ position: "sticky", top: 0, backgroundColor: "#343a40", zIndex: 1 }}>
                      <tr>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Nombre</th>
                        <th>Fecha Inicial</th>
                        <th>Fecha Final</th>
                        <th>Consulta</th>
                        <th>Correo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {accountData.map((item, index) => (
                        <tr key={index}>
                          <td style={{ textAlign: "left" }}>{item.Fecha_Insert?.split("T")[0] || "--"}</td>
                          <td style={{ textAlign: "left" }}>{item.Segundo_Insert}</td>
                          <td style={{ textAlign: "left" }}>{item.NombreEjecutivo}</td>
                          <td style={{ textAlign: "left" }}>{item.FechaInicial?.split("T")[0] || "--"}</td>
                          <td style={{ textAlign: "left" }}>{item.FechaFinal?.split("T")[0] || "--"}</td>
                          <td style={{ textAlign: "left" }}>{item._Consulta}</td>
                          <td style={{ textAlign: "left" }}>
                            {item["Correo Electrónico"] && typeof item["Correo Electrónico"] === "string"
                              ? item["Correo Electrónico"]
                              : "--"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <p className="text-center mt-3">No hay datos disponibles</p>
              )}
            </div>
          </div>
          {accountData.length > 0 && (
            <Col className="w-100">
              <Card className="ml-3" style={{ width: "100%", marginBottom: "0px"}}>
                <Card.Body style={{ padding: "5px", width: "100%"}}>
                  <Card.Title style={{ paddingTop: "0px" }}>Solicitar</Card.Title>
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Desde</Form.Label>
                      <div
                        className="date-input-wrapper"
                        style={{
                          position: 'relative',
                          display: 'flex',
                          alignItems: 'center',
                          border: '1px solid rgb(50, 50, 51)', // Bootstrap default border
                          borderRadius: '.25rem', // Bootstrap default border-radius
                          padding: '.375rem .75rem', // Bootstrap default padding for form-control
                          backgroundColor: '#fff',
                          cursor: 'pointer' // Indicar que es clicable
                        }}
                        onClick={() => handleCalendarIconClick(startDateInputRef)} // Abre el calendario al hacer clic en el div
                      >
                        <Form.Control
                          type="date"
                          name="startDate"
                          value={selectedDateRange.startDate}
                          onChange={handleDateChange}
                          required
                          ref={startDateInputRef} // Asocia la referencia
                          style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            top: 0,
                            left: 0,
                            opacity: 0, // Ahora sí podemos usar opacity: 0 de forma segura
                            padding: 0, // Quita padding extra del input
                            border: 'none', // Quita el borde del input
                            backgroundColor: 'transparent', // Quita el fondo del input
                            cursor: 'pointer'
                          }}
                        />
                        {/* Tu icono personalizado */}
                        <i className="bi bi-calendar-event" style={{ marginRight: '0.5rem' }}></i>
                        {/* El texto de la fecha seleccionada */}
                        <span>{selectedDateRange.startDate || 'Seleccionar fecha'}</span>
                      </div>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Hasta</Form.Label>
                      <div
                        className="date-input-wrapper"
                        style={{
                          position: 'relative',
                          display: 'flex',
                          alignItems: 'center',
                          border: '1px solid rgb(58, 59, 59)',
                          borderRadius: '.25rem',
                          padding: '.375rem .75rem',
                          backgroundColor: '#fff',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleCalendarIconClick(endDateInputRef)}
                      >
                        <Form.Control
                          type="date"
                          name="endDate"
                          value={selectedDateRange.endDate}
                          onChange={handleDateChange}
                          required
                          ref={endDateInputRef} // Asocia la referencia
                          style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            top: 0,
                            left: 0,
                            opacity: 0,
                            padding: 0,
                            border: 'none',
                            backgroundColor: 'transparent',
                            cursor: 'pointer'
                          }}
                        />
                        {/* Tu icono personalizado */}
                        <i className="bi bi-calendar-event" style={{ marginRight: '0.5rem' }}></i>
                        {/* El texto de la fecha seleccionada */}
                        <span>{selectedDateRange.endDate || 'Seleccionar fecha'}</span>
                      </div>
                    </Form.Group>

                    <div className="d-flex gap-2 mb-3 justify-content-between">
                      <Form.Switch
                        label="Consulta"
                        name="option"
                        checked={selectedOption}
                        onChange={handleOptionChange}
                      />
                      <Form.Switch
                        label="Envio"
                        name="envio"
                        checked={selectedOptionEnvio}
                        onChange={handleEnvioSwitchChange}
                      />
                    </div>

                    {selectedOptionEnvio && (
                      <Form.Group className="mb-3">
                        <Form.Label>Correo</Form.Label>
                        <Form.Select
                          value={selectedEmail}
                          onChange={handleEmailChange}
                          required
                        >
                          <option value="">Seleccione un correo</option>
                          {validEmails.map((email, index) => (
                            <option key={index} value={email}>
                              {email}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    )}

                    <Button
                      variant="primary"
                      type="button"
                      className="w-100"
                      onClick={handleSubmit}
                      disabled={!isFormValid}
                    >
                      Solicitar
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          )}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default EstadoCuentaModal;