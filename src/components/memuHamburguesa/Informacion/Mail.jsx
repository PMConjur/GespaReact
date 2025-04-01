import { useState, useEffect, useContext } from "react";
import {
  Modal,
  Button,
  Form,
  Table,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import servicio from "../../../services/axiosServices";
import { toast } from "sonner";
import Conversation from "./conversation";
import { AppContext } from "../../../pages/Managment"; // Asegúrate de que la ruta sea correcta
import { reemplazarValores } from "../../ValoresCatalogos.js"; // Importa el método de reemplazo de valores

const Mail = ({ show, handleClose }) => {
  const { searchResults } = useContext(AppContext); // Obtén el contexto
  const [correos, setCorreos] = useState([]);
  const [nuevoCorreo, setNuevoCorreo] = useState("");
  const [dominio, setDominio] = useState("hotmail.es");
  const [estado, setEstado] = useState("1901");
  const [errorMessage, setErrorMessage] = useState(""); // Para evitar doble toast

  const [correoSeleccionadoSolo, setCorreoSeleccionadoSolo] = useState(""); // Estado que guarda solo el correo como string
  const [correoSeleccionado, setCorreoSeleccionado] = useState(null); // Nuevo estado para correo seleccionado
  const [correosEnviados, setCorreosEnviados] = useState([]); // Estado para los correos enviados
  const [selectedEnviados, setSelectedEnviados] = useState(null);
  const [mostrarConversacion, setMostrarConversacion] = useState(false);

  const mostrarConversacionHandler = () => {
    console.log("Botón de conversación clickeado");
    setMostrarConversacion(true);
  };

  const responseData = JSON.parse(localStorage.getItem("responseData"));
  const idEjecutivo = responseData?.ejecutivo?.infoEjecutivo?.idEjecutivo;
  const token = responseData?.ejecutivo?.token;

  // Obtener el idCuenta del primer resultado de searchResults
  const idCuenta = searchResults.length > 0 ? searchResults[0].idCuenta : null;

  useEffect(() => {
    const fetchCorreos = async () => {
      if (!idCuenta) return; // Asegúrate de que idCuenta sea válido

      try {
        const url = `/ejecutivo/CorreosCarga/1/${idCuenta}`;
        const response = await servicio.get(url); // Usa 'servicio' en lugar de 'axios'
        const data = response.data;

        if (Array.isArray(data)) {
          const correosFormateados = data.map((item) => ({
            email: item.CorreoElectrónico,
            origen: item.idOrigen,
            info: item.idInformación,
          }));
          setCorreos(correosFormateados);
        } else {
          console.error("La respuesta no es un arreglo:", data);
        }
      } catch (error) {
        console.error("Error al cargar los correos:", error);
      }
    };

    fetchCorreos();
  }, [idCuenta]);

  // Función para obtener los correos enviados
  const fetchCorreosEnviadosData = async () => {
    if (!idCuenta || !correoSeleccionadoSolo) return;

    try {
      const url = `/ejecutivo/CorreosObtiene/1/${idCuenta}`;
      const response = await servicio.get(url);
      const data = response.data;

      if (Array.isArray(data)) {
        const correosFiltrados = data.filter(
          (item) =>
            item.CorreoElectrónico && // Usamos "CorreoElectrónico" en lugar de "CorreoElectronico"
            item.CorreoElectrónico.trim().toLowerCase() ===
              correoSeleccionadoSolo.trim().toLowerCase()
        );

        console.log("Correos filtrados:", correosFiltrados); // Verifica los correos filtrados

        setCorreosEnviados(correosFiltrados);
      } else {
        console.error("La respuesta no es un arreglo:", data);
      }
    } catch (error) {
      console.error("Error al cargar los correos enviados:", error);
      toast.error("Error al cargar los correos enviados.");
    }
  };

  const agregarCorreo = async () => {
    if (nuevoCorreo.trim() === "") return;

    const nuevoCorreoCompleto = `${nuevoCorreo}${dominio}`;
    const idCuentaLimpio = idCuenta.trim();
    const datosCorreo = {
      correoElectronico: nuevoCorreoCompleto,
      idCartera: 1,
      idCuenta: idCuentaLimpio,
      idEjecutivo: idEjecutivo,
      idOrigen: 1805,
      idInformacion: 1901,
    };

    // Define la URL con parámetros de consulta
    const url = `/ejecutivo/nuevoCorreo?idEjecutivo=${idEjecutivo}&idOrigen=1805&ValidarDuplicidad=true`;

    try {
      const response = await servicio.post(url, datosCorreo, {
        headers: {
          Authorization: `Bearer ${token}`, // Usa el token como en fetchCorreos
        },
      });

      if (response.status === 200 || response.status === 201) {
        const nuevoCorreoObj = {
          email: nuevoCorreoCompleto,
          origen: "Gestión",
          info: 1901, // Asignamos explícitamente el estado "Sin verificar"
        };

        setCorreos([...correos, nuevoCorreoObj]);
        setNuevoCorreo("");

        // Validar si el estado es 1901
        if (nuevoCorreoObj.info === "1901") {
          setEstado("1901"); // Actualiza el estado a "Sin verificar"
          toast.success(
            "Correo electrónico agregado con estado 'Sin verificar'."
          );
        } else {
          toast.success("Correo electrónico agregado con éxito.");
        }
      } else {
        console.error("Error al agregar el correo:", response.data);
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error.message);
      console.error("URL:", url);
      console.error("Datos enviados:", datosCorreo);
    }
  };

  useEffect(() => {
    if (correoSeleccionadoSolo) {
      fetchCorreosEnviadosData(); // Llamar a la API para obtener los correos enviados filtrados
    }
  }, [correoSeleccionadoSolo]);

  // Función para manejar la selección del correo
  const seleccionarCorreo = (correo) => {
    console.log("Correo seleccionado:", correo);
    setCorreoSeleccionado(correo);
    setCorreoSeleccionadoSolo(correo.email);

    // Si el correo tiene `info` igual a 1901, se muestra el selector de estado
    if (correo.info === 1901) {
      setEstado("1901");
    } else {
      setEstado("1901"); // Si el correo no tiene la info correcta, mostrar "Sin verificar" por defecto
    }
  };

  // Función para identificar el correo
  const identificarCorreo = async () => {
    // Log para verificar los parámetros antes de hacer la solicitud
    console.log("Parámetros a enviar:", {
      correoElectronico: correoSeleccionadoSolo,
      idInformacion: estado,
      idCartera: 1,
      idCuenta: idCuenta,
      idEjecutivoInformacion: idEjecutivo,
    });
    const url = `/ejecutivo/identificar?correoElectronico=${correoSeleccionadoSolo}&idInformacion=${estado}&idCartera=1&idCuenta=${idCuenta}&idEjecutivoInformacion=${idEjecutivo}`;

    try {
      const response = await servicio.put(
        url,
        {}, // Assuming you want to send an empty object as the request body
        {
          headers: {
            Authorization: `Bearer ${token}`, // Pass the token just like in the first request
          },
        }
      );

      if (response.status === 200) {
        toast.success(
          `Correo electrónico identificado con éxito: ${response.data}`
        );
      } else {
        console.error("Error al identificar el correo:", response.data);
        toast.error("Error al identificar el correo.");
      }
    } catch (error) {
      console.error("Error en la solicitud de identificación:", error);
      toast.error("Error al identificar el correo.");
    }
  };

  const renderCell = (value) => {
    return value ?? ""; // Asegura que si el valor es undefined, muestre "N/A"
  };

  return (
    <Modal show={show} onHide={handleClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Correos - Gespa</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          {/* Tabla de correos */}
          <div
            style={{ maxHeight: "200px", maxWidth: "800px", overflowY: "auto" }}
          >
            <Table striped bordered hover responsive variant="dark">
              <thead>
                <tr>
                  <th>Correo Electrónico</th>
                  <th>Origen</th>
                  <th>Información</th>
                </tr>
              </thead>
              <tbody>
                {correos.map((correo, index) => (
                  <tr
                    key={index}
                    style={{
                      backgroundColor:
                        correo.email === correoSeleccionadoSolo
                          ? "lightblue" // Si el correo coincide, se pinta de azul
                          : "",
                    }}
                    onClick={() => seleccionarCorreo(correo)} // Seleccionar el correo completo
                  >
                    <td>{correo.email}</td>
                    <td>{reemplazarValores(correo.origen)}</td>
                    <td>{reemplazarValores(correo.info)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          {/* Tabla de correos */}
          <hr />
          {/* Selector de estado */}
          {correoSeleccionado?.info === 1901 && (
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="estado">
                  <Form.Label>Estado</Form.Label>
                  <Form.Select
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                  >
                    <option value="">Selecciona un estado</option>
                    <option value="1901">Sin verificar</option>
                    <option value="1902">Incompleta</option>
                    <option value="1903">No corresponde</option>
                    <option value="1904">Errónea</option>
                    <option value="1905">Inexistente</option>
                    <option value="1906">Correcta</option>
                    <option value="1907">Verificada</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3} className="d-flex align-items-end">
                <Button onClick={identificarCorreo} variant="secondary">
                  Identificar
                </Button>
              </Col>
            </Row>
          )}
          {/* Selector de estado */}
          <hr />
          {/* Input de nuevo correo */}
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group controlId="correo">
                <Form.Label>Correo</Form.Label>
                <div className="d-flex">
                  <Form.Control
                    type="text"
                    value={nuevoCorreo}
                    onChange={(e) => setNuevoCorreo(e.target.value)}
                    placeholder="Nuevo correo"
                  />
                  <Form.Select
                    value={dominio}
                    onChange={(e) => setDominio(e.target.value)}
                  >
                    <option value="">Selecciona un @</option>
                    <option value="@gmail.com">@gmail.com</option>
                    <option value="@hotmail.com">@hotmail.com</option>
                    <option value="@hotmail.es">@hotmail.es</option>
                    <option value="@icloud.com">@icloud.com</option>
                    <option value="@live.com">@live.com</option>
                    <option value="@live.com.mx">@live.com.mx</option>
                    <option value="@msn.com">@msn.com</option>
                    <option value="@outlook.com">@outlook.com</option>
                    <option value="@prodigy.net.mx">@prodigy.net.mx</option>
                    <option value="@yahoo.com">@yahoo.com</option>
                    <option value="@yahoo.com.mx">@yahoo.com.mx</option>
                  </Form.Select>
                </div>
              </Form.Group>
            </Col>
            {/* Botón para agregar correo */}
            <Col md={3} className="d-flex align-items-end">
              <Button
                onClick={mostrarConversacionHandler} // Cambiar el estado a true
                variant="primary"
                className="me-2"
              >
                Conversación
              </Button>

              <Button onClick={agregarCorreo} variant="primary">
                Nuevo
              </Button>
            </Col>
          </Row>
          {/* Input de nuevo correo */}
          <hr />
          {/* Sección de correos enviados */}
          <h5>Enviados</h5>
          <Form.Group controlId="plantilla">
            <Form.Label>Plantilla</Form.Label>
            <Form.Select>
              <option value="recordatorio">Recordatorio de pago</option>
              <option value="notificacion">Notificación de cuenta</option>
            </Form.Select>
          </Form.Group>

          {/* Tabla correos enviados */}
          <div
            style={{ maxHeight: "200px", maxWidth: "800px", overflowY: "auto" }}
          >
            <Table striped bordered hover responsive variant="dark">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Etapa</th>
                  <th>Asunto</th>
                  <th>Ejecutivo</th>
                </tr>
              </thead>
              <tbody>
                {correosEnviados.map((item, index) => (
                  <tr key={index} onClick={() => setSelectedEnviados(item)}>
                    <td>{renderCell(item.Fecha_Insert)}</td>
                    <td>{renderCell(item.Segundo_Insert)}</td>
                    <td>{renderCell(reemplazarValores(item.idEtapa))}</td>
                    <td>{renderCell(item.Asunto)}</td>
                    <td>{renderCell(item.Ejecutivo)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
          <Row>
            <div>
              <strong>Mensaje: </strong>
              {selectedEnviados
                ? selectedEnviados.Mensaje
                  ? renderCell(selectedEnviados.Mensaje)
                  : "No hay mensaje disponible"
                : "Seleccione un correo para ver el mensaje"}
            </div>
          </Row>
          {/* Tabla correos enviados */}

          {/* Aquí se renderiza el componente Conversation cuando el estado es true */}
          {mostrarConversacion && (
            <Conversation
              show={mostrarConversacion} // Muestra el modal de conversación cuando este es true
              handleClose={() => setMostrarConversacion(false)} // Cierra el modal de conversación cuando sea necesario
              correoSeleccionadoSolo={correoSeleccionadoSolo} // Pasa el correo seleccionado como string
            />
          )}
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default Mail;
