import { Navbar, Nav } from "react-bootstrap";
import DropExecutive from "./DropExecutive";
import NavContainer from "./NavContainer";
import { Offcanvas } from "react-bootstrap";
import CerrarSesion from "./CierraSesion";
import { useLocation } from "react-router-dom";

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
      >
        <Offcanvas.Header closeButton />
        <Offcanvas.Body>
          <Nav className="flex-grow-1 pe-3">
            <Nav.Link href="/home">
              <h5>Inicio</h5>
            </Nav.Link>
            <Nav.Link href="/managment">
              <h5>Gestion</h5>
            </Nav.Link>
            <CerrarSesion setUser={setUser} setIdEjecutivo={setIdEjecutivo} />
            <div className="mt-auto">Grupo Consorcio</div>
          </Nav>
        </Offcanvas.Body>
      </Navbar.Offcanvas>
    </Navbar>
  );
};

export default NavbarComponent;
