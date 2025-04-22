import servicio from "./axiosServices";
import { toast } from "sonner";
import axios from "axios";

const responseData =
  location.state || JSON.parse(localStorage.getItem("responseData"));
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

// endpoint busqueda manual ejecutivo
export async function searchCustomers(filter, searchValue) {
  try {
    const response = await servicio.get(
      "/search-customer/busqueda-cuenta",{
        params: { 
          filtro: filter, 
          ValorBusqueda: searchValue 
        },
  });
    
    return response.data.listaResultados || [];
    
  } catch (error) {
    console.error("Error fetching customer suggestions:", error);
    throw error; // Puedes personalizar el error que quieres lanzar
  }
}

// Endpoint para búsqueda automática de ejecutivo
export async function automaticSearchEjecutivo(idEjecutivo) {
  try {
    const response = await servicio.get(
      `/search-customer/automatico-ejecutivo?numEmpleado=${idEjecutivo}`
    );
    return {
      idCuenta: response.data.idCuenta?.trim(),
      numeroTelefonico: response.data.numeroTelefonico
    };
  } catch (error) {
    console.error("Error en búsqueda automática de ejecutivo:", error);
    throw new Error(error.response?.data?.message || "Error al buscar ejecutivo automáticamente");
  }
}

// Endpoint para búsqueda por cuenta 
export async function searchByAccount(idCuenta) {
  try {
    const response = await servicio.get(
      "/search-customer/busqueda-cuenta",
      {
        params: { 
          filtro: "Cuenta", 
          ValorBusqueda: idCuenta 
        }
      }
    );
    return response.data.listaResultados || [];
  } catch (error) {
    console.error("Error en búsqueda por cuenta:", error);
    throw new Error(error.response?.data?.message || "Error al buscar por cuenta");
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

    // Seleccionar el endpoint según el valor de "actual"
    const endpoint =
      actual === 1
        ? `/ejecutivo/get-recuperacion-Actual?idEjecutivo=${idEjecutivo}`
        : `/ejecutivo/get-recuperacion-Anterior?idEjecutivo=${idEjecutivo}`;

    const response = await servicio.get(endpoint);
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

    //console.log("Respuesta de la API recibida. Estado:", response.status);

    if (response.status !== 200) {
      toast.error(message, { position: "top-right" });
      throw new Error(message);
    }

    const data = response.data;
    //console.log("estos trae telefonos", response.data);
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
      `/search-customer/products-info-full?idCuenta=${idCuenta}`
    );

    const message = getErrorStatus(response.status);

    //console.log("Respuesta de la API recibida. Estado:", response.status);

    if (response.status !== 200) {
      toast.error(message, { position: "top-right" });
      throw new Error(message);
    }

    const data = response.data;
    console.log("Datos obtenidos de la fetch informacion:", data);

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
    //console.log("Iniciando llamada a la API...");
    // console.log(
    //   "URL de la API:",
    //   `${apiUrl}/ejecutivo/accionamientos/${idCartera}/${idCuenta}`
    // );

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

    //console.log("Datos obtenidos de la API:", data); // Agrega este console.log para mostrar los datos obtenidos

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
    

    const response = await servicio.get(url);
    const message = getErrorStatus(response.status);

    if (response.status !== 200) {
      toast.error(message, { position: "top-right" });
      throw new Error(message);
    }

    return response.data;
  } catch (error) {
    
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
    const response = await servicio.post(`/ejecutivo/GuardarBusqueda`, data);

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
export const getErrorStatus = (status) => {
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
      return "Datos incorrectos (500):o falla en el servidor.";
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
  

    const response = await servicio.get(url);


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
export async function fetchScripts(Ejecutivo, idProducto, idCartera, cuenta) {
  try {
    console.log("Iniciando la llamada a ña API para obtener scripts...");

    console.log(
      "URL de la API scripts-full :",
      `${apiUrl}/ejecutivo/scripts-full/${Ejecutivo}/1/1/${cuenta}`
    );

    const response = await servicio.get(
      `/ejecutivo/scripts-full/${Ejecutivo}/1/1/${cuenta}`,
      {}
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

// Endpoint de gestión TE para múltiples cuentas
export const getGestionTeData = async (idCartera, idCuenta) => {
  try {
    if (!idCartera || !idCuenta) {
      throw new Error("idCartera o idCuenta no son válidos.");
    }

    const Top = 10000;
    const url = `/ejecutivo/gestionTe/${idCartera}/${idCuenta}/${Top}`;
    //console.log("Solicitando datos de gestion Telefonica a:", url); // Depurar URL

    const response = await servicio.get(url);
    const message = getErrorStatus(response.status);
    //console.log("Respuesta de gestiones. Estado:", response.status);
    if (response.status !== 200) {
      toast.error(message, { position: "top-right" });
      throw new Error(message);
    }
    //console.log("Datos obtenidos de la API:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error en getGestionTeData:", error);

    throw error;
  }
};

// Endpoint Recordatorios

export const fetchNotes = async (numEmpleado) => {
  try {
    const response = await servicio.get(
      `/ejecutivo/recordatorios/${numEmpleado}`,
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
    //console.log("Validación recibida:", result);
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
    //console.log("Llamando al endpoint /ejecutivo/ddQuejas"); // Confirmar que se llama al endpoint
    const response = await servicio.get(`/ejecutivo/ddQuejas`);

    // console.log("Respuesta recibida:", response);

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
    //console.log("Solicitando datos de Adicionales a:", url); // Depurar URL

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
      //console.error("Parámetros inválidos:", { proceso, idCuenta });
      throw new Error("Se requieren ambos parámetros: proceso e idCuenta");
    }

    const url = `/ejecutivo/ProcesosWLP`;
    const params = {
      proceso,
      idCuenta: idCuenta.toString().trim()
    };

    //console.log("Realizando solicitud a:", url, "con parámetros:", params);

    const response = await servicio.get(url, { params });
    //console.log("Respuesta recibida:", response);

    if (!response) {
      throw new Error("No se recibió respuesta del servidor");
    }

    if (response.status !== 200) {
      const message =
        getErrorStatus(response.status) || `Error ${response.status}`;
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

      if (response.data?.message === "Contraseña incorrecta") {
          throw new Error("Contraseña incorrecta");
      }

      return response.data;
  } catch (error) {
      console.error("Error en userTimesUpdate:", error);
      if (error.response) {
          const serverMessage = error.response.data?.mensaje || error.response.data?.message;
          throw new Error(serverMessage || "Error al actualizar tiempos");
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
// Método para validar el huso horario
export const validateTimeZone = async (
  idCuenta,
  numeroTelefonico,
  idEjecutivo
) => {
  try {
    const cleanIdCuenta = String(idCuenta).trim();
    const cleanNumeroTelefonico = String(numeroTelefonico).trim();
    const cleanIdEjecutivo = String(idEjecutivo).trim();

    const token = responseData?.ejecutivo?.token;

    // Verificar si el token está disponible
    if (!token) {
      throw new Error(
        "Error: No se encontró un token válido para la autenticación."
      );
    }

    // Construcción de la URL con los parámetros de consulta
    const baseURL = "http://192.168.7.33/api"; // Asegúrate de que esta URL sea correcta
    const url = `${baseURL}/ejecutivo/UsosHorarios/1/${cleanIdCuenta}/${cleanNumeroTelefonico}/${cleanIdEjecutivo}`;
    console.log("URL solicitada:", url); // Imprimir la URL completa

    // Realizar la solicitud al servidor utilizando el token en la cabecera
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });

    // Verificar la respuesta
    if (response.headers["content-type"]?.includes("application/json")) {
      const data = response.data;
      console.log("Respuesta completa de la API:", data);

      if (data[0]?.Mensaje === "La marcación es válida") {
        toast.info(`Llame a : ${numeroTelefonico}`, {
          position: "top-center", // Cambia la posición al centro superior

          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          style: {
            fontSize: "1.2rem",
            fontWeight: "bold"
          }
        });
        return { isValid: true, mensaje: data[0].Mensaje };
      } else {
        console.error("Respuesta inesperada: La marcación no es válida.");
        return {
          isValid: false,
          mensaje: data[0]?.Mensaje || "La marcación no es válida."
        };
      }
    } else {
      console.error(
        "Respuesta inesperada del servidor (no es JSON):",
        response.data
      );
      return {
        isValid: false,
        mensaje: "El servidor devolvió un contenido no válido."
      };
    }
  } catch (error) {
    console.error("Error al realizar la solicitud:", error);
    if (error.response) {
      return {
        isValid: false,
        mensaje: `Error ${error.response.status}: ${
          error.response.data?.message || "Error desconocido en el servidor"
        }`
      };
    } else if (error.request) {
      return {
        isValid: false,
        mensaje: "No se recibió respuesta del servidor."
      };
    } else {
      return { isValid: false, mensaje: `Error: ${error.message}` };
    }
  }
};

// METODO DE HORARIO
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
        `Error en la respuesta de la API. Estado: ${response.getErrorStatus}`
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


//endpoint buscar-tipo de queja y origen de queja
export const fetchSearchAddDate = async () => {
  try {
    console.log("Llamando al endpoint /ejecutivo/ddDatos");
    const response = await servicio.get(`/ejecutivo/ddDatos`);

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

//endpoint carga correos
export const fetchEmailsCharging = async (idCartera, idCuenta) => {
  try {
    console.log(
      "Llamando al endpoint /ejecutivo/CorreosCarga/${idCartera}/${idCuenta}"
    );
    const response = await servicio.get(
      `/ejecutivo/CorreosCarga/${idCartera}/${idCuenta}`
    );

    console.log("Respuesta recibida:", response);

    if (response.status !== 200) {
      throw new Error(
        `Error en la respuesta de la API. Estado: ${response.status}`
      );
    }

    const result = response.data;
    console.log("respuesta de endpoint emails:", result);
    return result;
  } catch (error) {
    console.error("Error en fetchEmails:", error);
    throw error;
  }
};

// endpoint Guarda Negociacion Plazos
export const fetchSaveNegotiationDeadlines = async (requestData) => {
  try {
    console.log(
      "Enviando datos al endpoint GuardaNegociacionPlazos:",
      requestData
    );

    // Validar datos antes de enviarlos
    if (
      !requestData.idCuenta ||
      !requestData.idHerramienta ||
      !requestData.montoNegociado
    ) {
      throw new Error("Faltan datos requeridos en la solicitud.");
    }

    const response = await servicio.post(
      `/ejecutivo/GuardaNegociacionPlazos`,
      requestData, // Enviar datos directamente sin serializar
      {
        headers: {
          "Content-Type": "application/json" // Asegurar el tipo de contenido
        }
      }
    );

    if (response.status !== 200) {
      throw new Error(
        `Error en la respuesta de la API. Estado: ${response.status}`
      );
    }

    const result = response.data;
    console.log("Respuesta del endpoint GuardaNegociacionPlazos:", result);
    return result;
  } catch (error) {
    console.error("Error en fetchSaveNegotiationDeadlines:", error);

    // Agregar más detalles sobre el error
    if (error.response) {
      console.error("Detalles del error de respuesta:", error.response.data);
    } else if (error.request) {
      console.error("No se recibió respuesta del servidor:", error.request);
    } else {
      console.error("Error al configurar la solicitud:", error.message);
    }

    throw error;
  }
};

// endpoint incrementa negociacion 
export const fetchIncreasesNegotiation = async (increaseRequestData) => {
  try {
    console.log("Enviando datos al endpoint IncrementaNegociacion:", increaseRequestData);
    const response = await servicio.post(
      `/ejecutivo/IncrementaNegociacion`,
      increaseRequestData // Envía los datos al endpoint
    );

    if (response.status !== 200) {
      throw new Error(
        `Error en la respuesta de la API. Estado: ${response.status}`
      );
    }

    const result = response.data;
    console.log("Respuesta del endpoint IncrementaNegociacion:", result);
    return result;
  } catch (error) {
    console.error("Error en fetchIncreasesNegotiation:", error);
    throw error;
  }
};

// endpoint guarda ofrecimiento
export const fetchSaveOffering = async (requestData) => {
  try {
    console.log("Enviando datos al endpoint Guarda ofrecimiento:", requestData);
    const response = await servicio.post(
      `/ejecutivo/save-ofrecimiento`,
      requestData
    );

    if (response.status !== 200) {
      throw new Error(
        `Error en la respuesta de la API. Estado: ${response.status}`
      );
    }

    const result = response.data;
    console.log("Respuesta del endpoint guardar ofrecimiento:", result);
    return result;
  } catch (error) {
    console.error("Error en fetchSaveOffering:", error);
    throw error;
  }
};


export const createPayments = async (data) => {
  try {
    const response = await servicio.post(`/ejecutivo/GuardarPagos`, data);

    return response.data;
  } catch (error) {
    console.error("Error en createPayments:", error);
    if (error.response) {
      const errorMessage =
        error.response.data?.mensaje || "Error al crear Pago";
      throw new Error(errorMessage);
    }
    throw error;
  }
};


export const getRelaciones = async () => {
  try {
  
    const url = `/ejecutivo/relaciones`;
    console.log("Solicitando datos de Relaciones a:", url); // Depurar URL"

    const response = await servicio.get(url);
    const message = getErrorStatus(response.status);

    if (response.status !== 200) {
      toast.error(message, { position: "top-right" });
      throw new Error(message);
    }

    return response.data;
  } catch (error) {
    console.error("Error en getRelaciones:", error);
    toast.error(
      "No se pudo obtener los datos de Relaciones. Verifica la conexión o los parámetros."
    );
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

//endpoint domicilios
export const fetchAddress = async (idCartera, idCuenta) => {
  try {
    console.log("Llamando al endpoint /api/search-customer/domicilios-visitas");
    console.log("Parámetros enviados: idCartera:", idCartera, "idCuenta:", idCuenta);

    const response = await servicio.get(`/search-customer/domicilios-visitas`, {
      params: { idCartera, idCuenta } // Usa parámetros de consulta
    });

    console.log("Respuesta recibida:", response);

    if (response.status !== 200) {
      throw new Error(
        `Error en la respuesta de la API. Domicilios: ${response.status}`
      );
    }

    const result = response.data;
    console.log("Validación recibida Domicilios:", result);
    return result;
  } catch (error) {
    console.error("Error en Domicilios:", error);
    throw error;
  }
};



export const getDeadlineData = async (idCartera, idCuenta) => {
  try {
    if (!idCartera || !idCuenta) {
      throw new Error("idCartera o idCuenta no son válidos.");
    }

    const url = `/ejecutivo/accionesPlazos`;
    console.log("Solicitando datos de plazos a:", url); // Depurar URL

    const response = await servicio.get(url, {
      params: { idCartera, idCuenta }
    });
    const message = getErrorStatus(response.status)


    if (response.status !== 200) {
      toast.error(message, { position: "top-right" });
      throw new Error(message);
    }

    return response.data;
  } catch (error) {
    
    toast.error(
      "No se pudo obtener los datos de Plazos. Verifica la conexión o los parámetros."
    );
    throw error;
  }
};
// endpoint recordatorios 
const numEmpleado = responseData?.ejecutivo?.infoEjecutivo?.idEjecutivo;
export const saveNotesToAPI = async (notes) => {
  try {
    if (!notes || notes.length === 0) return;
    
    const response = await servicio.get(
      `/ejecutivo/recordatorios/${numEmpleado}`,
      notes,
      {
        headers: {
          "Content-Type": "application/json",
        }
      }
    );
    
    return response.data;
  } catch (error) {
    toast.error("Error saving notes:", error);
    throw error; // Re-lanzamos el error para manejarlo en el componente
  }
};


