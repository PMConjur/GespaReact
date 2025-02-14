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
import axios from 'axios';
import React, { useState } from 'react';


function OffcanvasExample() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('Cuenta');
  const [searchResults, setSearchResults] = useState(null);

  const handleSearch = async () => {
    try {
      const response = await axios.get('http://192.168.7.33/api/Search/busqueda-cuenta', {
        params: { query: searchTerm, filter: filter },
        headers: {
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJST0FDIiwianRpIjoiYTM3ODhlMWQtOTczMC00YjRjLWFhMjEtYjRiM2EwZjFkNjRhIiwiVXN1YXJpbyI6IlJPQUMiLCJleHAiOjE3Mzk1NjE1MTYsImlzcyI6IjE5Mi4xNjguNy4zMyIsImF1ZCI6IjE5Mi4xNjguNS4zOCJ9.ul1goTwMxMQzhMLHZdX4ty_EE0MwUA6Syw1gr1H59y4',
        },
        
      });
      console.log(searchTerm, filter),
      console.log('Response from endpoint:', response);
      setSearchResults(response.data.busquedainfo);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const handleFilterSelect = (filter) => {
    setFilter(filter);
  };

  return (
    <>
      {[false].map((expand) => (
        <Navbar
          key={expand}
          expand={expand}
          className="bg-dark mb-3"
          data-bs-theme="dark"
          style={{
            width: '100%',
            height: '60px',
            top: '0',
            position: 'fixed',
            left: '0',
            zIndex: '1000',
          }}
        >
          <Container fluid className="justify-content-between">
            <Navbar.Toggle
              aria-controls={`offcanvasNavbar-expand-${expand}`}
              style={{ margin: '0 10px' }}
            />
            <Navbar.Brand
              href="/home"
              style={{ left: '0', marginRight: 'auto' }}
              className="d-none d-md-block"
            >
              Gespa <Image src={Logo} style={{ width: '36px' }} roundedCircle />
            </Navbar.Brand>

            <Form
              className="d-flex"
              data-bs-theme="dark"
              style={{
                gap: '10px',
                alignContent: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
            >
              <Form.Control
                type="search"
                placeholder="Buscar Cuenta"
                className="me-2"
                aria-label="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <NavDropdown
                title={`Filtrar por: ${filter}`}
                id={`offcanvasNavbarDropdown-expand-${expand}`}
                data-bs-theme="dark"
                style={{ color: 'white' }}
                className="d-none d-md-block"
              >
                <NavDropdown.Item onClick={() => handleFilterSelect('Cuenta')}>Cuenta</NavDropdown.Item>
                <NavDropdown.Item onClick={() => handleFilterSelect('Nombre')}>Nombre</NavDropdown.Item>
                <NavDropdown.Item onClick={() => handleFilterSelect('RFC')}>RFC</NavDropdown.Item>
                <NavDropdown.Item onClick={() => handleFilterSelect('Numero de cliente')}>Numero de cliente</NavDropdown.Item>
                <NavDropdown.Item onClick={() => handleFilterSelect('Telefono')}>Telefono</NavDropdown.Item>
                <NavDropdown.Item onClick={() => handleFilterSelect('Expediente')}>Expediente</NavDropdown.Item>
              </NavDropdown>
              <Button className="d-none d-md-block" variant="primary" type="submit">
                Buscar
              </Button>
            </Form>

            <Dropdown
              as={ButtonGroup}
              drop="start"
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                textAlign: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: '10px',
                gap: '5px',
              }}
            >
              <Dropdown.Toggle split variant="dark" id="dropdown-split-basic" />

              <Dropdown.Menu
                className="custom-dropdown-menu"
                drop="start"
                style={{ textAlign: 'center' }}
              >
                <p>Cesar Enrique Rodriguez Alvarez</p>
                <p>23389</p>
                <Dropdown.Item href="/maintenance">
                  Ejecutivo Telefonico
                </Dropdown.Item>
              </Dropdown.Menu>
              <Col>
                <Image src={User} roundedCircle style={{ width: '36px' }} />
              </Col>
              <span className="d-none d-lg-block" style={{ color: 'white' }}>
                Cesar Enrique
              </span>
            </Dropdown>

            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${expand}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
              placement="start"
              style={{ left: '0' }}
              data-bs-theme="dark"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}></Offcanvas.Title>
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
                  <div style={{ bottom: '0' }}>
                    <span>Grupo Consorcio</span>
                  </div>
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
      ))}
      {searchResults && (
        <div>
          <h3>Resultados de la búsqueda:</h3>
          <pre>{JSON.stringify(searchResults, null, 2)}</pre>
        </div>
      )}
    </>
  );
}

export default OffcanvasExample;

