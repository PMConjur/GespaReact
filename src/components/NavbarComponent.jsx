import { Navbar, Nav } from "react-bootstrap";
import DropExecutive from "./DropExecutive";
import NavContainer from "./NavContainer";
import { Offcanvas } from "react-bootstrap";
import CerrarSesion from "./CierraSesion";
import { NavLink, useLocation } from "react-router-dom";
import DropdownsInfo from "../../src/components/memuHamburguesa/Informacion/DropdownInfo"
import DropdownAction from "../../src/components/memuHamburguesa/Acciones/DropdownAction"
import DropdownExecutive from "../../src/components/memuHamburguesa/Ejecutivo/DropdownExecutive"
import { HouseDoorFill, KanbanFill } from "react-bootstrap-icons";

const NavbarComponent = () => {
  const location = useLocation();
  const responseData =
    location.state || JSON.parse(localStorage.getItem("responseData"));
  const setUser = (user) => {
    responseData.ejecutivo.infoEjecutivo.usuario = user;
  };
  const setIdEjecutivo = (idEjecutivo) => {
    responseData.ejecutivo.infoEjecutivo.idEjecutivo = idEjecutivo;
  };

  return (
    <Navbar
      expand={false}
      className="bg-dark mb-3"
      data-bs-theme="dark"
      style={{
        width: "100%",
        height: "60px",
        position: "fixed",
        top: "0",
        left: "0",
        zIndex: "1000"
      }}
    >
      <NavContainer />
      <DropExecutive />
      <Navbar.Offcanvas
        id="offcanvasNavbar"
        placement="start"
        data-bs-theme="dark"
        style={{ width: "300px" }}
      >
        <Offcanvas.Header closeButton />
        <Offcanvas.Body style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between', // Distribuye el espacio entre los elementos
          height: '100%',
        }}>
          <Nav className="flex-grow-1 pe-3" >
            <Nav.Link href="/home" className="text-align-center">
              <h5><span><HouseDoorFill/></span> Inicio</h5>
            </Nav.Link>
            <Nav.Link href="/managment" className="text-align-center">
              <h5><span><KanbanFill/></span> Gestion</h5>
            </Nav.Link>
            <DropdownsInfo/>
            <DropdownAction/>
            <DropdownExecutive/>
          </Nav>
          <div style={{marginTop: 'auto', marginBottom: '10px', display: 'flex', justifyContent: 'space-between'}}>
            <div style={{ textAlign: 'center' }}>Grupo Consorcio</div>
            <CerrarSesion setUser={setUser} setIdEjecutivo={setIdEjecutivo} />
          </div>
        </Offcanvas.Body>
      </Navbar.Offcanvas>
    </Navbar>
  );
};

export default NavbarComponent;
