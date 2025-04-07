import { useState, useEffect } from "react";
import {
  FormControl,
  Alert,
  Button,
  Dropdown,
  InputGroup
} from "react-bootstrap";
import { Search, ArrowRepeat, FunnelFill } from "react-bootstrap-icons";
import { useContext } from "react";
import { AppContext } from "../pages/Managment"; // Importa el contexto
import { toast } from "sonner"; // Importar toast

const SearchForm = () => {
  const {
    searchTerm,
    setSearchTerm,
    filter,
    setFilter,
    suggestions,
    setSuggestions,
    showSuggestions,
    setShowSuggestions,
    errorMessage,
    setErrorMessage,
    handleSearch,
    handleFilterSelect,
    handleInputChange,
    handleSuggestionClick,
    handleAutomaticSearch,
    userActiveFlow // Obtener userActiveFlow del contexto
  } = useContext(AppContext);
  console.log(userActiveFlow); // Verifica el valor de userActiveFlow
  const [inputError, setInputError] = useState(""); // Estado para el mensaje de error

  // Limpiar el mensaje de error cuando el filtro cambie
  useEffect(() => {
    setInputError("");
  }, [filter]); // Dependencia: cuando `filter` cambie, se ejecuta este efecto

  // Función para validar el campo según el filtro seleccionado
  const validateInput = (value) => {
    switch (filter) {
      case "Cuenta":
        if (!/^\d{0,16}$/.test(value)) {
          setInputError(
            "Solo se permiten números y un máximo de 16 caracteres."
          );
          return false;
        }
        break;
      case "Nombre":
        if (!/^[a-zA-Z\s]{0,60}$/.test(value)) {
          setInputError(
            "Solo se permiten letras y espacios, con un máximo de 60 caracteres."
          );
          return false;
        }
        break;
      case "RFC":
        if (!/^[a-zA-Z0-9]{0,13}$/.test(value)) {
          setInputError(
            "Solo se permiten caracteres alfanuméricos y un máximo de 13 caracteres."
          );
          return false;
        }
        break;
      case "Numero de cliente":
        if (!/^\d{0,10}$/.test(value)) {
          setInputError(
            "Solo se permiten números y un máximo de 10 caracteres."
          );
          return false;
        }
        break;
      case "Expediente":
        if (!/^[a-zA-Z0-9]{0,10}$/.test(value)) {
          setInputError(
            "Solo se permiten caracteres alfanuméricos y un máximo de 10 caracteres."
          );
          return false;
        }
        break;
      case "Telefono":
        if (!/^\d{0,10}$/.test(value)) {
          setInputError(
            "Solo se permiten números y un máximo de 10 caracteres."
          );
          return false;
        }
        break;
      default:
        setInputError(""); // Sin validación si no hay filtro seleccionado
        return true;
    }
    setInputError(""); // Limpiar el mensaje de error si la validación es exitosa
    return true;
  };

  // Función para manejar el cambio en el input
  const handleChange = (e) => {
    if (userActiveFlow === true) {
      toast.warning(
        "No puedes realizar esta acción mientras el flujo está activo."
      );
      return; // Bloquear la acción si el flujo está activo
    }
    const value = e.target.value;
    if (validateInput(value)) {
      handleInputChange(e); // Solo actualiza el estado si la validación es correcta
    }
  };

  const handleButtonClick = () => {
    if (userActiveFlow) {
      toast.warning(
        "No puedes realizar esta acción mientras el flujo está activo."
      );
      return; // Bloquear la acción si el flujo está activo
    }
    handleAutomaticSearch(); // Ejecutar la búsqueda automática si el flujo no está activo
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }}
    >
      <span>Busqueda de información:</span>

      <div className="mx-auto ">
        <InputGroup className="col-5 " variant="dark">
          <InputGroup.Text
            id="btnGroupAddon"
            className="bg-dark text-white border-0"
          >
            <Search />
          </InputGroup.Text>
          <FormControl
            type="search"
            placeholder="Buscar"
            aria-label="Search"
            value={searchTerm}
            onChange={handleChange} // Usar la nueva función handleChange
            onFocus={() => {
              if (!userActiveFlow) setShowSuggestions(true); // Evitar acción si el flujo está activo
            }}
            onBlur={() => {
              if (!userActiveFlow)
                setTimeout(() => setShowSuggestions(false), 200); // Evitar acción si el flujo está activo
            }}
            style={{
              backgroundColor: "white",
              color: "black"
            }}
          />

          {inputError && (
            <Alert
              variant="danger"
              className="position-absolute w-auto mt-5"
              style={{
                zIndex: 2000
              }}
            >
              {inputError}
            </Alert>
          )}
          {errorMessage && (
            <Alert
              variant="danger"
              className="position-absolute w-auto mt-5"
              style={{
                zIndex: 2000
              }}
            >
              {errorMessage}
            </Alert>
          )}
          {showSuggestions && suggestions.length > 0 && (
            <div
              className="position-absolute w-auto bg-white mt-5"
              style={{
                maxHeight: "300px",
                overflowY: "auto",
                zIndex: 2000,
                color: "black",
                fontSize: "13px"
              }}
            >
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="p-2 cursor-pointer"
                >
                  {suggestion.nombreDeudor}
                </div>
              ))}
            </div>
          )}
          <Dropdown onSelect={handleFilterSelect} disabled={!userActiveFlow}>
            <Dropdown.Toggle variant="success" id="filter-dropdown">
              <FunnelFill className="d-block d-md-none"></FunnelFill>
              <span className="d-none d-md-inline">Filtro: {filter}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {[
                "Cuenta",
                "Nombre",
                "RFC",
                "Numero de cliente",
                "Telefono",
                "Expediente"
              ].map((item) => (
                <Dropdown.Item key={item} eventKey={item}>
                  {item}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <Button
            className="align-center"
            variant="primary"
            type="button"
            onClick={handleButtonClick} // Usar la nueva función handleButtonClick
          >
            <ArrowRepeat className="d-block d-md-none"></ArrowRepeat>
            <span className="d-none d-md-inline">Automático</span>
          </Button>
        </InputGroup>
      </div>
    </form>
  );
};

export default SearchForm;
