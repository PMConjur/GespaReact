import servicio from "./axiosServices";
import { toast } from "sonner";

// Obtiene token de inicio de sesión
const responseData =
  location.state || JSON.parse(localStorage.getItem("responseData"));
const token = responseData?.ejecutivo?.token;
const apiUrl = import.meta.env.VITE_API_URL;

//endpoint login
export async function userReset(dataUserReset) {
  try {
    const response = await servicio.post(
      "/login/resetea-password",
      dataUserReset
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      const errorMessage =
        error.response.data?.resetea?.mensaje ||
        "Error al actualizar la contraseña.";
      throw new Error(errorMessage);
    } else {
      throw new Error("Error al actualizar la contraseña.");
    }
  }
}
//EndPointProductividad

export async function userProductivity(numEmpleado) {
  try {
    console.log(numEmpleado);
    const response = await servicio.get(
      `/ejecutivo/productividad-ejecutivo?numEmpleado=${numEmpleado}`
    );
    const data = response.data;
    console.log(data);
    return data;
  } catch (error) {
    if (error.response) {
      const errorMessage =
        error.response.data?.mensaje || "Error al recibir la productividad";
      throw new Error(errorMessage);
    } else {
      throw new Error("Error al recibir la productividad.");
    }
  }
}

export async function userRecovery(idEjecutivo, actual) {
  try {
    console.log(idEjecutivo, actual);
    const response = await servicio.get(
      `/ejecutivo/get-recuperacion?idEjecutivo=${idEjecutivo}&actual=${actual}`
    );
    const data = response.data;
    console.log(data);
    return data;
  } catch (error) {
    if (error.response) {
      const errorMessage =
        error.response.data?.mensaje || "Error al recibir la recuperacion";
      throw new Error(errorMessage);
    } else {
      throw new Error("Sin respuesta del servidor.");
    }
  }
}

export async function userNegotiations(idEjecutivo) {
  try {
    console.log(idEjecutivo);
    const response = await servicio.get(
      `/ejecutivo/get-negociaciones?idEjecutivo=${idEjecutivo}`
    );
    const data = response.data;
    console.log(data);
    return data;
  } catch (error) {
    if (error.response) {
      const errorMessage =
        error.response.data?.mensaje || "Error al recibir la productividad";
      throw new Error(errorMessage);
    } else {
      throw new Error("Error al recibir la productividad.");
    }
  }
}

//Endpoint Telefonos
export const fetchPhones = async (idCuenta) => {
  try {
    console.log("Iniciando llamada a la API...");
    console.log(
      "URL de la API:",
      `${apiUrl}/search-customer/phones?idCuenta=${idCuenta}`
    );

    const response = await fetch(
      `${apiUrl}/search-customer/phones?idCuenta=${idCuenta}`,
      {
        method: "GET", // Método HTTP (GET, POST, etc.)
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en el header
          "Content-Type": "application/json" // Tipo de contenido
        }
      }
    );
    console.log("Respuesta de la API recibida. Estado:", response.status);

    if (!response.ok) {
      console.error(
        "Error en la respuesta de la API. Estado:",
        response.status
      );
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

//Endpoint Información del Cliente
export const fetchInformation = async (idCuenta) => {
  try {
    console.log("Iniciando llamada a la API...");
    console.log("URL de la API:", `${apiUrl}/search-customer/products-info?idCuenta=${idCuenta}`);

    const response = await fetch(
      `${apiUrl}/search-customer/products-info?idCuenta=${idCuenta}`,
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
      throw new Error("Error al obtener los datos de informacion");
    }

    const data = await response.json();
    console.log("Datos obtenidos de la API:", data);

    return data;
  } catch (error) {
    console.error("Error en fetchInformation:", error);
    throw error;
  }
};

//Endpoint Validación de Teléfono
export const fetchValidationTel = async (data) => {
  try {
    const response = await fetch(`${apiUrl}/search-customer/validate-phone`, {
      method: "POST", // Asegurar que sea POST
      headers: {
        Authorization: `Bearer ${token}`, // Incluye el token en el header
        "Content-Type": "application/json" // Tipo de contenido
      },
      body: JSON.stringify(data), // Enviar datos correctamente en el body
    });

    if (!response.ok) {
      throw new Error(`Error en la respuesta de la API. Estado: ${response.status}`);
    }

    const result = await response.json();
    console.log("Validación recibida:", result);
    return result;
  } catch (error) {
    console.error("Error en fetchValidationTel:", error);
    throw error;
  }
};

//Error status global
const getErrorStatus = (status) => {
  switch (status) {
    case 200:
      return "Solicitud exitosa (200): La operación se realizó correctamente.";
    case 201:
      return "Recurso creado (201): Se ha generado correctamente.";
    case 202:
      return "Aceptado (202): La solicitud ha sido aceptada para procesamiento.";
    case 204:
      return "Sin contenido (204): La solicitud fue exitosa, pero no hay datos para devolver.";
    case 400:
      return "Solicitud incorrecta (400): Verifica los datos enviados.";
    case 401:
      return "No autorizado (401): Verifica tus credenciales.";
    case 403:
      return "Acceso prohibido (403): No tienes permiso para esta acción.";
    case 404:
      return "No encontrado (404): El recurso solicitado no existe.";
    case 409:
      return "Conflicto (409): El recurso ya existe o hay un problema con la solicitud.";
    case 429:
      return "Demasiadas solicitudes (429): Intenta de nuevo más tarde.";
    case 500:
      return "Error interno del servidor (500): Intenta nuevamente más tarde.";
    default:
      return `Error inesperado (${status}): Contacta con soporte.`;
  }
};

//const message = getErrorStatus(response.status);