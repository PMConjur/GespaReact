import { Dropdown, ButtonGroup, Image, Col } from "react-bootstrap";
import User from "../assets/img/user.svg";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const DropExecutive = () => {
  const location = useLocation(); // Hook para obtener la ubicación actual
  const [nombreEjecutivo, setNombreEjecutivo] = useState(""); // Estado para el nombre del ejecutivo
  const [idEjecutivo, setIdEjecutivo] = useState(""); // Estado para el ID del ejecutivo

  useEffect(() => {
    // Obtener los datos del ejecutivo desde el estado de la ubicación o desde el localStorage
    const responseData =
      location.state || JSON.parse(localStorage.getItem("responseData"));
    if (responseData) {
      // Actualizar los estados con los datos del ejecutivo
      setNombreEjecutivo(responseData.ejecutivo.infoEjecutivo.nombreEjecutivo);
      setIdEjecutivo(responseData.ejecutivo.infoEjecutivo.idEjecutivo);
    }
  }, [location.state]); // Ejecutar el efecto cuando cambia el estado de la ubicación

  return (
    <Dropdown
      as={ButtonGroup}
      className="me-3"
      style={{ alignItems: "center" }}
    >
      {/* Mostrar el nombre del ejecutivo */}
      <span className="text-white me-1 ms-1">{nombreEjecutivo}</span>
      {/* Botón de toggle para el dropdown */}
      <Dropdown.Toggle split variant="dark" id="dropdown-split-basic" />
      <Dropdown.Menu
        className="text-center"
        align="start"
        style={{ left: "0", right: "auto" }}
      >
        {/* Mostrar el nombre y el ID del ejecutivo en el menú del dropdown */}
        <p>{nombreEjecutivo}</p>
        <p>{idEjecutivo}</p>
        {/* Opción del menú del dropdown */}
        <Dropdown.Item href="/maintenance">Ejecutivo Telefonico</Dropdown.Item>
      </Dropdown.Menu>

      {/* Imagen del usuario */}
      <Col>
        <Image src={User} roundedCircle style={{ width: "36px" }} />
      </Col>
    </Dropdown>
  );
};

export default DropExecutive;