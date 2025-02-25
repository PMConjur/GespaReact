import axios from "axios";
import { AppContext } from "../pages/Managment";

const responseData =
location.state || JSON.parse(localStorage.getItem("responseData")); 
const token = responseData?.ejecutivo?.token;
const apiUrl = import.meta.env.VITE_API_URL;

const servicio = axios.create({
  baseURL: {apiUrl},
  headers: {
    "Content-Type": "application/json"
  }
});

// Interceptor to add the token to the headers
servicio.interceptors.request.use(
  (config) => {
 const token = config.headers.Authorization; // Use the token set in Login.jsx
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

servicio.interceptors.response.use(null, (error) => {
  return Promise.reject(error);
});

export default servicio;

//Endpoint Telefonos
export const fetchPhones = async (idCuenta) => {
  try {
    console.log("Iniciando llamada a la API...");
    console.log("URL de la API:", `${apiUrl}/search-customer/phones?idCuenta=${idCuenta}`);

    const response = await fetch(
      `${apiUrl}/search-customer/phones?idCuenta=${idCuenta}`,
      {
        method: "GET", // Método HTTP (GET, POST, etc.)
        headers: {
          "Authorization": `Bearer ${token}`, // Incluye el token en el header
          "Content-Type": "application/json", // Tipo de contenido
        },
      }
    );
    console.log("Respuesta de la API recibida. Estado:", response.status);

    if (!response.ok) {
      console.error("Error en la respuesta de la API. Estado:", response.status);
      throw new Error("Error al obtener los datos de teléfonos");
    }

    const data = await response.json();
    console.log("Datos obtenidos de la API:", data);

    return data;
  } catch (error) {
    console.error("Error en fetchPhones:", error);
    throw error;
  }
};