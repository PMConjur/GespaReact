import { useState, useEffect, useContext, useRef } from "react";
import {
  Modal,
  Button,
  Form,
  Table,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import { toast } from "sonner";
import servicio from "../../../services/axiosServices";
import { AppContext } from "../../../pages/Managment"; // Asegúrate de que la ruta sea correcta
import { formatearFecha, reemplazarValores } from "../../ValoresCatalogos.js";
import TablePostal from "./TablePostal"; // Importar el nuevo componente
import FormularioDom from "./FormularioDom"; // Importar el nuevo componente

const Addresses = ({ show, handleClose }) => {
  const { searchResults } = useContext(AppContext); // Obtén el contexto
  const [formData, setFormData] = useState({
    calle: "",
    numExt: "",
    numInt: "",
    colonia: "",
    municipio: "",
    estado: "",
    origen: "",
    fecha_Insert: "",
    codigoPostal: "",
    idCódigoPostal: "",
    informacion: "",
  });
  const [selectedGestion, setSelectedGestion] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [recordCount, setRecordCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [tableDomicilioData, setTableDomicilioData] = useState([]);
  const [isPostalTableVisible, setIsPostalTableVisible] = useState(false);
  const [postalTableData, setPostalTableData] = useState([]); // Tabla de postales basada en código postal
  const [selectedDomicilio, setSelectedDomicilio] = useState(null);
  const [clase, setClase] = useState(""); // Agregar esta línea
  const [isEstadoVisible, setIsEstadoVisible] = useState(false); // Agregar esta línea
  const [tableDomData, setTableDomData] = useState([]); // Asegúrate de que esta línea esté presente
  const [isFormDisabled, setIsFormDisabled] = useState(false); // Nuevo estado para controlar la habilitación del formulario
  const [isDomicilioTableVisible, setIsDomicilioTableVisible] = useState(true); // Nuevo estado para controlar la visibilidad de la tabla de domicilios
  const [idInformacion, setIdInformacion] = useState(""); // Nuevo estado para el dropdown
  const [isIdentifyButtonDisabled, setIsIdentifyButtonDisabled] = useState(true); // Nuevo estado para controlar el botón "Identificar"
  const [existingAddresses, setExistingAddresses] = useState([]); // Nuevo estado para almacenar direcciones existentes
  const [currentIndex, setCurrentIndex] = useState(0); // Índice actual del elemento seleccionado
  const [postalCodesByIdData, setPostalCodesByIdData] = useState([]); // Tabla basada en idCódigoPostal
  const [isCommentHovered, setIsCommentHovered] = useState(false); // Estado para hover del comentario
  const [isPostalTableFocused, setIsPostalTableFocused] = useState(false); // Nuevo estado para el focus visual
  const [focusAnimCodigoPostal, setFocusAnimCodigoPostal] = useState(true);
  const toastIdsRef = useRef([]);
  const toast428ShownRef = useRef(false); // Nuevo useRef para el toast 428
  const postalTableFirstFocusShownRef = useRef(false); // Ref para controlar si ya se mostró el focus

  // Función para mostrar toast y guardar su id
  const showToast = (fn, ...args) => {
    const id = fn(...args);
    toastIdsRef.current.push(id);
    return id;
  };

  // Limpia todos los toasts activos
  const clearAllToasts = () => {
    toastIdsRef.current.forEach(id => toast.dismiss(id));
    toastIdsRef.current = [];
    toast428ShownRef.current = false; // Reinicia el flag al limpiar
  };

  // Función para limpiar todos los estados relevantes
  const resetAllStates = () => {
    setFormData({
      calle: "",
      numExt: "",
      numInt: "",
      colonia: "",
      municipio: "",
      estado: "",
      origen: "",
      fecha_Insert: "",
      codigoPostal: "",
      idCódigoPostal: "",
      informacion: "",
    });
    setSelectedGestion(null);
    setTableData([]);
    setIsLoading(false);
    setIsNew(false);
    setRecordCount(0);
    setErrorMessage("");
    setTableDomicilioData([]);
    setIsPostalTableVisible(false);
    setPostalTableData([]);
    setSelectedDomicilio(null);
    setClase("");
    setIsEstadoVisible(false);
    setTableDomData([]);
    setIsFormDisabled(false);
    setIsDomicilioTableVisible(true);
    setIdInformacion("");
    setIsIdentifyButtonDisabled(true);
    setExistingAddresses([]);
    setCurrentIndex(0);
    setPostalCodesByIdData([]);
    setIsCommentHovered(false);
    setIsPostalTableFocused(false);
    postalTableFirstFocusShownRef.current = false;
    // Limpiar toasts también
    clearAllToasts();
  };

  // Limpiar estados cada vez que el modal se abre o se cierra
  useEffect(() => {
    if (show) {
      resetAllStates();
      // Deshabilitar todos los campos si no hay cuenta válida
      if (!idCuenta) {
        setIsFormDisabled(true);
      }
    } else {
      resetAllStates();
    }
  }, [show]);

  // Mapeo de idInformacion a string
  const INFORMACION_MAP = {
    "1904": "Errónea",
    "1902": "Incompleta",
    "1903": "No corresponde",
    "1905": "Inexistente",
    "1906": "Correcta",
    "": "Sin información",
    null: "Sin información",
    undefined: "Sin información",
    "Sin verificar": "Sin verificar",
    "Sin información": "Sin información",
  };

  // Obtener el idCuenta del primer resultado de searchResults
  const idCuenta = searchResults.length > 0 ? searchResults[0].idCuenta : null;
  const responseData = JSON.parse(localStorage.getItem("responseData"));
  const idEjecutivo = responseData?.ejecutivo?.infoEjecutivo?.idEjecutivo;
  // Obtener dirección y visitas
  useEffect(() => {
    if (show) {
      fetchAddressData();
      fetchTableDomData();
      fetchTableDomicilioData();
      compareAndReplacePostalCodes(); // Llama a la función aquí
    }
  }, [show]);

  useEffect(() => {
    if (formData.idCódigoPostal) {
      loadPostalCodesById(formData.idCódigoPostal);
    }
  }, [formData.idCódigoPostal]);

  useEffect(() => {
    if (postalCodesByIdData.length > 0) {
      const firstItem = postalCodesByIdData[0]; // Tomar el primer elemento de la tabla Postal por ID
      setFormData((prev) => ({
        ...prev,
        codigoPostal: firstItem.CódigoPostal || "", // Actualizar C.Postal
        municipio: firstItem.Municipio || "", // Actualizar Delegación / Municipio
        estado: firstItem.Estado || "", // Actualizar Estado
      }));

      // Actualizar la tabla Postal con el nuevo Código Postal
      if (firstItem.CódigoPostal) {
        loadPostalCodesByText(firstItem.CódigoPostal);
      }

    }
  }, [postalCodesByIdData]); // Ejecutar cuando postalCodesByIdData cambie

  const fetchAddressData = async () => {
    if (!idCuenta) {
      const errorText = "Error 428: Primero debes buscar una Cuenta.";
      if (!toast428ShownRef.current) {
        clearAllToasts();
        showToast(toast.error, errorText, { duration: 2000 });
        toast428ShownRef.current = true;
      }
      setErrorMessage(errorText);
      return;
    }

    setIsLoading(true);
    try {
      const response = await servicio.get(`/direccion/${idCuenta}`);
      if (response.data) {
        setFormData(response.data);
        setIsNew(false);
        setRecordCount(1);
      } else {
        setIsNew(true);
        setRecordCount(0);
        showToast(toast.info, "No se encontró información de la dirección.", { duration: 2000 });
      }
    } catch (error) {
      console.error("Error fetching address data:", error);

      if (error.response?.status === 404) {
        setIsNew(true);
        setRecordCount(0);
      } else {
        let message = "No se pudo cargar la dirección.";
        if (error.response) {
          const status = error.response.status;
          message = `Error ${status}: ${error.response.data.message || "Ocurrió un error inesperado."}`;
        } else {
          message = `Error: Ocurrió un problema al realizar la solicitud. Detalles: ${error.message}`;
        }

        if (errorMessage !== message) {
          clearAllToasts();
          showToast(toast.error, message, { duration: 2000 });
          setErrorMessage(message);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };


  // Función para cargar códigos postales por texto
  const loadPostalCodesByText = async (codigoPostal) => {
    try {
      const response = await servicio.get(`/search-customer/search-postal-code?codigoPostal=${codigoPostal}`);
      if (response.data.codigosPostales?.length === 0) {
        showToast(toast.error, "Sin colonias para este Código Postal.", { duration: 2000 });
        setPostalTableData([]); // Limpiar la tabla si no hay datos
        return;
      }
      setPostalTableData(response.data.codigosPostales); // Actualizar los datos en TablePostal

      // Mostrar solo un toast de éxito, cerrando cualquier otro abierto antes
      clearAllToasts();
      showToast(toast.success, "Códigos postales cargados correctamente.", { duration: 1200 });

      // --- NUEVO: activar focus visual solo la primera vez que hay resultados ---
      if (
        !postalTableFirstFocusShownRef.current &&
        response.data.codigosPostales.length > 0
      ) {
        setIsPostalTableFocused(true);
        postalTableFirstFocusShownRef.current = true;
        setTimeout(() => setIsPostalTableFocused(false), 3000);
      }
      // -------------------------------------------------------------------------
    } catch (error) {
      if (error.response?.status === 404) {
        console.warn(`Código postal no encontrado: ${codigoPostal}.`);
        showToast(toast.info, "No se encontró información relacionada a ese código postal.", { duration: 2000 });
        setPostalTableData([]); // Limpiar la tabla si no hay datos
      } else {
        console.error("Error al cargar códigos postales:", error);
        showToast(toast.error, "Falló al obtener los Códigos Postales.", { duration: 2000 });
      }
    }
  };

  // Función para cargar códigos postales por ID
  const loadPostalCodesById = async (idCodigoPostal) => {
    try {
      // Construir la URL correctamente con el idCódigoPostal como parte de la ruta
      const response = await servicio.get(`/ejecutivo/busca-codigos-postales/${idCodigoPostal}`);
      
      // Verificar si la respuesta contiene datos
      if (!response.data || response.data.length === 0) {
        showToast(toast.info, `No se encontraron datos para el idCódigoPostal: ${idCodigoPostal}.`, { duration: 2000 });
        setPostalCodesByIdData([]); // Limpiar la tabla si no hay datos
        return;
      }

      // Actualizar el estado con los datos recibidos
      setPostalCodesByIdData(response.data);
    } catch (error) {
      console.error("Error al cargar datos para idCódigoPostal:", error);
      showToast(toast.error, "No se pudo cargar la información del idCódigoPostal.", { duration: 2000 });
    }
  };

  // Manejar cambios en el campo de código postal
  const handlePostalCodeChange = (e) => {
    const inputValue = e.target.value;
    if (/^\d{0,5}$/.test(inputValue)) {
      setFormData({ ...formData, codigoPostal: inputValue });
      if (inputValue.length === 5) {
        loadPostalCodesByText(inputValue);
      }
    }
  };

  const handleIdCodigoPostalChange = (e) => {
    const inputValue = e.target.value;
    if (/^\d*$/.test(inputValue)) { // Permitir solo números
      setFormData({ ...formData, idCódigoPostal: inputValue });
      if (inputValue) {
        loadPostalCodesById(inputValue); // Llamar al endpoint cuando se ingrese un valor
      }
    }
  };

  const handlePostalIdRowClick = (item) => {
    console.log("Fila seleccionada en tabla Postal por ID:", item); // Log para depuración
  
    // Actualizar los valores en el formulario
    setFormData((prev) => ({
      ...prev,
      codigoPostal: item.CódigoPostal || "", // Actualizar C.Postal
      municipio: item.Municipio || "", // Actualizar Delegación / Municipio
      estado: item.Estado || "", // Actualizar Estado
    }));
  
    // Actualizar la tabla Postal con el nuevo Código Postal
    if (item.CódigoPostal) {
      loadPostalCodesByText(item.CódigoPostal);
    }
  
    showToast(toast.info, "Datos cargados desde la tabla Postal por ID.", { duration: 2000 });
  };

  const fetchTableDomData = async () => {
    if (!idCuenta) {
      const errorText = "Error 428: Primero debes buscar una Cuenta.";
      if (!toast428ShownRef.current) {
        clearAllToasts();
        showToast(toast.error, errorText, { duration: 2000 });
        toast428ShownRef.current = true;
      }
      setErrorMessage(errorText);
      return;
    }

    setIsLoading(true);
    try {
      const response = await servicio.get(
        `/ejecutivo/Domicilios/1/${idCuenta}`
      );
      

      const sanitizedData = (response.data || []).map((item) => ({
        ...item,
        Fecha: item.Fecha || "",
        Hora: item.Hora || "",
        idContacto: item.idContacto || "",
        idSituación: item.idSituación || "",
        // Agrega más campos según sea necesario
      }));

      setTableDomData(sanitizedData);

    } catch (error) {
      console.error("Error fetching table dom data:", error);
      
      // Depuración detallada del error
      if (error.response) {
        console.error("Error en la respuesta:", {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers
        });
      } else if (error.request) {
        console.error("Error en la solicitud:", error.request);
      } else {
        console.error("Error en la configuración:", error.message);
      }

      let message = "No se pudo cargar la tabla de direcciones.";
      if (error.response) {
        const status = error.response.status;
        message =
          status === 404
            ? "No se encontraron datos para la cuenta especificada."
            : `Error ${status}: ${error.response.data.message}`;
      } else if (error.request) {
        message = "Error: No se recibió respuesta del servidor.";
      } else {
        message = `Error: Ocurrió un problema al realizar la solicitud. Detalles: ${error.message}`;
      }

      if (errorMessage !== message) {
        console.log("Mostrando toast con mensaje:", message);
        clearAllToasts(); // Cierra cualquier toast abierto
        showToast(toast.error, message, { duration: 2000 });
        setErrorMessage(message);
      } else {
        console.log("Mensaje duplicado, no se muestra toast:", message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTableDomicilioData = async () => {
    if (!idCuenta) {
      const errorText = "Error 428: Primero debes buscar una Cuenta.";
      if (!toast428ShownRef.current) {
        clearAllToasts();
        showToast(toast.error, errorText, { duration: 2000 });
        toast428ShownRef.current = true;
      }
      setErrorMessage(errorText);
      return;
    }

    setIsLoading(true);
    try {
      const url = `/search-customer/domicilios-visitas?idCartera=1&idCuenta=${idCuenta}`;

      const response = await servicio.get(url, {
        headers: { 
        },
      });

      // Normaliza los datos
      const sanitizedData = (response.data.domicilios || []).map((item) => ({
        ...item,
        idCódigoPostal: item.idCódigoPostal || null, // Asegúrate de incluir este campo
      }));

      // Filtrar códigos postales válidos
      const uniquePostalIds = [...new Set(sanitizedData.map((item) => item.idCódigoPostal))].filter(
        (idCódigoPostal) => idCódigoPostal
      );

      const postalDataPromises = uniquePostalIds.map((idCódigoPostal) =>
        servicio
          .get(`/search-customer/search-postal-code?codigoPostal=${idCódigoPostal}`)
          .catch((error) => {
            if (error.response?.status === 404) {
              console.warn(
                `Código postal no encontrado: ${idCódigoPostal}. Detalles: ${
                  error.response.data?.mensaje || "Sin detalles"
                }`
              );
              return null; // Retorna null si el código postal no existe
            }
            throw error; // Lanza otros errores
          })
      );

      const postalResponses = await Promise.allSettled(postalDataPromises);
      const postalDataMap = postalResponses.reduce((acc, result, index) => {
        if (result.status === "fulfilled" && result.value?.data) {
          const postalInfo = result.value.data.codigosPostales?.[0];
          if (postalInfo) {
            acc[uniquePostalIds[index]] = postalInfo;
          }
        }
        return acc;
      }, {});

      // Reemplazar los valores en sanitizedData con los datos del segundo endpoint
      const enrichedData = sanitizedData.map((item) => {
        const postalInfo = postalDataMap[item.idCódigoPostal];
        if (postalInfo) {
          return {
            ...item,
            códigoPostal: postalInfo.códigoPostal || item.códigoPostal, // Actualiza el código postal
            delegaciónMunicipio: postalInfo.municipio || item.delegaciónMunicipio, // Actualiza el municipio
            estado: postalInfo.estado || item.estado, // Actualiza el estado
          };
        }
        return item;
      });

      setTableDomicilioData(enrichedData); // solo los items reales
      setExistingAddresses(enrichedData); // Actualiza las direcciones existentes
    } catch (error) {
      console.error("Error fetching domicilio data:", error);

      let message = "No se pudo cargar la tabla de domicilios.";
      if (error.response) {
        const status = error.response.status;
        message =
          status === 404
            ? "No se encontraron datos para la cuenta especificada."
            : `Error ${status}: ${error.response.data.message}`;
      } else if (error.request) {
        message = "Error: No se recibió respuesta del servidor.";
      } else {
        message = `Error: Ocurrió un problema al realizar la solicitud. Detalles: ${error.message}`;
      }

      if (errorMessage !== message) {
        console.log("Mostrando toast con mensaje:", message);
        clearAllToasts(); // Cierra cualquier toast abierto
        showToast(toast.error, message, { duration: 2000 });
        setErrorMessage(message);
      } else {
        console.log("Mensaje duplicado, no se muestra toast:", message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const compareAndReplacePostalCodes = async () => {
    if (!idCuenta) {
      // Solo log, no toast aquí porque ya se muestra en fetchAddressData/fetchTableDomData
      console.error("ID de cuenta no válido. No se puede realizar la comparación.");
      return;
    }
  
    try {
      const domiciliosResponse = await servicio.get(
        `/search-customer/domicilios-visitas?idCartera=1&idCuenta=${idCuenta}`
      );
      const domiciliosData = domiciliosResponse.data.domicilios || [];
  
      const uniquePostalIds = [...new Set(domiciliosData.map((item) => item.idCódigoPostal))]
        .filter((id) => id);
  
      const postalDataPromises = uniquePostalIds.map((idCódigoPostal) =>
        servicio.get(`/search-customer/search-postal-code?codigoPostal=${idCódigoPostal}`)
          .catch((error) => {
            if (error.response?.status === 404) {
              console.warn(`Código postal no encontrado: ${idCódigoPostal}. Detalles: ${error.response.data?.mensaje || "Sin detalles"}`);
              return null; // Retorna null si el código postal no existe
            }
            throw error; // Lanza otros errores
          })
      );
  
      const postalResponses = await Promise.allSettled(postalDataPromises);
  
      const postalDataMap = postalResponses.reduce((acc, result, index) => {
        if (result.status === "fulfilled" && result.value?.data) {
          const postalInfo = result.value.data.codigosPostales?.[0];
          if (postalInfo) {
            acc[uniquePostalIds[index]] = postalInfo;
          }
        }
        return acc;
      }, {});
  
      const updatedDomiciliosData = domiciliosData.map((item) => {
        const postalInfo = postalDataMap[item.idCódigoPostal];
        if (postalInfo) {
          return {
            ...item,
            códigoPostal: postalInfo.códigoPostal, // Actualiza el valor del código postal
          };
        }
        return item;
      });
  
      setTableDomicilioData(updatedDomiciliosData); // Actualiza la tabla con los nuevos valores
    } catch (error) {
      console.error("Error al comparar y reemplazar códigos postales:", error);
    }
  };


  const renderCell = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === "" ||
      typeof value === "object"
    ) {
      return "--";
    }
    return value;
  };
  const handleRowClick = (item) => {
    // console.log("Selected gestion:", item);
    setSelectedGestion(item); // Asigna el item seleccionado a selectedGestion
  };


  const handleSubmitAddressInformation = async () => {
    if (!selectedDomicilio || !idInformacion) {
        showToast(toast.error, "Por favor, seleccione un domicilio y un tipo de información válido.", { duration: 2000 });
        return;
    }

    const payload = {
        idCartera: 1,
        idCuenta: idCuenta,
        idDomicilio: selectedDomicilio.idDomicilio,
        idInformacion: parseInt(idInformacion, 10), // Convertir a número
    };

    try {
        setIsLoading(true);
        const response = await servicio.post(
            "/search-customer/update-address-information",
            payload
        );
        showToast(toast.success, "Información del domicilio actualizada exitosamente.", { duration: 2000 });
        console.log("Respuesta del servidor:", response.data);

        // Actualizar el campo 'informacion' en el formulario inmediatamente
        setFormData((prev) => ({
          ...prev,
          informacion: INFORMACION_MAP[idInformacion] || idInformacion
        }));

        // Actualizar la tabla de domicilios después de la actualización
        await fetchTableDomicilioData();

        // Limpiar el formulario y deshabilitar el dropdown
        setIdInformacion("");
        setIsEstadoVisible(false);
        setSelectedDomicilio(null);
    } catch (error) {
        console.error("Error al actualizar la información del domicilio:", error);

        // Manejar el error 400 específicamente
        if (error.response?.status === 400 && error.response.data?.message) {
            showToast(toast.error, error.response.data.message, { duration: 2000 });
        } else {
            showToast(toast.error, "No se pudo actualizar la información del domicilio.", { duration: 2000 });
        }
    } finally {
        setIsLoading(false);
    }
};

  const clearFormFields = () => {
    setFormData({
      calle: "",
      numExt: "",
      numInt: "",
      codigoPostal: "",
      colonia: "",
      municipio: "",
      estado: "",
      origen: "",
    });
    setClase(""); // Limpia el campo "Clase"
    setIsFormDisabled(false); // Habilita el formulario
    setIsDomicilioTableVisible(true); // Muestra la tabla de domicilios
    // Activa la animación de focus en código postal
    setFocusAnimCodigoPostal && setFocusAnimCodigoPostal(true);
  };

  const handlePostalRowClick = (item) => {
    console.log("Fila seleccionada en tabla postal:", item); // Log para depuración

    setFormData((prev) => ({
      ...prev,
      colonia: item.colonia || "",
      municipio: item.municipio || "",
      estado: item.estado || "",
      // Guardar también el idCódigoPostal seleccionado
      idCódigoPostal: item.idCódigoPostal || "",
      // No modificar el código postal aquí
    }));
    showToast(toast.info, "Datos cargados desde la tabla postal.", { duration: 2000 });
  };

  const handleSaveNewAddress = async () => {
    // Validar que todos los campos requeridos estén llenos
    if (
      !formData.calle ||
      !formData.numExt ||
      !formData.codigoPostal ||
      !formData.colonia ||
      !formData.municipio ||
      !formData.estado
    ) {
      showToast(toast.error, "Por favor, complete todos los campos obligatorios.", { duration: 2000 });
      // No limpiar el formulario ni el código postal aquí
      return;
    }

    // Validar que el código postal sea válido (5 dígitos)
    if (!/^\d{5}$/.test(formData.codigoPostal)) {
      showToast(toast.error, "Ingrese un código postal válido (5 dígitos).", { duration: 2000 });
      // No limpiar el formulario ni el código postal aquí
      return;
    }

    // Validar si la dirección ya existe en los datos locales
    const isDuplicate = existingAddresses.some(
      (address) =>
        address.calle === formData.calle &&
        address.númeroExterior === formData.numExt
    );

    if (isDuplicate) {
      showToast(toast.error, "La dirección ya existe. No se puede duplicar.", { duration: 2000 });
      return;
    }

    // Normalizar los datos antes de enviarlos
    const payload = {
      idCartera: 1,
      idCuenta: idCuenta,
      idEjecutivo: parseInt(idEjecutivo, 10) || 0,
      idProducto: 1,
      calle: formData.calle,
      numeroExterior: formData.numExt,
      numeroInterior: formData.numInt || "0", // Valor predeterminado
      // Asegura que idCodigoPostal sea string después de la conversión a número
      idCodigoPostal: formData.idCódigoPostal
        ? String(Number(formData.idCódigoPostal))
        : (formData.codigoPostal ? String(Number(formData.codigoPostal)) : "0"),
      colonia: formData.colonia,
      municipio: formData.municipio,
      estado: formData.estado,
      idClase: parseInt(clase, 10) || 0,
    };

    console.log("Payload enviado:", payload);

    try {
      setIsLoading(true);
      const response = await servicio.post(
        "/search-customer/save-new-address",
        payload
      );
      showToast(toast.success, "Dirección guardada exitosamente.", { duration: 2000 });
      console.log("Respuesta del servidor:", response.data);

      // Actualizar la tabla de domicilios después de guardar
      await fetchTableDomicilioData();

      // Limpiar la tabla postal
      setPostalTableData([]);
      setIsPostalTableVisible(false); // Ocultar la tabla postal

      // Limpiar todos los campos del formulario tras registro exitoso
      setFormData({
        calle: "",
        numExt: "",
        numInt: "",
        colonia: "",
        municipio: "",
        estado: "",
        origen: "",
        fecha_Insert: "",
        codigoPostal: "",
        idCódigoPostal: "",
        informacion: "",
      });
      setClase("");
      setIdInformacion("");
      setIsEstadoVisible(false);

      // Activa la animación de focus en código postal
      setFocusAnimCodigoPostal(true);

    } catch (error) {
      console.error("Error al guardar la dirección:", error);

      // Manejar errores específicos
      if (error.response?.status === 400 && error.response?.data?.message) {
        showToast(toast.error, error.response.data.message, { duration: 2000 });
      } else {
        showToast(toast.error, "Verifica que se esten enviando todos los campo selecionables.", { duration: 2000 });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviousItem = () => {
    const totalItems = tableDomicilioData.length + 1; // Incluye el formulario vacío (índice 0)
    const newIndex = (currentIndex - 1 + totalItems) % totalItems; // Navegación circular
    setCurrentIndex(newIndex);
    loadItemToForm(newIndex === 0 ? null : tableDomicilioData[newIndex - 1]); // Índice 0 es el formulario vacío
  };

  const handleNextItem = () => {
    const totalItems = tableDomicilioData.length + 1; // Incluye el formulario vacío (índice 0)
    const newIndex = (currentIndex + 1) % totalItems; // Navegación circular
    setCurrentIndex(newIndex);
    loadItemToForm(newIndex === 0 ? null : tableDomicilioData[newIndex - 1]); // Índice 0 es el formulario vacío
  };

  const loadItemToForm = async (item) => {
    if (!item) {
      // Si es el formulario vacío (índice 0), limpiar el formulario
      clearFormFields();
      setIsFormDisabled(false); // Habilitar el formulario
      setSelectedDomicilio(null);
      showToast(toast.info, "Formulario listo para un nuevo registro.", { duration: 2000 });
    } else {
      setFormData((prev) => ({
        ...prev,
        calle: item.calle || "",
        numExt: item.númeroExterior || "",
        numInt: item.númeroInterior || "",
        codigoPostal: item.códigoPostal,
        idCódigoPostal: item.idCódigoPostal || "", // Asegurar que se pinte el valor en el formulario
        colonia: item.coloniaLocalidad || "",
        municipio: item.delegaciónMunicipio || "",
        estado: item.estado || "",
        origen: item.orígen || "",
        informacion: INFORMACION_MAP[item.información] || item.información || "Sin información",
        fecha_Insert: item.fecha_Insert || item.Fecha || "", // <-- Agrega esta línea
      }));
      setClase(item.clase || "");
      setSelectedDomicilio(item);

      // Cargar datos adicionales del Código Postal
      if (item.idCódigoPostal) {
        await loadPostalCodesById(item.idCódigoPostal);
      }

      // Verificar si el idInformacion es "Sin verificar"
      if (item.información === "Sin verificar") {
        setIdInformacion("");
        setIsEstadoVisible(true);
        showToast(toast.info, "Seleccione una información para identificar.", { duration: 2000 });
      } else {
        setIdInformacion(item.información);
        setIsEstadoVisible(false);
      }
    }
  };

  const handleCloseModal = () => {
    resetAllStates(); // Limpia todos los estados
    handleClose(); // Cierra el modal
  };

  return (
    <Modal
      show={show}
      onHide={handleCloseModal}
      size="xl"
      backdrop="static"
      keyboard={false}
      dialogClassName="modal-scroll-inside"
    >
      <Modal.Header closeButton>
        <Modal.Title>Domicilios</Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          maxHeight: "80vh",
          overflowY: "auto",
          paddingRight: "16px"
        }}
      >
        <Container fluid>
          {/* 1. Tabla postal arriba, ancho 12, maxHeight 250px */}
          <Row>
            <Col xs={12}>
              <div style={{ maxHeight: "250px", overflowY: "auto" }}>
                <TablePostal
                  postalTableData={postalTableData}
                  handlePostalRowClick={handlePostalRowClick}
                  renderCell={renderCell}
                  isFocused={isPostalTableFocused} // <-- Nuevo prop
                />
              </div>
            </Col>
          </Row>

          {/* 2. Formulario (9) y paginador/botones/limpiar (3) en el mismo row, sin espacio muerto */}
          <Row className="align-items-start mt-3">
            <Col xs={12}>
              <Row className="align-items-start">
                {/* FormularioDom (ancho máx 9) */}
                <Col xs={12} md={8}>
                  <div style={{ marginTop: "18px" }}>
                    <FormularioDom
                      formData={formData}
                      setFormData={setFormData}
                      handleSaveNewAddress={handleSaveNewAddress}
                      isFormDisabled={isFormDisabled || !idCuenta}
                      clase={clase}
                      setClase={setClase}
                      handlePreviousItem={handlePreviousItem}
                      handleNextItem={handleNextItem}
                      currentIndex={currentIndex}
                      totalItems={tableDomicilioData.length + 1}
                      onSearchPostalCode={loadPostalCodesByText}
                      handlePostalCodeChange={handlePostalCodeChange}
                      handleIdCodigoPostalChange={handleIdCodigoPostalChange}
                      idInformacion={idInformacion}
                      setIdInformacion={setIdInformacion}
                      isEstadoVisible={isEstadoVisible}
                      isIdentifyButtonDisabled={isIdentifyButtonDisabled}
                      handleSubmitAddressInformation={handleSubmitAddressInformation}
                      disableRegistrarDomicilio={!idCuenta}
                      disableCodigoPostal={!idCuenta}
                      focusAnimCodigoPostal={focusAnimCodigoPostal}
                      setFocusAnimCodigoPostal={setFocusAnimCodigoPostal}
                    />
                  </div>
                </Col>
                {/* Botones paginador, contador y limpiar (ancho 3), centrados */}
                <Col
                  xs={12}
                  md={4}
                  className="d-flex justify-content-center align-items-center"
                  style={{ minHeight: "100%" }}
                >
                  <div
                    style={{
                      marginTop: "64px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      height: "100%",
                    }}
                  >
                    <FormularioDom
                      // Solo renderiza el paginado, no el formulario completo
                      formData={{}} // dummy
                      setFormData={() => {}}
                      handleSaveNewAddress={() => {}}
                      isFormDisabled={true}
                      clase=""
                      setClase={() => {}}
                      handlePreviousItem={handlePreviousItem}
                      handleNextItem={handleNextItem}
                      currentIndex={currentIndex}
                      totalItems={tableDomicilioData.length + 1}
                      onSearchPostalCode={() => {}}
                      handlePostalCodeChange={() => {}}
                      idInformacion=""
                      setIdInformacion={() => {}}
                      isEstadoVisible={false}
                      isIdentifyButtonDisabled={true}
                      handleSubmitAddressInformation={() => {}}
                      onlyPagination={true}
                      disableRegistrarDomicilio={true}
                      disableCodigoPostal={true}
                    />
                    <Button
                      variant="primary"
                      className="mt-3"
                      onClick={() => {
                        setCurrentIndex(0);
                        clearFormFields();
                        setIsFormDisabled(false);
                        setSelectedDomicilio(null);
                        setIdInformacion("");
                        setIsEstadoVisible(false);
                        setPostalTableData([]);
                        setFocusAnimCodigoPostal(true); // Activa animación al limpiar
                      }}
                      disabled={currentIndex === 0 || !idCuenta} // <-- Desactiva cuando es formulario de nuevo registro o sin cuenta
                    >
                      Limpiar Formulario
                    </Button>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>

          {/* 3. Tabla de visitas al final, ancho 12 */}
          <Row className="mt-3">
            <Col xs={12}>
              <h4>Visitas</h4>
              <div
                className="scroll-container"
                style={{
                  width: "100%",
                  maxHeight: "200px",
                  overflowY: "auto",
                  display: "flex",
                  backgroundColor: "#343a40",
                  color: "#ffffff",
                  scrollbarColor: "#6c757d #343a40",
                  scrollbarWidth: "thin",
                }}
              >
                <Table
                  striped
                  bordered
                  hover
                  responsive
                  variant="dark"
                  style={{ fontSize: "13px" }}
                >
                  <thead
                    style={{
                      position: "sticky",
                      top: -1,
                      zIndex: 1,
                      backgroundColor: "#343a40",
                    }}
                  >
                    <tr style={{ height: "55px" }}>
                      <th>Fecha</th>
                      <th>Hora</th>
                      <th>Contacto</th>
                      <th>Situación</th>
                      <th>Causa No Pago</th>
                      <th>Nombre</th>
                      <th>Parentesco</th>
                      <th>Sucursal</th>
                      <th>Color Fachada</th>
                      <th>Color Puerta</th>
                      <th>Color Herrería</th>
                      <th>Pisos</th>
                      <th>Vivienda</th>
                      <th>Habitación</th>
                      <th>Económico</th>
                      <th>NombrePropietario</th>
                      <th>AutoMapeo</th>
                      <th>AutoMarca</th>
                      <th>AutoAño</th>
                      <th>CalleHorizontalNorte</th>
                      <th>CalleHorizontalSur</th>
                      <th>CalleVerticalOeste</th>
                      <th>CalleVerticalEste</th>
                      <th>Visitador</th>
                      <th>Capturista</th>
                      <th>FechaPagoNegociación</th>
                      <th>MontoNegociación</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableDomData.map((item, index) => {
                      const idContacto =
                        item.idContacto !== undefined && item.idContacto !== ""
                          ? item.idContacto
                          : null;
                      const idSituacion =
                        item.idSituacion !== undefined && item.idSituacion !== ""
                          ? item.idSituacion
                          : (item.idSituación !== undefined && item.idSituación !== "" ? item.idSituación : null);
                      const idCausaNoPago =
                        item.idCausaNoPago !== undefined && item.idCausaNoPago !== ""
                          ? item.idCausaNoPago
                          : null;
                      const idParentesco =
                        item.idParentesco !== undefined && item.idParentesco !== ""
                          ? item.idParentesco
                          : null;
                      const idSucursal = 0;

                      return (
                        <tr
                          key={index}
                          onClick={() => handleRowClick(item)}
                          style={{
                            cursor: "pointer",
                            backgroundColor:
                              selectedGestion === item ? "#264d26" : "inherit"
                          }}
                        >
                          <td>{renderCell(formatearFecha(item.Fecha))}</td>
                          <td>{renderCell(item.Hora)}</td>
                          <td>{renderCell(reemplazarValores(idContacto))}</td>
                          <td>{renderCell(reemplazarValores(idSituacion))}</td>
                          <td>{renderCell(reemplazarValores(idCausaNoPago))}</td>
                          <td>{renderCell(item.NombreContacto)}</td>
                          <td>{renderCell(reemplazarValores(idParentesco))}</td>
                          <td>{renderCell(reemplazarValores(idSucursal))}</td>
                          <td>{renderCell(item.ColorFachada)}</td>
                          <td>{renderCell(item.ColorPuerta)}</td>
                          <td>{renderCell(item.ColorHerrería)}</td>
                          <td>{renderCell(item.Pisos)}</td>
                          <td>{renderCell(item.idVivienda)}</td>
                          <td>{renderCell(item.idHabitación)}</td>
                          <td>{renderCell(item.idEconómico)}</td>
                          <td>{renderCell(item.NombrePropietario)}</td>
                          <td>{renderCell(item.AutoMapeo)}</td>
                          <td>{renderCell(item.AutoMarca)}</td>
                          <td>{renderCell(item.AutoAño)}</td>
                          <td>{renderCell(item.CalleHorizontalNorte)}</td>
                          <td>{renderCell(item.CalleHorizontalSur)}</td>
                          <td>{renderCell(item.CalleVerticalOeste)}</td>
                          <td>{renderCell(item.CalleVerticalEste)}</td>
                          <td>{renderCell(item.Visitador)}</td>
                          <td>{renderCell(item.Capturista)}</td>
                          <td>{renderCell(item.FechaPagoNegociación)}</td>
                          <td>{renderCell(item.MontoNegociación)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </Col>
          </Row>
          {/* Comentario debajo de la tabla de visitas */}
          <Row>
            <Col xs={12}>
              <div
                style={{
                  display: "inline-block",
                  backgroundColor: isCommentHovered
                    ? "rgb(26.5611940299, 251.5388059701, 123.4746268657)"
                    : "#000000",
                  color: isCommentHovered
                    ? "#000"
                    : "rgb(26.5611940299, 251.5388059701, 123.4746268657)",
                  fontWeight: "bold",
                  borderRadius: "10px",
                  padding: "5px",
                  transition: "background-color 0.5s ease, color 0.5s ease",
                  cursor: "pointer",
                  marginTop: "8px"
                }}
                onMouseEnter={() => setIsCommentHovered(true)}
                onMouseLeave={() => setIsCommentHovered(false)}
              >
                <span>
                  Comentario:{" "}
                  {selectedGestion && selectedGestion.Comentario
                    ? renderCell(selectedGestion.Comentario)
                    : "Seleccione una gestión para ver el comentario"}
                </span>
              </div>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default Addresses;