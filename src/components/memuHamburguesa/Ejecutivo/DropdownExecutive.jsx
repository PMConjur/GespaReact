import React, { useState } from "react";
import { PersonLinesFill } from "react-bootstrap-icons";
import Dropdown from "react-bootstrap/Dropdown";
import "../../../scss/styles.scss";
import Negotiations from "../../../components/memuHamburguesa/Ejecutivo/NegotiationsE";
import ActivitiesDay from "../../../components/memuHamburguesa/Ejecutivo/ActivitiesDay";

function DropdownInfo() {
  const [showNegotiations, setShowNegotiations] = useState(false);
  const [showActivities, setShowActivities] = useState(false);

  const handleShowNegotiations = () => {
    setShowNegotiations(true);
    setShowActivities(false);
  };

  const handleShowActivities = () => {
    setShowActivities(true);
    setShowNegotiations(false);
  };

  const handleClose = () => {
    setShowNegotiations(false);
    setShowActivities(false);
  };

  return (
    <>
      <Dropdown>
        <Dropdown.Toggle
          className="custom-dropdown-toggle d-flex align-items-center"
          id="dropdown-basic"
        >
          Ejecutivo
        </Dropdown.Toggle>
        <Dropdown.Menu
          style={{ backgroundColor: "#1d1f20", border: "none" }}
          className="custom-dropdown-menu"
        >
          <Dropdown.Item
            onClick={handleShowActivities}
            className="custom-dropdown-item"
          >
            Gestiones del dia
          </Dropdown.Item>
          <Dropdown.Item href="/maintenance" className="custom-dropdown-item">
            Scripts
          </Dropdown.Item>
          <Dropdown.Item
            onClick={handleShowNegotiations}
            className="custom-dropdown-item"
          >
            Negociaciones
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      {showNegotiations && (
        <Negotiations show={showNegotiations} handleClose={handleClose} />
      )}
      {showActivities && (
        <ActivitiesDay show={showActivities} handleClose={handleClose} />
      )}
    </>
  );
}

export default DropdownInfo;
