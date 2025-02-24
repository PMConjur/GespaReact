import { Dropdown, ButtonGroup, Image, Col } from "react-bootstrap";
import User from "../assets/img/user.svg";

const responseData =
  location.state || JSON.parse(localStorage.getItem("responseData")); // Retrieve responseData from localStorage if not in location state
const nombreEjecutivo = responseData?.ejecutivo?.infoEjecutivo?.nombreEjecutivo;
const idEjecutivo = responseData?.ejecutivo?.infoEjecutivo?.idEjecutivo;
console.log(nombreEjecutivo);
console.log(idEjecutivo);
const DropExecutive = () => {
  return (
    <Dropdown
      as={ButtonGroup}
      className="me-3"
      style={{ alignItems: "center" }}
    >
      <span className=" text-white me-1 ms-1">{nombreEjecutivo}</span>
         <Dropdown.Toggle split variant="dark" id="dropdown-split-basic" />
      <Dropdown.Menu className="text-center" align="start" style={{left: '0', right: 'auto'}}>
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
