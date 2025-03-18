import { useState, useEffect } from "react";
import { Modal, Container, Row, Table } from "react-bootstrap";
import { toast } from "sonner";
import servicio from "../../../services/axiosServices";

const ActivityDay = ({ show, handleClose }) => {
  const responseData = JSON.parse(localStorage.getItem("responseData"));
  const idEjecutivo = responseData?.ejecutivo?.infoEjecutivo?.idEjecutivo;

  const [cuentasData, setCuentasData] = useState([]);
  const [gestionesData, setGestionesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedGestion, setSelectedGestion] = useState(null);

  const validateidEjecutivo = (id) => {
    // console.log("Validating idEjecutivo:", id);
    return (
      (typeof id === "string" && id.trim() !== "") ||
      (typeof id === "number" && !isNaN(id))
    );
  };

  const fetchActivityDayData = async () => {
    // console.log("idEjecutivo:", idEjecutivo);
    if (!validateidEjecutivo(idEjecutivo)) {
      toast.error("Error 400: Por favor ingrese un ID de Ejecutivo válido.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await servicio.get(
        `/ejecutivo/gestionesDelDia/${idEjecutivo}`
      );
      setCuentasData(response.data.Cuentas);
      setGestionesData(response.data.GestionesEjecutivo);
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
      fetchActivityDayData();
    }
  }, [show, idEjecutivo]);

  const renderCell = (value) => {
    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value);
    }
    return value ?? "N/A";
  };

  const handleRowClick = (item) => {
    // console.log("Selected gestion:", item);
    setSelectedGestion(item); // Asigna el item seleccionado a selectedGestion
  };

  return (
    <Modal show={show} onHide={handleClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Gestiones Diarias</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <hr />
          <Row>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Cuenta</th>
                  <th>Producto</th>
                  <th>Situacion</th>
                  <th>Nombre</th>
                  <th>RFC</th>
                  <th>NumeroCliente</th>
                  <th>Saldo</th>
                </tr>
              </thead>
              <tbody>
                {cuentasData.map((item, index) => (
                  <tr key={index}>
                    <td>{renderCell(item.Fecha_Insert)}</td>
                    <td>{renderCell(item.Segundo_Insert)}</td>
                    <td>{renderCell(item.idCuenta)}</td>
                    <td>{renderCell(item.idProducto)}</td>
                    <td>{renderCell(item.idSituación)}</td>
                    <td>{renderCell(item.NombreDeudor)}</td>
                    <td>{renderCell(item.RFC)}</td>
                    <td>{renderCell(item.NúmeroCliente)}</td>
                    <td>{renderCell(item.Saldo)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Row>
        </Container>

        <Container>
          <Modal.Title>Gestiones</Modal.Title>
          <hr />
          <Row>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Telefono</th>
                  <th>Contacto</th>
                  <th>Situacion</th>
                  <th>CausaNoPago</th>
                  <th>Parentesco</th>
                  <th>Nombre</th>
                  <th>Modo</th>
                  <th>Acercamiento</th>
                  <th>Duracion</th>
                </tr>
              </thead>
              <tbody>
                {gestionesData.map((item, index) => (
                  <tr key={index} onClick={() => handleRowClick(item)}>
                    <td>{renderCell(item.Fecha_Insert)}</td>
                    <td>{renderCell(item.Segundo_Insert)}</td>
                    <td>{renderCell(item.NúmeroTelefónico)}</td>
                    <td>{renderCell(item.idContacto)}</td>
                    <td>{renderCell(item.idSituaciónGestión)}</td>
                    <td>{renderCell(item.idCausaNoPago)}</td>
                    <td>{renderCell(item.idParentesco)}</td>
                    <td>{renderCell(item.NombreContacto)}</td>
                    <td>{renderCell(item.idModo)}</td>
                    <td>{renderCell(item.idAcercamiento)}</td>
                    <td>{renderCell(item.Duración)}</td>
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

export default ActivityDay;