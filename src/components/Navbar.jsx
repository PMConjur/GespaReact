import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Offcanvas from "react-bootstrap/Offcanvas";
import Image from "react-bootstrap/Image";
import Logo from "../assets/img/logo22.png";

import ButtonGroup from "react-bootstrap/ButtonGroup";
import Dropdown from "react-bootstrap/Dropdown";
import { left } from "@popperjs/core";

function OffcanvasExample() {
  return (
    <>
      {[false].map((expand) => (
        <Navbar
          key={expand}
          expand={expand}
          className="bg-dark mb-3"
          data-bs-theme="dark"
          style={{
            width: "100%",
            height: "60px",
            top: "0",
            position: "fixed",
            left: "0",
            zIndex: "1000",
          }}
        >
          <Container fluid>
            <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} 
            style={{margin: "0 10px"}}/>
            <Navbar.Brand href="#"
            style={{ left: "0", marginRight: "auto" }}>
              Gespa <Image src={Logo} style={{ width: "36px" }} roundedCircle />
            </Navbar.Brand>

            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="start"
              style={{ left: "0" }}
              data-bs-theme="dark"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  <Nav.Link href="#action1">
                    <h5>Inicio</h5>
                  </Nav.Link>
                  <Nav.Link href="#action2">
                    <h5>Gestion</h5>
                  </Nav.Link>
                  <Nav.Link href="#action2">
                    <h5>Cerrar Sesion</h5>
                  </Nav.Link>
                  <br />
                  <div style={{ bottom: "0" }}>
                    <span>Grupo Consorcio</span>
                  </div>
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      ))}
    </>
  );
}

export default OffcanvasExample;
