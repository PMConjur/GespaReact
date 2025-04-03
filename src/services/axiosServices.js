import axios from "axios";

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
    const payload = JSON.parse(atob(token.split(".")[1])); // Decodificar el payload del JWT
    const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
    return payload.exp < currentTime; // Comparar con el tiempo de expiración
  } catch (error) {
    console.error("Error al decodificar el token:", error);
    return true; // Si hay un error, asumimos que el token es inválido
  }
};


// Interceptor para agregar el token a las solicitudes
servicio.interceptors.request.use(
  (config) => {
    try {
      const responseData = JSON.parse(localStorage.getItem("responseData"));
      console.log("Contenido de responseData:", responseData);

      const token = responseData?.ejecutivo?.token;
      console.log("Token obtenido:", token);

      if (token) {
        if (isTokenExpired(token)) {
          console.error("El token ha expirado. Redirigiendo a login...");
          localStorage.removeItem("responseData");
          window.location.href = "/";
          return Promise.reject(new Error("El token ha expirado"));
        }

        console.log("Token en interceptor (request):", token);
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.warn("No se encontró un token válido en responseData.");
      }
    } catch (error) {
      console.error("Error al leer el token del localStorage:", error);
    }
    return config;
  },
  (error) => {
    console.error("Error en el interceptor de solicitud:", error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
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
        console.error("Token expirado o inválido. Redirigiendo a login...");
        localStorage.removeItem("responseData");
        localStorage.removeItem("idLogIngreso");
        sessionStorage.clear();
        document.cookie.split(";").forEach((c) => {
          document.cookie = c
            .replace(/^ +/, "")
            .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
        window.location.href = "/";
      } else {
        console.error(`Error de respuesta con código de estado ${status}:`, error.response.data);
      }
    } else {
      console.error("Error sin respuesta del servidor:", error.message);
    }

    return Promise.reject(error);
  }
);

export default servicio;