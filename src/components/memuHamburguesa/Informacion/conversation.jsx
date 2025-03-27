import { useState, useEffect, useContext } from "react";
import { Modal, Container, Row, Table } from "react-bootstrap";
import { toast } from "sonner";
import servicio from "../../../services/axiosServices";
import { AppContext } from "../../../pages/Managment"; // Asegúrate de que la ruta sea correcta
const Conversation = ({ show, handleClose, correoSeleccionadoSolo }) => {
  const { searchResults } = useContext(AppContext);
  const [gestionesData, setGestionesData] = useState([]);
  const [errorMessage, setErrorMessage] = useState(""); // Para evitar doble toast
  const [selectedGestion, setSelectedGestion] = useState(null); // Declare selectedGestion

  const idCuenta = searchResults.length > 0 ? searchResults[0].idCuenta : null;

  const fetchGestionesData = async () => {
    if (!correoSeleccionadoSolo) {
      const error = "Error 400: Por favor seleccione un correo válido.";
      if (errorMessage !== error) {
        console.log("Mostrando toast con mensaje:", error);
        toast.dismiss(); // Cierra cualquier toast abierto
        toast.error(error);
        setErrorMessage(error);
      } else {
        console.log("Mensaje duplicado, no se muestra toast:", error);
      }
      return;
    }

    try {
      console.log(
        "Fetching data with idCuenta:",
        idCuenta,
        "correo:",
        correoSeleccionadoSolo
      );

      const response = await servicio.get(
        `/search-customer/conversacion?idCuenta=${idCuenta}&correo=${correoSeleccionadoSolo}`
      );
      setGestionesData(response.data);
      setErrorMessage(""); // Resetea el mensaje de error si la solicitud es exitosa
    } catch (error) {
      console.error("Error fetching gestiones data:", error);

      let message = "Error desconocido.";
      if (error.response) {
        const status = error.response.status;
        message =
          status === 404
            ? "Error 404: No se encontraron datos para la cuenta o correo especificados."
            : `Error ${status}: ${
                error.response.data.message ||
                "Ocurrió un error en el servidor."
              }`;
      } else if (error.request) {
        message = "Error: No se recibió respuesta del servidor.";
      } else {
        message = `Error: Ocurrió un problema al realizar la solicitud. Detalles: ${error.message}`;
      }

      if (errorMessage !== message) {
        console.log("Mostrando toast con mensaje:", message);
        toast.dismiss(); // Cierra cualquier toast abierto
        toast.error(message);
        setErrorMessage(message);
      } else {
        console.log("Mensaje duplicado, no se muestra toast:", message);
      }
    }
  };

  useEffect(() => {
    if (show) {
      fetchGestionesData();
    }
  }, [show, correoSeleccionadoSolo, idCuenta]); // Dependencias actualizadas

  const renderCell = (value) => {
    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value);
    }
    return value ?? "N/A";
  };

  const handleRowClick = (item) => {
    setSelectedGestion(item); // Asigna el item seleccionado a selectedGestion
  };

  return (
    <Modal show={show} onHide={handleClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Conversacion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
            <Table striped bordered hover responsive variant="dark">
              <thead>
                <tr>
                  <th>Fecha_Acciona</th>
                  <th>Hora_Acciona</th>
                  <th>TipoEmail</th>
                  <th>Modo</th>
                  <th>Fecha_Respuesta</th>
                  <th>Hora_Respuesta</th>
                  <th>Resultado</th>
                </tr>
              </thead>
              <tbody>
                {gestionesData.map((item, index) => (
                  <tr
                    key={index}
                    onClick={() => handleRowClick(item)}
                    style={{
                      backgroundColor:
                        selectedGestion === item ? "lightblue" : "white",
                      cursor: "pointer",
                    }}
                  >
                    <td>{renderCell(item.Fecha_Acciona)}</td>
                    <td>{renderCell(item.Hora_Acciona)}</td>
                    <td>{renderCell(item.TipoEmail)}</td>
                    <td>{renderCell(item.Modo)}</td>
                    <td>{renderCell(item.Fecha_Respuesta)}</td>
                    <td>{renderCell(item.Hora_Respuesta)}</td>
                    <td>{renderCell(item.Resultado)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Row>
          <Row>
            <div>
              <strong>Comentario: </strong>
              {selectedGestion && selectedGestion.Comentario
                ? renderCell(selectedGestion.Comentario)
                : "Seleccione una gestión para ver el comentario"}
            </div>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};

export default Conversation;
