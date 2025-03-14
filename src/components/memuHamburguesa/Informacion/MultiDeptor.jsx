import { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import "../../../scss/styles.scss";
import MultiDeptor from "../Informacion/MultiDeptor"; // Ajusta la ruta según la ubicación de tu archivo // Ajusta la ruta según la ubicación de tu archivo

function DropdownInfo() {
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    <>
      <Dropdown className="">
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
          <Dropdown.Item onClick={handleShow} className="custom-dropdown-item">
            Multideudores
          </Dropdown.Item>
          <Dropdown.Item href="/maintenance" className="custom-dropdown-item">
            Adicionales
          </Dropdown.Item>
          <Dropdown.Item href="/maintenance" className="custom-dropdown-item">
            Pagos
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <MultiDeptor show={showModal} handleClose={handleClose} />
    </>
  );
}

export default DropdownInfo;