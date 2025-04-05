import { useState, useEffect, useContext } from "react";
import { Modal, Button, Form, Table, Card, Row, Col } from "react-bootstrap";
import "../scss/styles.scss";
import { fetchCalFirtsPart, fetchCalSecondPart, fetchCalSecondPartModify, fetchSaveDeleteDeadlines, fetchSaveNegotiationDeadlines, fetchIncreasesNegotiation } from "../services/gespawebServices";
import { AppContext } from "../pages/Managment";
import { toast } from "sonner";
import Validators from "./fragments/Validators"; // Importa el modal de Validators

const CalculatorSimulator = ({show, handleClose}) => {
  const { searchResults, idEjecutivo} = useContext(AppContext); // Obtiene searchResults desde AppContext
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [summaryData, setSummaryData] = useState({
    montoRequerido: 0,
    montoDescuento: 0,
    saldo: 0,
    fechaCorte: "",
    descuento: 0,
  });
  const [herramientas, setHerramientas] = useState([]); // Estado para almacenar las herramientas
  const [selectedHerramienta, setSelectedHerramienta] = useState(null); // Estado para almacenar el idHerramienta seleccionado
  const [calculosData, setCalculosData] = useState({
    plazos: 0,
    primerPago: 0,
    saldo: 0,
    montoNegociado: 0,
    descuento: 0,
    calculos: [],
    tasaMensual: 0, // Agregar tasa mensual al estado
  });
  const [formValues, setFormValues] = useState({
    montoRequerido: "",
    descuento: "",
  });
  const [formInputs, setFormInputs] = useState({
    meses: "",
    fechaPago: "",
  });
  const [isCalculateButtonEnabled, setIsCalculateButtonEnabled] = useState(false);
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
    filaMod: null,
  });
  const [selectedRow, setSelectedRow] = useState(null);// Estado para almacenar la fila seleccionada
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const idCartera = 1; // Ejemplo de valor
        // Obtiene el primer idCuenta de searchResults
        const idCuenta = searchResults?.[0]?.idCuenta?.trim();
        if (!idCuenta) {
          console.error("No se encontró idCuenta en searchResults");
          return;
        }
        const data = await fetchCalFirtsPart(idCartera, idCuenta, selectedHerramienta || 136); // Usa el idHerramienta seleccionado o un valor por defecto
        // Extraer datos de ofrecimientos, herramientas y resumen
        if (data) {
          if (Array.isArray(data.ofrecimientos)) {
            setTableData(data.ofrecimientos);
          }
          if (Array.isArray(data.herramientas)) {
            setHerramientas(data.herramientas); // Almacena las herramientas
          }
          setSummaryData({
            montoRequerido: data.montoRequerido,
            montoDescuento: data.montoDescuento,
            saldo: data.saldo,
            fechaCorte: data.fechaCorte,
            descuento: data.descuento
          });
        } else {
          console.error("La respuesta del endpoint no contiene los datos esperados:", data);
          setTableData([]);
        }
      } catch (error) {
        console.error("Error al obtener los datos de la calculadora:", error);
        setTableData([]);
      }
    };
    if (searchResults?.length > 0) {
      fetchData(); // Llama a la función solo si searchResults tiene datos
    }
  }, [searchResults, selectedHerramienta]); // Agrega selectedHerramienta como dependencia
  const handleScroll = (e) => {
    if (e.target.scrollTop > 10) {
      setShowScrollIndicator(false);
    } else {
      setShowScrollIndicator(true);
    }
  };
  const handleHerramientaChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedHerramienta(Number(selectedValue)); // Actualiza el idHerramienta seleccionado

    // Limpia los campos al cambiar de herramienta
    setMontoPago("");
    setMontoNegociado("");
    setFormInputs((prev) => ({
      ...prev,
      fechaPago: "",
    }));

    // Habilita el botón "Calcular" si la herramienta seleccionada es válida
    const validHerramientasCalcular = ["Convenio", "PIF", "PPA", "APR", "PPA+AC"];
    const validHerramientasAgregar = ["Parcial", "Ajuste"];
    const herramientaSeleccionada = herramientas.find(
      (herramienta) => herramienta.idHerramienta === Number(selectedValue)
    );

    setIsCalculateButtonEnabled(
      herramientaSeleccionada &&
        validHerramientasCalcular.includes(herramientaSeleccionada.nombre)
    );

    setIsAddButtonEnabled(
      herramientaSeleccionada &&
        validHerramientasAgregar.includes(herramientaSeleccionada.nombre)
    );

    // Habilita los campos si la herramienta seleccionada es "Parcial" o "Ajuste"
    setAreFieldsEnabled(
      herramientaSeleccionada &&
        validHerramientasAgregar.includes(herramientaSeleccionada.nombre)
    );
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
      if (!selectedHerramienta || !idCuenta || !formValues.montoRequerido || !formValues.descuento || !formInputs.fechaPago) {
        console.error("Datos incompletos. Verifica los campos antes de enviar.");
        toast.error("Por favor, completa todos los campos requeridos.");
        return;
      }
  
      const requestData = {
        idHerramienta: selectedHerramienta,
        NoCuenta: idCuenta,
        idCartera: 1,
        MontoRequerido: parseFloat(formValues.montoRequerido) || 0,
        Descuento: parseFloat(formValues.descuento) || 0,
        iMeses: parseInt(formInputs.meses, 10) || 0,
        dtpFecha: formInputs.fechaPago || "",
        periodos: parseInt(formInputs.periodos, 10) || 1,
      };
  
      console.log("Datos enviados al endpoint fetchCalSecondPart:", requestData);
  
      const response = await fetchCalSecondPart(
        requestData.idCartera,
        requestData.NoCuenta,
        requestData.idHerramienta,
        requestData.MontoRequerido,
        requestData.Descuento,
        requestData.iMeses,
        requestData.dtpFecha,
        requestData.periodos
      );
  
      console.log("Respuesta del endpoint fetchCalSecondPart:", response);
      toast.success("Cálculo realizado correctamente.");
      setCalculosData({
        plazos: response.plazos,
        primerPago: response.pago,
        saldo: response.montoRequerido,
        montoNegociado: response.montoNegociado,
        descuento: response.descuento,
        calculos: response.calculos,
        tasaMensual: response.tasaMensual, // Agregar la tasa mensual al estado
      });

      setShowDetails(true); // Muestra el contenido del Row
    } catch (error) {
      console.error("Error al enviar los datos al endpoint fetchCalSecondPart:", error);
      const errorMessage = error.response?.data?.errors || "Error desconocido al realizar el cálculo.";
      toast.error(errorMessage);
    }
  };
  

  const handleSetFormValues = () => {
    setFormValues({
      montoRequerido: summaryData.montoRequerido.toFixed(2),
      descuento: summaryData.descuento.toFixed(2),
    });
    setShowCalculator(true); // Muestra el contenido del Col
  };

  const handleAgregarPago = () => {
    if (montoNegociado && formInputs.fechaPago) {
      const nuevoPago = {
        fecha: formInputs.fechaPago,
        hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }), // Agrega hora y minutos en formato 12 horas
        pago: montoNegociado,
      };
      setTablaPagos((prev) => [...prev, nuevoPago]); // Agrega el nuevo pago a la tabla
    }
  };

  const handleEliminarPago = (index) => {
    setTablaPagos((prev) => prev.filter((_, i) => i !== index)); // Elimina el registro por índice
  };

  const handleModifyFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setModifyForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleModifyPayment = async () => {
    const idCuenta = searchResults?.[0]?.idCuenta?.trim();
    try {
      // Validar los datos antes de enviarlos
      if (!selectedHerramienta || !idCuenta || !modifyForm.montoMod || !modifyForm.fechaPagoMod) {
        console.error("Datos incompletos. Verifica los campos antes de enviar.");
        toast.error("Por favor, completa todos los campos requeridos.");
        return;
      }
  
      const requestData = {
        idHerramienta: selectedHerramienta,
        NoCuenta: idCuenta,
        idCartera: 1,
        MontoRequerido: parseFloat(formValues.montoRequerido) || 0,
        Descuento: parseFloat(formValues.descuento) || 0,
        iMeses: parseInt(formInputs.meses, 10) || 0,
        dtpFecha: formInputs.fechaPago || "",
        periodos: parseInt(formInputs.periodos, 10) || 1, // Asigna el valor seleccionado en el select
        modificar: 1, // Siempre se envía 1 al hacer clic en el botón "Modificar"
        montoMod: parseFloat(modifyForm.montoMod) || 0,
        fechaPagoMod: modifyForm.fechaPagoMod,
        agregarPagos: modifyForm.agregarPagos ? 1 : 0, // 1 si el checkbox está marcado, 0 si no
        filaMod: modifyForm.filaMod,
      };
  
      console.log("Datos enviados al endpoint fetchCalSecondPartModify:", requestData);
  
      const response = await fetchCalSecondPartModify(
        requestData.idCartera,
        requestData.NoCuenta,
        requestData.idHerramienta,
        requestData.MontoRequerido,
        requestData.Descuento,
        requestData.iMeses,
        requestData.dtpFecha,
        requestData.periodos,
        requestData.modificar,
        requestData.montoMod,
        requestData.fechaPagoMod,
        requestData.agregarPagos,
        requestData.filaMod
      );
  
      console.log("Respuesta del endpoint fetchCalSecondPartModify:", response);
  
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
      console.error("Error al enviar los datos al endpoint fetchCalSecondPartModify:", error);
      const errorMessage = error.response?.data?.title || "Error desconocido al enviar los datos.";
      toast.error(errorMessage);
    }
  };

  const handleRowClick = (index) => {
    setSelectedRow(index); // Actualiza el índice de la fila seleccionada
    setModifyForm((prev) => ({
      ...prev,
      filaMod: index, // Actualiza filaMod con el índice seleccionado
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
    if (!calculosData.calculos || calculosData.calculos.length === 0) {
      toast.error("No hay plazos disponibles para guardar.");
      return;
    }
  
    const plazos = calculosData.calculos.map((calculo) => ({
      monto: calculo.pago,
      fecha: calculo.fecha,
    }));
  
    const requestData = {
      idCartera: 1,
      idCuenta: searchResults?.[0]?.idCuenta?.trim(),
      idHerramienta: selectedHerramienta,
      plazos,
      fechaInsert: new Date().toISOString(),
      segundo_Insert: "00:00:01",
    };
  
    try {
      console.log("Enviando datos al endpoint:", requestData);
      const response = await fetchSaveDeleteDeadlines(requestData);
      console.log("Respuesta del endpoint:", response);
  
      if (response?.mensaje) {
        const diasASumar = parseInt(response.mensaje, 10); // Convierte el mensaje a número
        const fechaPago = new Date(formInputs.fechaPago);
        fechaPago.setDate(fechaPago.getDate() + diasASumar); // Suma los días al valor de fechaPago
        const nuevaFechaFinNegociacion = fechaPago.toISOString().split("T")[0]; // Formatea la nueva fecha
  
        console.log("Nueva fechaFinNegociacion calculada:", nuevaFechaFinNegociacion);
  
        // Actualiza el estado o usa la nueva fecha en el siguiente request
        setFormInputs((prev) => ({
          ...prev,
          fechaFinNegociacion: nuevaFechaFinNegociacion,
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
      // Validar datos antes de enviarlos
      if (!idCuenta || !selectedHerramienta || !calculosData.montoNegociado) {
        toast.error("Faltan datos requeridos para guardar la negociación.");
        console.error("Datos faltantes:", { idCuenta, selectedHerramienta, montoNegociado: calculosData.montoNegociado });
        return;
      }
  
      const requestData = {
        idCartera: 1,
        idCuenta: idCuenta,
        idEjecutivo: idEjecutivo,
        idHerramienta: selectedHerramienta,
        montoNegociado: parseFloat(calculosData.montoNegociado),
        plazos: parseInt(calculosData.plazos, 10), // Asegura que plazos sea un número entero
        cartaConvenio: cartaConvenio, // Usa el valor del estado
        correo: selectedEmail || "", // Usa el correo seleccionado o vacío
        fechaPago: formInputs.fechaPago || "",
        fechaFinNegociacion: formInputs.fechaFinNegociacion, // Usa la nueva fecha calculada
        idEjecutivoValidador: parseInt(idEjecutivoValidador, 10), // Asegura que sea un número entero
        contrasena: validatorPassword || "", // Usa la contraseña del validador o vacío
        fechaInsert: "2025-04-03",
        segundoInsert: "12:34:59",
        reestructura: 0,
        condonacion: 0,
        idGrabacion: "", // Cambiar si es necesario
      };
  
      console.log("Datos enviados al endpoint fetchSaveNegotiationDeadlines:", requestData);
  
      const response = await fetchSaveNegotiationDeadlines(requestData);
      toast.success("Negociación guardada correctamente.");
      console.log("Respuesta del endpoint fetchSaveNegotiationDeadlines:", response);
  
      // Extraer el campo duración de la respuesta y almacenarlo en el estado
      const duracionObtenida = response?.duración || "";
      console.log("Duración obtenida de la respuesta:", duracionObtenida);
      setDuracion(duracionObtenida); // Almacena la duración en el estado
  
      // Cambia el estado para mostrar el botón "Finalizar"
      setIsNegotiationSaved(true);
    } catch (error) {
      console.error("Error al guardar la negociación:", error);
      toast.error("Error al guardar la negociación.");
    }
  };
  
  const handleValidate = (validator, password, cartaConvenioValue, email) => {
    console.log("Validación exitosa con validador:", validator, "contraseña:", password, "cartaConvenio:", cartaConvenioValue, "correo:", email);
    setIdEjecutivoValidador(validator); // Almacena el idEjecutivo seleccionado
    setValidatorPassword(password); // Almacena la contraseña del validador
    setCartaConvenio(cartaConvenioValue); // Almacena el valor del checkbox
    setSelectedEmail(email || ""); // Almacena el correo seleccionado o "" si no hay correo
    setIsValidated(true); // Cambia el estado a validado
    setShowValidators(false); // Cierra el modal de validación
  };

  
const sendIncreaseNegotiation = async () => {
  try {
    // Enviar datos al endpoint IncrementaNegociacion
    const increaseRequestData = {
      idEjecutivo: idEjecutivo,
      monto: parseFloat(calculosData.montoNegociado), // Usar el valor de Monto Negociado
      saldo: summaryData.saldo,
      duracion: duracion, // Usar el valor de duración obtenido
    };

    console.log("Enviando datos al endpoint IncrementaNegociacion:", increaseRequestData);
    const increaseResponse = await fetchIncreasesNegotiation(increaseRequestData);

    console.log("Respuesta del endpoint IncrementaNegociacion:", increaseResponse);
    return increaseResponse;
  } catch (error) {
    console.error("Error al enviar los datos al endpoint IncrementaNegociacion:", error);
    toast.error("Error al procesar la negociación.");
    throw error;
  }
};

  return (
    <>
      <Modal show={show} onHide={handleClose} size="xl">
        <Modal.Header closeButton>
          <Modal.Title style={{ color: "#0dcaf0" }} className="ms-3">
            Calculadora
          </Modal.Title>
        </Modal.Header>
        <Modal.Body
          style={{
            maxHeight: "80vh", // Limitar la altura máxima del cuerpo del modal
            overflowY: "auto", // Habilitar scroll vertical
            position: "relative", // Necesario para posicionar el indicador
          }}
          onScroll={handleScroll}
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
                    className="custom-scrollbar"
                    style={{
                      maxHeight: "300px",
                      overflowY: "auto",
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
                          <th style={{ textAlign: "center" }}>FechaHora</th>
                          <th style={{ textAlign: "center" }}>Herramienta</th>
                          <th style={{ textAlign: "center" }}>Status</th>
                          <th style={{ textAlign: "center" }}>Vencimiento</th>
                          <th style={{ textAlign: "center" }}>Saldo</th>
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
                                </td>{" "}
                                {/* Muestra "--" si no hay valor */}
                                <td style={{ textAlign: "left" }}>
                                  {row.idEstado || "--"}
                                </td>{" "}
                                {/* Muestra "--" si no hay valor */}
                                <td style={{ textAlign: "left" }}>
                                  {row.vencimiento || "--"}
                                </td>{" "}
                                {/* Muestra "--" si no hay valor */}
                                <td style={{ textAlign: "left" }}>
                                  {row.saldoInterés !== undefined
                                    ? `$${parseFloat(row.saldoInterés).toFixed(
                                        2
                                      )}`
                                    : "--"}{" "}
                                  {/* Muestra "--" si no hay valor */}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center">
                              No hay cuenta seleccionada
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </div>
                </Col>
              </Row>
              <Col className="mt-4">
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
                              ${summaryData.montoRequerido.toFixed(2)}
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
                              ${summaryData.montoDescuento.toFixed(2)}
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
                              ${summaryData.saldo.toFixed(2)}
                            </h5>
                          </div>
                          <div className="ps-3">
                            <span className="text-light small pt-1 fw-bold">
                              Corte
                            </span>
                            <h5 className="text-light light-modal-money">
                              {summaryData.fechaCorte.split(" ")[0]}{" "}
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
              {areFieldsEnabled && ( // Muestra el Row solo si la herramienta seleccionada es válida
                <Row className="d-flex gap-4">
                  <Col>
                    <Card>
                      <Card.Body className="p-0">
                        <Card.Title className="pt-0">Acuerdo con el cliente</Card.Title>
                        <Form>
                          <Form.Group className="d-flex w-100">
                            <Form.Control
                              className="w-100"
                              type="text"
                              placeholder="Monto Pago"
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
                              <Form.Control
                                type="text"
                                placeholder="Monto Negociado"
                                value={montoNegociado ? `$${montoNegociado}` : ""} // Agrega un '$' al inicio del valor
                                readOnly // Hace que el campo no sea editable
                                disabled={!areFieldsEnabled} // Deshabilita el campo si no está habilitado
                              />
                            </Form.Group>
                            <Form.Group className="mt-3 w-100">
                              <Form.Control
                                type="date"
                                name="fechaPago"
                                value={formInputs.fechaPago}
                                onChange={handleInputChange} // Actualiza el estado de "Fecha Pago"
                                disabled={!areFieldsEnabled} // Deshabilita el campo si no está habilitado
                              />
                              <Form.Label>Máximo 15 días</Form.Label>
                            </Form.Group>
                          </div>
                          <div style={{ display: "flex", justifyContent: "flex-end" }}>
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
                                  {`${new Date(pago.fecha).toLocaleDateString()}`}
                                </td>
                                <td
                                  style={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  ${parseFloat(pago.pago).toFixed(2)}
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
                  </Col>
                </Row>
              )}
              <Col className="p-0">
                {showScrollIndicator && (
                  <div
                    className="container-scroll-down"
                    style={{
                      position: "absolute",
                      bottom: "80px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      textAlign: "start",
                      zIndex: 10,
                    }}
                  >
                    <div className="chevron"></div>
                    <div className="chevron"></div>
                    <div className="chevron"></div>
                    <span className="text">Desliza hacia abajo</span>
                  </div>
                )}

                {showCalculator && !areFieldsEnabled && ( // Oculta la calculadora si los campos están habilitados
                  <>
                    {/* Calculadora AMEX */}
                    <h5 style={{ textAlign: "center", color: "#20c997" }}>
                      Calculadora AMEX
                    </h5>
                    <Card className="p-3 mb-0">
                      <Card.Body className="p-0">
                        <Card.Title className="pt-0 ms-3">Datos</Card.Title>
                        <Form className="d-flex gap-4 w-100">
                          <Row className="d-flex w-100">
                            <Form.Group>
                              <Form.Control
                                placeholder="Monto Requerido"
                                name="montoRequerido"
                                value={
                                  formValues.montoRequerido
                                    ? `$${formValues.montoRequerido}`
                                    : ""
                                }
                                onChange={(e) =>
                                  setFormValues((prev) => ({
                                    ...prev,
                                    montoRequerido: e.target.value.replace(
                                      /^\$/,
                                      ""
                                    ), // Elimina el '$' antes de actualizar el estado
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
                              <Form.Control
                                placeholder="Descuento"
                                name="descuento"
                                value={
                                  formValues.descuento
                                    ? `${parseInt(formValues.descuento, 10)}%`
                                    : ""
                                }
                                onChange={(e) =>
                                  setFormValues((prev) => ({
                                    ...prev,
                                    descuento: e.target.value.replace(/%$/, ""), // Elimina el '%' antes de actualizar el estado
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
                              <Form.Control
                                type="text"
                                placeholder="Meses"
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
                              <Form.Control
                                type="date"
                                placeholder="Fecha Pago"
                                name="fechaPago"
                                value={formInputs.fechaPago}
                                onChange={handleInputChange} // Actualiza el estado formInputs
                              />
                            </Form.Group>
                            <div className="mt-4">
                              <Button
                                variant="primary"
                                onClick={handleCalculateSecondPart}
                              >
                                Calcular Plazos
                              </Button>
                            </div>
                          </Row>
                        </Form>
                      </Card.Body>
                    </Card>
                  </>
                )}
              </Col>
              <Row>
                {showDetails && ( 
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
                                  {calculosData.plazos || 0}
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
                                  {(calculosData.montoNegociado || 0).toFixed(
                                    2
                                  )}
                                </h5>
                              </Col>
                              <Col>
                                <span className="text-light small pt-1 fw-bold">
                                  Descuento
                                </span>
                                <h5 style={{ color: "#6dd6ff" }}>
                                  {(calculosData.descuento || 0).toFixed(2)}
                                </h5>
                              </Col>
                              <Col>
                                <span className="text-light small pt-1 fw-bold">
                                  Tasa mensual
                                </span>
                                <h5 className="text-light">
                                  {calculosData.tasaMensual
                                    ? `${calculosData.tasaMensual}%`
                                    : "N/A"}
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
                                style={{ display: isValidated ? "none" : "inline-block" }} // Oculta el botón si está validado
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
                                  handleOpenValidators(); // Abre el modal de validación
                                  setModifyForm((prev) => ({
                                    ...prev,
                                    modificar: 0, // Oculta el botón "Modificar" después de la validación
                                  }));
                                }}
                              >
                                Validación
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
                            {!isSaveDeadlinesClicked && isValidated && ( // Muestra el botón "Guardar Plazos" solo si no se ha hecho clic
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
                            {isSaveDeadlinesClicked && !isNegotiationSaved && ( // Muestra el botón "Guardar Negociación" solo si no se ha guardado
                              <Button
                                variant="primary"
                                onClick={handleSaveNegotiation} // Llama a la función para guardar la negociación
                                disabled={!isValidated} // Deshabilita el botón si no está validado
                              >
                                Guardar Negociación
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
                            {isNegotiationSaved && ( // Muestra el botón "Finalizar" después de guardar la negociación
                              <Button
                                variant="success"
                                onClick={sendIncreaseNegotiation} // Llama a la función para finalizar
                              >
                                Finalizar
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
                                          ${(calculo.saldo || 0).toFixed(2)}
                                        </td>
                                        <td className="amount-cell">
                                          ${(calculo.pago || 0).toFixed(2)}
                                        </td>
                                        <td className="amount-cell">
                                          $
                                          {(calculo.saldoFinal || 0).toFixed(2)}
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
        handleValidate={(validator, password, cartaConvenioValue, email) => handleValidate(validator, password, cartaConvenioValue, email)} // Pasa el correo seleccionado
      />
    </>
  );
};

export default CalculatorSimulator;