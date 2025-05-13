import { useState, useEffect, useContext } from "react";
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
import { formatearFecha } from "../../ValoresCatalogos.js";
import MergeTable from "./MergeTable"; // Importar el componente MergeTable

const Addresses = ({ show, handleClose }) => {
  const { searchResults } = useContext(AppContext); // Obtén el contexto
  const [formData, setFormData] = useState({
    calle: "",
    numExt: "",
    numInt: "",
    colonia: "",
    municipio: "",
    estado: "",
    origen: "Gestión",
    fecha: "",
    codigoPostal: "",
  });
  const [selectedGestion, setSelectedGestion] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [recordCount, setRecordCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [tableDomicilioData, setTableDomicilioData] = useState([
    {
      calle: "",
      numExt: "",
      numInt: "",
      codigoPostal: "",
      colonia: "",
      municipio: "",
      estado: "",
      origen: "Gestión",
      fecha: "",
    },
  ]); // Registro en blanco como índice 0
  const [isPostalTableVisible, setIsPostalTableVisible] = useState(false);
  const [postalTableData, setPostalTableData] = useState([]);
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

  const fetchAddressData = async () => {
    if (!idCuenta) {
      const errorText = "ID de cuenta no válido. Por favor, verifique.";
      if (errorMessage !== errorText) {
        toast.dismiss();
        toast.error(errorText);
        setErrorMessage(errorText);
      }
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
        toast.info("No se encontró información de la dirección.");
      }
    } catch (error) {
      console.error("Error fetching address data:", error);

      if (error.response?.status === 404) {
        // toast.info("No se encontró información de la dirección para el ID de cuenta proporcionado.");
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
          toast.dismiss();
          toast.error(message);
          setErrorMessage(message);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTableData = async () => {
    setIsLoading(true);
    try {
      const response = await servicio.get(
        `/search-customer/search-postal-code?codigoPostal=${codigoPostal}`
      );
      setTableData(response.data || []);
    } catch (error) {
      console.error("Error fetching table data:", error);

      let message = "No se pudo cargar la tabla.";
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

      toast.dismiss(); // Cierra cualquier toast abierto
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cargar códigos postales por texto
  const loadPostalCodesByText = async (codigoPostal) => {
    try {
      const response = await servicio.get(`/search-customer/search-postal-code?codigoPostal=${codigoPostal}`);
      if (response.data.codigosPostales?.length === 0) {
        toast.error("Sin colonias para este Código Postal.");
        return;
      }
      setPostalTableData(response.data.codigosPostales);
      toast.success("Códigos postales cargados correctamente.");
    } catch (error) {
      if (error.response?.status === 404) {
        console.warn(`Código postal no encontrado: ${codigoPostal}. Detalles: ${error.response.data?.mensaje || "Sin detalles"}`);
        // toast.info("No se encontró información relacionada a ese código postal.");
      } else {
        console.error("Error al cargar códigos postales:", error);
        toast.error("Falló al obtener los Códigos Postales.");
      }
    }
  };

  // Función para cargar códigos postales por ID
  const loadPostalCodesById = async (idCodigoPostal) => {
    try {
      const response = await servicio.get(`/search-customer/search-postal-code?codigoPostal=${idCodigoPostal}`);
      if (response.data.codigosPostales?.length === 0) {
        toast.error("No se encontraron datos para el Código Postal.");
        return;
      }

      const postalInfo = response.data.codigosPostales[0];
      setFormData((prev) => ({
        ...prev,
        codigoPostal: postalInfo.códigoPostal || "",
        colonia: postalInfo.colonia || "",
        municipio: postalInfo.municipio || "",
        estado: postalInfo.estado || "",
        zona: postalInfo.zona || "",
        asentamiento: postalInfo.asentamiento || "",
        periferia: postalInfo.periferia || "",
        estancia: postalInfo.estancia || "",
        sucursal: postalInfo.sucursal || "",
        zonaRiesgo: postalInfo.zonaRiesgo ? "Sí" : "No",
      }));
      toast.success("Datos del Código Postal cargados correctamente.");
    } catch (error) {
      if (error.response?.status === 404) {
        console.warn(`Código postal no encontrado: ${idCodigoPostal}. Detalles: ${error.response.data?.mensaje || "Sin detalles"}`);
        toast.info("No se encontró información relacionada a ese código postal.");
      } else {
        console.error("Error al cargar datos del Código Postal:", error);
        toast.error("Falló al obtener los datos del Código Postal.");
      }
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

  // Función para identificar domicilio
  const identifyAddress = async (idDomicilio, idCodigoPostal, idInformacion, idClase) => {
    const payload = {
      idDomicilio,
      idCodigoPostal,
      idInformacion,
      idClase,
    };

    try {
      const response = await servicio.post("/search-customer/identify-address", payload);
      toast.success("Domicilio identificado correctamente.");
      console.log("Respuesta del servidor:", response.data);
      await fetchTableDomicilioData(); // Actualiza la tabla de domicilios
    } catch (error) {
      console.error("Error al identificar domicilio:", error);
      toast.error("No se pudo identificar el domicilio.");
    }
  };

  // Manejar el botón de acción (Nuevo / Identificar)
  const handleAction = async () => {
    if (isNew) {
      toast.info("Creando un nuevo registro...");
      setFormData({
        calle: "",
        numExt: "",
        numInt: "",
        codigoPostal: "",
        colonia: "",
        municipio: "",
        estado: "",
        origen: "Gestión",
      });
    } else {
      try {
        await servicio.put("/direccion/actualizar", formData);
        toast.success("Dirección actualizada.");
      } catch (error) {
        toast.error("No se pudo actualizar.");
      }
    }
  };

  const fetchTableDomData = async () => {
    if (!idCuenta) {
      const errorText = "ID de cuenta no válido. Por favor, verifique.";
      if (errorMessage !== errorText) {
        console.log("Mostrando toast con mensaje:", errorText);
        toast.dismiss(); // Cierra cualquier toast abierto
        toast.error(errorText);
        setErrorMessage(errorText);
      } else {
        console.log("Mensaje duplicado, no se muestra toast:", errorText);
      }
      return;
    }

    setIsLoading(true);
    try {
      console.log("Iniciando solicitud a /ejecutivo/Domicilios/1/${idCuenta}");
      const response = await servicio.get(
        `/ejecutivo/Domicilios/1/${idCuenta}`
      );
      
      
      if (response.headers) {
        console.log("Cabeceras de la respuesta:", response.headers);
      }

      const sanitizedData = (response.data || []).map((item) => ({
        ...item,
        Fecha: item.Fecha || "",
        Hora: item.Hora || "",
        idContacto: item.idContacto || "",
        idSituación: item.idSituación || "",
        // Agrega más campos según sea necesario
      }));

      console.log("Datos sanitizados:", sanitizedData);
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
        toast.dismiss(); // Cierra cualquier toast abierto
        toast.error(message);
        setErrorMessage(message);
      } else {
        console.log("Mensaje duplicado, no se muestra toast:", message);
      }
    } finally {
      console.log("Finalizando carga de datos de domicilios");
      setIsLoading(false);
    }
  };

  const fetchTableDomicilioData = async () => {
    if (!idCuenta) {
      const errorText = "ID de cuenta no válido. Por favor, verifique.";
      if (errorMessage !== errorText) {
        console.log("Mostrando toast con mensaje:", errorText);
        toast.dismiss(); // Cierra cualquier toast abierto
        toast.error(errorText);
        setErrorMessage(errorText);
      } else {
        console.log("Mensaje duplicado, no se muestra toast:", errorText);
      }
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("authToken"); // Obtén el token del almacenamiento local
      const url = `/search-customer/domicilios-visitas?idCartera=1&idCuenta=${idCuenta}`;
      console.log("URL de la solicitud:", url);

      const response = await servicio.get(url, {
        headers: {
          Authorization: `Bearer ${token}`, // Agrega el token aquí
        },
      });

      console.log("Datos recibidos del endpoint domi visi:", response.data);

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

      setTableDomicilioData([
        {
          calle: "",
          numExt: "",
          numInt: "",
          codigoPostal: "",
          colonia: "",
          municipio: "",
          estado: "",
          origen: "Gestión",
          fecha: "",
        }, // Registro en blanco
        ...enrichedData,
      ]); // Agregar el registro en blanco al inicio
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
        toast.dismiss(); // Cierra cualquier toast abierto
        toast.error(message);
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
          console.log("Código Postal encontrado:", postalInfo.códigoPostal);
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

  const fetchFechaInsert = async (idDomicilio) => {
    try {
      const response = await servicio.get(`/domicilios/fecha-insert/${idDomicilio}`);
      return response.data.Fecha_Insert || ""; // Devuelve la Fecha_Insert o una cadena vacía
    } catch (error) {
      console.error("Error al obtener la Fecha_Insert:", error);
      toast.error("No se pudo obtener la Fecha_Insert.");
      return "";
    }
  };

  const renderCell = (value) => {
    if (value === null || value === undefined || typeof value === "object") {
      return ""; // Valor predeterminado
    }
    return value;
  };
  const handleRowClick = (item) => {
    // console.log("Selected gestion:", item);
    setSelectedGestion(item); // Asigna el item seleccionado a selectedGestion
  };

  const handleDomicilioSelection = async (selectedCodigoPostal) => {
    try {
      setIsLoading(true);
      const response = await servicio.get(
        `/search-customer/search-postal-code?codigoPostal=${selectedCodigoPostal}`
      );
      setPostalTableData(response.data.codigosPostales || []); // Actualiza los datos de la tabla "Postal"
      setIsPostalTableVisible(true); // Muestra la tabla postal
      toast.success("Datos de la tabla Postal actualizados.");
    } catch (error) {
      console.error("Error al actualizar la tabla Postal:", error);
      // No mostrar toast de error aquí
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAddressInformation = (selectedDomicilio) => {
    console.log("Domicilio seleccionado:", selectedDomicilio);
    if (selectedDomicilio.información === "Sin verificar") {
      setIsEstadoVisible(true);
      setSelectedDomicilio(selectedDomicilio);
      console.log("Formulario visible");
    } else {
      setIsEstadoVisible(false);
      setSelectedDomicilio(null);
      console.log("Formulario oculto");
      toast.info("El domicilio seleccionado ya ha sido verificado.");
    }
  };

  const handleSubmitAddressInformation = async () => {
    if (!selectedDomicilio || !idInformacion) {
        toast.error("Por favor, seleccione un domicilio y un tipo de información válido.");
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
        toast.success("Información del domicilio actualizada exitosamente.");
        console.log("Respuesta del servidor:", response.data);

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
            toast.error(error.response.data.message);
        } else {
            toast.error("No se pudo actualizar la información del domicilio.");
        }
    } finally {
        setIsLoading(false);
    }
};

  const handleNewButtonClick = () => {
    if (isFormDisabled) {
      // Si hay un registro seleccionado, limpia los campos y habilita el formulario
      clearFormFields();
      setIsDomicilioTableVisible(false); // Oculta la tabla de domicilios
      toast.info("Formulario listo para un nuevo registro.");
    } else {
      toast.error("El formulario ya está listo para un nuevo registro.");
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
      origen: "Gestión",
    });
    setClase(""); // Limpia el campo "Clase"
    setIsFormDisabled(false); // Habilita el formulario
    setIsDomicilioTableVisible(true); // Muestra la tabla de domicilios
  };

  const handlePostalRowClick = (item) => {
    console.log("Fila seleccionada en tabla postal:", item); // Log para depuración

    setFormData((prev) => ({
      ...prev,
      colonia: item.colonia || "",
      municipio: item.municipio || "",
      estado: item.estado || "",
      // No modificar el código postal aquí
    }));
    toast.info("Datos cargados desde la tabla postal.");
  };

  const handleDomicilioRowClick = async (item) => {
    console.log("Fila seleccionada:", item);

    if (selectedDomicilio?.idDomicilio === item.idDomicilio) {
      // Si el mismo row está seleccionado, limpia el formulario y deselecciona
      clearFormFields();
      setIdInformacion(""); // Limpia el campo de "Información Actual"
      setIsEstadoVisible(false); // Deshabilita el dropdown y el botón
      setSelectedDomicilio(null); // Limpia el domicilio seleccionado
      toast.info("Formulario limpiado y elementos deshabilitados.");
    } else {
      // Obtener la Fecha_Insert desde la base de datos
      const fechaInsert = await fetchFechaInsert(item.idDomicilio);

      // Si es un row diferente, carga los datos en el formulario
      setFormData((prev) => ({
        ...prev,
        calle: item.calle || "",
        numExt: item.númeroExterior || "",
        numInt: item.númeroInterior || "",
        códigoPostal: item.códigoPostal, // Mantener el código postal actual
        colonia: item.coloniaLocalidad || "",
        municipio: item.delegaciónMunicipio || "",
        estado: item.estado || "",
        origen: item.orígen || "Gestión",
        fecha: fechaInsert, // Actualizar el campo Fecha con la Fecha_Insert
      }));
      setClase(item.clase || ""); // Actualiza el campo "Clase" en el formulario
      setIsFormDisabled(true); // Deshabilita el formulario
      setSelectedDomicilio(item); // Guarda el domicilio seleccionado
      toast.info("Datos cargados desde la tabla Domicilios.");

      // Cargar datos adicionales del Código Postal
      if (item.idCódigoPostal) {
        await loadPostalCodesById(item.idCódigoPostal);
      }

      // Verificar si el idInformacion es "Sin verificar"
      if (item.información === "Sin verificar") {
        setIdInformacion(""); // Limpia el dropdown
        setIsEstadoVisible(true); // Muestra el dropdown y habilita el botón
        toast.info("Seleccione una información para identificar.");
      } else {
        setIdInformacion(item.información); // Muestra el valor actual en el nuevo campo
        setIsEstadoVisible(false); // Oculta el dropdown y deshabilita el botón
        // toast.info(`Información actual: ${item.información}`);
      }
    }
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
      toast.error("Por favor, complete todos los campos obligatorios.");
      return;
    }

    // Validar si la dirección ya existe en los datos locales
    const isDuplicate = existingAddresses.some(
      (address) =>
        address.calle === formData.calle &&
        address.númeroExterior === formData.numExt 
        //address.códigoPostal === formData.codigoPostal
    );

    if (isDuplicate) {
      toast.error("La dirección ya existe. No se puede duplicar.");
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
      codigoPostal: formData.codigoPostal,
      colonia: formData.colonia,
      municipio: formData.municipio,
      estado: formData.estado,
      idClase: parseInt(clase, 10) || 0,
    };

    console.log("Payload enviado:", payload);

    try {
      setIsLoading(true);
      const response = await servicio.put("/search-customer/save-new-address", payload);
      toast.success("Dirección guardada exitosamente.");
      console.log("Respuesta del servidor:", response.data);

      // Actualizar la tabla de domicilios después de guardar
      await fetchTableDomicilioData();

      // Limpiar la tabla postal
      setPostalTableData([]);
      setIsPostalTableVisible(false); // Ocultar la tabla postal
    } catch (error) {
      console.error("Error al guardar la dirección:", error);

      // Manejar errores específicos
      if (error.response?.status === 503 && error.response?.data?.errors?.includes("Violation of UNIQUE KEY")) {
        toast.error("La dirección ya existe en la base de datos. No se puede duplicar.");
      } else {
        toast.error("No se pudo guardar la dirección. Intente nuevamente.");
      }
    } finally {
      setIsLoading(false);
      clearFormFields();
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
      toast.info("Formulario listo para un nuevo registro.");
    } else {
      setFormData((prev) => ({
        ...prev,
        calle: item.calle || "",
        numExt: item.númeroExterior || "",
        numInt: item.númeroInterior || "",
        códigoPostal: item.códigoPostal,
        colonia: item.coloniaLocalidad || "",
        municipio: item.delegaciónMunicipio || "",
        estado: item.estado || "",
        origen: item.orígen || "Gestión",
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
        toast.info("Seleccione una información para identificar.");
      } else {
        setIdInformacion(item.información);
        setIsEstadoVisible(false);
      }
    }
  };

  const handleCloseModal = () => {
    clearFormFields(); // Limpia los campos del formulario
    setCurrentIndex(0); // Restablece el índice al formulario vacío (0)
    handleClose(); // Cierra el modal
  };

  // Función para manejar la selección de un row en MergeTable
  const handleRowSelectFromMergeTable = (selectedData) => {
    if (
      formData.calle === selectedData.calle &&
      formData.numExt === selectedData.numExt &&
      formData.numInt === selectedData.numInt &&
      formData.codigoPostal === selectedData.codigoPostal &&
      formData.colonia === selectedData.colonia &&
      formData.municipio === selectedData.municipio &&
      formData.estado === selectedData.estado
    ) {
      // Si se selecciona el mismo row, limpiar el formulario
      clearFormFields();
      setIdInformacion(""); // Limpia el campo de "Información Actual"
      setIsEstadoVisible(false); // Deshabilita el dropdown
      setIsFormDisabled(false); // Habilita el formulario
      setSelectedDomicilio(null); // Limpia el domicilio seleccionado
      toast.info("Formulario limpiado.");
    } else {
      // Si es un row diferente, actualizar el formulario
      setFormData((prev) => ({
        ...prev,
        calle: selectedData.calle,
        numExt: selectedData.numExt,
        numInt: selectedData.numInt,
        codigoPostal: selectedData.codigoPostal,
        colonia: selectedData.colonia,
        municipio: selectedData.municipio,
        estado: selectedData.estado,
        origen: selectedData.origen,
      }));
      setClase(selectedData.idClase); // Actualizar idClase
      setIdInformacion(selectedData.idInformacion); // Actualizar idInformacion
      setIsEstadoVisible(selectedData.isEstadoVisible); // Mostrar u ocultar el dropdown
      setIsFormDisabled(true); // Desactivar el formulario
      setSelectedDomicilio(selectedData); // Guardar el domicilio seleccionado

      // Activar el botón y el select si la información es "Sin verificar"
      if (selectedData.idInformacion === "") {
        setIsEstadoVisible(true); // Habilitar el dropdown
        toast.info("Seleccione una información para identificar.");
      }
    }
  };

  return (
    <Modal
      show={show}
      onHide={handleCloseModal} // Usa la nueva función para limpiar el estado
      size="xl"
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>Domicilios</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container fluid>
          <Row>
            {/* Tabla de postales a la izquierda */}
            <Col md={8}>
              <h4>Postal</h4>
              <div
                className="scroll-container"
                style={{
                  width: "100%",
                  maxHeight: "350px",
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
                      top: 0,
                      zIndex: 1,
                      backgroundColor: "#343a40",
                    }}
                  >
                    <tr style={{ height: "55px" }}>
                      <th>Id código Postal</th>
                      <th>Código Postal</th>
                      <th>Colonia</th>
                      <th>Municipio</th>
                      <th>Estado</th>
                      <th>Zona</th>
                      <th>Asentamiento</th>
                      <th>Periferia</th>
                      <th>Estancia</th>
                      <th>Sucursal</th>
                      <th>Zona de Riesgo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {postalTableData?.map((item, index) => (
                      <tr
                        key={index}
                        onClick={() => handlePostalRowClick(item)}
                        style={{ cursor: "pointer" }}
                      >
                        <td>{renderCell(item.idCódigoPostal)}</td>
                        <td>{renderCell(item.códigoPostal)}</td>
                        <td>{renderCell(item.colonia)}</td>
                        <td>{renderCell(item.municipio)}</td>
                        <td>{renderCell(item.estado)}</td>
                        <td>{renderCell(item.zona)}</td>
                        <td>{renderCell(item.asentamiento)}</td>
                        <td>{renderCell(item.periferia)}</td>
                        <td>{renderCell(item.estancia)}</td>
                        <td>{renderCell(item.sucursal)}</td>
                        <td>{renderCell(item.zonaRiesgo ? "Sí" : "No")}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Col>
            {/* Formulario y flechas de navegación a la derecha */}
            <Col md={4} className="d-flex flex-column justify-content-start align-items-end">
              {/* Flechas de navegación */}
              <Row className="mb-3 w-100">
                <Col className="d-flex justify-content-center align-items-center">
                  <Button 
                    variant="primary" 
                    onClick={handlePreviousItem} 
                    disabled={isLoading} // Deshabilitar mientras se cargan los registros
                  >
                      Anterior
                  </Button>
                  <span className="mx-3">
                    {currentIndex} / {tableDomicilioData.length} {/* Mostrar desde 0 a n */}
                  </span>
                  <Button 
                    variant="primary" 
                    onClick={handleNextItem} 
                    disabled={isLoading} // Deshabilitar mientras se cargan los registros
                  >
                    Siguiente 
                  </Button>
                </Col>
              </Row>
              {/* Formulario */}
              <Row className="mb-3 w-100">
                <Col>
                  <Form.Group>
                    <Form.Label>C.Postal</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.codigoPostal || ""}
                      maxLength={5} // Limitar a 5 caracteres
                      onChange={handlePostalCodeChange}
                      placeholder="Ingrese Código Postal"
                      disabled={isFormDisabled} // Deshabilitar si isFormDisabled es true
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Nú. Exterior</Form.Label>
                    <Form.Control
                      maxLength={8}
                      type="text"
                      value={formData.numExt}
                      onChange={(e) =>
                        setFormData({ ...formData, numExt: e.target.value }) // Permitir espacios
                      }
                      disabled={isFormDisabled} // Deshabilitar si isFormDisabled es true
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Nú. Interior</Form.Label>
                    <Form.Control
                      maxLength={8}
                      type="text"
                      as="input"
                      value={formData.numInt}
                      onChange={(e) =>
                        setFormData({ ...formData, numInt: e.target.value }) // Permitir espacios
                      }
                      disabled={isFormDisabled} // Deshabilitar si isFormDisabled es true
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3 w-100">
                <Col>
                  <Form.Group>
                    <Form.Label>Calle</Form.Label>
                    <Form.Control
                      type="text"
                      as="input"
                      value={formData.calle}
                      onChange={(e) =>
                        setFormData({ ...formData, calle: e.target.value }) // Permitir espacios
                      }
                      disabled={isFormDisabled} // Deshabilitar si isFormDisabled es true
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3 w-100">
                <Col>
                  <Form.Group>
                    <Form.Label>Colonia / Localidad</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.colonia}
                      onChange={(e) =>
                        setFormData({ ...formData, colonia: e.target.value }) // Permitir espacios
                      }
                      disabled={isFormDisabled} // Deshabilitar si isFormDisabled es true
                    />
                  </Form.Group>
                  
                  <Form.Group>
                    <Form.Label>Estado</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.estado}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        if (/^[a-zA-Z\s]*$/.test(inputValue)) { // Permitir solo letras y espacios
                          setFormData({ ...formData, estado: inputValue });
                        }
                      }}
                      disabled={isFormDisabled} // Deshabilitar si isFormDisabled es true
                    />
                  </Form.Group>
                </Col>
            
              </Row>
              <Row className="mb-3 w-100">
                <Col>
                  <Form.Group>
                    <Form.Label>Delegación / Municipio</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.municipio}
                      onChange={(e) =>
                        setFormData({ ...formData, municipio: e.target.value }) // Permitir espacios
                      }
                      disabled={isFormDisabled} // Deshabilitar si isFormDisabled es true
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3 w-100">
                <Col>
                  <Form.Group>
                    <Form.Label>Origen</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.origen}
                      disabled
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Fecha</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData?.Fecha || ""}
                      disabled
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="clase">
                    <Form.Label>Clase</Form.Label>
                    <Form.Select
                      value={clase}
                      onChange={(e) => setClase(e.target.value)}
                      disabled={isFormDisabled} // Deshabilitar si isFormDisabled es true
                    >
                      <option value="">Selecciona una Clase</option>
                      <option value="1505">Hogar</option>
                      <option value="1509">Tercero</option>
                      <option value="1508">Familiar</option>
                      <option value="1501">Empresa</option>
                      <option value="1506">Oficina</option>
                      <option value="1519">Baja</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-3 w-100">
                <Col>
                  <Form.Group>
                    <Form.Label>Información Actual</Form.Label>
                    <Form.Control
                      type="text"
                      value={
                        idInformacion === "1904"
                          ? "Errónea"
                          : idInformacion === "1902"
                          ? "Incompleta"
                          : idInformacion === "1903"
                          ? "No corresponde"
                          : idInformacion === "1905"
                          ? "Inexistente"
                          : idInformacion === "1906"
                          ? "Correcta"
                          : idInformacion || "Sin información" // Mantén la lógica actual si no coincide con las nuevas condiciones
                      }
                      disabled
                      placeholder="Sin información"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mt-4 w-100">
                <Col className="d-flex justify-content-start">
                  <Button
                    variant="success"
                    onClick={handleSubmitAddressInformation} // Llamar a la función para actualizar
                    disabled={isIdentifyButtonDisabled} // Deshabilitar si el botón está desactivado
                  >
                    Identificar
                  </Button>
                </Col>
                <Col className="d-flex justify-content-center">
                  <Form.Group controlId="idInformacion">
                    <Form.Select
                      value={idInformacion}
                      onChange={(e) => setIdInformacion(e.target.value)}
                      disabled={!isEstadoVisible} // Deshabilitar si el dropdown no está visible
                    >
                      <option value="">Seleccione una Información</option>
                      <option value="1904">Errónea</option>
                      <option value="1902">Incompleta</option>
                      <option value="1903">No corresponde</option>
                      <option value="1905">Inexistente</option>
                      <option value="1906">Correcta</option>
                      {/* Agregar más opciones según sea necesario */}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col className="d-flex justify-content-end">
                  <Button
                    variant="primary"
                    onClick={handleSaveNewAddress}
                    disabled={isFormDisabled} // Deshabilitar si isFormDisabled es true
                  >
                    Nuevo
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
          {/* Tabla MergeTable */}
          <h4>Tablas Adicionales</h4>
          <MergeTable onRowSelect={handleRowSelectFromMergeTable} />
          {/* Fin de MergeTable */}
          {/*TableVisits.jsx*/}
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
                  top: 0,
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
                {tableDomData.map((item, index) => (
                  <tr key={index} onClick={() => handleRowClick(item)}>
                    <td>{renderCell(formatearFecha(item.Fecha))}</td>
                    <td>{renderCell(item.Hora)}</td>
                    <td>{renderCell(item.idContacto)}</td>
                    <td>{renderCell(item.idSituación)}</td>
                    <td>{renderCell(item.idCausaNoPago)}</td>
                    <td>{renderCell(item.NombreContacto)}</td>
                    <td>{renderCell(item.idParentesco)}</td>
                    <td>{renderCell(item.idSucursal)}</td>
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
                ))}
              </tbody>
            </Table>
          </div>
          <Row>
            <div>
              <strong>Comentario: </strong>
              {selectedGestion && selectedGestion.Comentario
                ? renderCell(selectedGestion.Comentario)
                : "Seleccione una gestión para ver el comentario"}
            </div>
          </Row>
          {/*TableVisits.jsx */}
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default Addresses;