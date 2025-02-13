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
          <Container fluid className="justify-content-between">
            <Navbar.Toggle
              aria-controls={`offcanvasNavbar-expand-${expand}`}
              style={{ margin: "0 10px" }}
            />
            <Navbar.Brand href="#" style={{ left: "0", marginRight: "auto" }}>
              Gespa <Image src={Logo} style={{ width: "36px" }} roundedCircle />
            </Navbar.Brand>

            <Form
              className="d-flex"
              data-bs-theme="dark"
              style={{
                gap: "10px",
                alignContent: "center",
                justifyContent: "center",
                alignItems: "center",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              <Form.Control
                type="search"
                placeholder="Search"
                className="me-2"
                aria-label="Search"
              />
              <NavDropdown
                title="Filtrar por"
                id={`offcanvasNavbarDropdown-expand-${expand}`}
                data-bs-theme="dark"
                style={{ color: "white" }}
              >
                <NavDropdown.Item href="#action3">Cuenta</NavDropdown.Item>
                <NavDropdown.Item href="#action4">Nombre</NavDropdown.Item>
                <NavDropdown.Item href="#action3">RFC</NavDropdown.Item>
                <NavDropdown.Item href="#action3">No. cliente</NavDropdown.Item>
                <NavDropdown.Item href="#action3">Telefono</NavDropdown.Item>
                <NavDropdown.Item href="#action3">Expediente</NavDropdown.Item>
              </NavDropdown>
              <Button variant="primary">Automatico</Button>
            </Form>

            <Dropdown
              as={ButtonGroup}
              drop="start" // Esto moverá el menú hacia la izquierda
              style={{
                backgroundColor: "transparent",
                border: "none",
                textAlign: "center",
                justifyContent: "center",
                alignItems: "center",
                marginRight: "10px",
              }}
            >
              <Dropdown.Toggle split variant="dark" id="dropdown-split-basic" />

              <Dropdown.Menu className="custom-dropdown-menu"
              drop="start"
              style={{ textAlign: "center"}}>
                <p>Cesar Enrique Rodriguez Alvarez</p>
                <p href="#/action-2">23389</p>
                <Dropdown.Item href="#/action-3">
                  Ejecutivo Telefonico
                </Dropdown.Item>
              </Dropdown.Menu>

              <span style={{ color: "white" }}>Cesar Enrique</span>
            </Dropdown>

            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="start"
              style={{ left: "0" }}
              data-bs-theme="dark"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title
                  id={`offcanvasNavbarLabel-expand-${expand}`}
                ></Offcanvas.Title>
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
