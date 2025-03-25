import { useState, useContext } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { AppContext } from "../../../pages/Managment"; // Ajusta la ruta según tu estructura de archivos
import "../../../scss/styles.scss";
import Scripts from "./Scripts"; // Asegúrate de importar el componente
import { PersonLinesFill } from "react-bootstrap-icons";
import { fetchScripts } from "../../../services/gespawebServices";

function DropdownExecutive() {
  const [showScripts, setShowScripts] = useState(false);
  const [scriptsData, setScriptsData] = useState([]);
  const [loadingScripts, setLoadingScripts] = useState(false);

  // Consumir el contexto
  const { searchResults } = useContext(AppContext);

  // Mostrar scripts
  const handleShowScripts = async () => {
    setLoadingScripts(true);
    try {
      const scripts = await fetchScripts(1); // Obtener los datos de scripts
      setScriptsData(scripts); // Establece los datos recibidos
      setShowScripts(true);
    } catch (error) {
      console.error("Error al cargar los datos de scripts:", error);
    } finally {
      setLoadingScripts(false);
    }
  };

  const handleCloseScripts = () => setShowScripts(false);

  return (
    <>
      <Dropdown className="">
        <Dropdown.Toggle
          className="custom-dropdown-toggle d-flex"
          id="dropdown-basic"
        >
          <span>
            <PersonLinesFill /> Ejecutivo
          </span>
        </Dropdown.Toggle>
        <Dropdown.Menu
          style={{ backgroundColor: "#1d1f20", border: "none" }}
          className="custom-dropdown-menu"
        >
          <Dropdown.Item
            onClick={handleShowScripts}
            className="custom-dropdown-item"
          >
            Scripts
          </Dropdown.Item>
          <Dropdown.Item href="/maintenance" className="custom-dropdown-item">
            Gestiones del dia
          </Dropdown.Item>
          <Dropdown.Item href="/maintenance" className="custom-dropdown-item">
            Negociaciones del mes
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      {/* Renderiza el modal */}
      <Scripts
        show={showScripts}
        handleCloseScripts={handleCloseScripts}
        data={scriptsData}
        loadingScripts={loadingScripts}
      />
    </>
  );
}

export default DropdownExecutive;
