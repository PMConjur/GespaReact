import React from "react";
import { Navbar, Container, Nav, Offcanvas, Image, Dropdown, ButtonGroup, Col } from "react-bootstrap";
import Logo from "../assets/img/logo22.png";
import User from "../assets/img/user.svg";
import CerrarSesion from "./CierraSesion";
import SearchForm from "./SearchForm";

const NavbarComponent = ({
  handleSearch,
  searchTerm,
  handleInputChange,
  errorMessage,
  showSuggestions,
  setShowSuggestions,
  suggestions,
  handleSuggestionClick,
  filter,
  handleFilterSelect,
  handleAutomaticSearch,
  idEjecutivo,
  nombreEjecutivo,
  setUser,
  setPassword,
}) => {
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
        zIndex: "1000",
      }}
    >
      <Container fluid className="justify-content-between">
        <Navbar.Toggle aria-controls="offcanvasNavbar" style={{ margin: "0 10px" }} />
        <Image src={Logo} style={{ width: "30px" }} roundedCircle />
        <Navbar.Brand href="/home" className="d-none d-md-block">
          <h3>GespaWeb</h3>
        </Navbar.Brand>

        <SearchForm
          handleSearch={handleSearch}
          searchTerm={searchTerm}
          handleInputChange={handleInputChange}
          errorMessage={errorMessage}
          showSuggestions={showSuggestions}
          setShowSuggestions={setShowSuggestions} 
          suggestions={suggestions}
          handleSuggestionClick={handleSuggestionClick}
          filter={filter}
          handleFilterSelect={handleFilterSelect}
          handleAutomaticSearch={handleAutomaticSearch}
          idEjecutivo={idEjecutivo}
        />

        <Dropdown as={ButtonGroup} className="mr-2" style={{alignItems: 'center'}}>
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

        <Navbar.Offcanvas id="offcanvasNavbar" placement="start" data-bs-theme="dark">
          <Offcanvas.Header closeButton />
          <Offcanvas.Body>
            <Nav className="flex-grow-1 pe-3">
              <Nav.Link href="/home"><h5>Inicio</h5></Nav.Link>
              <Nav.Link href="/managment"><h5>Gestion</h5></Nav.Link>
              <CerrarSesion setUser={setUser} setPassword={setPassword} />
              <div className="mt-auto">Grupo Consorcio</div>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;