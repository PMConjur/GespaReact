import servicio from "./axiosServices";
import { toast } from "sonner";
import axios from "axios";

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

// Obtener tiempos del ejecutivo
export async function userTimes(numEmpleado) {
  try {
    console.log(`📡 Solicitando tiempos para empleado: ${numEmpleado}`);

    const response = await servicio.get(
      `/ejecutivo/tiempos-ejecutivo?numEmpleado=${numEmpleado}`
    );

    // Filtramos la contraseña si estuviera en la respuesta
    const { ...dataSinContraseña } = response.data;
    return dataSinContraseña;

  } catch (error) {
    console.error("❌ Error al recibir la productividad:", error);
    const errorMessage =
      error.response?.data?.mensaje || "Error al recibir la productividad.";
    throw new Error(errorMessage);
  }
}

export async function userTimesUpdate(data) {
  try {
    console.log("📤 Enviando datos de pausa a la API:", JSON.stringify(data, null, 2));

    const responseData = JSON.parse(localStorage.getItem("responseData"));
    const token = responseData?.ejecutivo?.token;

    if (!token) {
      throw new Error("⚠️ No se encontró un token de autenticación.");
    }

    if (!data.idEjecutivo || !data.contrasenia || !data.peCausa || !data.duracion) {
      throw new Error("⚠️ Datos incompletos. Verifica que todos los campos estén llenos.");
    }

    const response = await axios.post(
      `${apiUrl}/ejecutivo/pause-ejecutivo`,
      {
        idEjecutivo: data.idEjecutivo,
        contrasenia: data.contrasenia.trim(),
        peCausa: data.peCausa,
        duracion: data.duracion, 
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Respuesta de la API:", response.data);

    if (!response.data || response.data.error) {
      throw new Error(response.data.error || "Error desconocido en la API.");
    }

    toast.success("Datos enviados correctamente.");
    return response.data;
  } catch (error) {
    console.error("❌ Error al enviar los datos:", error);
    const errorMessage =
      error.response?.data?.mensaje || error.message || "Error al enviar los datos.";
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

// endpoint de agregar nuevo telefono
export const fetchNewTel = async (newPhoneData) => {
  try {
    const response = await servicio.put(
      `/search-customer/save-new-phone`,
      newPhoneData
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
    console.error("Error en fetchNewTel:", error);
    throw error;
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

// Endpoint estado de cuenta 
export const fetchAccoutStatements = async (idCartera, idCuenta) => {

  try {
    console.log("Iniciando llamada a la API...");
    console.log(
      "URL de la API:",
      `${apiUrl}/ejecutivo/estadoDeCuenta/${idCartera}/${idCuenta}`
    );

    const response = await servicio.get(
      `${apiUrl}/ejecutivo/estadoDeCuenta/${idCartera}/${idCuenta}`
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
    console.error("Error en getErrorStatus:", error);
    throw error;
  }
};

// Endpoint guardar estado de cuentas
export const fetchSaveAccount = async (data) => {
  try {
    console.log("Enviando datos al endpoint..."); // Verifica que esto aparezca en la consola
    const response = await servicio.post(
      `/ejecutivo/SaveEstadoDeCuenta`,
      data
    );

    if (response.status !== 200) {
      throw new Error(
        `Error en la respuesta de la API. Estado: ${response.status}`
      );
    }

    const result = response.data;
    console.log("Cuenta guardada:", result);
    return result;
  } catch (error) {
    console.error("Error en fetchSaveAccount:", error);
    throw error;
  }
};

export async function getTalksData(searchResults) {
  try {
    // Obtener token desde localStorage
    const responseData = JSON.parse(localStorage.getItem("responseData"));
    const token = responseData?.ejecutivo?.token;

    if (!token) {
      throw new Error("Token de autenticación no disponible");
    }

    // Definir idCartera fijo (siempre 1)
    const idCartera = 1;
    

    // Realizar solicitudes en paralelo para cada idCuenta
    const talks = await Promise.all(
      searchResults.map(async (result) => {
        const idCuenta = result.idCuenta?.trim();
        console.log("🔍 Buscando negociaciones para idCuenta:", idCuenta, idCartera);

        try {
          const response = await axios.get(
            `${apiUrl}/ejecutivo/accionesNegociacion?idCartera=${idCartera}&idCuenta=${idCuenta}`,
            {
              headers: {
                Authorization: `Bearer ${token}` 
            },
          }
        );        

          console.log(`✅ Respuesta recibida para idCuenta ${idCuenta}:`, response.data);
          return response.data; // Retorna los datos obtenidos
        } catch (error) {
          console.error(`❌ Error al obtener negociaciones para idCuenta ${idCuenta}:`, error);
          return null; // Evita que falle `Promise.all`
        }
      })
    );

    return talks.filter(Boolean); // 🔹 Filtrar valores nulos
  } catch (error) {
    console.error("❌ Error al obtener los datos de negociaciones:", error);
    throw new Error("Error al cargar los datos de negociaciones.");
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
  }}

// Endpoint de cargos en línea para múltiples cuentas
export async function getOnlinechargeData(searchResults) {
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
    const onlinecharge = await Promise.all(
      searchResults.map(async (result) => {
        const idCuenta = result.idCuenta.trim(); // Limpieza del idCuenta
        console.log("🔍 Buscando cargos en línea para idCuenta:", idCuenta);

        try {
          const response = await axios.get(
            `${apiUrl}/ejecutivo/cargosEnLinea/${idCartera}/${idCuenta}`,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Autenticación con token
              },
            }
          );

          console.log(`✅ Respuesta recibida para idCuenta ${idCuenta}:`, response.data);
          return response.data; // Retornar datos obtenidos
        } catch (error) {
          console.error(`❌ Error al obtener datos de cargos en línea para idCuenta ${idCuenta}:`, error);
          return null; // Retornar null en caso de error para evitar fallas en Promise.all
        }
      })
    );

    // Filtrar valores nulos (en caso de errores individuales)
    return onlinecharge.filter((data) => data !== null);
  } catch (error) {
    console.error("❌ Error al obtener los datos de cargos en línea:", error);
    throw new Error("Error al cargar los datos de cargos en línea.");
  }
}


// Endpoint de seguimientos para múltiples cuentas
export async function getPaymentsData(searchResults) {
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
    const Payments = await Promise.all(
      searchResults.map(async (result) => {
        const idCuenta = result.idCuenta.trim(); // Limpieza del idCuenta
        console.log("🔍 Buscando Pagos para idCuenta:", idCuenta);

        try {
          const response = await axios.get(
            `${apiUrl}/ejecutivo/pagos/${idCartera}/${idCuenta}`,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Autenticación con token
              },
            }
          );

          console.log(`✅ Respuesta recibida para idCuenta ${idCuenta}:`, response.data);
          return response.data; // Retornar datos obtenidos
        } catch (error) {
          console.error(`❌ Error al obtener datos de Pagos para idCuenta ${idCuenta}:`, error);
          return null; // Retornar null en caso de error para evitar fallas en Promise.all
        }
      })
    );

    // Filtrar valores nulos (en caso de errores individuales)
    return Payments.filter((data) => data !== null);
  } catch (error) {
    console.error("❌ Error al obtener los datos de seguimiento:", error);
    throw new Error("Error al cargar los datos de gestión.");
  }
}

// Endpoint para obtener datos de scripts
export async function getScriptsData(searchResults) {
  try {
    const responseData = location.state || JSON.parse(localStorage.getItem("responseData"));
    const token = responseData?.ejecutivo?.token;

    if (!token) {
      throw new Error("Token de autenticación no disponible");
    }

    const idProducto = 1

    const Scripts = await Promise.all(
      searchResults.map(async (result) => {
        const idProducto = result.idProducto.trim();
        console.log("🔍 Buscando scripts:", idProducto);

        try {
          const response = await axios.get(
            `${apiUrl}/ejecutivo/scripts/${idProducto}`,
            {
              headers: {
                Authorization: `Bearer ${token}`, // Autenticación con token
              },
            }
          );

          console.log(`✅ Respuesta recibida para idCuenta ${idProducto}:`, response.data);
          return response.data; // Retornar datos obtenidos
        } catch (error) {
          console.error(`❌ Error al obtener datos de scripts para:  ${idProducto}:`, error);
          return null; // Retornar null en caso de error para evitar fallas en Promise.all
        }
      })
    );
  } catch (error) {
    console.error("❌ Error al obtener los datos de scripts:", error);
    throw new Error("Error al cargar los datos de scripts.");
  }}

// Nueva función para obtener datos de scripts
export async function fetchScripts(idProducto) {
  try {
    console.log("Iniciando llamada a la API para obtener scripts...");
    console.log("URL de la API:", `${apiUrl}/ejecutivo/scripts/${idProducto}`);

    const response = await servicio.get(
      `/ejecutivo/scripts/${idProducto}`
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
    console.error("Error en fetchScripts:", error);
    throw error;
  }
}

