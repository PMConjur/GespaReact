// Importación de dependencias necesarias
import React, { useState } from "react"; // React y hook de estado
import { PersonLinesFill } from "react-bootstrap-icons"; // Ícono para el menú
import Dropdown from "react-bootstrap/Dropdown"; // Componente de menú desplegable de Bootstrap
import "../../../scss/styles.scss"; // Estilos personalizados globales
import { fetchScripts } from "../../../services/gespawebServices"; // Servicio para obtener datos de scripts

// Importación de componentes propios que representan modales
import Negotiations from "../../../components/memuHamburguesa/Ejecutivo/NegotiationsE";
import ActivitiesDay from "../../../components/memuHamburguesa/Ejecutivo/ActivitiesDay";
import Scripts from "../../../components/memuHamburguesa/Ejecutivo/Scripts";

// Componente principal del menú desplegable del Ejecutivo
function DropdownInfo() {
  // Estados para controlar la visibilidad de los modales
  const [showNegotiations, setShowNegotiations] = useState(false); // Modal de Negociaciones del mes
  const [showActivities, setShowActivities] = useState(false);     // Modal de Gestiones del día
  const [showScripts, setShowScripts] = useState(false);           // Modal de Scripts

  // Estado para almacenar los datos de scripts y el estado de carga
  const [scriptsData, setScriptsData] = useState([]);              // Datos obtenidos de los scripts
  const [loadingScripts, setLoadingScripts] = useState(false);     // Estado de carga para mostrar spinner o similar

  /**
   * Maneja la visualización del modal de Negociaciones del mes.
   * Oculta otros modales antes de mostrar el correspondiente.
   */
  const handleShowNegotiations = () => {
    setShowNegotiations(true);
    setShowActivities(false);
  };

  /**
   * Maneja la visualización del modal de Gestiones del día.
   * Oculta otros modales antes de mostrar el correspondiente.
   */
  const handleShowActivities = () => {
    setShowActivities(true);
    setShowNegotiations(false);
  };

  /**
   * Cierra los modales de Negociaciones y Actividades.
   */
  const handleClose = () => {
    setShowNegotiations(false);
    setShowActivities(false);
  };

  /**
   * Maneja la visualización del modal de Scripts.
   * Obtiene los datos desde el servicio y muestra el componente correspondiente.
   */
  const handleShowScripts = async () => {
    setLoadingScripts(true); // Inicia estado de carga
    try {
      const scripts = await fetchScripts(1); // Llamada al servicio (ejemplo con ID = 1)
      setScriptsData(scripts);              // Guarda los datos obtenidos
      setShowScripts(true);                 // Muestra el modal de Scripts
    } catch (error) {
      console.error("Error al cargar los datos de scripts:", error); // Manejo de errores
    } finally {
      setLoadingScripts(false); // Finaliza estado de carga
    }
  };

  /**
   * Cierra el modal de Scripts.
   */
  const handleCloseScripts = () => setShowScripts(false);

  return (
    <>
      {/* Menú desplegable con las opciones del ejecutivo */}
      <Dropdown>
        <Dropdown.Toggle
          className="custom-dropdown-toggle d-flex align-items-center"
          id="dropdown-basic"
        >
          {/* Ícono del ejecutivo */}
          <PersonLinesFill className="me-2" />
          Ejecutivo
        </Dropdown.Toggle>

        <Dropdown.Menu
          style={{ backgroundColor: "#1d1f20", border: "none" }}
          className="custom-dropdown-menu"
        >
          {/* Opción del menú: Scripts */}
          <Dropdown.Item onClick={handleShowScripts} className="custom-dropdown-item">
            Scripts
          </Dropdown.Item>

          {/* Opción del menú: Gestiones del día */}
          <Dropdown.Item onClick={handleShowActivities} className="custom-dropdown-item">
            Gestiones del día
          </Dropdown.Item>

          {/* Opción del menú: Negociaciones del mes */}
          <Dropdown.Item onClick={handleShowNegotiations} className="custom-dropdown-item">
            Negociaciones del mes
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      {/* Renderización condicional del modal de Negociaciones del mes */}
      {showNegotiations && (
        <Negotiations show={showNegotiations} handleClose={handleClose} />
      )}

      {/* Renderización condicional del modal de Gestiones del día */}
      {showActivities && (
        <ActivitiesDay show={showActivities} handleClose={handleClose} />
      )}

      {/* Renderización condicional del modal de Scripts */}
      {showScripts && (
        <Scripts
          show={showScripts}
          handleCloseScripts={handleCloseScripts}
          data={scriptsData}
          loadingScripts={loadingScripts}
        />
      )}
    </>
  );
}

// Exportación del componente para ser utilizado en otras partes de la aplicación
export default DropdownInfo;


/***
 * Codigo Reviado por: Ing Uriel Saenz
 */