import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
const useSearchResults = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("Cuenta");
  const { state: responseData } = useLocation();
  const token = responseData?.ejecutivo?.token;
  const idEjecutivo = responseData?.ejecutivo?.infoEjecutivo?.idEjecutivo;

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
        "http://192.168.7.33/api/search-customer/busqueda-cuenta",
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

  const handleAutomaticSearch = async () => {
    if (!idEjecutivo) return;
    try {
      const responseEjecutivo = await axios.get(
        `http://192.168.7.33/api/search-customer/automatico-ejecutivo?numEmpleado=${idEjecutivo}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const idCuenta = responseEjecutivo.data.idCuenta?.trim();
      if (!idCuenta) return;

      const responseCuenta = await axios.get(
        "http://192.168.7.33/api/search-customer/busqueda-cuenta",
        {
          params: { filtro: "Cuenta", ValorBusqueda: idCuenta },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSearchResults(responseCuenta.data.listaResultados || []);
    } catch (error) {
      console.error("Error en la búsqueda automática:", error);
    }
  };

  return {
    searchResults,
    handleSearch,
    handleAutomaticSearch,
    searchTerm,
    setSearchTerm,
    filter,
    setFilter,
  };
};

export default useSearchResults;
