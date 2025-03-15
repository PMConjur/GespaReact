import { useContext, useState, useEffect } from "react";
import { Modal, Table, Button, Card, Form } from "react-bootstrap";
import { fetchAccoutStatements, fetchSaveAccount } from "../../../services/gespawebServices";
import { AppContext } from "../../../pages/Managment";
import { toast } from "sonner";
import "../../../scss/styles.scss"

const EstadoCuentaModal = ({ show, handleClose }) => {
  const [accountData, setAccountData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [selectedEmail, setSelectedEmail] = useState("");
  const [selectedOption, setSelectedOption] = useState(false);
  const responseData =
    location.state || JSON.parse(localStorage.getItem("responseData"));

  const { searchResults } = useContext(AppContext);

  // Obtener datos de estado de cuenta
  const handleAccountStatement = async () => {
    if (!searchResults || searchResults.length === 0) {
      toast.error("No hay resultados de búsqueda disponibles");
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
      toast.error("No se obtuvo respuesta:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Modal abierto:", show); // Verifica que el modal se abra correctamente
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

    console.log("Iniciando handleSubmit...");

    // Validar campos obligatorios
    if (!selectedDateRange.startDate || !selectedDateRange.endDate || !selectedEmail) {
      toast.error("Por favor, complete todos los campos antes de enviar la solicitud.");
      return;
    }

    console.log("Campos validados correctamente.");

    const idEjecutivo = responseData?.ejecutivo?.infoEjecutivo?.idEjecutivo;
    // Construir el objeto de datos para enviar al endpoint
    const requestData = {
      idCartera: 1, // Ajusta según necesidad
      idCuenta: searchResults?.[0]?.idCuenta.trim() || "string", // Obtener idCuenta del primer resultado
      idEjecutivo: idEjecutivo, // Ajusta según necesidad o obtén del contexto
      fechaInicial: new Date(selectedDateRange.startDate).toISOString(),
      fechaFinal: new Date(selectedDateRange.endDate).toISOString(),
      consulta: selectedOption, // true si es consulta, false si es envío
      correoElectrónico: selectedEmail,
    };

    console.log("Datos a enviar:", requestData);
    try {
      console.log("Enviando datos al endpoint...");
      const response = await fetchSaveAccount(requestData);
      console.log("Respuesta del servidor:", response);
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
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Estado de Cuenta - Gespa</Modal.Title>
      </Modal.Header>

      <Modal.Body  style={{ padding: "5px 10px" }}>
        <div className="d-block d-lg-flex">
          <div>
            <div
              className="flex-grow-1 scroll-container"
              style={{
                overflow: "auto ",
                maxWidth: "550px",
                maxHeight: "375px",
                marginBottom: "auto",
                height: "100%",
              }}
            >
              {loading ? (
                <p>Cargando datos...</p>
              ) : (
                <div style={{}}>
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
            <div>
              <Button
                variant="secondary"
                onClick={handleClose}
                style={{ marginBottom: "30px", marginTop: "10px" }}
              >
                Cerrar
              </Button>
            </div>
          </div>
          {/* Card para ingresar datos */}
          <Card
            className="ml-3"
            style={{ width: "18rem", marginBottom: "0px" }}
          >
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

                {/* Opciones de consulta */}
                <div className="d-grid gap-2 mb-3">
                  <Form.Switch
                    label="Consulta"
                    name="option"
                    checked={selectedOption}
                    onChange={handleOptionChange}
                  />
                </div>

                {/* Botón de Solicitar */}
                <Button
                  variant="primary"
                  type="button"
                  style={{ borderRadius: "20px" }}
                  onClick={handleSubmit}
                >
                  Solicitar
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default EstadoCuentaModal;