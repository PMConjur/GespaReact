import React from "react";
import { Modal, Button, Form, Table, FloatingLabel, Card, Row, Col } from "react-bootstrap";

const CalculatorSimulator = ({ show, handleClose }) => {
  return (
    <Modal show={show} onHide={handleClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title className="text-white">
          <i className="bi bi-hand-index-thumb"> Simulador</i>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Col>
          {/* Ofrecimientos */}
          <Col sm={12}>
            <h5>Ofrecimientos</h5>
            <div className="table-responsive d-flex">
            <Col>
              <Card className="rounded-lg">
                  <Card.Body className="d-flex pt-0">
                    <Form className="w-100">
                      <Form.Group className="w-auto">
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
                      <div className="d-flex">
                      <div className="ps-3 mt-3">
                        <span className="text-light small pt-1 fw-bold">Monto Requerido</span>
                        <h4 className="warning-modal-money">$17,313.91</h4>
                      </div>
                      <div className="ps-3 mt-3">
                        <span className="text-light small pt-1 fw-bold">45% Desc</span>
                        <h4 className="success-modal-money">$14,313.91</h4>
                      </div>
                      <div className="ps-3 mt-3">
                        <span className="text-light small pt-1 fw-bold">Saldo</span>
                        <h4 className="info-modal-money">$31,313.91</h4>
                      </div>
                      <div className="ps-3 mt-3">
                        <span className="text-light small pt-1 fw-bold">Corte</span>
                        <h6 className="light-modal-money">16/05/2025</h6>
                      </div>
                      </div>
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
                  <tr>
                    <td>22/01/2025 8:31 a.m.</td>
                    <td>Convenio</td>
                    <td>Incumplida</td>
                    <td>29/11/2024</td>
                    <td>$31,479.83</td>
                  </tr>
                </tbody>
              </Table>
              </Col>
            </div>
            <Row sm={12} className="d-flex">
              <Col sm={6}>
                <Card className="rounded-lg">
                  <Card.Body>
                    <Card.Title className="pt-0">Acuerdo con el cliente</Card.Title>
                    <Form>
                      <Form.Group className="d-flex gap-3">
                        <Form.Control type="text" placeholder="Monto negociado" />
                        <div className="text-center mt-3">
                        <Button variant="secondary">Calcular</Button>
                      </div>
                      </Form.Group>
                      <div className="d-flex gap-3 w-100">
                      <Form.Group className="mt-3 w-100">
                        <Form.Label>Monto Pago</Form.Label>
                        <Form.Control type="text" />
                      </Form.Group>
                      <Form.Group className="mt-3 w-100">
                        <Form.Label>Máximo 15 días</Form.Label>
                        <Form.Control type="date" />
                      </Form.Group>
                      </div>
                      <div className="text-center mt-3">
                        <Button variant="primary">Agregar</Button>
                      </div>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
              <Col sm={6} className="mt-3">
                <div className="table-responsive">
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

          {/* Calculadora AMEX */}
          <Col sm={7}>
            <h5>Calculadora AMEX</h5>
            <Row>
              <Col sm={3}>
                <Card className="rounded-lg">
                  <Card.Body>
                    <Card.Title>Datos</Card.Title>
                    <Form>
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
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
              <Col sm={9}>
                <h5>Resumen Calculadora</h5>
                <Row>
                  <Col>
                    <Form>
                      <div className="ps-3">
                        <span className="text-light small pt-1 fw-bold">Plazos</span>
                        <h6 className="light-modal-money">12</h6>
                      </div>
                      <div className="ps-3">
                        <span className="text-light small pt-1 fw-bold">Primer Pago</span>
                        <h6 className="light-modal-money">$3,711.70</h6>
                      </div>
                      <div className="ps-3">
                        <span className="text-light small pt-1 fw-bold">Saldo</span>
                        <h6 className="light-modal-money">$31,711.70</h6>
                      </div>
                      <div className="ps-3">
                        <span className="text-light small pt-1 fw-bold">Monto Negociado</span>
                        <h6 className="light-modal-money">$44,711.70</h6>
                      </div>
                      <div className="ps-3">
                        <span className="text-light small pt-1 fw-bold">Descuento</span>
                        <h6 className="light-modal-money">$44,711.70</h6>
                      </div>
                    </Form>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col sm={8}>
                    <h5>Plazos</h5>
                    <div className="table-responsive">
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
                          <tr>
                            <td>1</td>
                            <td>22/01/2025</td>
                            <td>$44,540.52</td>
                            <td>$3,540.52</td>
                            <td>$40,540.52</td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Col>
      </Modal.Body>
    </Modal>
  );
};

export default CalculatorSimulator;