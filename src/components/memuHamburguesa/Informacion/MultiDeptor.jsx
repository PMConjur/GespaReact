import { useState, useEffect } from "react";
import { Modal, Button, Form, Container, Row, Table } from "react-bootstrap";
import { toast, Toaster } from "sonner";
import servicio from "../../../services/axiosServices";

const Multideudores = ({ show, handleClose }) => {
  const responseData = JSON.parse(localStorage.getItem("responseData"));
  //const numEmpleado = responseData?.ejecutivo?.infoEjecutivo?.idEjecutivo;
  const [idCuenta, setIdCuenta] = useState("");
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const validateIdCuenta = (id) => {
    return id && id.trim() !== "";
  };

  const fetchMultideudoresData = async () => {
    if (!validateIdCuenta(idCuenta)) {
      toast.error("Error 400: Por favor ingrese un ID de cuenta válido.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await servicio.get(
        `/ejecutivo/multideudores/1/${idCuenta}`
      );
      setTableData(response.data);
    } catch (error) {
      console.error("Error fetching multideudores data:", error);
      if (error.response) {
        toast.error(
          `Error ${error.response.status}: ${error.response.data.message}`
        );
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

  return (
    <Modal show={show} onHide={handleClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Multideudores</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Row>
            <div className="col">
              <Form.Group className="input-group mb-3">
                <Form.Control
                  type="text"
                  placeholder="ID Cuenta"
                  value={idCuenta}
                  onChange={(e) => setIdCuenta(e.target.value)}
                />
                <Button
                  variant="primary"
                  onClick={fetchMultideudoresData}
                  disabled={isLoading}
                >
                  {isLoading ? "Cargando..." : "Buscar"}
                </Button>
              </Form.Group>
            </div>
          </Row>
          <hr />
          <Row>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Cuenta</th>
                  <th>Cartera</th>
                  <th>Producto</th>
                  <th>Situacion</th>
                  <th>RFC</th>
                  <th>NumeroCliente</th>
                  <th>Saldo</th>
                  <th>Activacion</th>
                  <th>Bloqueo</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((item, index) => (
                  <tr key={index}>
                    <td>{item.idCuenta ?? "N/A"}</td>
                    <td>{item.idCartera ?? "N/A"}</td>
                    <td>{item.idProducto ?? "N/A"}</td>
                    <td>{item.idSituacion ?? "N/A"}</td>
                    <td>{item.RFC ?? "N/A"}</td>
                    <td>{item.NumeroCliente ?? "N/A"}</td>
                    <td>{item.Saldo ?? "N/A"}</td>
                    <td>{item.Activacion ?? "N/A"}</td>
                    <td>{item.Bloqueo ? "Sí" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
      <Toaster />
    </Modal>
  );
};

export default Multideudores;
