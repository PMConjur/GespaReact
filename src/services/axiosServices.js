import axios from "axios";
//import { config } from "npm";

const apiUrl = import.meta.env.VITE_API_URL;
const servicio = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json"
  }
});

// Función para verificar si el token ha expirado
const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    return true; // Si hay un error, consideramos que el token es inválido
  }
};

// Función para verificar el token periódicamente
const checkTokenExpiration = () => {
  setInterval(() => {
    try {
      const responseData = JSON.parse(localStorage.getItem("responseData"));
      const token = responseData?.ejecutivo?.token;

      if (token && isTokenExpired(token)) {
        console.error("Token expirado, redirigiendo a login...");
        localStorage.removeItem("responseData");
        localStorage.removeItem("idLogIngreso");
        sessionStorage.clear();
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
        window.location.href = "/"; // Redirigir al login
      }
    } catch (error) {
      console.error("Error al verificar el token periódicamente:", error);
    }
  }, 5000); // Verificar cada 5 segundos
};

// Llamar a la función para iniciar la verificación periódica
checkTokenExpiration();

servicio.interceptors.request.use(
  (config) => {
    try {
      const responseData = JSON.parse(localStorage.getItem("responseData"));
      console.log("Contenido de ResponseData:", responseData); // Log the response data to ensure it is set

      const token = responseData?.ejecutivo?.token;
      console.log("Token obtenido", token); // Log the token to ensure it is set

      if (token) {
        if (isTokenExpired(token)) {
          console.error("Token expirado, redirigiendo a login...");
          localStorage.removeItem("responseData");
          window.location.href = "/"; // Redirigir al login
          return Promise.reject(new Error("Token expirado"));
        }
        console.log("Token en interceptor (request):", token);
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.warn("No se encontró un token válido en responseData.");
      }
    } catch (error) {
      console.error("Error al leer el token del localstorage", error);
    }
    return config;
  },
  (error) => {
    console.error("Error en la respuesta del interceptor:", error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas
servicio.interceptors.response.use(
  (response) => {
    console.log("Respuesta exitosa:", response);
    return response;
  },
  (error) => {
    console.error("Error capturado en el interceptor (response):", error);

    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        console.error("Token expirado, redirigiendo a login...");
        localStorage.removeItem("responseData");
        localStorage.removeItem("idLogIngreso");
        sessionStorage.clear();
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
        window.location.href = "/"; // Redirigir al login
      } else {
        console.error(`Error de respuesta con código de estado ${status}:`, error.response.data);
      }
    } else {
      console.error("Error sin respuesta del servidor", error.message);
    }
    return Promise.reject(error);
  }
);

export default servicio;