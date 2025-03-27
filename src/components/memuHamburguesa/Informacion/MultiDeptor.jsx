import { useState, useEffect } from "react";
import { Modal, Container } from "react-bootstrap";
import { toast } from "sonner";
import { fetchMultideudores } from "../../../services/gespawebServices";
import TableMultiDeptor from "../../TableMultiDeptor";

const Multideudores = ({ show, handleClose, searchResults }) => {
  const [idCuenta, setIdCuenta] = useState(""); // Define el estado para idCuenta
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Datos por defecto
  const defaultData = {
    idCuenta: "--", // Otros campos por defecto si es necesario
  };

  // Verificar que searchResults no esté vacío antes de acceder
  const result =
    Array.isArray(searchResults) && searchResults.length > 0
      ? searchResults[0]
      : defaultData;

  useEffect(() => {
    // Validar si el componente está visible y si searchResults tiene datos
    if (show && result.idCuenta !== "--") {
      const idCuentaFromSearch = result.idCuenta?.trim() || "--"; // Elimina espacios en blanco
      console.log("searchResults:", searchResults); // Para depurar la estructura de searchResults

      if (idCuentaFromSearch !== "--") {
        setIdCuenta(idCuentaFromSearch); // Actualiza el estado de idCuenta
        console.log("idCuenta obtenido:", idCuentaFromSearch); // Muestra el idCuenta obtenido
      } else {
        toast.error("No se encontró un idCuenta válido.");
      }
    } else {
      console.log("searchResults está vacío o no tiene un idCuenta válido.");
    }
  }, [show, searchResults]);

  useEffect(() => {
    // Fetch de datos si idCuenta es válido
    if (show && idCuenta && idCuenta !== "--") {
      fetchData();
    }
  }, [show, idCuenta]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchMultideudores(idCuenta);
      setTableData(data);
    } catch (error) {
      console.error("Error fetching multideudores:", error);
      toast.error(`Error al obtener los datos: ${error.message}`);
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
          {isLoading ? (
            <p>Cargando...</p>
          ) : (
            <TableMultiDeptor tableData={tableData} />
          )}
        </Container>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};

export default Multideudores;
