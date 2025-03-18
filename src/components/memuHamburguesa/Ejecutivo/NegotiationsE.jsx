// Importación de dependencias y servicios
import { useState, useEffect } from "react";
import { Modal, Button, Form, Container, Row, Table } from "react-bootstrap";
import { toast } from "sonner";
import servicio from "../../../services/axiosServices";

// Componente principal de Negociaciones
const Negotiations = ({ show, handleClose }) => {
  // Obtiene los datos almacenados localmente del ejecutivo
  const responseData = JSON.parse(localStorage.getItem("responseData"));
  console.log("responseData:", responseData); // Línea para debugging

  // Extrae el id del ejecutivo del objeto responseData
  const idEjecutivo = responseData?.ejecutivo?.infoEjecutivo?.idEjecutivo;

  // Estados locales para datos de la tabla y carga
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Función para validar si el idEjecutivo es válido
  const validateidEjecutivo = (id) => {
    return (
      (typeof id === "string" && id.trim() !== "") ||
      (typeof id === "number" && !isNaN(id))
    );
  };

  // Función que obtiene los datos de negociaciones desde el backend
  const fetchNegotiationsData = async () => {
    // Validación del ID del ejecutivo
    if (!validateidEjecutivo(idEjecutivo)) {
      toast.error("Error 400: Por favor ingrese un ID de cuenta válido.");
      return;
    }

    setIsLoading(true); // Activa el estado de carga

    try {
      // Solicitud al backend
      const response = await servicio.get(
        `/ejecutivo/NegociacionesDelMesEje/${idEjecutivo}`
      );
      setTableData(response.data); // Guarda los datos obtenidos
    } catch (error) {
      // Manejo de errores
      console.error("Error fetching multideudores data:", error);

      if (error.response) {
        // Error con respuesta del servidor
        if (error.response.status === 404) {
          toast.error(
            "Error 404: No se encontró la cuenta especificada. Por favor, verifique el ID de cuenta e intente nuevamente."
          );
        } else {
          toast.error(
            `Error ${error.response.status}: ${error.response.data.message}`
          );
        }
      } else if (error.request) {
        // Error sin respuesta del servidor
        toast.error("Error: No se recibió respuesta del servidor.");
      } else {
        // Otros errores
        toast.error(
          `Error: Ocurrió un problema al realizar la solicitud. Detalles: ${error.message}`
        );
      }
    } finally {
      setIsLoading(false); // Desactiva el estado de carga
    }
  };

  // useEffect para obtener datos cuando el modal se muestra
  useEffect(() => {
    if (show) {
      fetchNegotiationsData();
    }
  }, [show]);

  // Render del componente Modal con los datos de negociaciones
  return (
    <Modal show={show} onHide={handleClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Negociaciones del mes</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Container>
          <hr />
          <Row>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Cuenta</th>
                  <th>Herramienta</th>
                  <th>Estado</th>
                  <th>Fecha Creación</th>
                  <th>Fecha Término</th>
                  <th>Negociado</th>
                  <th>Pagado</th>
                  <th>Pagos</th>
                  <th>Carta Convenio</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.idCuenta ?? "N/A"}</td>
                    <td>{item.Herramienta ?? "N/A"}</td>
                    <td>{item.idEstado ?? "N/A"}</td>
                    <td>{item.FechaCreación ?? "N/A"}</td>
                    <td>{item.FechaTérmino ?? "N/A"}</td>
                    <td>{item.MontoNegociado ?? "N/A"}</td>
                    <td>{item.MontoPagado ?? "N/A"}</td>
                    <td>{item.Pagos ?? "N/A"}</td>
                    <td>{item._CartaConvenio ? "Sí" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Row>
        </Container>
      </Modal.Body>

      <Modal.Footer>{/* Puedes agregar botones aquí si deseas */}</Modal.Footer>
    </Modal>
  );
};

export default Negotiations;
