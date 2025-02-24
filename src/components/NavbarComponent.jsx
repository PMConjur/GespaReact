import { useContext } from "react";
import { AppContext } from "../pages/Managment"; // Importa el contexto
import { Navbar, Nav } from "react-bootstrap";
import DropExecutive from "./DropExecutive";
import NavContainer from "./NavContainer";
import { Offcanvas } from "react-bootstrap";
import CerrarSesion from "./CierraSesion";

const NavbarComponent = () => {
  // Consume el contexto
  const { setPassword, setUser } = useContext(AppContext);

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
            <CerrarSesion setUser={setUser} setPassword={setPassword} />
            <div className="mt-auto">Grupo Consorcio</div>
          </Nav>
        </Offcanvas.Body>
      </Navbar.Offcanvas>
    </Navbar>
  );
};

export default NavbarComponent;
