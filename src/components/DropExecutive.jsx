import { Dropdown, ButtonGroup, Image, Col } from "react-bootstrap";
import User from "../assets/img/user.svg";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import {Hash} from "react-bootstrap-icons";

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
      {/* Mostrar el nombre del ejecutivo con degradado */}
      <span
        className="me-1 ms-1"
        style={{
          background: "linear-gradient(90deg, #6dd6ff, #07fb70)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {nombreEjecutivo}
      </span>
      {/* Botón de toggle para el dropdown */}
      <Dropdown.Toggle split variant="dark" id="dropdown-split-basic" />
      <Dropdown.Menu
        className="text-center p-3"
        align="end" // Cambiado a "end" para que se alinee hacia la izquierda
        style={{
          top: "40px",
          left: "-200px", // Cambiado para que se ajuste automáticamente
          right: "0", // Posición hacia la izquierda
          borderRadius: "10px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          minWidth: "240px", // Cambiado a 240px
        }}
      >
        {/* Encabezado con nombre e ID del ejecutivo */}
        <div className="text-center">
          <p className="mb-0 fw-bold" style={{ fontSize: "18px" }}> {/* Letra más grande */}
            {nombreEjecutivo}
          </p>
          <p className="mb-0 text-muted" style={{ fontSize: "16px" }}> {/* Letra más grande */}
          <Hash></Hash>{idEjecutivo}
          </p>
        </div>
        <hr
          className="my-2"
          style={{
            height: "2px",
            border: "none",
            background: "linear-gradient(90deg, #6dd6ff, #07fb70)", // Degradado aplicado
          }}
        />
        {/* Opción del menú del dropdown */}
        <p
          className="text-center" // Cambiado a text-center para centrar
          style={{
            fontSize: "16px",
            color: "#fff", // Cambiado a blanco
            borderRadius: "5px",
          }}
        >
          Ejecutivo Telefonico
        </p>
      </Dropdown.Menu>

      {/* Imagen del usuario */}
      <Col>
        <Image src={User} roundedCircle style={{ width: "36px" }} />
      </Col>
    </Dropdown>
  );
};

export default DropExecutive;