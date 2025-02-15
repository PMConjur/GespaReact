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
import React, { useState, useEffect } from 'react';
import FormControl from "react-bootstrap/FormControl";


function OffcanvasExample() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('Cuenta');
  const [searchResults, setSearchResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJCR1JIIiwianRpIjoiMTJmNTFmNTYtNDI5Yi00MzZlLWJlM2UtYzBhNjc0MWE2YmNjIiwiVXN1YXJpbyI6IkJHUkgiLCJleHAiOjE3Mzk1ODE2NjIsImlzcyI6IjE5Mi4xNjguNy4zMyIsImF1ZCI6IjE5Mi4xNjguNS4zOCJ9.yY1hnbY6NeFDXFO3BwmC9rOwg5CLQn90C_KvUvmEqMo'; // Reemplaza 'YOUR_ACCESS_TOKEN_HERE' con tu token de acceso 

  useEffect(() => {
    if (filter && !searchTerm) {
      fetchFilterData(filter);
    }
  }, [filter]);

  const fetchFilterData = async (filter) => {
    try {
      const response = await axios.get('http://192.168.7.33/api/Search/busqueda-cuenta', {
        params: { filtro: filter },
        headers: {
          Authorization: token,
        },
      });
      console.log('Response for filter:', response.data);
      setSearchResults(response.data.busquedainfo || []);
    } catch (error) {
      console.error('Error fetching filter data:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get('http://192.168.7.33/api/Search/busqueda-cuenta', {
        params: { filtro: filter, ValorBusqueda: searchTerm },
        headers: {
          Authorization: token,
        },
      });
      console.log('Response for search term:', response.data);
      setSearchResults(Array.isArray(response.data.busquedainfo) ? response.data.busquedainfo : []);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const handleFilterSelect = (filter) => {
    setFilter(filter);
    setSearchTerm('');
  };

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length > 0) {
      try {
        const response = await axios.get('http://192.168.7.33/api/Search/busqueda-cuenta', {
          params: { filtro: filter, ValorBusqueda: value },
          headers: {
            Authorization: token,
          },
        });
        console.log('Response for suggestions:', response.data.busquedainfo);
        if (Array.isArray(response.data.busquedainfo)) {
          setSuggestions(response.data.busquedainfo);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setShowSuggestions(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.nombreDeudor);
    setSuggestions([]);
    setShowSuggestions(false);
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

            <form
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
              <div style={{ position: 'relative', width: '300px' }}>
                <FormControl
                  type="search"
                  placeholder="Buscar"
                  className="me-2"
                  aria-label="Search"
                  value={searchTerm}
                  onChange={handleInputChange}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 100)} // delay to allow click event
                  style={{ width: '100%' }}
                />
                {showSuggestions && (
                  <div style={{ position: 'absolute', top: '100%', left: '0', width: '100%', backgroundColor: 'white', border: '1px solid #ddd', zIndex: 1000 }}>
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        style={{ padding: '10px', cursor: 'pointer' }}
                      >
                        {suggestion.nombreDeudor}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <NavDropdown
                title={`Filtrar por: ${filter}`}
                id={`offcanvasNavbarDropdown-expand-${expand}`}
                data-bs-theme="dark"
                style={{ color: 'white' }}
                className="d-none d-md-block"
                onSelect={handleFilterSelect}
              >
                <NavDropdown.Item eventKey="Cuenta">Cuenta</NavDropdown.Item>
                <NavDropdown.Item eventKey="Nombre">Nombre</NavDropdown.Item>
                <NavDropdown.Item eventKey="RFC">RFC</NavDropdown.Item>
                <NavDropdown.Item eventKey="Numero de cliente">Numero de cliente</NavDropdown.Item>
                <NavDropdown.Item eventKey="Telefono">Telefono</NavDropdown.Item>
                <NavDropdown.Item eventKey="Expediente">Expediente</NavDropdown.Item>
              </NavDropdown>
              <Button className="d-none d-md-block" variant="primary" type="submit">
                Buscar
              </Button>
            </form>

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