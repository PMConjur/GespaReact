import { Dropdown, ButtonGroup, Image, Col } from "react-bootstrap";
import User from "../assets/img/user.svg";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const DropExecutive = () => {
  const location = useLocation();
  const [nombreEjecutivo, setNombreEjecutivo] = useState("");
  const [idEjecutivo, setIdEjecutivo] = useState("");

  useEffect(() => {
    const responseData =
      location.state || JSON.parse(localStorage.getItem("responseData"));
    if (responseData) {
      setNombreEjecutivo(responseData.ejecutivo.infoEjecutivo.nombreEjecutivo);
      setIdEjecutivo(responseData.ejecutivo.infoEjecutivo.idEjecutivo);
    }
  }, [location.state]);

  return (
    <Dropdown
      as={ButtonGroup}
      className="me-3"
      style={{ alignItems: "center" }}
    >
      <span className="text-white me-1 ms-1">{nombreEjecutivo}</span>
      <Dropdown.Toggle split variant="dark" id="dropdown-split-basic" />
      <Dropdown.Menu
        className="text-center"
        align="start"
        style={{ left: "0", right: "auto" }}
      >
        <p>{nombreEjecutivo}</p>
        <p>{idEjecutivo}</p>
        <Dropdown.Item href="/maintenance">Ejecutivo Telefonico</Dropdown.Item>
      </Dropdown.Menu>

      <Col>
        <Image src={User} roundedCircle style={{ width: "36px" }} />
      </Col>
    </Dropdown>
  );
};

export default DropExecutive;
