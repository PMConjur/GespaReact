import DataCard from "../components/DataCard";
import { createContext, useState} from "react";
import Flow from "../components/Flow";
import Telephones from "../components/Telephones";
import InformationClient from "../components/InformationClient";
import { Row, Col, Container, Card } from "react-bootstrap";
import DebtorInformation from "../components/DebtorInformation";
import Calculator from "../components/Calculator";
import DatePickerComponent from "../components/Calendar";
import NavbarComponent from "../components/NavbarComponent";
import { toast, Toaster } from "sonner";
import SearchForm from "../components/SearchForm";
import SearchCustomer from "../components/SearchCustomer";
import CustomToast from "../components/CustomToast";
import Managments from "../components/Managments";
import NotesWidget from "../components/NotesWidget";
import { searchCustomer, searchCustomers, automaticSearchEjecutivo, searchByAccount } from "../services/gespawebServices";
import StickyTimmer from "../components/StickyTimmer";
import { se } from "date-fns/locale";

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
  const [communicationData, setCommunicationData] = useState(null); // Estado para los datos de CommunicationPhone
  const [stoppedTime, setStoppedTime] = useState(null); // Estado para el tiempo detenido
  const [isPaymentActive, setPaymentActive] = useState(false); // Estado para pagos
  const [isOnlineChargeActive, setOnlineChargeActive] = useState(false); // Estado para cargos en línea
  const [stoppedTimeSticky, setStoppedTimeSticky] = useState(null); // Estado para el tiempo actual del StickyTimmer
  const [triggerUpdateStickyTime, setTriggerUpdateStickyTime] = useState(false); // Estado para accionar la actualización del tiempo
  const [userActiveFlow, setUserActiveFlow] = useState(false); // Asegurar que el estado inicial sea false
  const [isManagment, setManagment] = useState([]); // Estado para la gestión
  const [isDataAllPhones, setIsDataAllPhones] = useState([]); // Estado para manejar los teléfonos
  const [selectedPhoneFilter, setSelectedPhoneFilter] = useState(null); // Nueva variable para el filtro de teléfonos
  const [selectedPhoneForFollowUps, setSelectedPhoneForFollowUps] = useState(null); // Nueva variable para el número seleccionado
  const [refreshManagments, setRefreshManagments] = useState(false); // Estado para controlar la actualización de Managments
  const token = responseData?.ejecutivo?.token;
  const nombreEjecutivo =
    responseData?.ejecutivo?.infoEjecutivo?.nombreEjecutivo;
  const idEjecutivo = responseData?.ejecutivo?.infoEjecutivo?.idEjecutivo;
  const [phoneData, setPhoneData] = useState([]);
  const [formData, setFormData] = useState(null); // Estado para el flujo activo del usuario
  const [selectedDate, setSelectedDate] = useState(null);

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
        const results = await searchCustomers(filter, value);
        setSuggestions(results);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error:", error);
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

  // En tu componente
const handleAutomaticSearch = async () => {
  if (!idEjecutivo) {
    console.error("ID del ejecutivo no disponible");
    return;
  }

  try {
    // 1. Búsqueda automática del ejecutivo
    const { idCuenta, numeroTelefonico } = await automaticSearchEjecutivo(idEjecutivo);

    if (!idCuenta) {
      toast.warning(
        "No cuentas con cuentas asignadas, por favor verifica con tu supervisor"
      );
      setSearchResults([]);
      return;
    }

    setNumeroTelefonico(numeroTelefonico);
    setShowToast(true);

    // 2. Búsqueda por cuenta
    const listaResultados = await searchByAccount(idCuenta);

    if (Array.isArray(listaResultados) && listaResultados.length > 0) {
      setSearchResults(listaResultados);
    } else {
      toast.warning("No se encontraron resultados en la búsqueda de cuenta");
      setSearchResults([]);
    }
  } catch (error) {
    console.error("Error en la búsqueda automática:", error);
    toast.error(`Error: ${error.message}`);
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
    idEjecutivo, // Agregar idEjecutivo al contexto
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
    isPaymentActive, // Enviar estado de pagos al contexto
    setPaymentActive, // Enviar función para actualizar pagos al contexto
    isOnlineChargeActive, // Enviar estado de cargos en línea al contexto
    setOnlineChargeActive, // Enviar función para actualizar cargos en línea al contexto
    lastPhoneNumberFromToast,
    setLastPhoneNumberFromToast,
    communicationData,
    setCommunicationData,
    stoppedTime,
    setStoppedTime,
    stoppedTimeSticky,
    setStoppedTimeSticky,
    triggerUpdateStickyTime,
    setTriggerUpdateStickyTime,
    userActiveFlow, // Enviar estado userActiveFlow al contexto
    setUserActiveFlow, // Enviar función para actualizar userActiveFlow al contexto
    isManagment, // Enviar estado de gestión al contexto
    setManagment, // Enviar función para actualizar la gestión al contexto
    phoneData, // Enviar datos de teléfono al contexto
    formData, // Enviar datos del formulario al contexto
    setFormData, // Enviar función para actualizar los datos de teléfono al contexto
    isDataAllPhones, // Agregar al contexto
    setIsDataAllPhones, // Agregar setter al contexto
    selectedPhoneFilter, // Agregar al contexto
    setSelectedPhoneFilter, // Agregar setter al contexto
    selectedPhoneForFollowUps, // Agregar al contexto
    setSelectedPhoneForFollowUps, // Agregar setter al contexto
    selectedDate, // Enviar fecha seleccionada al contexto
    setSelectedDate, // Enviar función para actualizar la fecha seleccionada al contexto
    refreshManagments, // Enviar estado refreshManagments al contexto
    setRefreshManagments, // Enviar función para actualizar refreshManagments al contexto
    reminders: [], // Puedes inicializarlo como un array vacío o con los datos que necesites
  };

  return (
    <>
      <AppContext.Provider value={contextValue}>
        <section>
          <NavbarComponent />
          <StickyTimmer />
          <CustomToast
            show={showToast}
            onClose={handleToastClosed} // Usamos la función renombrada
            numeroTelefonico={numeroTelefonico}
            copyToClipboard={() => {
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
              <Container fluid>
                <Row className="d-flex" xs={12} md={12}>
                  <Col xs={12} md={12} lg={8}>
                    <Row className="recent-sales">
                      <Col xs={12}>
                        <InformationClient />
                      </Col>
                    </Row>
                    <Row>
                      <Col xs={12} md={12} lg={12}>
                        <Telephones onDataLoaded={setPhoneData} />
                      </Col>
                    </Row>
                  </Col>
                  <Col xs={12} md={12} lg={4}>
                    <Row>
                      <Col xs={12} md={12}>
                        <Flow />
                      </Col>
                    </Row>
                    <Card className="widgets-container bg-transparent">
                      <Row>
                        <Col xs={6} md={6} xl={6}>
                          <Calculator /> {/* Componente con la calculadora */}
                          <br />
                        </Col>
                        <Col xs={6} md={6} xl={6}>
                          <DatePickerComponent />{" "}
                          {/* Componente con el calendario */}
                          <br />
                        </Col>

                        {/* Componente de gestiones */}
                        <Col xs={12} md={12} xl={12}>
                           <NotesWidget /> 
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <Managments />
                  </Col>
                </Row>
              </Container>
            </Row>
          </Container>
        </section>
      </AppContext.Provider>
    </>
  );
};

export default Managment;
