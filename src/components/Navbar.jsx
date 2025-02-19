import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
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
import axios from "axios";
import { useState, useEffect } from "react";
import FormControl from "react-bootstrap/FormControl";
import { Alert } from "react-bootstrap";
import { Card } from "react-bootstrap";
import "../scss/styles.scss";
import { Row } from "react-bootstrap";
import {
  FaRegCreditCard,
  FaUser,
  FaFileAlt,
  FaCalendarCheck,
  FaClipboardList,
} from "react-icons/fa";
import { ArrowRepeat, Search } from "react-bootstrap-icons";
import { useLocation } from "react-router-dom";
import DataCard from "./DataCard";
import CerrarSesion from "./CierraSesion";

function OffcanvasExample() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("Cuenta");
  const [searchResults, setSearchResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { state: responseData } = useLocation(); // Use useLocation to receive responseData
  console.log("Datos usuario", responseData);
  const [user, setUser] = useState(""); // Estado para el usuario
  const [password, setPassword] = useState(""); // Estado para la contraseña

  const token = responseData?.ejecutivo?.token; // Use the token from responseData
  const nombreEjecutivo =
    responseData?.ejecutivo?.infoEjecutivo?.nombreEjecutivo; // Use the name from responseData
  const idEjecutivo = responseData?.ejecutivo?.infoEjecutivo?.idEjecutivo; // Use the id from responseData
  console.log(token); //Token del usuario
  useEffect(() => {
    if (filter && !searchTerm) {
      fetchFilterData(filter);
    }
  }, [filter]);

  const fetchFilterData = async (filter) => {
    try {
      const response = await axios.get(
        "http://192.168.7.33/api/search-customer/busqueda-cuenta",
        {
          params: { filtro: filter },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Response for filter:", response.data);
      setSearchResults(response.data.listaResultados || []);
    } catch (error) {
      console.error("Error fetching filter data:", error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        "http://192.168.7.33/api/search-customer/busqueda-cuenta",
        {
          params: { filtro: filter, ValorBusqueda: searchTerm },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Response for search term:", response.data);
      setSearchResults(response.data.listaResultados || []);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleFilterSelect = (filter) => {
    setFilter(filter);
    setSearchTerm("");
    setErrorMessage(""); // Clear error message when changing filter
  };

  const handleInputChange = async (e) => {
    const value = e.target.value;
    let maxLength;

    // Validation based on selected filter
    let valid = true;
    switch (filter) {
      case "Cuenta":
        valid = /^[0-9]*$/.test(value);
        maxLength = 15;
        if (!valid) setErrorMessage("Cuenta solo puede contener números.");
        if (value.length > maxLength)
          setErrorMessage(`Cuenta puede tener máximo ${maxLength} caracteres.`);
        break;
      case "Nombre":
        valid = /^[A-Za-z\s]*$/.test(value);
        maxLength = 50;
        if (!valid) setErrorMessage("Nombre solo puede contener letras.");
        if (value.length > maxLength)
          setErrorMessage(`Nombre puede tener máximo ${maxLength} caracteres.`);
        break;
      case "RFC":
        valid = /^[A-Za-z0-9]*$/.test(value);
        maxLength = 13;
        if (!valid)
          setErrorMessage("RFC solo puede contener caracteres alfanuméricos.");
        if (value.length > maxLength)
          setErrorMessage(`RFC puede tener máximo ${maxLength} caracteres.`);
        break;
      case "Numero de cliente":
        valid = /^[0-9]*$/.test(value);
        maxLength = 10;
        if (!valid)
          setErrorMessage("Número de cliente solo puede contener números.");
        if (value.length > maxLength)
          setErrorMessage(
            `Número de cliente puede tener máximo ${maxLength} caracteres.`
          );
        break;
      case "Telefono":
        valid = /^[0-9]*$/.test(value);
        maxLength = 10;
        if (!valid) setErrorMessage("Teléfono solo puede contener números.");
        if (value.length > maxLength)
          setErrorMessage(
            `Teléfono puede tener máximo ${maxLength} caracteres.`
          );
        break;
      case "Expediente":
        valid = /^[A-Za-z0-9]*$/.test(value);
        maxLength = 10;
        if (!valid)
          setErrorMessage(
            "Expediente solo puede contener caracteres alfanuméricos."
          );
        if (value.length > maxLength)
          setErrorMessage(
            `Expediente puede tener máximo ${maxLength} caracteres.`
          );
        break;
      default:
        valid = /^[A-Za-z0-9\s]*$/.test(value);
        maxLength = 50; // Default maxLength for any other fields
        if (!valid)
          setErrorMessage(
            "Este campo solo puede contener caracteres alfanuméricos."
          );
        if (value.length > maxLength)
          setErrorMessage(
            `Este campo puede tener máximo ${maxLength} caracteres.`
          );
        break;
    }

    if (valid && value.length <= maxLength) {
      setSearchTerm(value);
      setErrorMessage(""); // Clear error message if the value is valid

      if (value.length > 0) {
        try {
          const response = await axios.get(
            "http://192.168.7.33/api/search-customer/busqueda-cuenta",
            {
              params: { filtro: filter, ValorBusqueda: value },
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          console.log(
            "Response for suggestions:",
            response.data.listaResultados
          );
          setSuggestions(response.data.listaResultados || []);
          setShowSuggestions(true);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
          setShowSuggestions(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.nombreDeudor);
    setSearchResults([suggestion]);
    setSuggestions([]);
    setShowSuggestions(false);
  };


  const handleAutomaticSearch = async () => {
    if (!idEjecutivo) {
      console.error("ID del ejecutivo no disponible");
      return;
    }
  
    if (typeof idEjecutivo !== 'number' && typeof idEjecutivo !== 'string') {
      console.error("ID del ejecutivo no es un número o una cadena válida");
      return;
    }
  
    try {
      // Obtener la cuenta asociada al ejecutivo
      const responseEjecutivo = await axios.get(
        `http://192.168.7.33/api/search-customer/automatico-ejecutivo?numEmpleado=${idEjecutivo}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      console.log("Response for automatic ejecutivo:", responseEjecutivo.data);
  
      // Extraer idCuenta asegurándonos de eliminar espacios en blanco
      const idCuenta = responseEjecutivo.data.idCuenta?.trim();
      
      if (!idCuenta) {
        console.warn("idCuenta es nulo o indefinido en la respuesta del ejecutivo");
        setSearchResults([]);
        return;
      }
  
      // Obtener la información de la cuenta
      const responseCuenta = await axios.get(
        "http://192.168.7.33/api/search-customer/busqueda-cuenta",
        {
          params: { filtro: "Cuenta", ValorBusqueda: idCuenta },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      console.log("Response for account search:", responseCuenta.data);
  
      // Validar que la respuesta contenga listaResultados con al menos un elemento
      const listaResultados = responseCuenta.data.listaResultados;
      if (Array.isArray(listaResultados) && listaResultados.length > 0) {
        setSearchResults(listaResultados);
      } else {
        console.warn("No se encontraron resultados en la búsqueda de cuenta");
        setSearchResults([]);
      }
    } catch (error) {
      if (error.response) {
        console.error("Error en la búsqueda automática:", error.response.data);
        alert(`Error: ${error.response.data.errors}`);
      } else if (error.request) {
        console.error("No se recibió respuesta del servidor:", error.request);
        alert("No se recibió respuesta del servidor. Por favor, intente nuevamente.");
      } else {
        console.error("Error en la configuración de la solicitud:", error.message);
        alert(`Error en la configuración de la solicitud: ${error.message}`);
      }
    }
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
            <Image src={Logo} style={{ width: "30px" }} roundedCircle />
            <Navbar.Brand
              href="/home"
              style={{ left: "0", marginRight: "auto" }}
              className="d-none d-md-block"
            >
              <h3>GespaWeb</h3>
              
            </Navbar.Brand>

            <form
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
              onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}
            >
              <div style={{ position: "relative", width: "300px" }}>
                <FormControl
                  style={{
                    width: "100%",
                    backgroundColor: "white",
                    paddingLeft: "35px", // Ajustar para que el texto no cubra el icono
                    color: "black",
                  }}
                  type="search"
                  placeholder="Buscar"
                  className="custom-placeholder me-2"
                  aria-label="Search"
                  value={searchTerm}
                  onChange={handleInputChange}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() =>
                    setTimeout(() => setShowSuggestions(false), 200)
                  }
                />
                <Search
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "black",
                    pointerEvents: "none", // Para que no bloquee la entrada de texto
                  }}
                />
                {errorMessage && (
                  <Alert
                    variant="danger"
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: "0",
                      width: "100%",
                    }}
                  >
                    {errorMessage}
                  </Alert>
                )}
                {showSuggestions && suggestions.length > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: "0",
                      width: "100%",
                      backgroundColor: "white",
                      color: "black",
                      border: "1px solid #ddd",
                      maxHeight: "300px",
                      overflowY: "auto",
                      zIndex: 1000,
                    }}
                  >
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        style={{ padding: "10px", cursor: "pointer" }}
                      >
                        {suggestion.nombreDeudor}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button variant="light">
                <NavDropdown
                  title={`Seleccionar filtro: ${filter}`}
                  id={`offcanvasNavbarDropdown-expand-${expand}`}
                  data-bs-theme="dark"
                  style={{ backgroundColor: "" }}
                  className="d-none d-md-block"
                  onSelect={handleFilterSelect}
                >
                  <NavDropdown.Item eventKey="Cuenta">Cuenta</NavDropdown.Item>
                  <NavDropdown.Item eventKey="Nombre">Nombre</NavDropdown.Item>
                  <NavDropdown.Item eventKey="RFC">RFC</NavDropdown.Item>
                  <NavDropdown.Item eventKey="Numero de cliente">
                    Numero de cliente
                  </NavDropdown.Item>
                  <NavDropdown.Item eventKey="Telefono">
                    Telefono
                  </NavDropdown.Item>
                  <NavDropdown.Item eventKey="Expediente">
                    Expediente
                  </NavDropdown.Item>
                </NavDropdown>
              </Button>
              <Button
        className="d-none d-md-block"
        variant="primary"
        type="button"
        onClick={handleAutomaticSearch} // Llamar a la nueva función
      >
        <ArrowRepeat />
        <span>Automático ({idEjecutivo})</span>
      </Button>
            </form>

            <Dropdown
              as={ButtonGroup}
              drop="down"
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
              <Col>
                <Image src={User} roundedCircle style={{ width: "36px" }} />
              </Col>

              <Dropdown.Menu
                className="custom-dropdown-menu"
                drop="down"
                style={{ textAlign: "center" }}
              >
                <p>{nombreEjecutivo}</p>
                <p>{idEjecutivo}</p>
                <Dropdown.Item href="/maintenance">
                  Ejecutivo Telefonico
                </Dropdown.Item>
              </Dropdown.Menu>

              <span className="d-none d-lg-block" style={{ color: "white" }}>
                {nombreEjecutivo}
              </span>
              <Dropdown.Toggle split variant="dark" id="dropdown-split-basic" />
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
                  <Nav.Link href="/managment">
                    <h5>Gestion</h5>
                  </Nav.Link>
                  <CerrarSesion setUser={setUser} setPassword={setPassword} />
                  {/* se agregar el apartadp cioerrasesion */}
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
      <div style={{ width: "50%", textAlign: "left", marginTop: "50px" }}>
        <Card
          className="p-3"
          style={{ backgroundColor: "black", color: "white", border: "none" }}
        >
          <Card.Title>
            <span style={{ color: "gray" }}>Cartera:</span>{" "}
            <strong>American Express</strong>
          </Card.Title>
          <Card.Body className="p-0">
            <div>
              <a
                href="#"
                style={{ color: "lightgreen", textDecoration: "none" }}
              >
                Inicio
              </a>{" "}
              /{" "}
              <a
                href="#"
                style={{ color: "lightblue", textDecoration: "none" }}
              >
                Productividad
              </a>{" "}
              /{" "}
              <a href="#" style={{ color: "#6495ED", textDecoration: "none" }}>
                Recuperación
              </a>{" "}
              /{" "}
              <a href="#" style={{ color: "orange", textDecoration: "none" }}>
                Tiempos
              </a>
              /{" "}
              <a
                href="#"
                style={{ color: "lightblue", textDecoration: "none" }}
              >
                Simulador
              </a>
            </div>
          </Card.Body>
        </Card>
      </div>
      {searchResults.length > 0 && (
        <Container fluid className="mt-3">
          {searchResults.map((result, index) => (
            <Card
              key={index}
              className="mb-3 custom-card mt-5"
              style={{ backgroundColor: "rgb(33, 37, 41)" }}
            >
              <Card.Body>
                {/* Contenedor de los datos que ocupa todo el ancho */}
                <Row>
                  <Col md={4}>
                    <p>
                      <FaRegCreditCard /> <strong>Producto:</strong>{" "}
                      {result.producto}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p>
                      <FaClipboardList /> <strong>Cuenta:</strong>{" "}
                      {result.idCuenta}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p>
                      <FaCalendarCheck /> <strong>Activada:</strong>{" "}
                      {result.fechaActivacion || "N/A"}
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <p>
                      <FaFileAlt /> <strong>Exp:</strong>{" "}
                      {result.expediente || "N/A"}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p>
                      <FaUser /> <strong>No. Cliente:</strong>{" "}
                      {result.numeroCliente || "N/A"}
                    </p>
                  </Col>
                  <Col md={4}>
                    <p>
                      <FaFileAlt /> <strong>RFC:</strong> {result.rfc}
                    </p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))}
        </Container>
      )}
      <DataCard/>
    </>
  );
}

export default OffcanvasExample;