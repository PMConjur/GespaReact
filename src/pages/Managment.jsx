import DataCard from "../components/DataCard";
import { createContext, useState, useEffect } from "react";
import Flow from "../components/Flow";
import Telephones from "../components/Telephones";
import InformationClient from "../components/InformationClient";
import { Row, Col, Container } from "react-bootstrap";
import DebtorInformation from "../components/DebtorInformation";
import Calculator from "../components/Calculator";
import DatePickerComponent from "../components/Calendar";
import NavbarComponent from "../components/NavbarComponent";
import axios from "axios";
import { toast, Toaster } from "sonner";
import SearchForm from "../components/SearchForm";
import SearchCustomer from "../components/SearchCustomer";
import CustomToast from "../components/CustomToast";
import Managments from "../components/Managments";
import NotesWidget from "../components/NotesWidget";
import { searchCustomer } from "../services/gespawebServices";

export const AppContext = createContext();

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
    location.state || JSON.parse(localStorage.getItem("responseData"));
  const [showToast, setShowToast] = useState(false);
  const [numeroTelefonico, setNumeroTelefonico] = useState("");
  const [flowMessage, setFlowMessage] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isNegotiationActive, setNegotiationActive] = useState(false);
  const [isFollowUpActive, setFollowUpActive] = useState(false);
  const [lastPhoneNumberFromToast, setLastPhoneNumberFromToast] = useState("");
  const token = responseData?.ejecutivo?.token;
  const nombreEjecutivo = responseData?.ejecutivo?.infoEjecutivo?.nombreEjecutivo;
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
        const response = await axios.get(
          "http://192.168.7.33/api/search-customer/busqueda-cuenta",
          {
            params: { filtro: filter, ValorBusqueda: value },
            headers: { Authorization: `Bearer ${token}` }
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
        `http://192.168.7.33/api/search-customer/automatico-ejecutivo?numEmpleado=${idEjecutivo}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const idCuenta = responseEjecutivo.data.idCuenta?.trim();
      const numeroTelefonico = responseEjecutivo.data.numeroTelefonico;

      if (!idCuenta) {
        toast.warning("idCuenta es nulo, solicita cargar a tu administrador");
        setSearchResults([]);
        return;
      }

      setNumeroTelefonico(numeroTelefonico);
      setShowToast(true);

      const responseCuenta = await axios.get(
        "http://192.168.7.33/api/search-customer/busqueda-cuenta",
        {
          params: { filtro: "Cuenta", ValorBusqueda: idCuenta },
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const listaResultados = responseCuenta.data.listaResultados;
      if (Array.isArray(listaResultados) && listaResultados.length > 0) {
        setSearchResults(listaResultados);
      } else {
        toast.warning("No se encontraron resultados en la búsqueda de cuenta");
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error en la búsqueda automática:", error.response?.data || error.message);
      toast.error(`Error: ${error.response?.data?.errors || error.message}`);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(numeroTelefonico);
    toast.success("Número copiado al portapapeles");
  };

  const handleToastClosed = () => {
    setShowToast(false);
    if (numeroTelefonico) {
      setLastPhoneNumberFromToast(numeroTelefonico);
    }
  };

  const notifyPhoneNumber = (phoneNumber) => {
    setLastPhoneNumberFromToast(phoneNumber);
  };

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
    flowMessage,
    setFlowMessage,
    selectedAnswer,
    setSelectedAnswer,
    isNegotiationActive,
    setNegotiationActive,
    isFollowUpActive,
    setFollowUpActive,
    lastPhoneNumberFromToast,
    setLastPhoneNumberFromToast,
  };

  return (
    <>
      <AppContext.Provider value={contextValue}>
        <section>
          <NavbarComponent />

          <CustomToast
            show={showToast}
            onClose={handleToastClosed} // Usamos la función renombrada
            numeroTelefonico={numeroTelefonico}
            copyToClipboard ={() => {
              navigator.clipboard.writeText(numeroTelefonico);
              toast.success("Número copiado al portapapeles");
            }}
          />
          <Toaster richColors position="top-center" style={{ top: "60px" }} />

          <Container fluid className="responsive mt-5">
            <Row>
              <Col xs={12} md={12} lg={6}>
                <br />
                <DebtorInformation />
              </Col>

              <Col xs={12} md={12} lg={6} className="mx-auto">
                <br />
                <SearchForm />
              </Col>

              <Col xs={12} md={12}>
                <SearchCustomer />
              </Col>

              <Col xs={12} md={12}>
                <DataCard />
              </Col>

              <Row className="d-flex" xs={12} md={12}>
                <Col xs={12} md={6} lg={8}>
                  <Row className="recent-sales">
                    <Col xs={12}>
                      <InformationClient />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12}>
                      <Telephones />
                    </Col>
                  </Row>
                  <Col xs={12}>
                    <Managments />
                  </Col>
                </Col>
                <Col xs={12} md={6} lg={4}>
                  <Row>
                    <Col xs={12} md={12}>
                      <Flow />
                    </Col>
                    <Col xs={6} md={6}>
                      <Calculator /> {/* Componente con la calculadora */}
                      <br />
                    </Col>
                    <Col xs={6} md={6}>
                      <DatePickerComponent />{" "}
                      {/* Componente con el calendario */}
                      <br />
                    </Col>

                    {/* Componente de gestiones */}
                    <Col xs={12} md={12}>
                      <NotesWidget />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Row>
          </Container>
        </section>
      </AppContext.Provider>
    </>
  );
};

export default Managment;