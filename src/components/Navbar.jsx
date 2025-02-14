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
import User from "../assets/img/user.svg";
import Col from "react-bootstrap/Col";


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
            <Navbar.Brand
              href="/home"
              style={{ left: "0", marginRight: "auto" }}
              className="d-none d-md-block"
            >
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
                className="d-none d-md-block"
              >
                <NavDropdown.Item href="/maintenance">idCuenta</NavDropdown.Item>
                <NavDropdown.Item href="/maintenance">Nombre Deudor</NavDropdown.Item>
                <NavDropdown.Item href="/maintenance">Producto</NavDropdown.Item>
                <NavDropdown.Item href="/maintenance">RFC</NavDropdown.Item>
                <NavDropdown.Item href="/maintenance">No. cliente</NavDropdown.Item>
                <NavDropdown.Item href="/maintenance">idCartera</NavDropdown.Item>
                <NavDropdown.Item href="/maintenance">Situacion</NavDropdown.Item>
              </NavDropdown>
              <Button className="d-none d-md-block" variant="primary">
                Automatico
              </Button>
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
                gap: "5px",
              }}
            >
              <Dropdown.Toggle split variant="dark" id="dropdown-split-basic" />

              <Dropdown.Menu
                className="custom-dropdown-menu"
                drop="start"
                style={{ textAlign: "center" }}
              >
                <p>Cesar Enrique Rodriguez Alvarez</p>
                <p>23389</p>
                <Dropdown.Item href="/maintenance">
                  Ejecutivo Telefonico
                </Dropdown.Item>
              </Dropdown.Menu>
              <Col>
                <Image src={User} roundedCircle style={{ width: "36px" }} />
              </Col>
              <span className="d-none d-lg-block" style={{ color: "white" }}>
                Cesar Enrique
              </span>
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
                  <Nav.Link href="/home">
                    <h5>Inicio</h5>
                  </Nav.Link>
                  <Nav.Link href="/maintenance">
                    <h5>Gestion</h5>
                  </Nav.Link>
                  <Nav.Link href="/login">
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
