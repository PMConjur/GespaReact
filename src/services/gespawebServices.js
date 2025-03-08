import servicio from "./axiosServices";
import { toast } from "sonner";
import axios from "axios";

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
//Endpoibnt searchCustomer
export async function searchCustomer(filter, value) {
  try {
    const response = await servicio.get("/search-customer/busqueda-cuenta", {
      params: { filtro: filter, ValorBusqueda: value }
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      const errorMessage =
        error.response.data?.mensaje || "Error al buscar el cliente";
      throw new Error(errorMessage);
    } else {
      throw new Error("Error al buscar el cliente.");
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

    const message =  getErrorStatus(response.status);

    console.log("Respuesta de la API recibida. Estado:", response.status);

    if (!response.ok) {
      toast.error(message, { position: "top-right" });
      throw new Error(message);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error en 401:");
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


//Uso de endpoint de tiempos 
export async function userTimes(numEmpleado) {
  try {
    console.log(numEmpleado);
    const response = await servicio.get(
      `/ejecutivo/tiempos-ejecutivo?numEmpleado=${numEmpleado}`
    );
    const data = response.data;
    
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


export async function userTimesUpdate(data) {
    try {
        console.log("📤 Enviando datos de pausa a la API:", JSON.stringify(data, null, 2));

        // const response = await fetch(`${apiUrl}/search-customer/validate-phone`, {
        const response = await fetch(`${apiUrl}/ejecutivo/pause-ejecutivo`,
            {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }
        );

        console.log("✅ Respuesta de la API:", response.data);
        toast.success("Datos enviados correctamente a la base de datos.");
        return response.data;
    } catch (error) {
        console.error("❌ Error al enviar los datos:", error);
        const errorMessage = error.response?.data?.mensaje || "Error 408: Error al enviar la pausa.";
        toast.error(errorMessage);
        throw new Error(errorMessage);
    }
}


//Endpoint Flow

export async function userFlow() {
  try {
    const response = await servicio.get(
      `/ejecutivo/flujo-preguntas-respuestas`
    );
    const data = response.data;
    console.log(data);
    return data;
  } catch (error) {
    if (error.response) {
      const errorMessage =
        error.response.data?.mensaje || "Error al recibir el flujo";
      throw new Error(errorMessage);
    } else {
      throw new Error("Error en la respuesta del endpoint.");
    }
  }
}

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


// Endpoint de seguimientos para múltiples cuentas
export async function getFollowUpsData(searchResults) {
  try {
    // Obtener token de autenticación de localStorage o estado
    const responseData = location.state || JSON.parse(localStorage.getItem("responseData"));
    const token = responseData?.ejecutivo?.token;

    if (!token) {
      throw new Error("Token de autenticación no disponible");
    }

    // Definir idCartera fijo (siempre 1 según el código original)
    const idCartera = 1;

    // Realizar múltiples solicitudes en paralelo para cada idCuenta en searchResults
    const followUps = await Promise.all(
      searchResults.map(async (result) => {
        const idCuenta = result.idCuenta.trim(); // Limpieza del idCuenta
        console.log("🔍 Buscando seguimientos para idCuenta:", idCuenta);

        try {
          const response = await axios.get(
            `${apiUrl}/ejecutivo/seguimientos/${idCartera}/${idCuenta}`,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Autenticación con token
              },
            }
          );

          console.log(`✅ Respuesta recibida para idCuenta ${idCuenta}:`, response.data);
          return response.data; // Retornar datos obtenidos
        } catch (error) {
          console.error(`❌ Error al obtener datos de seguimiento para idCuenta ${idCuenta}:`, error);
          return null; // Retornar null en caso de error para evitar fallas en Promise.all
        }
      })
    );

    // Filtrar valores nulos (en caso de errores individuales)
    return followUps.filter((data) => data !== null);
  } catch (error) {
    console.error("❌ Error al obtener los datos de seguimiento:", error);
    throw new Error("Error al cargar los datos de gestión.");
  }
}

// export const getTalksData = async (searchResults) => {
//   try {
//     const response = await fetch("/negotiations", {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         "Content-Type": "/ejecutivo/acciones-negociaciones",
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`Error al obtener negociaciones: ${response.statusText}`);
//     }

//     const data = await response.json();

//     // 🔹 Filtrar negociaciones por idCuenta
//     const filteredData = data.filter(item => item.idCuenta === idCuenta && item.idCartera === idCartera);

//     return filteredData;
//   } catch (error) {
//     console.error("Error al cargar los datos de negociaciones:", error);
//     return [];
//   }
// };


