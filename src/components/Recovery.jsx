import { useState, useEffect } from "react";
import { Modal, Button, Form, ListGroup, Table, Card } from "react-bootstrap";
import { userRecovery } from "../services/gespawebServices";

const Recovery = ({ show, handleClose }) => {
  const [mes, setMes] = useState("actual");
  const [data, setData] = useState({
    montoNegociado: 0,
    negociaciones: 0,
    montoParcial: 0,
    montoCumplido: 0,
    metaCumplimiento: 0
  });

  const fetchData = async (selectedMes) => {
    try {
      const idEjecutivo = 14126;
      const actual = selectedMes === "actual" ? 1 : 0;
      const response = await userRecovery(idEjecutivo, actual);
      setData({
        montoNegociado: response.montoNegociado,
        negociaciones: response.negociaciones,
        montoParcial: response.montoParcial,
        montoCumplido: response.montoCumplido,
        metaCumplimiento: response.metaCumplimiento
      });
    } catch (error) {
      console.error("Error fetching recovery data:", error);
    }
  };

  useEffect(() => {
    if (show) {
      fetchData(mes);
    }
  }, [show, mes]);

  const handleMesChange = (selectedMes) => {
    setMes(selectedMes);
    setData({
      montoNegociado: 0,
      negociaciones: 0,
      montoParcial: 0,
      montoCumplido: 0,
      metaCumplimiento: 0
    });
    fetchData(selectedMes);
  };

  const formatNumber = (number) => {
    return (
      "$" +
      number.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    );
  };

  const formatPorcent = (number) => {
    return `${number.toFixed(2)}%`;
  };

  return (
    <Modal show={show} onHide={handleClose} size="xl" centered>
      <Modal.Header closeButton className="bg-dark text-white">
        <Modal.Title>
          <i className="bi bi-calendar-plus"> Recuperación</i>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="bg-dark text-white">
        <div className="row">
          {/* Selección de Mes */}
          <div className="col-sm-2">
            <p>Mes:</p>
            <Form.Check
              type="radio"
              label="Actual"
              name="mes"
              checked={mes === "actual"}
              onChange={() => handleMesChange("actual")}
            />
            <Form.Check
              type="radio"
              label="Anterior"
              name="mes"
              checked={mes === "anterior"}
              onChange={() => handleMesChange("anterior")}
            />
          </div>

          {/* Resumen */}
          <div className="col-sm-10">
            <ListGroup>
              <ListGroup.Item variant="dark">
                <div className="row text-center">
                  <div className="col">
                    <h2>{formatNumber(data.montoNegociado)}</h2>
                    <span>Negociado</span>
                  </div>
                  <div className="col">
                    <h2>/</h2>
                  </div>
                  <div className="col">
                    <h2>{data.negociaciones}</h2>
                    <span>Negociaciones</span>
                  </div>
                  <div className="col">
                    <h2>=</h2>
                  </div>
                  <div className="col">
                    <h2>
                      {data.negociaciones > 0
                        ? formatNumber(data.montoNegociado / data.negociaciones)
                        : "0"}
                    </h2>
                    <span>Promedio</span>
                  </div>
                </div>
              </ListGroup.Item>

              <ListGroup.Item variant="dark">
                <div className="row text-center">
                  <div className="col">
                    <h2>
                      {data.montoCumplido + data.negociaciones > 0
                        ? formatPorcent(
                            data.montoParcial /
                              (data.montoCumplido + data.montoParcial)
                          )
                        : data.montoParcial}
                    </h2>
                    <span>Parcial</span>
                  </div>
                  <div className="col">
                    <h2>/</h2>
                  </div>
                  <div className="col">
                    <h2>
                      {data.montoCumplido + data.montoParcial > 0
                        ? formatNumber(
                            data.montoParcial /
                              (data.montoCumplido + data.montoParcial)
                          )
                        : formatNumber(data.montoCumplido)}
                    </h2>
                    <span>Cumplido</span>
                  </div>
                  <div className="col">
                    <h2>=</h2>
                  </div>
                  <div className="col">
                    <h2>
                      {data.montoCumplido + data.montoParcial > 0
                        ? "100%"
                        : formatNumber(data.montoCumplido + data.montoParcial)}
                    </h2>
                    <span>Pagado</span>
                  </div>
                </div>
              </ListGroup.Item>
              <ListGroup.Item variant="dark">
                <div className="row text-center">
                  <div className="col">
                    <h2>
                      {formatPorcent(data.montoParcial / data.metaCumplimiento)}
                    </h2>
                    <span>Alcance</span>
                  </div>
                  <div className="col">
                    <h2>/</h2>
                  </div>
                  <div className="col">
                    <h2>
                      {formatPorcent(
                        data.montoCumplido / data.metaCumplimiento
                      )}
                    </h2>
                    <span>Logro</span>
                  </div>
                  <div className="col">
                    <h2>=</h2>
                  </div>
                  <div className="col">
                    <h2>
                      {formatPorcent(
                        (data.montoCumplido + data.montoParcial) /
                          data.metaCumplimiento
                      )}
                    </h2>
                    <span>Avance</span>
                  </div>
                </div>
              </ListGroup.Item>
            </ListGroup>
          </div>
        </div>

        <hr />

        {/* Negociaciones del mes */}
        <h5>Negociaciones del mes</h5>
        <ListGroup>
          <ListGroup.Item variant="dark">
            <div className="row text-center">
              <div className="col">
                <h2>0%</h2>
                <span>Alcance</span>
              </div>
              <div className="col">
                <h2>+</h2>
              </div>
              <div className="col">
                <h2>0%</h2>
                <span>Logro</span>
              </div>
              <div className="col">
                <h2>=</h2>
              </div>
              <div className="col">
                <h2>0%</h2>
                <span>Avance</span>
              </div>
            </div>
          </ListGroup.Item>
        </ListGroup>

        <Card className="mt-3 bg-secondary text-white">
          <Card.Body>
            <div className="table-responsive">
              <Table striped bordered hover variant="dark">
                <thead>
                  <tr>
                    <th>Cuenta</th>
                    <th>Herramienta</th>
                    <th>Estado</th>
                    <th>Fecha Creación</th>
                    <th>Fecha Término</th>
                    <th>Negociado</th>
                    <th>Pagado</th>
                    <th>Pagos</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="8" className="text-center">
                      Sin datos
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>
      </Modal.Body>

      <Modal.Footer className="bg-dark text-white">
        <h6>Ninguna negociación se ha realizado a lo largo del mes</h6>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Recovery;
