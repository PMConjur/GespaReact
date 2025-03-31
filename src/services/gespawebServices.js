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
    console.log("estos trae telefonos", response.data);
    return data;
  } catch (error) {
    console.error("Error en fetchPhones:", error);
    throw error;
  }
};

//Endpoint Información del Cliente
export const fetchInformation = async (idCuenta) => {
  try {
    //console.log("Iniciando llamada a la API...");

    const response = await servicio.get(
      `/search-customer/products-info?idCuenta=${idCuenta}`
    );

    const message = getErrorStatus(response.status);

    //console.log("Respuesta de la API recibida. Estado:", response.status);

    if (response.status !== 200) {
      toast.error(message, { position: "top-right" });
      throw new Error(message);
    }

    const data = response.data;
    //console.log("Datos obtenidos de la API:", data);

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

    //console.log("Respuesta de la API recibida. Estado:", response.status);

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

export const getFollowUpsData = async (idCartera, idCuenta) => {
  try {
    if (!idCartera || !idCuenta) {
      throw new Error("idCartera o idCuenta no son válidos.");
    }

    const url = `/ejecutivo/seguimientos/${idCartera}/${idCuenta}`;
    console.log("Solicitando datos de seguimiento a:", url); // Depurar URL

    const response = await servicio.get(url);
    const message = getErrorStatus(response.status);

    if (response.status !== 200) {
      toast.error(message, { position: "top-right" });
      throw new Error(message);
    }

    return response.data;
  } catch (error) {
    console.error("Error en getFollowUpsData:", error);
    toast.error(
      "No se pudo obtener los datos de seguimiento. Verifica la conexión o los parámetros."
    );
    throw error;
  }
};

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

    //console.log("Respuesta de la API recibida. Estado:", response.status);

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
export const fetchSaveAccount = async (requestData) => {
  try {
    console.log("Enviando datos al endpoint..."); // Verifica que esto aparezca en la consola
    const response = await servicio.post(
      `/ejecutivo/SaveEstadoDeCuenta`,
      requestData
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

export const getTalksData = async (idCartera, idCuenta) => {
  try {
    if (!idCartera || !idCuenta) {
      throw new Error("idCartera o idCuenta no son válidos.");
    }

    const url = `/ejecutivo/accionesNegociacion?idCartera=${idCartera}&idCuenta=${idCuenta}`;
    console.log("Solicitando datos de Negociaciones a:", url); // Depurar URL"

    const response = await servicio.get(url);
    const message = getErrorStatus(response.status);

    if (response.status !== 200) {
      toast.error(message, { position: "top-right" });
      throw new Error(message);
    }

    return response.data;
  } catch (error) {
    console.error("Error en getTalksData:", error);
    toast.error(
      "No se pudo obtener los datos de Negociaciones. Verifica la conexión o los parámetros."
    );
    throw error;
  }
};

//endpoint acciones-busquedas
export const fetchActionsSearch = async (idCuenta) => {
  try {
    console.log("Iniciando llamada a la API...");
    console.log(
      "URL de la API:",
      `${apiUrl}/ejecutivo/busqueda/1/${idCuenta}/0`
    );

    const response = await servicio.get(
      `${apiUrl}/ejecutivo/busqueda/1/${idCuenta}/0`
    );

    const message = getErrorStatus(response.status);

    console.log("Respuesta de la API recibida. Estado:", response.status);

    if (response.status !== 200) {
      throw new Error(message);
    }

    const data = response.data;
    console.log("Datos obtenidos de la busqueda:", data); // Agrega este console.log para mostrar los datos obtenidos
    return data;
  } catch (error) {
    console.error("Error en fetchActionsSearch:", error);
    throw error;
  }
};

//endpoint guardar busqueda ejecutivo

export const fetchSaveExecutive = async (data) => {
  try {
    console.log("Enviando datos al endpoint...", data); // Verifica que esto aparezca en la consola
    const response = await servicio.post(`/ejecutivo/guardar`, data);

    if (response.status !== 200) {
      throw new Error(
        `Error en la respuesta de la API. Estado: ${response.status}`
      );
    }

    const result = response.data;
    console.log("Busqueda guardada:", result);
    return result;
  } catch (error) {
    console.error("Error en fetchSaveExecutive:", error);
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

export const getOnlinechargeData = async (idCartera, idCuenta) => {
  try {
    if (!idCartera || !idCuenta) {
      throw new Error("idCartera o idCuenta no son válidos.");
    }

    const url = `/ejecutivo/cargosEnLinea/${idCartera}/${idCuenta}`;
    console.log("Solicitando datos de cargos en linea a:", url); // Depurar URL

    const response = await servicio.get(url);
    const message = getErrorStatus(response.status);

    if (response.status !== 200) {
      toast.error(message, { position: "top-right" });
      throw new Error(message);
    }

    return response.data;
  } catch (error) {
    console.error("Error en getOnlineChargeData:", error);
    toast.error(
      "No se pudo obtener los datos de Cargos en Linea. Verifica la conexión o los parámetros."
    );
    throw error;
  }
};

// Endpoint de seguimientos para múltiples cuentas
export const getPaymentsData = async (idCartera, idCuenta) => {
  try {
    if (!idCartera || !idCuenta) {
      throw new Error("idCartera o idCuenta no son válidos.");
    }

    const url = `/ejecutivo/pagos/${idCartera}/${idCuenta}`;
    console.log("Solicitando datos de pagos a:", url); // Depurar URL

    const response = await servicio.get(url);
    const message = getErrorStatus(response.status);

    if (response.status !== 200) {
      toast.error(message, { position: "top-right" });
      throw new Error(message);
    }

    return response.data;
  } catch (error) {
    console.error("Error en getPaymentsData:", error);
    toast.error(
      "No se pudo obtener los datos de Pagos. Verifica la conexión o los parámetros."
    );
    throw error;
  }
};

// Nueva función para obtener datos de scripts
export async function fetchScripts(idProducto) {
  try {
    console.log("Iniciando llamada a la API para obtener scripts...");
    console.log("URL de la API:", `${apiUrl}/ejecutivo/scripts/${idProducto}`);

    const response = await servicio.get(`/ejecutivo/scripts/${idProducto}`);

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

// Endpoint de gestión TE para múltiples cuentas
export const getGestionTeData = async (idCartera, idCuenta) => {
  try {
    if (!idCartera || !idCuenta) {
      throw new Error("idCartera o idCuenta no son válidos.");
    }

    const Top = 2000;
    const url = `/ejecutivo/gestionTe/${idCartera}/${idCuenta}/${Top}`;
    console.log("Solicitando datos de gestion Telefonica a:", url); // Depurar URL

    const response = await servicio.get(url);
    const message = getErrorStatus(response.status);
    console.log("Respuesta de gestiones. Estado:", response.status);
    if (response.status !== 200) {
      toast.error(message, { position: "top-right" });
      throw new Error(message);
    }
    console.log("Datos obtenidos de la API:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error en getGestionTeData:", error);

    throw error;
  }
};

// Endpoint Recordatorios

export const fetchNotes = async (numEmpleado, token) => {
  try {
    if (!token) {
      throw new Error("Token is missing or invalid");
    }

    const response = await servicio.get(
      `http://192.168.7.33/api/ejecutivo/recordatorios/${numEmpleado}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    // formato de los datos
    const data = response.data;
    const formattedNotes = data.map((item) => ({
      id: item.idCuenta,
      title: item.Nombre,
      content: `Saldo: ${item.Saldo}\nTeléfono: ${item.NúmeroTelefónico}\nSituación: ${item.idSituación}\nFecha Seguimiento: ${item.FechaSeguimiento}\nHora Seguimiento: ${item.SegundoSeguimiento}`,
      date: item.FechaHoraSeguimiento
    }));

    return formattedNotes;
  } catch (error) {
    console.error("Error fetching notes:", error);
    throw error;
  }
};

// endpoint ejecutivo quejas post
export const fetchComplaints = async (data) => {
  try {
    console.log("Enviando datos al endpoint...", data); // Verifica que esto aparezca en la consola
    const response = await servicio.post(`/ejecutivo/quejas`, data);

    if (response.status !== 200) {
      throw new Error(
        `Error en la respuesta de la API. Estado: ${response.status}`
      );
    }

    const result = response.data;
    console.log("Queja guardada:", result);
    return result;
  } catch (error) {
    console.error("Error en fetchComplaints:", error);
    throw error;
  }
};

// tabla vista quejas
export const fetchViewComplaints = async ({ idCartera, idCuenta }) => {
  try {
    console.log("Enviando solicitud a /ejecutivo/viewQuejas con:", {
      idCartera,
      idCuenta
    });

    const response = await servicio.get(`/ejecutivo/viewQuejas`, {
      params: {
        idCartera,
        idCuenta
      }
    });

    console.log("Respuesta recibida:", response);

    if (response.status !== 200) {
      throw new Error(
        `Error en la respuesta de la API. Estado: ${response.status}`
      );
    }

    const result = response.data;
    console.log("Validación recibida:", result);
    return result;
  } catch (error) {
    console.error("Error en fetchViewComplaints:", error);
    throw error;
  }
};

// endpoint origen quejas
export const fetchOriginComplaints = async () => {
  try {
    console.log("Llamando al endpoint /ejecutivo/ddOrigenQuejas"); // Confirmar que se llama al endpoint
    const response = await servicio.get(`/ejecutivo/ddOrigenQuejas`);

    console.log("Respuesta recibida:", response);

    if (response.status !== 200) {
      throw new Error(
        `Error en la respuesta de la API. Estado: ${response.status}`
      );
    }

    const result = response.data;
    console.log("Validación recibida:", result);
    return result;
  } catch (error) {
    console.error("Error en fetchOriginComplaints:", error);
    throw error;
  }
};

// endpoint tipo de quejas
export const fetchDdComplaints = async () => {
  try {
    console.log("Llamando al endpoint /ejecutivo/ddQuejas"); // Confirmar que se llama al endpoint
    const response = await servicio.get(`/ejecutivo/ddQuejas`);

    console.log("Respuesta recibida:", response);

    if (response.status !== 200) {
      throw new Error(
        `Error en la respuesta de la API. Estado: ${response.status}`
      );
    }

    const result = response.data;
    console.log("Validación recibida:", result);
    return result;
  } catch (error) {
    console.error("Error en fetchOriginComplaints:", error);
    throw error;
  }
};

// Endpoint de seguimientos para múltiples cuentas
export const getAditionalsData = async (idCartera, idCuenta) => {
  try {
    if (!idCartera || !idCuenta) {
      throw new Error("idCartera o idCuenta no son válidos.");
    }

    const url = `/ejecutivo/Adicionales${idCartera}/${idCuenta}`;
    console.log("Solicitando datos de Adicionales a:", url); // Depurar URL

    const response = await servicio.get(url);
    const message = getErrorStatus(response.status);

    if (response.status !== 200) {
      toast.error(message, { position: "top-right" });
      throw new Error(message);
    }

    return response.data;
  } catch (error) {
    console.error("Error en getFAditionalsData:", error);
    toast.error(
      "No se pudo obtener los datos de Adicionales. Verifica la conexión o los parámetros."
    );
    throw error;
  }
};

// gespawebServices.js (actualización de fetchProcessesWLP)
export const fetchProcessesWLP = async (proceso, idCuenta) => {
  try {
    if (!proceso || !idCuenta) {
      console.error('Parámetros inválidos:', { proceso, idCuenta });
      throw new Error("Se requieren ambos parámetros: proceso e idCuenta");
    }

    const url = `/ejecutivo/ProcesosWLP`;
    const params = {
      proceso,
      idCuenta: idCuenta.toString().trim()
    };

    console.log("Realizando solicitud a:", url, "con parámetros:", params);

    const response = await servicio.get(url, { params });
    console.log("Respuesta recibida:", response);

    if (!response) {
      throw new Error("No se recibió respuesta del servidor");
    }

    if (response.status !== 200) {
      const message = getErrorStatus(response.status) || `Error ${response.status}`;
      throw new Error(message);
    }

    if (!response.data) {
      console.warn("La respuesta no contiene data");
      return [];
    }

    // Asegurarnos de que siempre devolvemos un array
    return Array.isArray(response.data) ? response.data : [response.data];
  } catch (error) {
    console.error("Error en fetchProcessesWLP:", {
      error: error.message,
      stack: error.stack
    });
    
    toast.error(`Error al obtener procesos WLP: ${error.message}`, { 
      position: "top-right",
      duration: 5000
    });
    
    throw error;
  }
};

// endpoint calculadora primera parte
export const fetchCalFirtsPart = async (Cartera, NoCuenta, idHerr) => {
  try {
    console.log("Llamando al endpoint /ejecutivo/Calculadora-1erParte");
    const response = await servicio.get(`/ejecutivo/Calculadora-1erParte`, {
      params: { Cartera, NoCuenta, idHerr }
    });

    console.log("Respuesta recibida:", response);

    if (response.status !== 200) {
      throw new Error(
        `Error en la respuesta de la API. Estado: ${response.status}`
      );
    }

    const result = response.data;
    console.log("Validación recibida:", result);
    return result;
  } catch (error) {
    console.error("Error en fetchCalFirtsPart:", error);
    throw error;
  }
};

//EndPoint - Relaciones
export async function Relations() {
  try {
    const response = await servicio.get(`/ejecutivo/relaciones`);
    const data = response.data;

    return data;
  } catch (error) {
    if (error.response) {
      const errorMessage =
        error.response.data?.mensaje || "Error al recibir las relaciones";
      throw new Error(errorMessage);
    } else {
      throw new Error("Error en la respuesta del endpoint de relaciones.");
    }
  }
}

// endpoint calculadora primera parte
export const fetchCalSecondPart = async (
  idCartera,
  NoCuenta,
  idHerramienta,
  MontoRequerido,
  Descuento,
  iMeses,
  dtpFecha,
  periodos
) => {
  try {
    console.log("Llamando al endpoint /ejecutivo/Calculadora-2daParte");
    console.log("Datos enviados:", {
      idCartera,
      NoCuenta,
      idHerramienta,
      MontoRequerido,
      Descuento,
      iMeses,
      dtpFecha,
      periodos
    });

    const response = await servicio.get(`/ejecutivo/Calculadora-2daParte`, {
      params: {
        idHerramienta,
        NoCuenta,
        idCartera,
        MontoRequerido,
        Descuento,
        iMeses,
        dtpFecha,
        periodos
      }
    });

    console.log("Respuesta recibida:", response);

    if (response.status !== 200) {
      throw new Error(
        `Error en la respuesta de la API. Estado: ${response.status}`
      );
    }

    return response.data;
  } catch (error) {
    console.error("Error en fetchCalSecondPart:", error);
    console.error("Detalles del error:", error.response?.data || error.message);
    throw error;
  }
};

export const closeSession = async (idEjecutivo, idLogIngreso) => {
  try {
    const url = `/login/cierre-sesion?idEjecutivo=${idEjecutivo}&idLogIngreso=${idLogIngreso}`;

    const response = await servicio.get(url);

    if (response.status !== 200) {
      throw new Error(
        `Error en la respuesta del backend. Estado: ${response.status}`
      );
    }

    const data = response.data;

    return data;
  } catch (error) {
    console.error("Error en closeSession:", error.response || error.message);
    const errorMessage =
      error.response?.data?.mensaje ||
      error.message ||
      "Error desconocido al cerrar sesión.";
    throw new Error(errorMessage);
  }
};

export const fetchCalSecondPartModify = async (
  idCartera,
  NoCuenta,
  idHerramienta,
  MontoRequerido,
  Descuento,
  iMeses,
  dtpFecha,
  periodos,
  modificar,
  montoMod,
  fechaPagoMod,
  agregarPagos,
  filaMod
) => {
  try {
    console.log("Llamando al endpoint /ejecutivo/Calculadora-2daParte");
    console.log("Datos enviados:", {
      idCartera,
      NoCuenta,
      idHerramienta,
      MontoRequerido,
      Descuento,
      iMeses,
      dtpFecha,
      periodos,
      modificar,
      montoMod,
      fechaPagoMod,
      agregarPagos,
      filaMod
    });

    const response = await servicio.get(`/ejecutivo/Calculadora-2daParte`, {
      params: {
        idHerramienta,
        NoCuenta,
        idCartera,
        MontoRequerido,
        Descuento,
        iMeses,
        dtpFecha,
        periodos,
        modificar,
        montoMod,
        fechaPagoMod,
        agregarPagos,
        filaMod
      }
    });

    console.log("Respuesta recibida:", response);

    if (response.status !== 200) {
      throw new Error(
        `Error en la respuesta de la API. Estado: ${response.status}`
      );
    }

    return response.data;
  } catch (error) {
    console.error("Error en fetchCalSecondPartModify:", error);
    console.error("Detalles del error:", error.response?.data || error.message);
    throw error;
  }
};

export async function userTimes(numEmpleado) {
  try {
    const response = await servicio.get(`/ejecutivo/tiempos-ejecutivo`, {
      params: { numEmpleado }
    });

    if (!response.data) {
      throw new Error("No se recibieron datos del servidor");
    }

    return response.data;
  } catch (error) {
    console.error("Error en userTimes:", error);
    if (error.response) {
      const errorMessage =
        error.response.data?.mensaje || "Error al obtener tiempos";
      throw new Error(errorMessage);
    }
    throw new Error("Error de conexión al obtener tiempos");
  }
}

export async function userTimesPromedio(numEmpleado) {
  try {
    const response = await servicio.get(`/ejecutivo/promedios-ejecutivo`, {
      params: { numEmpleado }
    });

    if (!response.data) {
      throw new Error("No se recibieron datos del servidor");
    }

    return response.data;
  } catch (error) {
    console.error("Error en userTimesPromedio:", error);
    if (error.response) {
      const errorMessage =
        error.response.data?.mensaje || "Error al obtener promedio";
      throw new Error(errorMessage);
    }
    throw new Error("Error de conexión al obtener promedio");
  }
}

export const userTimesUpdate = async (data) => {
  try {
    const response = await servicio.post(`/ejecutivo/pause-ejecutivo`, data);

    if (response.status !== 200) {
      throw new Error(`Error en la respuesta. Estado: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error("Error en userTimesUpdate:", error);
    if (error.response) {
      const errorMessage =
        error.response.data?.mensaje || "Error al actualizar tiempos";
      throw new Error(errorMessage);
    }
    throw error;
  }
};

//End point Fernando

//EndPoint - ActivitiesDay
export const fetchGestionesDelDia = async (idEjecutivo, setErrorMessage) => {
  try {
    const response = await servicio.get(
      `/ejecutivo/gestionesDelDia/${idEjecutivo}`
    );
    return response.data;
  } catch (error) {
    let message = "Error desconocido.";
    if (error.response) {
      const status = error.response.status;
      message =
        status === 404
          ? "No se encontraron resultados para la cuenta especificada."
          : `Error ${status}: ${error.response.data.message}`;
    } else if (error.request) {
      message = "Error: No se recibió respuesta del servidor.";
    } else {
      message = `Error: Ocurrió un problema al realizar la solicitud. Detalles: ${error.message}`;
    }

    if (setErrorMessage) {
      toast.dismiss();
      toast.error(message);
      setErrorMessage(message);
    }
    throw error;
  }
};
//EndPoint - ActivitiesDay

//EndPoint - Domicilios

//EndPoint - Domicilios

//EndPoint -Nergocicaciones del mes
export const fetchNegotiationsData = async (idEjecutivo) => {
  try {
    const response = await servicio.get(
      `/ejecutivo/NegociacionesDelMesEje/${idEjecutivo}`
    );
    return response.data; // Devuelve los datos obtenidos
  } catch (error) {
    console.error("Error fetching negotiations data:", error);

    let message = "Error desconocido.";
    if (error.response) {
      const status = error.response.status;
      message =
        status === 404
          ? "No se encontraron resultados para la cuenta especificada."
          : `Error ${status}: ${error.response.data.message}`;
    } else if (error.request) {
      message = "Error: No se recibió respuesta del servidor.";
    } else {
      message = `Error: Ocurrió un problema al realizar la solicitud. Detalles: ${error.message}`;
    }
    throw new Error(message); // Lanza el error para manejarlo en el componente
  }
};

//EndPoint -Nergocicaciones del mes\
//EndPoint MultiDeptor
export const fetchMultideudores = async (idCuenta) => {
  try {
    const response = await servicio.get(
      `/ejecutivo/multideudores/1/${idCuenta}`
    );
    return response.data;
  } catch (error) {
    let message = "Error desconocido.";
    if (error.response) {
      const status = error.response.status;
      message =
        status === 404
          ? "Error 404: No se encontró la cuenta especificada. Por favor, verifique el ID de cuenta e intente nuevamente."
          : `Error ${status}: ${
              error.response.data.message || "Ocurrió un error en el servidor."
            }`;
    } else if (error.request) {
      message = "Error: No se recibió respuesta del servidor.";
    } else {
      message = `Error: Ocurrió un problema al realizar la solicitud. Detalles: ${error.message}`;
    }
    throw new Error(message);
  }
};

//EndPoint MultiDeptors

//End point Fernando

export const createFollows = async (data) => {
  try {
    const response = await servicio.post(`/ejecutivo/crearSeguimiento`, data);

    if (response.status !== 200) {
      throw new Error(`Error en la respuesta. Estado: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error("Error en crearSeguimiento:", error);
    if (error.response) {
      const errorMessage =
        error.response.data?.mensaje || "Error al crear Seguimiento";
      throw new Error(errorMessage);
    }
    throw error;
  }
};

//EndPoint - Validadores
export const fetchValidators = async (idProducto, idEjecutivo, Contraseña) => {
  try {
    console.log("Llamando al endpoint /ejecutivo/validador");
    const response = await servicio.get(`/ejecutivo/validador`, {
      params: { idProducto, idEjecutivo, Contraseña }
    });

    console.log("Respuesta recibida:", response);

    if (response.status !== 200) {
      throw new Error(
        `Error en la respuesta de la API. Estado: ${response.status}`
      );
    }

    const result = response.data;
    console.log("Validación recibida Validators:", result);
    return result;
  } catch (error) {
    console.error("Error en fetchValidators:", error);
    throw error;
  }
};

//EndPoint - lista Validadores
export const fetchListValidators = async (idProducto) => {
  try {
    console.log("Llamando al endpoint /ejecutivo/validadores");
    const response = await servicio.get(`/ejecutivo/validadores`, {
      params: { idProducto }
    });

    console.log("Respuesta recibida:", response);

    if (response.status !== 200) {
      throw new Error(
        `Error en la respuesta de la API. Estado: ${response.status}`
      );
    }

    const result = response.data;
    console.log("Validación recibida Validators:", result);
    return result;
  } catch (error) {
    console.error("Error en fetchValidators:", error);
    throw error;
  }
};

// endpoint guardar-Elimina-Plazos
export const fetchSaveDeleteDeadlines = async (requestData) => {
  try {
    console.log("Enviando datos al endpoint:", requestData);
    const response = await servicio.post(
      `/ejecutivo/guarda-Elimina-Plazos`,
      requestData
    );

    if (response.status !== 200) {
      throw new Error(
        `Error en la respuesta de la API. Estado: ${response.status}`
      );
    }

    const result = response.data;
    console.log("Respuesta del endpoint:", result);
    return result;
  } catch (error) {
    console.error("Error en fetchSaveDeleteDeadlines:", error);
    throw error;
  }
};

export const createOnlineCharge = async (data) => {
  try {
    const response = await servicio.post(`/ejecutivo/SaveCargoEnlinea`, data);

    if (response.status !== 200) {
      throw new Error(`Error en la respuesta. Estado: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error("Error en createOnlineCharge:", error);
    if (error.response) {
      const errorMessage =
        error.response.data?.mensaje || "Error al crear Cargos en Linea";
      throw new Error(errorMessage);
    }
    throw error;
  }
};
// endpoint guardar-Gestion-Telefonica
export const saveManagment = async (dataManagment) => {
  try {
    const response = await servicio.post(
      `/ejecutivo/GuardarGestionTe`,
      dataManagment
    );

    if (response.status !== 200) {
      throw new Error(
        `Error en la respuesta de la API. Estado: ${response.status}`
      );
    }

    const result = response.data;
    console.log("Gestion Guardada correctamente:", result);
    return result;
  } catch (error) {
    console.error("Error al guardar la gestión", error);
    throw error;
  }
};
