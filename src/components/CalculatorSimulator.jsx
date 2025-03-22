import { useState, useEffect, useContext } from "react";
import { Modal, Button, Form, Table, Card, Row, Col } from "react-bootstrap";
import "../scss/styles.scss";
import { fetchCalFirtsPart, fetchCalSecondPart } from "../services/gespawebServices";
import { AppContext } from "../pages/Managment";

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
    setSelectedHerramienta(Number(e.target.value)); // Actualiza el idHerramienta seleccionado
  };

  const handleCalculateSecondPart = async () => {
    const idCuenta = searchResults?.[0]?.idCuenta?.trim();
    try {
      const requestData = {
        idHerramienta: selectedHerramienta, // Enviar el idHerramienta seleccionado
        NoCuenta: idCuenta,
        IdCartera: 1,
        MontoRequerido: summaryData.montoRequerido || 17313.91,
        Descuento: 45,
        iMeses: parseInt(formInputs.meses, 10) || 5, // Toma el valor de "Meses"
        dtpFecha: formInputs.fechaPago || "2025-03-22", // Toma el valor de "Fecha Pago"
        periodos: 1,
      };
  
      console.log("Enviando datos al endpoint fetchCalSecondPart:", requestData);
  
      const response = await fetchCalSecondPart(
        requestData.IdCartera,
        requestData.NoCuenta,
        requestData.idHerramienta,
        requestData.MontoRequerido,
        requestData.Descuento,
        requestData.iMeses,
        requestData.dtpFecha,
        requestData.periodos
      );
  
      console.log("Respuesta del endpoint fetchCalSecondPart:", response);
      // Aquí puedes manejar la respuesta como desees
      setCalculosData({
        plazos: response.plazos,
        primerPago: response.pago,
        saldo: response.montoRequerido,
        montoNegociado: response.montoNegociado,
        descuento: response.descuento,
        calculos: response.calculos,
      });
    } catch (error) {
      console.error("Error al enviar los datos al endpoint fetchCalSecondPart:", error);
    }
  };

  const handleSetFormValues = () => {
    setFormValues({
      montoRequerido: summaryData.montoRequerido.toFixed(2),
      descuento: summaryData.descuento.toFixed(2),
    });
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
                            No hay datos disponibles
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
            <Row className="">
              <Row className="d-flex gap-4">
                <Col>
                  <Card>
                    <Card.Body className="p-0">
                      <Card.Title className="pt-0">
                        Acuerdo con el cliente
                      </Card.Title>
                      <Form>
                        <Form.Group className="d-flex gap-3">
                          <Form.Control
                            type="text"
                            placeholder="Monto negociado"
                          />
                          <div className="text-center ">
                        
                          </div>
                        </Form.Group>
                        <div className="d-flex gap-3 w-100 mb-3">
                          <Form.Group className="mt-3 w-100">
                            <Form.Label>Monto Pago</Form.Label>
                            <Form.Control type="text" />
                          </Form.Group>
                          <Form.Group className="mt-3 w-100">
                            <Form.Label>Máximo 15 días</Form.Label>
                            <Form.Control type="date" />
                          </Form.Group>
                        </div>

                        <div className="mt-3 gap-3 d-flex">
                          <div>
                            <Button variant="primary" onClick={handleSetFormValues}>
                              Calcular
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
                          <th>Fecha</th>
                          <th>Pago</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>22/01/2025 8:31 a.m.</td>
                          <td>$10,479.83</td>
                        </tr>
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
                <Card className="p-3">
                  <Card.Body className="p-0">
                    <Card.Title className="pt-0 ms-3">Datos</Card.Title>
                    <Form className="d-flex gap-5 w-100">
                      <Row className="d-flex w-100">
                        <Form.Group>
                          <Form.Label>Monto Requerido</Form.Label>
                          <Form.Control type="text" value={formValues.montoRequerido} readOnly />
                        </Form.Group>
                        <Form.Group className="mt-3">
                          <Form.Label>Descuento</Form.Label>
                          <Form.Control type="text" value={formValues.descuento} readOnly />
                        </Form.Group>
                        <Form.Group className="mt-3">
                          <Form.Label>Tasa Mensual</Form.Label>
                          <Form.Control type="text" />
                        </Form.Group>
                      </Row>
                      <Row className="d-flex w-100">
                        <Form.Group className="mt-3">
                          <Form.Control
                            type="text"
                            placeholder="Meses"
                            name="meses"
                            value={formInputs.meses}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                        <Form.Group className="mt-3">
                          <Form.Control
                            type="date"
                            placeholder="Fecha Pago"
                            name="fechaPago"
                            value={formInputs.fechaPago}
                            onChange={handleInputChange}
                          />
                        </Form.Group>
                        <div className="mt-4">
                        <Button variant="secondary" onClick={handleCalculateSecondPart}>
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
                <Card className="mb-3">
                  <Card.Body>
                    <Row>
                      <Col>
                        <h6>Plazos</h6>
                        <h5>{calculosData.plazos}</h5>
                      </Col>
                      <Col>
                        <h6>Primer Pago</h6>
                        <h5>${calculosData.primerPago.toFixed(2)}</h5>
                      </Col>
                      <Col>
                        <h6>Saldo</h6>
                        <h5>${calculosData.saldo.toFixed(2)}</h5>
                      </Col>
                      <Col>
                        <h6>Monto Negociado</h6>
                        <h5>${calculosData.montoNegociado.toFixed(2)}</h5>
                      </Col>
                      <Col>
                        <h6>Descuento</h6>
                        <h5>${calculosData.descuento.toFixed(2)}</h5>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                {/* Plazos */}
                <Card className="mb-3">
                  <Card.Body>
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
                        {calculosData.calculos.length > 0 ? (
                          calculosData.calculos.map((calculo, index) => (
                            <tr key={index}>
                              <td>{calculo.no}</td>
                              <td>{new Date(calculo.fecha).toLocaleDateString()}</td>
                              <td>${calculo.saldo.toFixed(2)}</td>
                              <td>${calculo.pago.toFixed(2)}</td>
                              <td>${calculo.saldoFinal.toFixed(2)}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="5" className="text-center">
                              No hay datos disponibles
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>

                {/* Pagos */}
                <Card>
                  <Card.Body>
                    <h6>Pagos</h6>
                    <Form>
                      <Form.Check
                        type="checkbox"
                        label="Pago Inicial"
                        className="mb-3"
                      />
                      <Form.Group className="mb-3">
                        <Form.Label>
                          Seleccione el pago para modificar
                        </Form.Label>
                        <Form.Control type="text" value={`$${0}`} readOnly />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Fecha Pago</Form.Label>
                        <Form.Control type="date" />
                      </Form.Group>
                      <Button variant="primary">Modificar</Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Row>
            </Row>
          </Col>
        </Col>
      </Modal.Body>
    </Modal>
  );
};

export default CalculatorSimulator;