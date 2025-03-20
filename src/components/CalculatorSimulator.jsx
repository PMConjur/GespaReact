import { useState, useEffect } from "react";
import { Modal, Button, Form, Table, Card, Row, Col } from "react-bootstrap";
import "../scss/styles.scss";
import { fetchCalFirtsPart } from "../services/gespawebServices";

const CalculatorSimulator = ({ show, handleClose }) => {
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [summaryData, setSummaryData] = useState({
    montoRequerido: 0,
    montoDescuento: 0,
    saldo: 0,
    fechaCorte: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const Cartera = 1; // Ejemplo de valor
        const NoCuenta = "370700000000004"; // Ejemplo de valor
        const idHerr = 136; // Ejemplo de valor

        const data = await fetchCalFirtsPart(Cartera, NoCuenta, idHerr);

        // Extraer datos de ofrecimientos y resumen
        if (data && Array.isArray(data.ofrecimientos)) {
          setTableData(data.ofrecimientos);
          setSummaryData({
            montoRequerido: data.montoRequerido,
            montoDescuento: data.montoDescuento,
            saldo: data.saldo,
            fechaCorte: data.fechaCorte,
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

    fetchData();
  }, []);

  const handleScroll = (e) => {
    if (e.target.scrollTop > 10) {
      setShowScrollIndicator(false);
    } else {
      setShowScrollIndicator(true);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title style={{ color: "#20c997" }} className="ms-3">
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
            <h5 style={{ color: "#0dcaf0" }} className="text-center">
              Ofrecimientos
            </h5>
            <Row className="table-responsive d-flex">
              <Col>
                <Card className="rounded-lg mb-0">
                  <Card.Body className="d-flex p-0 pb-3 w-100">
                    <Form
                      className="d-flex w-100 gap-5"
                      style={{ alignItems: "center" }}
                    >
                      <Col>
                        <Form.Group>
                          <Form.Select>
                            <option>Seleccionar Herramienta</option>
                            <option>Convenio</option>
                            <option>Parcial</option>
                            <option>PIF</option>
                            <option>PPA</option>
                            <option>Ajuste</option>
                            <option>APR</option>
                            <option>PPA+AC</option>
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
                              {summaryData.fechaCorte}
                            </h5>
                          </div>
                        </div>
                      </Col>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
              <Col>
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
                      tableData.map((row, index) => (
                        <tr key={index}>
                          <td>{row.fecha_Insert}</td>
                          <td>{row.herramienta}</td>
                          <td>{row.idEstado}</td>
                          <td>{row.vencimiento}</td>
                          <td>{row.saldoInterés}</td>
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
              </Col>
            </Row>
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
                          <Button variant="secondary">Calcular</Button>
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
                      <div className=" mt-3">
                        <Button variant="primary">Agregar</Button>
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
          </Col>
          {showScrollIndicator && (
            <div
              className="container-scroll-down"
              style={{
                position: "absolute",
                bottom: "10px",
                left: "50%",
                transform: "translateX(-50%)",
                textAlign: "center",
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
          <Row className="m-0">
            <h5 style={{ textAlign: "center", color: "#0dcaf0" }}>
              Calculadora AMEX
            </h5>
            <Col className="p-0">
              <Card className="rounded-lg">
                <Card.Body className="p-0">
                  <Card.Title className="pt-0 ms-3">Datos</Card.Title>
                  <Form className="d-flex gap-5 w-100">
                    <Row className="d-flex w-100">
                      <Form.Group>
                        <Form.Label>Monto Requerido</Form.Label>
                        <Form.Control type="text" />
                      </Form.Group>
                      <Form.Group className="mt-3">
                        <Form.Label>Descuento</Form.Label>
                        <Form.Control type="text" />
                      </Form.Group>
                      <Form.Group className="mt-3">
                        <Form.Label>Tasa Mensual</Form.Label>
                        <Form.Control type="text" />
                      </Form.Group>
                    </Row>
                    <Row className="d-flex w-100">
                      <Form.Group className="mt-3">
                        <Form.Label>Meses</Form.Label>
                        <Form.Control type="text" />
                      </Form.Group>
                      <Form.Group className="mt-3">
                        <Form.Label>Fecha Pago</Form.Label>
                        <Form.Control type="date" />
                      </Form.Group>
                      <div className="mt-3">
                        <Button variant="secondary">Terminado</Button>
                      </div>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Modal.Body>
    </Modal>
  );
};

export default CalculatorSimulator;