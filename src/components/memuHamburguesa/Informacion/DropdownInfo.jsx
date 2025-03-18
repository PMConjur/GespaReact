import { useState, useContext } from "react";
import { AppContext } from "../../../pages/Managment"; // Ajusta la ruta si es necesario
import Dropdown from "react-bootstrap/Dropdown";
import Payments from "./Payments"; // Asegúrate de importar correctamente el componente
import "../../../scss/styles.scss"; // Importación de estilos
import { getPaymentsData } from "../../../services/gespawebServices";
import MultiDeptor from "../Informacion/MultiDeptor"; // Asegura que la ruta sea correcta

function DropdownInfo() {
  // Estados para manejar la visibilidad de los modales
  const [showPayments, setShowPayments] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Estado para almacenar los datos de pagos
  const [paymentsData, setPaymentsData] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(false);

  // Consumir el contexto de búsqueda
  const { searchResults } = useContext(AppContext);

  // Función para mostrar el modal de pagos y cargar los datos
  const handleShowPayments = async () => {
    setLoadingPayments(true);
    try {
      // Obtener los datos de pagos usando el contexto de búsqueda
      const talks = await getPaymentsData(searchResults);
      setPaymentsData(talks.flat()); // Aplanar el array en caso de ser necesario
      setShowPayments(true);
    } catch (error) {
      console.error("Error al cargar los datos de pagos:", error);
    } finally {
      setLoadingPayments(false);
    }
  };

  // Función para cerrar el modal de pagos
  const handleClosePayments = () => setShowPayments(false);

  // Funciones para manejar la visibilidad del modal de Multideudores
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    <>
      {/* Menú desplegable */}
      <Dropdown>
        <Dropdown.Toggle
          className="custom-dropdown-toggle d-flex align-items-center"
          id="dropdown-right"
        >
          Información
        </Dropdown.Toggle>

        <Dropdown.Menu
          placement="end"
          style={{ backgroundColor: "#1d1f20", border: "none" }}
          className="custom-dropdown-menu"
        >
          {/* Opción para mostrar el modal de Multideudores */}
          <Dropdown.Item onClick={handleShow} className="custom-dropdown-item">
            Multideudores
          </Dropdown.Item>

          {/* Otras opciones con enlaces */}
          <Dropdown.Item href="/maintenance" className="custom-dropdown-item">
            Adicionales
          </Dropdown.Item>
          <Dropdown.Item href="/maintenance" className="custom-dropdown-item">
            Domicilios
          </Dropdown.Item>
          <Dropdown.Item href="/maintenance" className="custom-dropdown-item">
            Correos
          </Dropdown.Item>

          {/* Opción para mostrar pagos */}
          <Dropdown.Item
            onClick={handleShowPayments}
            className="custom-dropdown-item"
          >
            Pagos
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      {/* Renderiza el modal de pagos solo si `showPayments` es true */}
      {showPayments && (
        <Payments
          show={showPayments}
          handleClose={handleClosePayments}
          data={paymentsData}
          loadingPayments={loadingPayments}
        />
      )}

      {/* Renderiza el modal de Multideudores solo si `showModal` es true */}
      {showModal && (
        <MultiDeptor show={showModal} handleClose={handleClose} />
      )}
    </>
  );
}

export default DropdownInfo;
