import { useState, useEffect, useContext } from "react";
import { Modal, Container } from "react-bootstrap";
import { toast } from "sonner";
import { fetchMultideudores } from "../../../services/gespawebServices";
import TableMultiDeptor from "../../TableMultiDeptor";
import { AppContext } from "../../../pages/Managment";

const Multideudores = ({ show, handleClose, searchResults }) => {
  const { handleSearchByCuenta } = useContext(AppContext); // Verifica que esta función exista en el contexto
  const [idCuenta, setIdCuenta] = useState(""); // Define el estado para idCuenta
  const [rfc, setRfc] = useState(""); // Define el estado para RFC
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
      const rfcFromSearch = result.rfc?.trim() || ""; // Cambiar a minúsculas para coincidir con la estructura
      console.log("searchResults:", searchResults); // Para depurar la estructura de searchResults

      if (idCuentaFromSearch !== "--" && rfcFromSearch) {
        setIdCuenta(idCuentaFromSearch); // Actualiza el estado de idCuenta
        setRfc(rfcFromSearch); // Guardar el RFC en el estado
        console.log("idCuenta obtenido:", idCuentaFromSearch); // Muestra el idCuenta obtenido
        console.log("RFC obtenido:", rfcFromSearch); // Muestra el RFC obtenido
      } else {
        toast.error("No se encontró un idCuenta o RFC válido.");
      }
    } else {
      console.log("searchResults está vacío o no tiene un idCuenta válido.");
    }
  }, [show, searchResults]);

  useEffect(() => {
    // Realizar la búsqueda solo si idCuenta y rfc están definidos
    if (show && idCuenta && idCuenta !== "--" && rfc) {
      console.log("Fetching data for idCuenta:", idCuenta); // Verifica el idCuenta
      fetchData();
    }
  }, [show, idCuenta, rfc]); // Agregar rfc como dependencia

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchMultideudores(idCuenta, rfc); // Pasar RFC al endpoint
      console.log("Datos obtenidos del endpoint:", data);

      setTableData(
        data.map(item => ({
          ...item,
          idSituaciónDesactivación: item.idSituaciónDesactivación || "N/A",
          idSucursal: item.idSucursal || "N/A",
          idCausaNoPago: item.idCausaNoPago || "N/A",
          // NúmeroCliente: item.NúmeroCliente || "N/A",
          N\u00FAmeroCliente: item.NúmeroCliente || "N/A",
        }))
      );
    } catch (error) {
      console.error("Error fetching multideudores:", error);
      if (error.response && error.response.status === 404) {
        toast.error("No se encontraron datos para el idCuenta proporcionado.");
      } else {
        toast.error(error.message || "Error al obtener los datos de multideudores.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowClick = (idCuenta) => {
    if (typeof handleSearchByCuenta === "function") {
      console.log("Cuenta seleccionada:", idCuenta);
      handleSearchByCuenta(idCuenta); // Realizamos la búsqueda por cuenta
      handleClose(); // Cerramos el modal
    } else {
      console.error("handleSearchByCuenta no está definido o no es una función.");
    }
  };

  return (
    <Modal 
    show={show} 
    onHide={handleClose} 
    size="xl"
    backdrop="static"
    keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Multideudores</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          {isLoading ? (
            <p>Cargando...</p>
          ) : (
            <TableMultiDeptor
              tableData={tableData}
              onRowClick={handleRowClick} // Pasamos la función al componente
            />
          )}
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default Multideudores;
