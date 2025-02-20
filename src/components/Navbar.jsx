import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import NavbarComponent from "./NavbarComponent";
import SearchCustomer from "./SearchCustomer";
import { toast, Toaster } from "sonner";

function OffcanvasExample() {
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
  const [telefono, setTelefono] = useState("");

  const token = responseData?.ejecutivo?.token;
  console.log("Token recibido:", token);
  const nombreEjecutivo =
    responseData?.ejecutivo?.infoEjecutivo?.nombreEjecutivo;
  const idEjecutivo = responseData?.ejecutivo?.infoEjecutivo?.idEjecutivo;

  useEffect(() => {
    if (filter && !searchTerm) fetchFilterData(filter);
  }, [filter]);

  const fetchFilterData = async (filter) => {
    try {
      const response = await axios.get(
        "http://192.168.7.33/api/search-customer/busqueda-cuenta",
        {
          params: { filtro: filter },
          headers: { Authorization: `Bearer ${token}` }
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
        "http://192.168.7.33/api/search-customer/busqueda-cuenta",
        {
          params: { filtro: filter, ValorBusqueda: searchTerm },
          headers: { Authorization: `Bearer ${token}` }
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

      console.log("Respuesta completa de la API:", responseEjecutivo.data);

      // Validar si idCuenta está presente en la respuesta
      const idCuenta = responseEjecutivo.data.idCuenta?.trim();
      const numeroTelefonico = responseEjecutivo.data.numeroTelefonico;

      if (!idCuenta) {
        console.warn(
          "idCuenta es nulo o indefinido en la respuesta del ejecutivo"
        );
        setSearchResults([]);
        return;
      }

      const copyToClipboard = () => {
        navigator.clipboard.writeText(numeroTelefonico);
        toast.success("Número copiado al portapapeles");
      };

      toast.info(
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            backgroundColor: ""
          }}
        >
          <span>Número de Teléfono: {numeroTelefonico}</span>
          <button
            onClick={copyToClipboard}
            style={{
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Copiar
          </button>
        </div>,
        { duration: Infinity, closeButton: true }
      );

      const responseCuenta = await axios.get(
        "http://192.168.7.33/api/search-customer/busqueda-cuenta",
        {
          params: { filtro: "Cuenta", ValorBusqueda: idCuenta },
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      console.log("Respuesta de la búsqueda de cuenta:", responseCuenta.data);

      // Validar que la respuesta contenga listaResultados con al menos un elemento
      const listaResultados = responseCuenta.data.listaResultados;
      if (Array.isArray(listaResultados) && listaResultados.length > 0) {
        setSearchResults(listaResultados);
      } else {
        console.warn("No se encontraron resultados en la búsqueda de cuenta");
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

  return (
    <>
      <NavbarComponent
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
        nombreEjecutivo={nombreEjecutivo}
        setUser={setUser}
        setPassword={setPassword}
      />

      {searchResults.length > 0 && (
        <SearchCustomer searchResults={searchResults} />
      )}
      {/* Toast para mostrar el número de teléfono */}
      <Toaster richColors position="top-right" />
    </>
  );
}

export default OffcanvasExample;
