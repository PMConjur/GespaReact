import { useState, useEffect } from "react";
import { Modal, Button, Form, Container, Row, Table } from "react-bootstrap";
import { toast } from "sonner";
import servicio from "../../../services/axiosServices";

const Negotiations = ({ show, handleClose }) => {
  const responseData = JSON.parse(localStorage.getItem("responseData"));
  console.log("responseData:", responseData); // Debugging line
  const idEjecutivo = responseData?.ejecutivo?.infoEjecutivo?.idEjecutivo;
  // console.log("idEjecutivo:", idEjecutivo); // Debugging line
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const validateidEjecutivo = (id) => {
    //console.log("Validating idEjecutivo:", id);
    return (
      (typeof id === "string" && id.trim() !== "") ||
      (typeof id === "number" && !isNaN(id))
    );
  };

  const fetchNegotiationsData = async () => {
    if (!validateidEjecutivo(idEjecutivo)) {
      toast.error("Error 400: Por favor ingrese un ID de cuenta válido.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await servicio.get(
        `/ejecutivo/NegociacionesDelMesEje/${idEjecutivo}`
      );
      setTableData(response.data);
    } catch (error) {
      console.error("Error fetching multideudores data:", error);
      if (error.response) {
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
        toast.error("Error: No se recibió respuesta del servidor.");
      } else {
        toast.error(
          `Error: Ocurrió un problema al realizar la solicitud. Detalles: ${error.message}`
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (show) {
      fetchNegotiationsData();
    }
  }, [show]);

  return (
    <Modal show={show} onHide={handleClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Negociaciones</Modal.Title>
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
                  <th>FechaCreacion</th>
                  <th>FechaTermino</th>
                  <th>Negociado</th>
                  <th>Pagado</th>
                  <th>Pagos</th>
                  <th>CartaConvenio</th>
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
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};

export default Negotiations;
