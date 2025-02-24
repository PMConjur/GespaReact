import { useState, useEffect } from "react";
import {
  FormControl,
  Alert,
  Button,
  NavDropdown,
  Row,
  Form,
  Col
} from "react-bootstrap";
import { Search, ArrowRepeat } from "react-bootstrap-icons";
import React, { useContext } from "react";
import { AppContext } from "../pages/Managment"; // Importa el contexto
import { auto } from "@popperjs/core";

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
    handleAutomaticSearch
  } = useContext(AppContext);

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
    const value = e.target.value;
    if (validateInput(value)) {
      handleInputChange(e); // Solo actualiza el estado si la validación es correcta
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSearch();
      }}
    >
      <br />
      <Row>
        <Col xs={12} md={6}>
          <FormControl
            type="search"
            placeholder="Buscar"
            className="custom-placeholder me-2"
            aria-label="Search"
            value={searchTerm}
            onChange={handleChange} // Usar handleChange en lugar de handleInputChange
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            style={{
              width: "100%",
              backgroundColor: "white",

              color: "black"
            }}
          />
          <Search
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "black"
            }}
          />
          {inputError && (
            <Alert
              variant="danger"
              className="position-absolute w-auto mt-2 "
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
              className="position-absolute w-auto mt-2"
              style={{
                zIndex: 2000
              }}
            >
              {errorMessage}
            </Alert>
          )}
          {showSuggestions && suggestions.length > 0 && (
            <div
              className="position-absolute w-auto bg-white border border-secondary"
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
        </Col>
        <Col xs={6} md={2} className="text-right">
          <NavDropdown
            title={`Seleccionar filtro: ${filter}`}
            id="filter-dropdown"
            onSelect={handleFilterSelect}
          >
            {[
              "Cuenta",
              "Nombre",
              "RFC",
              "Numero de cliente",
              "Telefono",
              "Expediente"
            ].map((item) => (
              <NavDropdown.Item key={item} eventKey={item}>
                {item}
              </NavDropdown.Item>
            ))}
          </NavDropdown>
        </Col>
        <Col xs={6} md={2}>
          <Button
            className="d-flex"
            variant="primary"
            type="button"
            onClick={handleAutomaticSearch}
          >
            <ArrowRepeat />
            <span>Automático</span>
          </Button>
        </Col>
      </Row>
    </form>
  );
};

export default SearchForm;
