import { Dropdown, ButtonGroup, Image, Col } from "react-bootstrap";
import User from "../assets/img/user.svg";

const responseData =
  location.state || JSON.parse(localStorage.getItem("responseData")); // Retrieve responseData from localStorage if not in location state
const nombreEjecutivo = responseData?.ejecutivo?.infoEjecutivo?.nombreEjecutivo;
const idEjecutivo = responseData?.ejecutivo?.infoEjecutivo?.idEjecutivo;
const DropExecutive = () => {
  return (
    <Dropdown
      as={ButtonGroup}
      className="me-3"
      style={{ alignItems: "center" }}
    >
      <Col>
        <Image src={User} roundedCircle style={{ width: "36px" }} />
      </Col>
      <Dropdown.Toggle split variant="dark" id="dropdown-split-basic" />
      <Dropdown.Menu className="text-center">
        <p>{nombreEjecutivo}</p>
        <p>{idEjecutivo}</p>
        <Dropdown.Item href="/maintenance">Ejecutivo Telefonico</Dropdown.Item>
      </Dropdown.Menu>
      <span className="d-none d-lg-block text-white">{nombreEjecutivo}</span>
    </Dropdown>
  );
};

export default DropExecutive;
