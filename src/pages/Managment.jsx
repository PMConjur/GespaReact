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
import CustomToast from "../components/CustomToast";
import Managments from "../components/Managments";
import Reminder from "../components/Reminder";
import { searchCustomer } from "../services/gespawebServices";
// Crear el contexto
export const AppContext = createContext();
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

  //console.log("Token recibido:", token);
  const nombreEjecutivo =
    responseData?.ejecutivo?.infoEjecutivo?.nombreEjecutivo;
  const idEjecutivo = responseData?.ejecutivo?.infoEjecutivo?.idEjecutivo;

  const handleSearch = async () => {
    try {
      const response = await searchCustomer(filter, searchTerm);
      setSearchResults(response.listaResultados || []);
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
        const response = await searchCustomer(filter, value);
        setSuggestions(response.listaResultados || []);
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
        `http://192.168.7.33/api/search-customer/automatico-ejecutivo?numEmpleado=${idEjecutivo}`
      );

      console.log("Respuesta completa de la API:", responseEjecutivo.data);

      // Validar si idCuenta está presente en la respuesta
      const idCuenta = responseEjecutivo.data.idCuenta?.trim();
      const numeroTelefonico = responseEjecutivo.data.numeroTelefonico;

      if (!idCuenta) {
        toast.warning("idCuenta es nulo, solicita cargar a tu administrador");
        setSearchResults([]);
        return;
      }

      setNumeroTelefonico(numeroTelefonico);
      // Mostrar el toast
      setShowToast(true);

      const responseCuenta = await searchCustomer("Cuenta", idCuenta);

      console.log("Respuesta de la búsqueda de cuenta:", responseCuenta);

      // Validar que la respuesta contenga listaResultados con al menos un elemento
      const listaResultados = responseCuenta.listaResultados;
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
    handleAutomaticSearch
  };
  return (
    <>
      {/* Proveedor de contexto para compartir datos con los componentes hijos */}
      <AppContext.Provider value={contextValue}>
        <section>
          {/* Componente de la barra de navegación */}
          <NavbarComponent />
          
          {/* Componente de Toast personalizado para mostrar mensajes emergentes */}
          <CustomToast
            show={showToast} // Controla si el Toast debe mostrarse
            onClose={() => setShowToast(false)} // Cierra el Toast al invocar esta función
            numeroTelefonico={numeroTelefonico} // Pasa el número telefónico al Toast
            copyToClipboard={copyToClipboard} // Función para copiar al portapapeles
          />
          
          {/* Componente Toaster para mostrar notificaciones emergentes */}
          <Toaster richColors position="top-center" style={{ top: "60px" }} /> 
  
          <Container fluid className="responsive mt-5">
            <Row>
              {/* Columna para mostrar información del deudor */}
              <Col xs={12} md={12} lg={6}>
                <br />
                <DebtorInformation /> {/* Componente con información del deudor */}
              </Col>
  
              {/* Columna para mostrar el formulario de búsqueda */}
              <Col xs={12} md={12} lg={6} className="mx-auto">
                <br />
                <SearchForm /> {/* Componente del formulario de búsqueda */}
              </Col>
  
              {/* Componente de búsqueda de clientes */}
              <Col xs={12} md={12}>
                <SearchCustomer />
              </Col>
  
              {/* Componente de tarjeta de datos */}
              <Col xs={12} md={12}>
                <DataCard />
              </Col>
  
              <Col xs={12} md={12}>
                {/* Sección para mostrar información adicional */}
                <Row className="recent-sales">
                  <Col xs={12} md={8} lg={8}>
                    <InformationClient /> {/* Componente con la información del cliente */}
                  </Col>
                  <Col xs={12} md={4}>
                    <Flow /> {/* Componente con el flujo de información */}
                  </Col>
                </Row>
                <Row>
                  <Col xs={12} md={8}>
                    <Telephones /> {/* Componente con los números telefónicos */}
                  </Col>
                  <Col xs={12} md={4}>
                    <Calculator /> {/* Componente con la calculadora */}
                  </Col>
                </Row>
                <Row>
                  {/* Componente de gestiones */}
                  <Col xs={12} md={8}>
                    <h1>Gestiones</h1>
                    <Managments /> {/* Componente de gestiones */}
                  </Col>
                  <Col xs={12} md={4}>
                    <Calendar /> {/* Componente con el calendario */}
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
