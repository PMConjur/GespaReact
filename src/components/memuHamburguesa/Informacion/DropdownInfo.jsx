import { useState, useContext } from "react";
import Dropdown from "react-bootstrap/Dropdown"; // Importar el componente Dropdown de Bootstrap
import { AppContext } from "../../../pages/Managment"; // Importar el contexto de la aplicación
import "../../../scss/styles.scss";
import Addresses from "./Addresses"; // Importar el componente Addresses
import Mail from "./Mail"; // Importar el componente Mail
import Payments from "./Payments";
import Aditionals from "./Aditionals"; // Importar el componente Aditionals
import { InfoCircleFill } from "react-bootstrap-icons"; // Importar el ícono de Info de Bootstrap
import Multideudores from "../Informacion/MultiDeptor"; // Importar el componente Multideudores
import Address from "./Addresses" // Importar el componente Address

function DropdownInfo() {
  // Estados para controlar la visibilidad de los modales y la carga de datos
  const [showAddresses, setShowAddresses] = useState(false); // Estado para el modal de Addresses
  const [showMultideudores, setShowMultideudores] = useState(false); // Estado para el modal de Multideudores
  const [showMail, setShowMail] = useState(false); // Estado para el modal de Mail

  const [showPayments, setShowPayments] = useState(false);

  const handleShowPayments = () => {
    console.log("Abriendo modal de Pagos");
    setShowPayments(true);
  };

  const handleClosePayments = () => {
    console.log("Cerrando modal de Pagos");
    setShowPayments(false);
  };

  //adicionales
  const [showAditionals, setShowAditionals] = useState(false); // Estado para el modal de Aditionals

  const handleShowAditionals = () => setShowAditionals(true);
  const handleCloseAditionals = () => setShowAditionals(false);
  //adiconaslers

  const [aditionalsData, setAditionalsData] = useState([]); // Estado para almacenar los datos adicionales
  const [loadingAditionals, setLoadingAditionals] = useState(false); // Estado para indicar si se están cargando los datos adicionales

  // Consumir el contexto para obtener los resultados de búsqueda
  const { searchResults } = useContext(AppContext);

  // Función para manejar la apertura del modal de Addresses
  const handleShowAddresses = () => setShowAddresses(true);

  // Función para manejar el cierre del modal de Addresses
  const handleCloseAddresses = () => setShowAddresses(false);

  const handleShowMultideudores = () => setShowMultideudores(true);
  const handleCloseMultideudores = () => setShowMultideudores(false);

  // Función para manejar la apertura del modal de Aditionals
  const handleShowMail = () => setShowMail(true);
  const handleCloseMail = () => setShowMail(false);

  const [showAddress, setShowAddress] = useState(false); // Estado para el modal de Address

  const handleShowAddress = () => setShowAddress(true);
  const handleCloseAddress = () => setShowAddress(false);

  return (
    <>
      {/* Dropdown para mostrar las opciones de información */}
      <Dropdown className="">
        <Dropdown.Toggle
          className="custom-dropdown-toggle d-flex align-items-center"
          id="dropdown-right"
        >
          <span>
            <InfoCircleFill /> Información
          </span>
        </Dropdown.Toggle>
        <Dropdown.Menu
          placement="end"
          style={{ backgroundColor: "#1d1f20" }}
          className="custom-dropdown-menu"
        >
          <Dropdown.Item
            onClick={handleShowMultideudores}
            className="custom-dropdown-item"
          >
            Multideudores
          </Dropdown.Item>
          <Dropdown.Item
            onClick={handleShowAddresses}
            className="custom-dropdown-item"
          >
            Domicilios
          </Dropdown.Item>
          <Dropdown.Item
            onClick={handleShowAditionals}
            className="custom-dropdown-item"
          >
            Adicionales
          </Dropdown.Item>
          <Dropdown.Item
            onClick={handleShowMail}
            className="custom-dropdown-item"
          >
            Correos
          </Dropdown.Item>
          <Dropdown.Item
            onClick={handleShowPayments}
            className="custom-dropdown-item"
          >
            Pagos
          </Dropdown.Item>
          <Dropdown.Item
            onClick={handleShowAddress}
            className="custom-dropdown-item"
          >
            Address
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <Payments
        show={showPayments}
        handleClosePayments={handleClosePayments}
        allowClose={true}
        onFormSuccess={() => console.log("Formulario Pagos completado")}
      />

      {/* Renderizar el modal de Addresses */}
      <Addresses
        show={showAddresses}
        handleClose={handleCloseAddresses}
        searchResults={searchResults}
      />

      {/* Renderizar el modal de Aditionals */}
      <Aditionals
        show={showAditionals}
        handleClose={handleCloseAditionals}
        data={aditionalsData}
        loadingAditionals={loadingAditionals}
      />
      {/* Renderizar el modal de Multideudores */}
      <Multideudores
        show={showMultideudores}
        handleClose={handleCloseMultideudores}
        searchResults={searchResults} // Pasar searchResults como prop
      />
      {/* Renderizar el modal de Mail */}
      <Mail 
      show={showMail} 
      handleClose={handleCloseMail} />

      {/* Renderizar el modal de Address */}
      <Address 
      show={showAddress}
      handleClose={handleCloseAddress} />
    </>
  );
}

export default DropdownInfo;
