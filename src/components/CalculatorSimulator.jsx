import { useState, useEffect, useContext } from "react";
import { Modal, Button, Form, Table, Card, Row, Col } from "react-bootstrap";
import "../scss/styles.scss";
import {
  fetchCalFirtsPart,
  fetchCalSecondPart,
  fetchCalSecondPartModify,
} from "../services/gespawebServices";
import { AppContext } from "../pages/Managment";
import { toast } from "sonner";

const CalculatorSimulator = ({ show, handleClose }) => {
  const { searchResults } = useContext(AppContext); // Obtiene searchResults desde AppContext
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
  });
  const [formValues, setFormValues] = useState({
    montoRequerido: "",
    descuento: "",
  });
  const [formInputs, setFormInputs] = useState({
    meses: "",
    fechaPago: "",
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
    filaMod: null,
  });
  const [selectedRow, setSelectedRow] = useState(null); // Estado para almacenar la fila seleccionada

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
        const data = await fetchCalFirtsPart(
          idCartera,
          idCuenta,
          selectedHerramienta || 136
        ); // Usa el idHerramienta seleccionado o un valor por defecto
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
            descuento: data.descuento,
          });
        } else {
          console.error(
            "La respuesta del endpoint no contiene los datos esperados:",
            data
          );
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
    const validHerramientasCalcular = [
      "Convenio",
      "PIF",
      "PPA",
      "APR",
      "PPA+AC",
    ];
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
        NoCuenta: idCuenta,
        idCartera: 1,
        MontoRequerido: parseFloat(formValues.montoRequerido) || 0,
        Descuento: parseFloat(formValues.descuento) || 0,
        iMeses: parseInt(formInputs.meses, 10) || 0,
        dtpFecha: formInputs.fechaPago || "",
        periodos: parseInt(formInputs.periodos, 10) || 1,
      };

      console.log(
        "Datos enviados al endpoint fetchCalSecondPart:",
        requestData
      );

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
      });
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
      montoRequerido: summaryData.montoRequerido.toFixed(2),
      descuento: summaryData.descuento.toFixed(2),
    });
  };

  const handleAgregarPago = () => {
    if (montoNegociado && formInputs.fechaPago) {
      const nuevoPago = {
        fecha: formInputs.fechaPago,
        hora: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }), // Agrega hora y minutos en formato 12 horas
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

      console.log(
        "Datos enviados al endpoint fetchCalSecondPartModify:",
        requestData
      );

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
      console.error(
        "Error al enviar los datos al endpoint fetchCalSecondPartModify:",
        error
      );
      const errorMessage =
        error.response?.data?.title || "Error desconocido al enviar los datos.";
      toast.error(errorMessage);
    }
  };

  const handleRowClick = (index) => {
    if (!modifyForm.agregarPagos) {
      // Solo permite seleccionar filas si el checkbox no está marcado
      console.log("Fila seleccionada:", index); // Depuración
      setSelectedRow(index); // Actualiza el índice de la fila seleccionada
      setModifyForm((prev) => ({
        ...prev,
        filaMod: index, // Actualiza filaMod con el índice seleccionado
      }));
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title style={{ color: "#0dcaf0" }} className="ms-3">
          Calculadora-Simulador
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        style={{
          maxHeight: "70vh", // Limitar la altura máxima del cuerpo del modal
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
                  style={{ maxHeight: "300px", overflowY: "auto" }}
                >
                  <Table striped bordered hover variant="dark">
                    <thead>
                      <tr>
                        <th>FechaHora</th>
                        <th>Herramienta</th>
                        <th>Estado</th>
                        <th>Vencimiento</th>
                        <th>Saldo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(tableData) && tableData.length > 0 ? (
                        tableData.map((row, index) => {
                          const fechaSinHora = row.fecha_Insert.split(" ")[0]; // Extrae solo la fecha
                          const fechaConHora = `${fechaSinHora} ${row.segundo_Insert}`; // Combina la fecha con segundo_Insert
                          return (
                            <tr key={index}>
                              <td>{fechaConHora}</td>
                              <td>{row.herramienta}</td>
                              <td>{row.idEstado}</td>
                              <td>{row.vencimiento}</td>
                              <td>{row.saldoInterés}</td>
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
            <Col>
              <Card className="rounded-lg mb-0">
                <Card.Body className="d-flex p-0 pb-1 w-100">
                  <Form
                    className="d-flex w-100 gap-5"
                    style={{ alignItems: "center" }}
                  >
                    <Col>
                      <Form.Group>
                        <Form.Select onChange={handleHerramientaChange}>
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
                    </Col>
                    <Col>
                      <div className="d-flex">
                        <div className="ps-3 mt-3">
                          <span className="text-light small pt-1 fw-bold">
                            Monto Requerido
                          </span>
                          <h5 className="warning-modal-money">
                            ${summaryData.montoRequerido.toFixed(2)}
                          </h5>
                        </div>
                        <div className="ps-3 mt-3">
                          <span className="text-light small pt-1 fw-bold">
                            45% Desc
                          </span>
                          <h5 className="success-modal-money">
                            ${summaryData.montoDescuento.toFixed(2)}
                          </h5>
                        </div>
                        <div className="ps-3 mt-3">
                          <span className="text-light small pt-1 fw-bold">
                            Saldo
                          </span>
                          <h5 className="info-modal-money">
                            ${summaryData.saldo.toFixed(2)}
                          </h5>
                        </div>
                        <div className="ps-3 mt-3">
                          <span className="text-light small pt-1 fw-bold">
                            Corte
                          </span>
                          <h5 className="light-modal-money">
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
            <Col className="">
              <Row className="d-flex gap-4">
                <Col>
                  <Card>
                    <Card.Body className="p-0">
                      <Card.Title className="pt-0">
                        Acuerdo con el cliente
                      </Card.Title>
                      <Form>
                        <Form.Group
                          className="d-flex w-100"
                          style={{ opacity: areFieldsEnabled ? 1 : 0.5 }}
                        >
                          <Form.Control
                            className="w-100"
                            type="text"
                            placeholder="Monto Pago"
                            value={montoPago}
                            onChange={handleMontoPagoChange} // Actualiza el estado de "Monto Pago"
                            disabled={!areFieldsEnabled} // Deshabilita el campo si no está habilitado
                          />
                        </Form.Group>
                        <div
                          className="d-flex gap-3 w-100"
                          style={{ opacity: areFieldsEnabled ? 1 : 0.5 }}
                        >
                          <Form.Group className="mt-3 w-100">
                            <Form.Control
                              type="text"
                              placeholder="Monto Negociado"
                              value={montoNegociado} // Muestra el valor de "Monto Negociado"
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

                        <div className=" gap-3 d-flex">
                          <div>
                            <Button
                              variant="primary"
                              onClick={handleSetFormValues}
                              disabled={!isCalculateButtonEnabled} // Deshabilita el botón si no es válido
                            >
                              Calcular
                            </Button>
                          </div>
                          <div>
                            <Button
                              variant="primary"
                              onClick={handleAgregarPago} // Llama a la función para agregar el pago
                              disabled={!isAddButtonEnabled} // Deshabilita el botón si no es válido
                            >
                              Agregar
                            </Button>
                          </div>
                        </div>
                      </Form>
                    </Card.Body>
                  </Card>
                </Col>
                <Col className="mt-5">
                  <div className="table-responsive w-100">
                    <Table striped bordered hover variant="dark">
                      <thead>
                        <tr>
                          <th>Fecha y Hora</th>
                          <th>Pago</th>
                          <th>Eliminar</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tablaPagos.length > 0 ? (
                          tablaPagos.map((pago, index) => (
                            <tr key={index}>
                              <td>{`${new Date(
                                pago.fecha
                              ).toLocaleDateString()} ${pago.hora}`}</td>{" "}
                              {/* Combina fecha y hora */}
                              <td>${parseFloat(pago.pago).toFixed(2)}</td>
                              <td>
                                <Button
                                  style={{ padding: "1px 5px" }}
                                  variant="danger"
                                  size="sm"
                                  onClick={() => handleEliminarPago(index)} // Llama a la función para eliminar el registro
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
              {showScrollIndicator && (
                <div
                  className="container-scroll-down"
                  style={{
                    position: "absolute",
                    bottom: "50px",
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
              {/* Calculadora AMEX */}
              <h5 style={{ textAlign: "center", color: "#20c997" }}>
                Calculadora AMEX
              </h5>
              <Col className="p-0">
                <Card className="p-3 mb-0">
                  <Card.Body className="p-0">
                    <Card.Title className="pt-0 ms-3">Datos</Card.Title>
                    <Form className="d-flex gap-4 w-100">
                      <Row className="d-flex w-100">
                        <Form.Group>
                          <Form.Control
                            placeholder="Monto Requerido"
                            type="text"
                            name="montoRequerido"
                            value={formValues.montoRequerido}
                            onChange={(e) =>
                              setFormValues((prev) => ({
                                ...prev,
                                montoRequerido: e.target.value,
                              }))
                            }
                          />
                        </Form.Group>
                        <Form.Group className="mt-3">
                          <Form.Control
                            placeholder="Descuento"
                            type="text"
                            name="descuento"
                            value={parseInt(formValues.descuento, 10) || ""} // Convierte a entero antes de mostrar
                            onChange={(e) =>
                              setFormValues((prev) => ({
                                ...prev,
                                descuento: e.target.value,
                              }))
                            }
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
                            Terminar
                          </Button>
                        </div>
                      </Row>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
              {/* agregar aqui */}
              <Row>
                {/* Resumen */}
                <Col>
                  <Card className="mb-0">
                    <Card.Body>
                      <Row>
                        <Row>
                          <Col>
                            <h6>Plazos</h6>
                            <h5>{calculosData.plazos || 0}</h5>
                          </Col>
                          <Col>
                            <h6>Primer Pago</h6>
                            <h5>
                              ${(calculosData.primerPago || 0).toFixed(2)}
                            </h5>
                          </Col>
                          <Col>
                            <h6>Saldo</h6>
                            <h5>${(calculosData.saldo || 0).toFixed(2)}</h5>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <h6>Monto Negociado</h6>
                            <h5>
                              ${(calculosData.montoNegociado || 0).toFixed(2)}
                            </h5>
                          </Col>
                          <Col>
                            <h6>Descuento</h6>
                            <h5>{(calculosData.descuento || 0).toFixed(2)}</h5>
                          </Col>
                          <Col>
                            <h6>Tasa Mensual</h6>
                            <h5>
                              {calculosData.tasaMensual
                                ? `${calculosData.tasaMensual}%`
                                : "N/A"}
                            </h5>{" "}
                            {/* Mostrar la tasa mensual */}
                          </Col>
                        </Row>
                      </Row>
                    </Card.Body>
                  </Card>
                  {/* Pagos */}
                  <Card className="mt-0">
                    <Card.Body>
                      <div className="d-flex gap-3 mb-3">
                        <h6>Pagos</h6>
                        <Form.Check
                          type="checkbox"
                          label="Pago Inicial"
                          name="agregarPagos"
                          checked={modifyForm.agregarPagos}
                          onChange={(e) =>
                            setModifyForm((prev) => ({
                              ...prev,
                              agregarPagos: e.target.checked, // Cambia el valor de agregarPagos según el estado del checkbox
                              filaMod: e.target.checked ? 0 : null, // Si está marcado, establece filaMod en 0; si no, lo resetea
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
                            value={modifyForm.montoMod}
                            onChange={handleModifyFormChange}
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
                              })); // Cambia "modificar" a 1 al hacer clic
                              handleModifyPayment();
                            }}
                          >
                            Modificar
                          </Button>
                        </div>
                      </Form>
                    </Card.Body>
                  </Card>
                </Col>

                <Col className=" ">
                  {/* Plazos */}
                  <Card className="mb-0">
                    <Card.Body className="">
                      <h6>Plazos</h6>
                      <Table striped bordered hover variant="dark">
                        <thead>
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
                            calculosData.calculos.map((calculo, index) => (
                              <tr
                                key={index}
                                onClick={() => handleRowClick(index)} // Maneja el clic en la fila
                                style={{
                                  cursor: modifyForm.agregarPagos
                                    ? "not-allowed"
                                    : "pointer", // Deshabilita el cursor si el checkbox está marcado
                                  backgroundColor:
                                    selectedRow === index
                                      ? "#0dcaf0"
                                      : "transparent", // Aplica el color directamente
                                  color:
                                    selectedRow === index ? "#fff" : "inherit", // Cambia el color del texto si está seleccionada
                                }}
                              >
                                <td>{calculo.no}</td>
                                <td>
                                  {new Date(calculo.fecha).toLocaleDateString()}
                                </td>
                                <td>${(calculo.saldo || 0).toFixed(2)}</td>
                                <td>${(calculo.pago || 0).toFixed(2)}</td>
                                <td>${(calculo.saldoFinal || 0).toFixed(2)}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="5" className="text-center">
                                No hay datos
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Col>
        </Col>
      </Modal.Body>
    </Modal>
  );
};

export default CalculatorSimulator;
