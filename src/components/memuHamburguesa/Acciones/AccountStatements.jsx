import { useContext, useState, useEffect } from "react";
<<<<<<< HEAD
import { Modal, Table, Button, Card, Form, Col} from "react-bootstrap";
import { fetchAccoutStatements, fetchSaveAccount } from "../../../services/gespawebServices";
=======
import { Modal, Table, Button, Card, Form } from "react-bootstrap";
import {
  fetchAccoutStatements,
  fetchSaveAccount
} from "../../../services/gespawebServices";
>>>>>>> origin/HU22--Flujo
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
  const [isFormValid, setIsFormValid] = useState(false); // Estado para controlar la validez del formulario
  const responseData =
    location.state || JSON.parse(localStorage.getItem("responseData"));

  const { searchResults } = useContext(AppContext);

  // Validar si el formulario está completo
  useEffect(() => {
    const isValid =
      selectedDateRange.startDate &&
      selectedDateRange.endDate &&
      selectedEmail;
    setIsFormValid(isValid);
  }, [selectedDateRange, selectedEmail]);

  // Obtener datos de estado de cuenta
  const handleAccountStatement = async () => {
    if (!searchResults || searchResults.length === 0) {
      toast.error("Error 428: Primero debes buscar una Cuenta");
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
    //console.log("Modal abierto:", show); // Verifica que el modal se abra correctamente
    if (show) {
      handleAccountStatement();
    }
  }, [show, searchResults]);

  // Manejo de cambios en fecha y correo
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setSelectedDateRange((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailChange = (e) => {
    setSelectedEmail(e.target.value);
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.checked);
  };

  // Envío de datos al endpoint
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit ejecutado");
<<<<<<< HEAD

    // Validar campos obligatorios
    if (!selectedDateRange.startDate || !selectedDateRange.endDate || !selectedEmail) {
      toast.error("Por favor, complete todos los campos antes de enviar la solicitud.");
=======

    console.log("Iniciando handleSubmit...");

    // Validar campos obligatorios
    if (
      !selectedDateRange.startDate ||
      !selectedDateRange.endDate ||
      !selectedEmail
    ) {
      alert(
        "Por favor, complete todos los campos antes de enviar la solicitud."
      );
>>>>>>> origin/HU22--Flujo
      return;
    }

    const idEjecutivo = responseData?.ejecutivo?.infoEjecutivo?.idEjecutivo;
    const requestData = {
      idCartera: 1,
      idCuenta: searchResults?.[0]?.idCuenta.trim() || "string",
      idEjecutivo: idEjecutivo,
      fechaInicial: new Date(selectedDateRange.startDate).toISOString(),
      fechaFinal: new Date(selectedDateRange.endDate).toISOString(),
<<<<<<< HEAD
      consulta: selectedOption,
      correoElectrónico: selectedEmail,
=======
      consulta: selectedOption === "consulta", // true si es consulta, false si es envío
      correoElectrónico: selectedEmail
>>>>>>> origin/HU22--Flujo
    };

    try {
      const response = await fetchSaveAccount(requestData);
      toast.success("Solicitud enviada correctamente.");
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      toast.error("Hubo un error al enviar la solicitud.");
    }
  };

  // Filtrar correos válidos
  const validEmails = accountData
    .map((item) => item["Correo Electrónico"])
    .filter((email) => typeof email === "string");

  return (
    <Modal show={show} onHide={handleClose} size="xl" centered>
      <Modal.Header closeButton>
        <Modal.Title>Estado de Cuenta - Gespa</Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ padding: "5px 10px", maxHeight: '420px', overflowY: 'auto'}}>
        <div className="d-block d-lg-flex">
          <div>
            <div
              className="flex-grow-1 scroll-container"
              style={{
                overflow: "auto ",
                maxWidth: "800px",
                maxHeight: "420px",
                marginBottom: "auto",
                height: "100%",
              }}
            >
              {loading ? (
                <p>Cargando datos...</p>
              ) : (
                <div>
                  <Table striped bordered hover variant="dark" className="custom-table-account">
                    <thead>
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
                          <td>{item.Fecha_Insert}</td>
                          <td>{item.Segundo_Insert}</td>
                          <td>{item.NombreEjecutivo}</td>
                          <td>{item.FechaInicial}</td>
                          <td>{item.FechaFinal}</td>
                          <td>{item._Consulta}</td>
                          <td>
                            {item["Correo Electrónico"] &&
                            typeof item["Correo Electrónico"] === "string"
                              ? item["Correo Electrónico"]
                              : "--"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </div>
          </div>
          <Col>
          <Card className="ml-3 w-auto" style={{ width: "18rem", marginBottom: "0px" }}>
            <Card.Body style={{ padding: "5px" }}>
              <Card.Title style={{ paddingTop: "0px" }}>
                Solicitar Estado de Cuenta
              </Card.Title>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha Inicial</Form.Label>
                  <Form.Control
                    type="date"
                    name="startDate"
                    value={selectedDateRange.startDate}
                    onChange={handleDateChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Fecha Final</Form.Label>
                  <Form.Control
                    type="date"
                    name="endDate"
                    value={selectedDateRange.endDate}
                    onChange={handleDateChange}
                    required
                  />
                </Form.Group>
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

                <div className="d-grid gap-2 mb-3">
                  <Form.Switch
                    label="Consulta"
                    name="option"
                    checked={selectedOption}
                    onChange={handleOptionChange}
                  />
                </div>

                <Button
                  variant="primary"
                  type="button"
                  style={{ borderRadius: "20px" }}
                  onClick={handleSubmit}
                  disabled={!isFormValid} // Deshabilitar el botón si el formulario no es válido
                >
                  Solicitar
                </Button>
              </Form>
            </Card.Body>
          </Card>
          </Col>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default EstadoCuentaModal;