import axios from "axios";

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
export const fetchPhones = async () => {
  try {
    console.log("Iniciando llamada a la API...");
    console.log("URL de la API:", `${apiUrl}/search-customer/phones?idCuenta=370700000000004`);

    const response = await fetch(
      `${apiUrl}/search-customer/phones?idCuenta=370700000000004`,
      {
        method: "GET", // Método HTTP (GET, POST, etc.)
        headers: {
          "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJERVpPIiwianRpIjoiYzRkNjJkZjYtMGM0OC00MWFjLWFkY2EtYWM2OGVhYjcwOTAxIiwiVXN1YXJpbyI6IkRFWk8iLCJleHAiOjE3NDA0NDg1MTUsImlzcyI6IjE5Mi4xNjguNy4zMyIsImF1ZCI6IjE5Mi4xNjguNS4zOCJ9.LSWtJY3aZOmWFIuTyzdSqv_-bq_2n7ZazFHfCQiyM1Y`, // Incluye el token en el header
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
