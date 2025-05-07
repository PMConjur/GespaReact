import { useState, useEffect, useContext, useRef } from "react";
import { Modal, Button, Form, Table, Card, Row, Col } from "react-bootstrap";
import "../scss/styles.scss";
import {
  fetchCalFirtsPart,
  fetchCalSecondPart,
  fetchCalSecondPartModify,
  fetchSaveDeleteDeadlines,
  fetchSaveNegotiationDeadlines,
  fetchIncreasesNegotiation,
  fetchSaveOffering,
  fetchValidateNegotiationOffer
} from "../services/gespawebServices";
import { AppContext } from "../pages/Managment";
import { toast } from "sonner";
import Validators from "./fragments/Validators"; 

const CalculatorSimulator = ({ show, handleClose, showCloseButton }) => {
  const { searchResults, idEjecutivo, isManagment, setNegotiationActive } =
    useContext(AppContext);
  useEffect(() => {
    console.log("Contenido de isManagment:", isManagment);
  }, [isManagment]); // Se ejecutará cada vez que isManagment cambie

  const [tableData, setTableData] = useState([]);
  const [summaryData, setSummaryData] = useState({
    montoRequerido: 0,
    montoDescuento: 0,
    saldo: 0,
    fechaCorte: "",
    descuento: 0
  });
  const [herramientas, setHerramientas] = useState([]); // Estado para almacenar las herramientas
  const [selectedHerramienta, setSelectedHerramienta] = useState(136); // Estado para almacenar el idHerramienta seleccionado
  const [calculosData, setCalculosData] = useState({
    plazos: 0,
    primerPago: 0,
    saldo: 0,
    montoNegociado: 0,
    descuento: 0,
    calculos: [],
    tasaMensual: 0, // Agregar tasa mensual al estado
    maxDescuento: 0, 
  });
  const [formValues, setFormValues] = useState({
    montoNegociado: "",
    descuento: ""
  });
  const [formInputs, setFormInputs] = useState({
    meses: "",
    fechaPago: "",
    periodos: 1
  });
  const [isCalculateButtonEnabled, setIsCalculateButtonEnabled] =
    useState(false);
  const [isAddButtonEnabled, setIsAddButtonEnabled] = useState(false);
  const [montoPago, setMontoPago] = useState(""); // Estado para almacenar el valor de "Monto Pago"
  const [montoNegociado, setMontoNegociado] = useState(""); // Estado para almacenar el valor de "Monto Negociado"
  const [tablaPagos, setTablaPagos] = useState([]); // Estado para almacenar los datos de la tabla
  const [areFieldsEnabled, setAreFieldsEnabled] = useState(false); // Estado para habilitar/deshabilitar los campos
  const [modifyForm, setModifyForm] = useState({
    modificar: false,
    montoMod: "",
    fechaPagoMod: "",
    agregarPagos: false,
    filaMod: null
  });
  const [selectedRow, setSelectedRow] = useState(null); // Estado para almacenar la fila seleccionada
  const [showDetails, setShowDetails] = useState(false); // Estado para controlar la visibilidad del Row
  const [showCalculator, setShowCalculator] = useState(false); // Estado para controlar la visibilidad del Col
  const [showValidators, setShowValidators] = useState(false); // Estado para controlar el modal
  const [isValidated, setIsValidated] = useState(false); // Estado para controlar la validación
  const [idEjecutivoValidador, setIdEjecutivoValidador] = useState(0); // Estado para almacenar el idEjecutivoValidador
  const [validatorPassword, setValidatorPassword] = useState(""); // Estado para almacenar la contraseña del validador
  const [cartaConvenio, setCartaConvenio] = useState(0); // Estado para almacenar el valor del checkbox
  const [selectedEmail, setSelectedEmail] = useState(""); // Estado para almacenar el correo seleccionado
  const [duracion, setDuracion] = useState(""); // Estado para almacenar el valor de duración
  const [isSaveDeadlinesClicked, setIsSaveDeadlinesClicked] = useState(false); // Nuevo estado para controlar la visibilidad de los botones
  const [isNegotiationSaved, setIsNegotiationSaved] = useState(false); // Nuevo estado para controlar la visibilidad del botón "Finalizar"
  const [validationMessage, setValidationMessage] = useState("");
  const calculatorRef = useRef(null); // Referencia para la sección de la calculadora
  const detailsRef = useRef(null); // Referencia para la sección de "Resumen y Plazos"
  const [isSelectDisabled, setIsSelectDisabled] = useState(false); // Estado para habilitar/deshabilitar el select de herramientas
  const [isSelectDisabled2, setIsSelectDisabled2] = useState(false); // Estado para habilitar/deshabilitar el select de herramientas
  const [isSelectDisabled3, setIsSelectDisabled3] = useState(false); // Estado para habilitar/deshabilitar el select de herramientas

  useEffect(() => {
    if (showCalculator && calculatorRef.current) {
      calculatorRef.current.scrollIntoView({ behavior: "smooth" }); // Scroll automático para la calculadora
    }
  }, [showCalculator]);

  useEffect(() => {
    if (showDetails && detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: "smooth" }); // Scroll automático para "Resumen y Plazos"
    }
  }, [showDetails]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormInputs((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const idCartera = 1;
        const idCuenta = searchResults?.[0]?.idCuenta?.trim();
        
        if (!idCuenta) return;
  
        const data = await fetchCalFirtsPart(idCartera, idCuenta, selectedHerramienta);
  
        if (data) {
          setValidationMessage(data.mensaje || "");
          setTableData(Array.isArray(data.ofrecimientos) ? data.ofrecimientos : []);
          
          if (Array.isArray(data.herramientas)) {
            setHerramientas(data.herramientas);
            // Si es la primera carga, seleccionar la primera herramienta por defecto
            if (data.herramientas.length > 0 && !selectedHerramienta) {
              setSelectedHerramienta(data.herramientas[0].idHerramienta);
            }
          }
  
          const newSummary = {
            montoRequerido: data.montoRequerido || 0,
            montoDescuento: data.montoDescuento || 0,
            saldo: data.saldo || 0,
            fechaCorte: data.fechaCorte || "",
            descuento: data.descuento || 0,
            dias1erpago: data.dias1erpago || 0
          };
          
          setSummaryData(newSummary);
        }
      } catch (error) {
        console.error("Error fetching calculator data:", error);
      }
    };
  
    if (searchResults?.length > 0) {
      fetchData();
    }
  }, [searchResults, selectedHerramienta, show]);

  useEffect(() => {
    // Solo actualizar formValues si los valores son diferentes
    if (summaryData.montoRequerido !== parseFloat(formValues.montoRequerido || 0) ||
        summaryData.descuento !== parseFloat(formValues.descuento || 0)) {
      setFormValues({
        montoRequerido: summaryData.montoRequerido?.toFixed(2) || "0",
        descuento: summaryData.descuento?.toFixed(2) || "0"
      });
    }
  }, [summaryData]);

  const handleHerramientaChange = async (e) => {
    const selectedValue = e.target.value;
    const herramientaSeleccionada = herramientas.find(
      h => h.idHerramienta === Number(selectedValue)
    );
  
    // Resetear estados primero
    setMontoPago("");
    setMontoNegociado("");
    setFormInputs({
      meses: "",
      fechaPago: "",
      periodos: 1
    });
    setShowDetails(false);
    setCalculosData({
      plazos: 0,
      primerPago: 0,
      saldo: 0,
      montoNegociado: 0,
      descuento: 0,
      calculos: [],
      tasaMensual: 0
    });
  
    // Actualizar la herramienta seleccionada
    setSelectedHerramienta(Number(selectedValue));
  
    // Esperar un ciclo de renderizado
    await new Promise(resolve => setTimeout(resolve, 0));
  
    // Actualizar formValues basado en summaryData actualizado
    setFormValues({
      montoRequerido: summaryData.montoRequerido?.toFixed(2) || "0",
      descuento: summaryData.descuento?.toFixed(2) || "0"
    });
  
    // Determinar qué secciones mostrar
    const isHerramientaCalculo = ["Convenio", "PIF", "PPA", "APR", "PPA+AC"].includes(herramientaSeleccionada?.nombre);
    const isHerramientaAcuerdo = ["Parcial", "Ajuste"].includes(herramientaSeleccionada?.nombre);
  
    setIsCalculateButtonEnabled(isHerramientaCalculo);
    setIsAddButtonEnabled(isHerramientaAcuerdo);
    setAreFieldsEnabled(isHerramientaAcuerdo);
    setShowCalculator(isHerramientaCalculo);
  };

  const handleMontoPagoChange = (e) => {
    const value = e.target.value;
    setMontoPago(value); // Actualiza el estado de "Monto Pago"
    setMontoNegociado(value); // Actualiza el estado de "Monto Negociado" con el mismo valor
  };

  const handleCalculateSecondPart = async () => {
    const idCuenta = searchResults?.[0]?.idCuenta?.trim();
    try {
      // Validar los datos antes de enviarlos
      if (
        !selectedHerramienta ||
        !idCuenta ||
        !formValues.montoRequerido ||
        !formValues.descuento ||
        !formInputs.fechaPago
      ) {
        console.error(
          "Datos incompletos. Verifica los campos antes de enviar."
        );
        toast.error("Por favor, completa todos los campos requeridos.");
        return;
      }

      const requestData = {
        idHerramienta: selectedHerramienta,
        noCuenta: idCuenta,
        idCartera: 1,
        montoRequerido: parseFloat(formValues.montoRequerido) || 0,
        descuento: parseFloat(formValues.descuento) || 0,
        iMeses: parseInt(formInputs.meses, 10) || 0,
        fechaPago: formInputs.fechaPago || "",
        periodos: parseInt(formInputs.periodos, 10) || 1,
        plazos: []
      };

      console.log(
        "Datos enviados al endpoint fetchCalSecondPart:",
        requestData
      );

      const response = await fetchCalSecondPart(requestData);

      console.log("Respuesta del endpoint fetchCalSecondPart:", response);
      toast.success("Cálculo realizado correctamente.");
      setCalculosData({
        plazos: response.plazos,
        primerPago: response.pago,
        saldo: response.montoRequerido,
        montoNegociado: response.montoNegociado,
        descuento: response.descuento,
        calculos: response.calculos,
        tasaMensual: response.tasaMensual,
        montoDescuento: response.montoDescuento, // Agregar montoDescuento al estado
        maxDescuento: response.maxDescuento // Agregar maxDescuento al estado
      });

      setShowDetails(true); // Muestra el contenido del Row
    } catch (error) {
      console.error(
        "Error al enviar los datos al endpoint fetchCalSecondPart:",
        error
      );
      const errorMessage =
        error.response?.data?.errors ||
        "Error desconocido al realizar el cálculo.";
      toast.error(errorMessage);
    }
  };

  const handleSetFormValues = () => {
    setFormValues({
      montoRequerido: summaryData.montoRequerido
        ? summaryData.montoRequerido.toFixed(2)
        : 0,
      descuento: summaryData.descuento ? summaryData.descuento.toFixed(2) : 0
    });
    setShowCalculator(true); // Muestra el contenido del Col
  };

  const handleAgregarPago = () => {
    if (montoNegociado && formInputs.fechaPago) {
      const nuevoPago = {
        fecha: formInputs.fechaPago,
        hora: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true
        }), // Agrega hora y minutos en formato 12 horas
        pago: montoNegociado
      };
      setTablaPagos((prev) => [...prev, nuevoPago]); // Agrega el nuevo pago a la tabla
      setIsAddButtonEnabled(false); // Inhabilita el botón después de agregar un pago
    }
  };

  const handleEliminarPago = (index) => {
    setTablaPagos((prev) => prev.filter((_, i) => i !== index)); // Elimina el registro por índice
    setIsAddButtonEnabled(true); // Habilita el botón "Agregar" después de eliminar un pago
  };

  const handleModifyFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setModifyForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleModifyPayment = async () => {
    const idCuenta = searchResults?.[0]?.idCuenta?.trim();
    try {
      // Validar los datos antes de enviarlos
      if (
        !selectedHerramienta ||
        !idCuenta ||
        !modifyForm.montoMod ||
        !modifyForm.fechaPagoMod
      ) {
        console.error(
          "Datos incompletos. Verifica los campos antes de enviar."
        );
        toast.error("Por favor, completa todos los campos requeridos.");
        return;
      }
  
      // Mapear los datos de la tabla al formato requerido por el endpoint
      const plazos = calculosData.calculos.map((calculo) => ({
        no: calculo.no,
        fecha: new Date(calculo.fecha).toISOString(), // Convertir a formato ISO
        saldo: calculo.saldo || 0,
        pago: calculo.pago || 0,
        saldoFinal: calculo.saldoFinal || 0,
      }));
  
      const requestData = {
        idHerramienta: selectedHerramienta,
        noCuenta: idCuenta,
        idCartera: 1,
        montoRequerido: parseFloat(formValues.montoRequerido) || 0,
        descuento: parseFloat(formValues.descuento) || 0,
        iMeses: parseInt(formInputs.meses, 10) || 0,
        fechaPago: formInputs.fechaPago || "",
        periodos: parseInt(formInputs.periodos, 10) || 1, // Asigna el valor seleccionado en el select
        modificar: 1, // Siempre se envía 1 al hacer clic en el botón "Modificar"
        montoModificar: parseFloat(modifyForm.montoMod) || 0,
        fechaPagoModificar: modifyForm.fechaPagoMod,
        pagoInicial: modifyForm.agregarPagos ? 1 : 0, // 1 si el checkbox está marcado, 0 si no
        filaModificar: modifyForm.filaMod,
        plazos: plazos, // Agregar los plazos mapeados
      };
  
      console.log(
        "Datos enviados al endpoint fetchCalSecondPartModify:",
        requestData
      );
  
      const response = await fetchCalSecondPartModify(requestData);
  
      toast.success("Respuesta del endpoint al modificar", response);
  
      // Actualizar los datos en la tabla y el formulario
      setCalculosData({
        plazos: response.plazos,
        primerPago: response.pago,
        saldo: response.montoRequerido,
        montoNegociado: response.montoNegociado,
        descuento: response.descuento,
        calculos: response.calculos,
        tasaMensual: response.tasaMensual, // Agregar la tasa mensual al estado
      });
  
      toast.success("Datos enviados correctamente.");
    } catch (error) {
      console.error(
        "Error al enviar los datos al endpoint fetchCalSecondPartModify:",
        error
      );
    
      // Verifica si el error tiene una respuesta del servidor
      const errorMessage =
        error.response?.data || "Error desconocido al enviar los datos.";
    
      // Muestra el mensaje de error en el toast
      toast.warning(errorMessage);
    }
  };

  const validateNegotiationOffer = async () => {
    try {
      const idCuenta = searchResults?.[0]?.idCuenta?.trim();
  
      if (!idCuenta || !selectedHerramienta) {
        toast.error("Faltan datos para validar la oferta");
        return;
      }
  
      // Prepara el objeto con todos los campos requeridos
      const validationData = {
        plazos: calculosData.calculos.map((calculo) => ({
          monto: calculo.pago,
          fecha: calculo.fecha,
        })),
        montoNegociado: calculosData.montoNegociado || 0,
        montoRequerido: summaryData.montoRequerido || 0,
        saldo: summaryData.saldo || 0,
        descuento: summaryData.descuento || 0,
        maxDescuento: calculosData.maxDescuento || 0,
        idHerramienta: selectedHerramienta,
        idCuenta: idCuenta,
        idCartera: 1, // Asumiendo que siempre es 1 según tu código
      };
  
      console.log("Datos enviados para validación:", validationData);
  
      const result = await fetchValidateNegotiationOffer(validationData);
  
      if (result.mensaje === "No hay problema") {
        toast.success("Validación exitosa: No hay problema.");
        const saveSuccess = await handleSaveOffering2();
        return saveSuccess; // Llama a la función para guardar el ofrecimiento
      } else if (result.valido) {
        toast.success("Ofrecimiento válido.");
        const saveSuccess = await handleSaveOffering2();
        return saveSuccess; // Llama a la función para guardar el ofrecimiento
      } else {
        toast.warning(`${result.mensaje || "Ofrecimiento inválido."}`);
        return false;
      }
    } catch (error) {
      console.error("Error al validar oferta:", error);
      toast.error(error.response?.data?.message || "Error al validar ofrecer.");
      throw error;
    }
  };

  const handleRowClick = (index) => {
    setSelectedRow(index); // Actualiza el índice de la fila seleccionada
    setModifyForm((prev) => ({
      ...prev,
      filaMod: index // Actualiza filaMod con el índice seleccionado
    }));
  };

  const handleOpenValidators = () => {
    setShowValidators(true); // Abre el modal
    setIsValidated(false); // Reinicia el estado de validación
  };

  const handleCloseValidators = () => {
    setShowValidators(false); // Cierra el modal
  };

  const handleSaveDeadlines = async () => {
    const fechaInsert = isManagment?.storeOutput?.Fecha_Insert?.split("T")[0];
    const segundoInsert = isManagment?.storeOutput?.Segundo_Insert;
    if (!calculosData.calculos || calculosData.calculos.length === 0) {
      toast.error("No hay plazos disponibles para guardar.");
      return;
    }

    const plazos = calculosData.calculos.map((calculo) => ({
      monto: calculo.pago,
      fecha: calculo.fecha
    }));

    const requestData = {
      idCartera: 1,
      idCuenta: searchResults?.[0]?.idCuenta?.trim(),
      idHerramienta: selectedHerramienta,
      plazos,
      fechaInsert: fechaInsert,
      segundo_Insert: segundoInsert
    };

    try {
      console.log("Enviando datos al endpoint:", requestData);
      const response = await fetchSaveDeleteDeadlines(requestData);
      console.log("Respuesta del endpoint:", response);

      // Muestra el mensaje de la respuesta en el toast
      if (response?.mensaje) {
        toast.warning(`Respuesta de la solicitud: ${response.mensaje}`);
      } else {
        toast.success("Datos enviados.");
      }

      if (response?.mensaje) {
        const diasASumar = parseInt(response.mensaje, 10); // Convierte el mensaje a número
        const fechaPago = new Date(formInputs.fechaPago);
        fechaPago.setDate(fechaPago.getDate() + diasASumar); // Suma los días al valor de fechaPago
        const nuevaFechaFinNegociacion = fechaPago.toISOString().split("T")[0]; // Formatea la nueva fecha

        console.log(
          "Nueva fechaFinNegociacion calculada:",
          nuevaFechaFinNegociacion
        );

        // Actualiza el estado o usa la nueva fecha en el siguiente request
        setFormInputs((prev) => ({
          ...prev,
          fechaFinNegociacion: nuevaFechaFinNegociacion
        }));
      }

      toast.success("Datos enviados correctamente.");
      setIsSaveDeadlinesClicked(true); // Cambia el estado para alternar los botones
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      toast.error("Error al enviar los datos al endpoint.");
    }
  };

  const handleValidateSuccess = () => {
    setIsValidated(true); // Cambia el estado a validado
    setShowValidators(false); // Cierra el modal de validación
  };

  const handleSaveNegotiation = async () => {
    try {
      const idCuenta = searchResults?.[0]?.idCuenta?.trim();
      const fechaInsert = isManagment?.storeOutput?.Fecha_Insert?.split("T")[0];
      const segundoInsert = isManagment?.storeOutput?.Segundo_Insert;
      // Validar datos antes de enviarlos
      if (!idCuenta || !selectedHerramienta || !calculosData.montoNegociado) {
        toast.error("Faltan datos requeridos para guardar la negociación.");
        console.error("Datos faltantes:", {
          idCuenta,
          selectedHerramienta,
          montoNegociado: calculosData.montoNegociado
        });
        return;
      }

      const requestData = {
        idCartera: 1,
        idCuenta: idCuenta,
        idEjecutivo: idEjecutivo,
        idHerramienta: selectedHerramienta,
        montoNegociado: parseFloat(calculosData.montoNegociado),
        plazos: calculosData.plazos, // Asegura que plazos sea un número entero
        cartaConvenio: cartaConvenio, // Usa el valor del estado
        correo: selectedEmail || "", // Usa el correo seleccionado o vacío
        fechaPago: formInputs.fechaPago || "",
        fechaFinNegociacion: formInputs.fechaFinNegociacion, // Usa la nueva fecha calculada
        idEjecutivoValidador: parseInt(idEjecutivoValidador, 10), // Asegura que sea un número entero
        contrasena: validatorPassword || "", // Usa la contraseña del validador o vacío
        fechaInsert: fechaInsert,
        segundoInsert: segundoInsert,
        reestructura: 0,
        condonacion: 0,
        idGrabacion: "" // Cambiar si es necesario
      };

      console.log(
        "Datos enviados al endpoint fetchSaveNegotiationDeadlines:",
        requestData
      );

      const response = await fetchSaveNegotiationDeadlines(requestData);
      toast.success("Negociación guardada correctamente.");
      console.log(
        "Respuesta del endpoint fetchSaveNegotiationDeadlines:",
        response
      );

      // Extraer el campo duración de la respuesta y almacenarlo en el estado
      const duracionObtenida = response?.duración || "";
      console.log("Duración obtenida de la respuesta:", duracionObtenida);
      setDuracion(duracionObtenida); // Almacena la duración en el estado
      
      // Llamar a sendIncreaseNegotiation después de recibir la respuesta
      await sendIncreaseNegotiation();

    } catch (error) {
      console.error("Error al guardar la negociación:", error);
      toast.error("Error al guardar la negociación.");
    }
  };

  const handleValidate = (validator, password, cartaConvenioValue, email) => {
    console.log(
      "Validación exitosa con validador:",
      validator,
      "contraseña:",
      password,
      "cartaConvenio:",
      cartaConvenioValue,
      "correo:",
      email
    );
    setIdEjecutivoValidador(validator); // Almacena el idEjecutivo seleccionado
    setValidatorPassword(password); // Almacena la contraseña del validador
    setCartaConvenio(cartaConvenioValue); // Almacena el valor del checkbox
    setSelectedEmail(email || ""); // Almacena el correo seleccionado o "" si no hay correo
    setIsValidated(true); // Cambia el estado a validado
    setShowValidators(false); // Cierra el modal de validación
  };

  const sendIncreaseNegotiation = async () => {
    try {
      const increaseRequestData = {
        idEjecutivo: idEjecutivo,
        monto: parseFloat(calculosData.montoNegociado),
        saldo: summaryData.saldo,
        duracion: duracion
      };

      console.log(
        "Enviando datos al endpoint IncrementaNegociacion:",
        increaseRequestData
      );
      const increaseResponse = await fetchIncreasesNegotiation(
        increaseRequestData
      );

         // Manejar el estado 204 como una respuesta válida
    if (increaseResponse?.status === 204) {
      setNegotiationActive(false);
      setIsSelectDisabled(true); // Deshabilita el select de herramientas
      setIsSelectDisabled3(true); // Deshabilita boton calcular
      handleClose(false); // Cierra el modal solo si el status es 204
      toast.success("Negociación incrementada correctamente.");
    } else if (increaseResponse?.status === 200) {
      toast.success("Negociación incrementada correctamente.");
    } else {
      toast.warning("La respuesta del servidor no fue la esperada.");
    }
      console.log(
        "Respuesta del endpoint IncrementaNegociacion:",
        increaseResponse
      );
      return increaseResponse;
    } catch (error) {
      console.error("Error al enviar los datos:", error);
      toast.error("Error al procesar la negociación.");
      throw error;
    }
  };



  const handleSaveOffering = async () => {
    try {
      const idCuenta = searchResults?.[0]?.idCuenta?.trim();
      const fechaInsert = isManagment?.storeOutput?.Fecha_Insert?.split("T")[0];
      const segundoInsert = isManagment?.storeOutput?.Segundo_Insert;
      const producto = 1;

      if (!idCuenta || !selectedHerramienta || !montoNegociado) {
        console.log("Datos faltantes:", {
          idCuenta,
          selectedHerramienta,
          montoNegociado: calculosData.montoNegociado
        });
        return;
      }

      const requestData = {
        idCartera: 1,
        idCuenta: idCuenta,
        idProducto: producto,
        idEjecutivo: idEjecutivo,
        idHerramienta: selectedHerramienta,
        montoRequerido: summaryData.montoRequerido,
        montoNegociado: parseFloat(montoNegociado),
        descuento: summaryData.montoDescuento,
        saldo: summaryData.saldo,
        plazos: tablaPagos.map((pago) => ({
          monto: parseFloat(pago.pago),
          fecha: new Date(pago.fecha).toISOString().split("T")[0]
        })),
        dias1erPago: summaryData.dias1erpago,
        fechaCorte: (() => {
          const [datePart] = summaryData.fechaCorte.split(" ");
          const [day, month, year] = datePart.split("/");
          return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
        })(),
        fechaInsert: fechaInsert,
        segundoInsert: segundoInsert,
        cartaConvenio: cartaConvenio,
        correo: selectedEmail || "",
        idEjecutivoValidador: parseInt(idEjecutivoValidador, 10)
      };

      console.log("Datos enviados al endpoint fetchSaveOffering:", requestData);

      const response = await fetchSaveOffering(requestData);
      toast.success("Ofrecimiento guardado correctamente.");
      console.log("Respuesta del endpoint fetchSaveOffering:", response);
      
      setShowValidators(true);
      setIsSelectDisabled(true); // Deshabilita el select de herramientas
      setIsSelectDisabled2(true); // Deshabilita boton eliminar
      if (typeof fetchData === "function") {
        const idCartera = 1;
        await fetchData(idCartera, idCuenta, selectedHerramienta);
      } else {
        console.warn(
          "fetchData no está definida. No se actualizarán los datos del modal."
        );
      }
      return true;
    } catch (error) {
      console.error("Error al guardar el ofrecimiento:", error);
      toast.error("Error al guardar el ofrecimiento.");
      return false;
    }
  };

  const handleSaveOffering2 = async () => {
    try {
      const idCuenta = searchResults?.[0]?.idCuenta?.trim();
      const fechaInsert = isManagment?.storeOutput?.Fecha_Insert?.split("T")[0];
      const segundoInsert = isManagment?.storeOutput?.Segundo_Insert;
      const producto = 1;

      if (!idCuenta || !selectedHerramienta || !calculosData.montoNegociado) {
        console.log("Datos faltantes:", {
          idCuenta,
          selectedHerramienta,
          montoNegociado: calculosData.montoNegociado
        });
        return;
      }

      const requestData = {
        idCartera: 1,
        idCuenta: idCuenta,
        idProducto: producto,
        idEjecutivo: idEjecutivo,
        idHerramienta: selectedHerramienta,
        montoRequerido: summaryData.montoRequerido,
        montoNegociado: calculosData.montoNegociado,
        descuento: summaryData.montoDescuento,
        saldo: summaryData.saldo,
        plazos: calculosData.calculos.map(calculo => ({
          monto: calculo.pago,
          fecha: new Date(calculo.fecha).toISOString().split("T")[0]
        })),
        dias1erPago: summaryData.dias1erpago,
        fechaCorte: (() => {
          const [datePart] = summaryData.fechaCorte.split(" ");
          const [day, month, year] = datePart.split("/");
          return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
        })(),
        fechaInsert: fechaInsert,
        segundoInsert: segundoInsert,
        cartaConvenio: cartaConvenio,
        correo: selectedEmail || "",
        idEjecutivoValidador: parseInt(idEjecutivoValidador, 10)
      };

      console.log("Datos enviados al endpoint fetchSaveOffering:", requestData);

      const response = await fetchSaveOffering(requestData);
      toast.success("Ofrecimiento guardado correctamente.");
      console.log("Respuesta del endpoint fetchSaveOffering:", response);
      
      setShowValidators(true);
      setIsSelectDisabled(true); // Deshabilita el select de herramientas
      setIsSelectDisabled3(true); // Deshabilita boton calcular

      if (typeof fetchData === "function") {
        const idCartera = 1;
        await fetchData(idCartera, idCuenta, selectedHerramienta);
      } else {
        console.warn(
          "fetchData no está definida. No se actualizarán los datos del modal."
        );
      }
    } catch (error) {
      console.error("Error al guardar el ofrecimiento:", error);
      toast.error("Error al guardar el ofrecimiento.");
      return false;
    }
  };

  const handleSaveNegotiation2 = async () => {
    try {
      const idCuenta = searchResults?.[0]?.idCuenta?.trim();
      const fechaInsert = isManagment?.storeOutput?.Fecha_Insert?.split("T")[0];
      const segundoInsert = isManagment?.storeOutput?.Segundo_Insert;
      // Validar datos antes de enviarlos
      if (!idCuenta || !selectedHerramienta || !montoPago) {
        toast.error("Faltan datos requeridos para guardar la negociación.");
        console.error("Datos faltantes:", {
          idCuenta,
          selectedHerramienta,
          montoNegociado: calculosData.montoNegociado
        });
        return;
      }

      const requestData = {
        idCartera: 1,
        idCuenta: idCuenta,
        idEjecutivo: idEjecutivo,
        idHerramienta: selectedHerramienta,
        montoNegociado: parseFloat(montoPago),
        plazos: 1, // Asegura que plazos sea un número entero
        cartaConvenio: cartaConvenio, // Usa el valor del estado
        correo: selectedEmail || "", // Usa el correo seleccionado o vacío
        fechaPago: formInputs.fechaPago || "",
        fechaFinNegociacion: formInputs.fechaFinNegociacion || formInputs.fechaPago, // Usa la nueva fecha calculada
        idEjecutivoValidador: parseInt(idEjecutivoValidador, 10), // Asegura que sea un número entero
        contrasena: validatorPassword || "", // Usa la contraseña del validador o vacío
        fechaInsert: fechaInsert,
        segundoInsert: segundoInsert,
        reestructura: 0,
        condonacion: 0,
        idGrabacion: "" // Cambiar si es necesario
      };

      console.log(
        "Datos enviados al endpoint fetchSaveNegotiationDeadlines:",
        requestData
      );

      const response = await fetchSaveNegotiationDeadlines(requestData);
      toast.success("Negociación guardada correctamente.");
      console.log(
        "Respuesta del endpoint fetchSaveNegotiationDeadlines:",
        response
      );

      // Extraer el campo duración de la respuesta y almacenarlo en el estado
      const duracionObtenida = response?.duración || "";
      console.log("Duración obtenida de la respuesta:", duracionObtenida);
      setDuracion(duracionObtenida); // Almacena la duración en el estado
      setIsSelectDisabled(true); // Deshabilita el select de herramientas
      setIsSelectDisabled2(true); // Deshabilita boton eliminar
      setNegotiationActive(false);
      handleClose(false); // Cierra el modal solo si el status es 204
    } catch (error) {
      console.error("Error al guardar la negociación:", error);
      toast.error("Error al guardar la negociación.");
    }
  };

  const resetStates = () => {
    setTableData([]);
    setSummaryData({
      montoRequerido: 0,
      montoDescuento: 0,
      saldo: 0,
      fechaCorte: "",
      descuento: 0,
    });
    setHerramientas([]);
    setSelectedHerramienta(136);
    setCalculosData({
      plazos: 0,
      primerPago: 0,
      saldo: 0,
      montoNegociado: 0,
      descuento: 0,
      calculos: [],
      tasaMensual: 0,
    });
    setFormValues({
      montoNegociado: "",
      descuento: "",
    });
    setFormInputs({
      meses: "",
      fechaPago: "",
      periodos: 1,
    });
    setIsCalculateButtonEnabled(false);
    setIsAddButtonEnabled(false);
    setMontoPago("");
    setMontoNegociado("");
    setTablaPagos([]);
    setAreFieldsEnabled(false);
    setModifyForm({
      modificar: false,
      montoMod: "",
      fechaPagoMod: "",
      agregarPagos: false,
      filaMod: null,
    });
    setSelectedRow(null);
    setShowDetails(false);
    setShowCalculator(false);
    setShowValidators(false);
    setIsValidated(false);
    setIdEjecutivoValidador(0);
    setValidatorPassword("");
    setCartaConvenio(0);
    setSelectedEmail("");
    setDuracion("");
    setIsSaveDeadlinesClicked(false);
    setIsNegotiationSaved(false);
    setValidationMessage("");
    setIsSelectDisabled(false);
    setIsSelectDisabled2(false);
    setIsSelectDisabled3(false);
  };
  
  useEffect(() => {
    if (!show) {
      resetStates(); // Reinicia los estados cuando el modal se cierra
    }
  }, [show]);

  return (
    <>
      <Modal
        key={show ? "modal-open" : "modal-closed"}
        show={show}
        onHide={() => {
          resetStates(); // Reinicia todos los estados
          handleClose(); // Llama a la función para cerrar el modal
        }}
        size="xl"
        backdrop="static"
      >
        <Modal.Header closeButton={showCloseButton}>
          <Modal.Title style={{ color: "#0dcaf0" }} className="ms-3">
            Calculadora
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            maxHeight: "80vh", // Limitar la altura máxima del cuerpo del modal
            overflowY: "auto", // Habilitar scroll vertical
            position: "relative", // Necesario para posicionar el indicador
            marginBottom: "1rem",
          }}
        >
          <Col>
            {/* Ofrecimientos */}
            <Col sm={12}>
              <h5 style={{ color: " #20c997" }} className="text-center">
                Ofrecimientos
              </h5>
              <Row className="table-responsive d-block">
                <Col>
                  <div
                    className="custom-scrollbar me-auto ms-2"
                    style={{
                      maxHeight: "350px",
                      maxWidth: "100vw",
                      overflow: "auto",
                      position: "relative", // Necesario para el scroll del tbody
                    }}
                  >
                    <Table
                      striped
                      bordered
                      hover
                      variant="dark"
                      style={{ marginBottom: "0" }}
                    >
                      <thead
                        style={{
                          position: "sticky",
                          top: "0",
                          backgroundColor: "#343a40", // Color de fondo para que coincida con el tema oscuro
                          zIndex: "1",
                        }}
                      >
                        <tr>
                          <th style={{ textAlign: "center" }}>Fecha-Hora</th>
                          <th style={{ textAlign: "center" }}>Herramienta</th>
                          <th style={{ textAlign: "center" }}>Status</th>
                          <th style={{ textAlign: "center" }}>Vencimiento</th>
                          <th style={{ textAlign: "center" }}>Saldo</th>
                          <th style={{ textAlign: "center" }}>Descuento</th>
                          <th style={{ textAlign: "center" }}>Requerido</th>
                          <th style={{ textAlign: "center" }}>Negociado</th>
                          <th style={{ textAlign: "center" }}>Pagado</th>
                          <th style={{ textAlign: "center" }}>plazos</th>
                          <th style={{ textAlign: "center" }}>Ofreció</th>
                          <th style={{ textAlign: "center" }}>Validó</th>
                          <th style={{ textAlign: "center" }}>
                            carta-Convenio
                          </th>
                          <th style={{ textAlign: "center" }}>Saldo-Interés</th>
                          <th style={{ textAlign: "center" }}>Remanente</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(tableData) && tableData.length > 0 ? (
                          tableData.map((row, index) => {
                            const fechaSinHora =
                              row.fecha_Insert?.split(" ")[0] || "--"; // Muestra "--" si no hay valor
                            const fechaConHora = row.fecha_Insert
                              ? `${fechaSinHora} - ${
                                  row.segundo_Insert || "--"
                                }`
                              : "--"; // Combina fecha y hora o muestra "--"
                            return (
                              <tr key={index}>
                                <td style={{ textAlign: "left" }}>
                                  {fechaConHora}
                                </td>
                                <td style={{ textAlign: "left" }}>
                                  {row.herramienta || "--"}
                                </td>
                                {/* Muestra "--" si no hay valor */}
                                <td style={{ textAlign: "left" }}>
                                  {row.idEstado || "--"}
                                </td>
                                {/* Muestra "--" si no hay valor */}
                                <td style={{ textAlign: "left" }}>
                                  {row.vencimiento || "--"}
                                </td>
                                {/* Muestra "--" si no hay valor */}
                                <td style={{ textAlign: "left" }}>
                                  {row.saldoInterés !== undefined
                                    ? `$${parseFloat(row.saldoInterés).toFixed(
                                        2
                                      )}`
                                    : 0}
                                  {/* Muestra "0.00" si no hay valor */}
                                </td>
                                <td style={{ textAlign: "left" }}>
                                  {row.descuento || "--"} %
                                </td>
                                <td style={{ textAlign: "left" }}>
                                  {row.requerido !== undefined
                                    ? `$${parseFloat(row.requerido).toFixed(2)}`
                                    : 0}
                                </td>
                                <td style={{ textAlign: "left" }}>
                                  {row.negociado !== undefined
                                    ? `$${parseFloat(row.negociado).toFixed(2)}`
                                    : 0}
                                </td>
                                <td style={{ textAlign: "left" }}>
                                  {row.pagado || "--"}
                                </td>
                                <td style={{ textAlign: "left" }}>
                                  {row.plazos || "--"}
                                </td>
                                <td style={{ textAlign: "left" }}>
                                  {row.ofrecio || "--"}
                                </td>
                                <td style={{ textAlign: "left" }}>
                                  {row.valido || "--"}
                                </td>
                                <td style={{ textAlign: "left" }}>
                                  {row.cartaConvenio === true
                                    ? "✓"
                                    : row.cartaConvenio === false
                                    ? "X"
                                    : "--"}
                                </td>
                                <td style={{ textAlign: "left" }}>
                                  {row.interes !== undefined
                                    ? `$${parseFloat(row.interes).toFixed(2)}`
                                    : 0}
                                </td>
                                <td style={{ textAlign: "left" }}>
                                  {row.remanente || "--"}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="15" className="text-start ps-3">
                              {tableData.length === 0 ? (
                                "No hay datos disponibles"
                              ) : (
                                <div className="d-flex justify-content-center align-items-center">
                                  <div
                                    className="spinner-border text-primary"
                                    role="status"
                                  >
                                    <span className="visually-hidden">
                                      Cargando Datos...
                                    </span>
                                  </div>
                                </div>
                              )}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                </Col>
              </Row>
              {validationMessage && (
                <h5
                  className="ms-2 mt-4 text-center"
                  style={{ color: "#dc3545" }}
                >
                  {validationMessage}
                </h5>
              )}
              <Col className="mt-5">
                <Card className="rounded-lg mb-0">
                  <Card.Body className="d-flex p-0 pb-1 w-100">
                    <Form
                      className="d-flex w-100 gap-5"
                      style={{ alignItems: "center" }}
                    >
                      <Col>
                        <Form.Group className="mb-3">
                          <Form.Select
                            onChange={(e) => {
                              handleHerramientaChange(e); // Maneja el cambio de herramienta
                              handleSetFormValues(); // Llama a handleSetFormValues al seleccionar una herramienta
                            }}
                            disabled={isSelectDisabled} // Deshabilita el select si es necesario
                          >
                            <option value="">Seleccionar Herramienta</option>
                            {herramientas.map((herramienta) => (
                              <option
                                key={herramienta.idHerramienta}
                                value={herramienta.idHerramienta}
                              >
                                {herramienta.nombre}
                              </option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                        {/* Elimina el botón */}
                      </Col>
                      <Col>
                        <div className="d-flex">
                          <div className="ps-3">
                            <span className="text-light small pt-1 fw-bold">
                              Monto Requerido
                            </span>
                            <h5
                              style={{ color: "#ffc400" }}
                              className="warning-modal-money"
                            >
                              $
                              {summaryData.montoRequerido
                                ? summaryData.montoRequerido.toFixed(2)
                                : 0}
                            </h5>
                          </div>
                          <div className="ps-3">
                            <span className="text-light small pt-1 fw-bold">
                              45% Desc
                            </span>
                            <h5
                              style={{ color: "#07fb70" }}
                              className="success-modal-money"
                            >
                              $
                              {summaryData.montoDescuento
                                ? summaryData.montoDescuento.toFixed(2)
                                : 0}
                            </h5>
                          </div>
                          <div className="ps-3">
                            <span className="text-light small pt-1 fw-bold">
                              Saldo
                            </span>
                            <h5
                              style={{ color: "#4a9dff" }}
                              className="info-modal-money"
                            >
                              $
                              {summaryData.saldo
                                ? summaryData.saldo.toFixed(2)
                                : 0}
                            </h5>
                          </div>
                          <div className="ps-3">
                            <span className="text-light small pt-1 fw-bold">
                              Corte
                            </span>
                            <h5 className="text-light light-modal-money">
                              {summaryData.fechaCorte
                                ? summaryData.fechaCorte.split(" ")[0]
                                : "--"}
                              {/* Muestra solo la fecha */}
                            </h5>
                          </div>
                        </div>
                      </Col>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
            </Col>
            <Col className="">
              {selectedHerramienta &&
                ["Parcial", "Ajuste"].includes(
                  herramientas.find(
                    (h) => h.idHerramienta === selectedHerramienta
                  )?.nombre
                ) && (
                  <Row className="d-flex gap-4">
                    <Col>
                      <Card>
                        <Card.Body className="p-0">
                          <Card.Title className="pt-0">
                            Acuerdo con el cliente
                          </Card.Title>
                          <Form>
                            <Form.Group className="d-block">
                              <Form.Label>Monto Pago</Form.Label>
                              <Form.Control
                                required
                                type="text"
                                placeholder=""
                                value={montoPago}
                                onKeyPress={(e) => {
                                  if (!/^\d*\.?\d*$/.test(e.key)) {
                                    e.preventDefault(); // Evita que se ingresen caracteres no numéricos
                                  }
                                }}
                                onChange={handleMontoPagoChange} // Actualiza el estado de "Monto Pago"
                                disabled={!areFieldsEnabled} // Deshabilita el campo si no está habilitado
                              />
                            </Form.Group>
                            <div className="d-flex gap-3 w-100">
                              <Form.Group className="mt-3 w-100">
                                <Form.Label>Monto Negociado</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="$ 0"
                                  value={
                                    montoNegociado ? `$${montoNegociado}` : ""
                                  } // Agrega un '$' al inicio del valor
                                  readOnly // Hace que el campo no sea editable
                                  disabled={!areFieldsEnabled} // Deshabilita el campo si no está habilitado
                                />
                              </Form.Group>
                              <Form.Group className="mt-3 w-100">
                                <Form.Label>Fecha Pago</Form.Label>
                                <Form.Control
                                  required
                                  type="date"
                                  name="fechaPago"
                                  value={formInputs.fechaPago}
                                  onChange={handleInputChange} // Actualiza el estado de "Fecha Pago"
                                  disabled={!areFieldsEnabled} // Deshabilita el campo si no está habilitado
                                  min={new Date().toISOString().split("T")[0]} // Fecha mínima: hoy
                                  max={
                                    new Date(
                                      new Date().setDate(
                                        new Date().getDate() + 15
                                      )
                                    )
                                      .toISOString()
                                      .split("T")[0]
                                  }
                                />
                                <Form.Label>Máximo 28 días</Form.Label>
                              </Form.Group>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                              }}
                            >
                              <Button
                                variant="primary"
                                onClick={handleAgregarPago} // Llama a la función para agregar el pago
                                disabled={!isAddButtonEnabled} // Deshabilita el botón si no es válido
                              >
                                Agregar
                              </Button>
                            </div>
                          </Form>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col className="mt-5">
                      <div
                        className="table-responsive w-100"
                        style={{
                          maxHeight: "300px",
                          overflowY: "auto",
                          scrollbarColor: "#343a40 #1a1a1a", // Color de la barra de scroll y el fondo
                          scrollbarWidth: "thin", // Ancho de la barra de scroll
                        }}
                      >
                        <Table
                          striped
                          bordered
                          hover
                          variant="dark"
                          style={{ tableLayout: "fixed" }}
                        >
                          <thead
                            style={{
                              position: "sticky",
                              top: 0,
                              backgroundColor: "#343a40", // Color de fondo para que coincida con el tema oscuro
                              zIndex: 1,
                            }}
                          >
                            <tr>
                              <th>Fecha</th>
                              <th>Pago</th>
                              <th>Eliminar</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tablaPagos.length > 0 ? (
                              tablaPagos.map((pago, index) => (
                                <tr key={index}>
                                  <td
                                    style={{
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {pago.fecha}{" "}
                                    {/* Usa la fecha directamente sin convertirla */}
                                  </td>
                                  <td
                                    style={{
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    ${parseFloat(pago.pago).toFixed(2) || 0}
                                  </td>
                                  <td
                                    style={{
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    <Button
                                      style={{ padding: "1px 5px" }}
                                      variant="danger"
                                      size="sm"
                                      onClick={() => handleEliminarPago(index)}
                                      disabled={isSelectDisabled2} // Deshabilita el botón si es necesario
                                    >
                                      X
                                    </Button>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="3" className="text-center">
                                  No hay datos
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </div>
                      <div className="justify-content-end d-flex mt-2">
                        {!isValidated && ( // Muestra el botón "Ofrecer" solo si está validado
                          <Button
                            onClick={handleSaveOffering}
                            disabled={tablaPagos.length === 0} // Deshabilita el botón si no hay registros en la tabla
                          >
                            Ofrecer
                          </Button>
                        )}
                        {isValidated && ( // Muestra el botón "Guardar Negociacion" solo si no está validado
                          <Button
                            variant="primary"
                            onClick={handleSaveNegotiation2}
                            disabled={tablaPagos.length === 0} // Deshabilita el botón si no hay registros en la tabla
                          >
                            Negociar
                          </Button>
                        )}
                      </div>
                    </Col>
                  </Row>
                )}
              <Col className="p-0">
                {(showCalculator ||
                  (selectedHerramienta &&
                    ["Convenio", "PIF", "PPA", "APR", "PPA+AC"].includes(
                      herramientas.find(
                        (h) => h.idHerramienta === selectedHerramienta
                      )?.nombre
                    ))) &&
                  !areFieldsEnabled && (
                    <>
                      {/* Calculadora AMEX */}
                      <h5
                        style={{
                          color: "#20c997",
                          marginLeft: "1rem",
                          marginTop: "1rem",
                        }}
                      >
                        Calculadora AMEX
                      </h5>
                      <Card className="p-3 mb-0" ref={calculatorRef}>
                        <Card.Body className="p-0">
                          <Card.Title className="pt-0 text-center">
                            Datos
                          </Card.Title>
                          <Form className="d-flex gap-4 w-100">
                            <Row className="d-flex w-100">
                              <Form.Group>
                                <Form.Label>Monto Requerido</Form.Label>
                                <Form.Control
                                  placeholder=""
                                  name="montoRequerido"
                                  value={calculosData.montoNegociado || ""}
                                  readOnly // Hace que el campo sea de solo lectura
                                  style={{
                                    backgroundColor: "#e9ecef", // Color de fondo para indicar que es no editable
                                    cursor: "not-allowed", // Cambia el cursor para indicar que no es editable
                                  }}
                                />
                              </Form.Group>
                              <Form.Group className="mt-3">
                                <Form.Label>Descuento</Form.Label>
                                <Form.Control
                                  placeholder=""
                                  name="descuento"
                                  value={
                                    formValues.descuento
                                      ? `${parseInt(formValues.descuento, 10)}`
                                      : ""
                                  }
                                  onChange={(e) =>
                                    setFormValues((prev) => ({
                                      ...prev,
                                      descuento: e.target.value.replace(
                                        /$/,
                                        ""
                                      ), // Elimina el '%' antes de actualizar el estado
                                    }))
                                  }
                                  readOnly // Hace que el campo sea de solo lectura
                                  style={{
                                    backgroundColor: "#e9ecef", // Color de fondo para indicar que es no editable
                                    cursor: "not-allowed", // Cambia el cursor para indicar que no es editable
                                  }}
                                />
                              </Form.Group>
                              <Form.Group className="mt-3">
                                <Form.Label>Periodo</Form.Label>
                                <Form.Select
                                  name="periodos"
                                  value={formInputs.periodos || 1} // Valor por defecto: 1 (Mes)
                                  onChange={handleInputChange} // Actualiza el estado formInputs
                                >
                                  <option value="1">Mensual</option>
                                  <option value="2">Quincenal</option>
                                  <option value="4">Semanal</option>
                                </Form.Select>
                              </Form.Group>
                            </Row>
                            <Row className="d-flex w-100">
                              <Form.Group className="mt-3">
                                <Form.Label>Meses</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder=""
                                  name="meses"
                                  value={formInputs.meses}
                                  onChange={handleInputChange} // Actualiza el estado formInputs
                                  onKeyPress={(e) => {
                                    if (!/^\d*$/.test(e.key)) {
                                      e.preventDefault(); // Evita que se ingresen caracteres no numéricos
                                    }
                                  }}
                                />
                              </Form.Group>
                              <Form.Group className="mt-3">
                                <Form.Label>Fecha Pago</Form.Label>
                                <Form.Control
                                  type="date"
                                  placeholder="Fecha Pago"
                                  name="fechaPago"
                                  value={formInputs.fechaPago}
                                  onChange={handleInputChange} // Actualiza el estado formInputs
                                  min={new Date().toISOString().split("T")[0]} // Fecha mínima: hoy
                                />
                              </Form.Group>
                              <div className="d-flex justify-content-between mt-4">
                                <div className="">
                                  <h5 className="text-light pt-1 fw-bold d-inline-flex">
                                    Tasa Mensual:{" "}
                                    {calculosData.tasaMensual
                                      ? `${calculosData.tasaMensual}%`
                                      : "0%"}
                                  </h5>
                                </div>
                                <div>
                                  <Button
                                    variant="primary"
                                    onClick={handleCalculateSecondPart}
                                    disabled={isSelectDisabled3} // Deshabilita el botón si no es válido
                                  >
                                    Calcular
                                  </Button>
                                </div>
                              </div>
                            </Row>
                          </Form>
                        </Card.Body>
                      </Card>
                    </>
                  )}
              </Col>
              <Row ref={detailsRef}>
                {showDetails && !areFieldsEnabled && (
                  <>
                    {/* Resumen */}
                    <Col>
                      <Card className="mb-0">
                        <Card.Body>
                          <Row>
                            <Row>
                              <Col>
                                <span className="text-light small pt-1 fw-bold">
                                  Plazos
                                </span>
                                <h5 style={{ color: "#4a9dff" }}>
                                  {calculosData.plazos}
                                </h5>
                              </Col>
                              <Col>
                                <span className="text-light small pt-1 fw-bold">
                                  Primer Pago
                                </span>
                                <h5 style={{ color: "#07fb70" }}>
                                  ${(calculosData.primerPago || 0).toFixed(2)}
                                </h5>
                              </Col>
                              <Col>
                                <span className="text-light small pt-1 fw-bold">
                                  Saldo
                                </span>
                                <h5 style={{ color: "#ffc400" }}>
                                  ${(summaryData.saldo || 0).toFixed(2)}
                                </h5>
                              </Col>
                            </Row>
                            <Row>
                              <Col>
                                <span className="text-light small pt-1 fw-bold">
                                  Monto Negociado
                                </span>
                                <h5 style={{ color: "#ffc400" }}>
                                  $
                                  {calculosData.montoNegociado
                                    ? calculosData.montoNegociado.toFixed(2)
                                    : 0}
                                </h5>
                              </Col>
                              <Col>
                                <span className="text-light small pt-1 fw-bold">
                                  Descuento
                                </span>
                                <h5 style={{ color: "#6dd6ff" }}>
                                  $
                                  {summaryData.montoDescuento
                                    ? summaryData.montoDescuento
                                    : 0}
                                </h5>
                              </Col>
                            </Row>
                          </Row>
                        </Card.Body>
                      </Card>
                      {/* Pagos */}
                      <Card className="mt-0">
                        <Card.Body>
                          <div
                            style={{
                              justifyContent: "space-evenly",
                              paddingLeft: "0",
                            }}
                            className="d-flex gap-3 mb-3"
                          >
                            <h6 style={{ color: "white" }}>Pagos</h6>
                            <Form.Check
                              type="checkbox"
                              label="Pago Inicial"
                              name="agregarPagos"
                              checked={modifyForm.agregarPagos}
                              onChange={(e) =>
                                setModifyForm((prev) => ({
                                  ...prev,
                                  agregarPagos: e.target.checked,
                                  filaMod: e.target.checked ? 0 : null,
                                }))
                              }
                            />
                          </div>
                          <Form
                            style={{ alignItems: "end" }}
                            className=" d-flex gap-3"
                          >
                            <Form.Group className="">
                              <Form.Label>
                                Seleccione el pago para modificar
                              </Form.Label>
                              <Form.Control
                                placeholder="Monto"
                                type="text"
                                name="montoMod"
                                value={
                                  modifyForm.montoMod
                                    ? `$${modifyForm.montoMod}`
                                    : ""
                                }
                                onChange={(e) => {
                                  const value = e.target.value.replace(
                                    /^\$/,
                                    ""
                                  ); // Elimina el '$' si ya existe
                                  setModifyForm((prev) => ({
                                    ...prev,
                                    montoMod: value, // Actualiza el estado sin el '$'
                                  }));
                                }}
                                onKeyPress={(e) => {
                                  if (!/^\d*\.?\d*$/.test(e.key)) {
                                    e.preventDefault(); // Evita que se ingresen caracteres no numéricos
                                  }
                                }}
                              />
                            </Form.Group>
                            <Form.Group className="">
                              <Form.Label>Fecha Pago</Form.Label>
                              <Form.Control
                                type="date"
                                name="fechaPagoMod"
                                value={modifyForm.fechaPagoMod}
                                onChange={handleModifyFormChange}
                                max={
                                  formInputs.fechaPago ||
                                  new Date().toISOString().split("T")[0]
                                } // Fecha máxima: la seleccionada en "fechaPago" o la fecha actual
                              />
                            </Form.Group>

                            <div>
                              <Button
                                variant="primary"
                                onClick={() => {
                                  setModifyForm((prev) => ({
                                    ...prev,
                                    modificar: 1,
                                  }));
                                  handleModifyPayment();
                                  setIsValidated(false); // Asegura que el botón "Validación" se muestre después de modificar
                                }}
                                disabled={isValidated} // Deshabilita el botón si ya está validado
                                style={{
                                  display: isValidated
                                    ? "none"
                                    : "inline-block",
                                }} // Oculta el botón si está validado
                              >
                                Modificar
                              </Button>
                            </div>
                          </Form>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                              marginTop: "15px",
                            }}
                          >
                            {!isValidated && (
                              <Button
                                variant="primary"
                                onClick={() => {
                                  validateNegotiationOffer();
                                  setModifyForm((prev) => ({
                                    ...prev,
                                    modificar: 0, // Oculta el botón "Modificar" después de la validación
                                  }));
                                }}
                              >
                                Ofrecer
                              </Button>
                            )}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                              marginTop: "",
                            }}
                          >
                            {!isSaveDeadlinesClicked &&
                              isValidated && ( // Muestra el botón "Guardar Plazos" solo si no se ha hecho clic
                                <Button
                                  variant="primary"
                                  onClick={handleSaveDeadlines}
                                >
                                  Guardar Plazos
                                </Button>
                              )}
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                              marginTop: "",
                            }}
                          >
                            {isSaveDeadlinesClicked &&
                              !isNegotiationSaved && ( // Muestra el botón "Guardar Negociación" solo si no se ha guardado
                                <Button
                                  variant="primary"
                                  onClick={handleSaveNegotiation} // Llama a la función para guardar la negociación
                                  disabled={!isValidated} // Deshabilita el botón si no está validado
                                >
                                  Negociar
                                </Button>
                              )}
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col className=" ">
                      {/* Plazos */}
                      <Card className="mb-0">
                        <Card.Body className="">
                          <h6>Plazos</h6>
                          <div
                            className="custom-scrollbar"
                            style={{ maxHeight: "320px", overflowY: "auto" }}
                          >
                            <Table
                              bordered
                              hover
                              className="custom-calculation-table"
                            >
                              <thead className="table-header-custom">
                                <tr>
                                  <th>No.</th>
                                  <th>Fecha</th>
                                  <th>Saldo</th>
                                  <th>Pago</th>
                                  <th>Saldo Final</th>
                                </tr>
                              </thead>
                              <tbody>
                                {Array.isArray(calculosData.calculos) &&
                                calculosData.calculos.length > 0 ? (
                                  calculosData.calculos.map(
                                    (calculo, index) => (
                                      <tr
                                        key={index}
                                        onClick={() =>
                                          !modifyForm.agregarPagos &&
                                          handleRowClick(index)
                                        }
                                        className={`table-row-custom ${
                                          selectedRow === index
                                            ? "selected-row"
                                            : ""
                                        }`}
                                        style={{
                                          cursor: modifyForm.agregarPagos
                                            ? "not-allowed"
                                            : "pointer",
                                        }}
                                      >
                                        <td>{calculo.no}</td>
                                        <td>
                                          {new Date(
                                            calculo.fecha
                                          ).toLocaleDateString()}
                                        </td>
                                        <td className="amount-cell">
                                          $
                                          {calculo.saldo
                                            ? calculo.saldo.toFixed(2)
                                            : 0}
                                        </td>
                                        <td className="amount-cell">
                                          $
                                          {calculo.pago
                                            ? calculo.pago.toFixed(2)
                                            : 0}
                                        </td>
                                        <td className="amount-cell">
                                          $
                                          {calculo.saldoFinal
                                            ? calculo.saldoFinal.toFixed(2)
                                            : 0}
                                        </td>
                                      </tr>
                                    )
                                  )
                                ) : (
                                  <tr>
                                    <td colSpan={5} className="no-data-message">
                                      No hay datos disponibles
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </Table>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </>
                )}
              </Row>
            </Col>
          </Col>
        </Modal.Body>
      </Modal>
      <Validators
        show={showValidators}
        handleClose={handleCloseValidators}
        onValidateSuccess={handleValidateSuccess} // Pasa la función de éxito de validación
        handleValidate={(validator, password, cartaConvenioValue, email) =>
          handleValidate(validator, password, cartaConvenioValue, email)
        } // Pasa los datos ingresados en el modal
      />
    </>
  );
};

export default CalculatorSimulator;
