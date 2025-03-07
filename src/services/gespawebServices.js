import servicio from "./axiosServices";
import { toast } from "sonner";

//
const apiUrl = import.meta.env.VITE_API_URL;

//endpoint login
export async function userReset(dataUserReset) {
  try {
    const response = await servicio.post(
      "/login/resetea-password",
      dataUserReset
    );
    const { mensaje, exito } = response.data.resetea;
    if (exito === "1") {
      return { success: true, message: "Contraseña actualizada correctamente" };
    } else if (mensaje) {
      return { success: false, message: mensaje };
    } else {
      throw new Error("Error desconocido al actualizar la contraseña.");
    }
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

    const response = await servicio.get(
      `/search-customer/phones?idCuenta=${idCuenta}`
    );

    const message = getErrorStatus(response.status);

    console.log("Respuesta de la API recibida. Estado:", response.status);

    if (response.status !== 200) {
      toast.error(message, { position: "top-right" });
      throw new Error(message);
    }

    const data = response.data;

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
    console.log(
      "URL de la API:",
      `${apiUrl}/search-customer/products-info?idCuenta=${idCuenta}`
    );

    const response = await servicio.get(
      `/search-customer/products-info?idCuenta=${idCuenta}`
    );

    const message = getErrorStatus(response.status);

    console.log("Respuesta de la API recibida. Estado:", response.status);

    if (response.status !== 200) {
      toast.error(message, { position: "top-right" });
      throw new Error(message);
    }

    const data = response.data;
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
    const response = await servicio.post(
      `/search-customer/validate-phone`,
      data
    );

    if (response.status !== 200) {
      throw new Error(
        `Error en la respuesta de la API. Estado: ${response.status}`
      );
    }

    const result = response.data;
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

//Endpoint Flow

export async function userFlow() {
  try {
    const response = await servicio.get(
      `/ejecutivo/flujo-preguntas-respuestas`
    );
    const data = response.data;

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

//Endpoint de accionamientos
export const fetchDrives = async (idCartera, idCuenta) => {

  try {
    console.log("Iniciando llamada a la API...");
    console.log(
      "URL de la API:",
      `${apiUrl}/ejecutivo/accionamientos/${idCartera}/${idCuenta}`
    );

    const response = await servicio.get(
      `${apiUrl}/ejecutivo/accionamientos/1/${idCuenta}`
    );

    const message = getErrorStatus(response.status);

    console.log("Respuesta de la API recibida. Estado:", response.status);

    if (response.status !== 200) {
      toast.error(message, { position: "top-right" });
      throw new Error(message);
    }

    const data = response.data;

    console.log("Datos obtenidos de la API:", data); // Agrega este console.log para mostrar los datos obtenidos

    return data;
  } catch (error) {
    console.error("Error en fetchDrives:", error);
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
//jajajajajajaja Pinche uriel

/***
 * 
 * 
 * 
 * 
 *         /////\\\\\
       /         \
      /  ~~~~ ~~~\  
     (  -  -  -  - )  
      |    ⏜    |  
      |  \___/  |  
       \_______/  
    /  |       |  \  
   /   |  ---  |   \  
  /    |       |    \  
 /_____|_______|_____\  
   (     )   (     )  

 * 
 */
