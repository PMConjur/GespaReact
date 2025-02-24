import DataCard from "../components/DataCard";
import { createContext, useState } from "react";
import Flow from "../components/Flow";
import Telephones from "../components/Telephones";
import InformationClient from "../components/InformationClient";
import { Row, Col, Container } from "react-bootstrap";
import DebtorInformation from "../components/DebtorInformation";
import Calculator from "../components/Calculator";
import Calendar from "../components/Calendar";
import NavbarComponent from "../components/NavbarComponent";
import axios from "axios";
import { toast, Toaster } from "sonner";
import SearchForm from "../components/SearchForm";
import SearchCustomer from "../components/SearchCustomer";
import CustomToast from "../components/CustomToast"

// Crear el contexto
export const AppContext = createContext();
const apiUrl = import.meta.env.VITE_API_URL;
//Import automatico
//immport Filtro Busqueda
const Managment = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("Cuenta");
  const [searchResults, setSearchResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const responseData =
    location.state || JSON.parse(localStorage.getItem("responseData")); // Retrieve responseData from localStorage if not in location state
  const [showToast, setShowToast] = useState(false);
  const [numeroTelefonico, setNumeroTelefonico] = useState("");

  const token = responseData?.ejecutivo?.token;
  console.log("Token recibido:", token);
  const nombreEjecutivo =
    responseData?.ejecutivo?.infoEjecutivo?.nombreEjecutivo;
  const idEjecutivo = responseData?.ejecutivo?.infoEjecutivo?.idEjecutivo;

  const fetchFilterData = async (filter) => {
    try {
      const response = await axios.get(
        `${apiUrl}/search-customer/busqueda-cuenta`,
        {
          params: { filtro: filter },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSearchResults(response.data.listaResultados || []);
    } catch (error) {
      console.error("Error fetching filter data:", error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        {apiUrl}`$search-customer/busqueda-cuenta`,
        {
          params: { filtro: filter, ValorBusqueda: searchTerm },
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSearchResults(response.data.listaResultados || []);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleFilterSelect = (filter) => {
    setFilter(filter);
    setSearchTerm("");
    setErrorMessage("");
  };

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setErrorMessage("");

    if (value.length > 0) {
      try {
        const response = await axios.get(
          `${apiUrl}/search-customer/busqueda-cuenta`,
          {
            params: { filtro: filter, ValorBusqueda: value },
            headers: { Authorization: `Bearer ${token}` },
          }
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

    try {
      const responseEjecutivo = await axios.get(
        `${apiUrl}/search-customer/automatico-ejecutivo?numEmpleado=${idEjecutivo}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("Respuesta completa de la API:", responseEjecutivo.data);

      // Validar si idCuenta está presente en la respuesta
      const idCuenta = responseEjecutivo.data.idCuenta?.trim();
      const numeroTelefonico = responseEjecutivo.data.numeroTelefonico;

      if (!idCuenta) {
        toast.warning(
          "idCuenta es nulo, solicita cargar a tu administrador"
        );
        setSearchResults([]);
        return;
      }

      setNumeroTelefonico(numeroTelefonico);
      // Mostrar el toast
      setShowToast(true);

      
      const responseCuenta = await axios.get(
        `${apiUrl}/search-customer/busqueda-cuenta`,
        {
          params: { filtro: "Cuenta", ValorBusqueda: idCuenta },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Respuesta de la búsqueda de cuenta:", responseCuenta.data);

      // Validar que la respuesta contenga listaResultados con al menos un elemento
      const listaResultados = responseCuenta.data.listaResultados;
      if (Array.isArray(listaResultados) && listaResultados.length > 0) {
        setSearchResults(listaResultados);
      } else {
        toast.warning("No se encontraron resultados en la búsqueda de cuenta");
        setSearchResults([]);
      }
    } catch (error) {
      console.error(
        "Error en la búsqueda automática:",
        error.response?.data || error.message
      );
      alert(`Error: ${error.response?.data?.errors || error.message}`);
    }
  };

     const copyToClipboard = () => {
        navigator.clipboard.writeText(numeroTelefonico);
        toast.success("Número copiado al portapapeles");
      };
  // Valores que se compartirán a través del contexto
  const contextValue = {
    nombreEjecutivo,
    idEjecutivo,
    searchTerm,
    setSearchTerm,
    filter,
    setFilter,
    searchResults,
    setSearchResults,
    suggestions,
    setSuggestions,
    showSuggestions,
    setShowSuggestions,
    errorMessage,
    setErrorMessage,
    user,
    setUser,
    password,
    setPassword,
    handleSearch,
    handleFilterSelect,
    handleInputChange,
    handleSuggestionClick,
    handleAutomaticSearch,
  };

  return (
    <>
      <AppContext.Provider value={contextValue}>
        <section>
          <NavbarComponent />
          <CustomToast
          show={showToast}
          onClose={() => setShowToast(false)}
          numeroTelefonico={numeroTelefonico}
          copyToClipboard={copyToClipboard}
        />
            <Toaster  richColors  position="top-center" style={{top: '60px'}}/> {/* Agregar Sonner aquí */}
          <Container fluid className="responsive mt-5">
            <Row>
              <Col xs={6} md={6}>
                <br />

                <DebtorInformation />
              </Col>
              <Col xs={6} md={6}>
                <br />
              
                <SearchForm />
              </Col>

              <Col xs={12} md={12}>
               
                <SearchCustomer />
              </Col>
              <Col xs={12} md={12}>
               
                <DataCard />
              </Col>
              <Col xs={12} md={12}>
                <Row className="recent-sales">
                  <Col xs={12} md={8} lg={8}>
                   
                    <InformationClient />
                  </Col>
                  <Col xs={12} md={4}>
                    
                    <Flow />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={8}>
                  
                    <Telephones />
                  </Col>
                  <Col xs={12} md={4}>
                    
                    <Calculator />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={8}>
                    <h1>Gestiones</h1>
                  </Col>
                  <Col xs={12} md={4}>
                    <h1>Calendario</h1>
                    <Calendar />
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={8}>
                    <h1>Prueba</h1>
                  </Col>
                  <Col xs={12} md={4}>
                    <h1>Recordatorios</h1>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Container>
        </section>
      </AppContext.Provider>
    </>
  );
};

export default Managment;
