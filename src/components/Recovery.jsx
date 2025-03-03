import { useState, useEffect } from "react";
import { Modal, Button, Form, ListGroup, Placeholder } from "react-bootstrap";
import { userRecovery, userNegotiations } from "../services/gespawebServices";
import NegotiationsMonth from "./NegotiationsMonth.jsx";
const Recovery = ({ show, handleClose }) => {
  const [mes, setMes] = useState("actual");
  const [data, setData] = useState({
    montoNegociado: 0,
    negociaciones: 0,
    montoParcial: 0,
    montoCumplido: 0,
    metaCumplimiento: 0
  });
  const [loading, setLoading] = useState(true);
  const [negotiations, setNegotiations] = useState([]);
  const responseData = JSON.parse(localStorage.getItem("responseData"));
  const idEjecutivo = responseData?.ejecutivo?.infoEjecutivo?.idEjecutivo; // Get idEjecutivo from respo
  const fetchData = async (selectedMes) => {
    try {
      setLoading(true);

      const actual = selectedMes === "actual" ? 1 : 0;
      const response = await userRecovery(idEjecutivo, actual);
      setData({
        montoNegociado: response.montoNegociado,
        negociaciones: response.negociaciones,
        montoParcial: response.montoParcial,
        montoCumplido: response.montoCumplido,
        metaCumplimiento: response.metaCumplimiento
      });
      if (actual === 1) {
        const negotiationsResponse = await userNegotiations(idEjecutivo);
        setNegotiations(negotiationsResponse.negociaciones);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching recovery data:", error);
      setLoading(false);
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
    return `${Math.round(number * 100)}%`;
  };

  return (
    <Modal show={show} onHide={handleClose} size="xl" centered>
      <Modal.Header closeButton className="text-white">
        <Modal.Title>
          <i className="bi bi-calendar-plus"> Recuperación</i>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="text-white">
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
              <ListGroup.Item>
                <div className="row text-center">
                  <div className="col">
                    {loading ? (
                      <Placeholder as="h2" animation="glow">
                        <Placeholder xs={6} />
                      </Placeholder>
                    ) : (
                      <h2>{formatNumber(data.montoNegociado)}</h2>
                    )}
                    <span>Negociado</span>
                  </div>
                  <div className="col">
                    <h2>/</h2>
                  </div>
                  <div className="col">
                    {loading ? (
                      <Placeholder as="h2" animation="glow">
                        <Placeholder xs={6} />
                      </Placeholder>
                    ) : (
                      <h2>{data.negociaciones}</h2>
                    )}
                    <span>Negociaciones</span>
                  </div>
                  <div className="col">
                    <h2>=</h2>
                  </div>
                  <div className="col">
                    {loading ? (
                      <Placeholder as="h2" animation="glow">
                        <Placeholder xs={6} />
                      </Placeholder>
                    ) : (
                      <h2>
                        {data.negociaciones > 0
                          ? formatNumber(
                              data.montoNegociado / data.negociaciones
                            )
                          : "0"}
                      </h2>
                    )}
                    <span>Promedio</span>
                    <span></span>
                  </div>
                </div>
              </ListGroup.Item>

              <ListGroup.Item variant="dark">
                <div className="row text-center">
                  <div className="col">
                    {loading ? (
                      <Placeholder as="h2" animation="glow">
                        <Placeholder xs={6} />
                      </Placeholder>
                    ) : (
                      <h2>{formatNumber(data.montoParcial)}</h2>
                    )}
                    <span>Parcial</span>
                    <br />
                    {loading ? (
                      <Placeholder as="h6" animation="glow">
                        <Placeholder xs={6} />
                      </Placeholder>
                    ) : (
                      <h6>
                        {data.montoCumplido + data.negociaciones > 0
                          ? formatPorcent(
                              data.montoParcial /
                                (data.montoCumplido + data.montoParcial)
                            )
                          : "0"}
                      </h6>
                    )}
                  </div>
                  <div className="col">
                    <h2>/</h2>
                  </div>
                  <div className="col">
                    {loading ? (
                      <Placeholder as="h2" animation="glow">
                        <Placeholder xs={6} />
                      </Placeholder>
                    ) : (
                      <h2>{formatNumber(data.montoCumplido)}</h2>
                    )}
                    <span>Cumplido</span>
                    <br />
                    {loading ? (
                      <Placeholder as="h6" animation="glow">
                        <Placeholder xs={6} />
                      </Placeholder>
                    ) : (
                      <h6>
                        {" "}
                        {data.montoCumplido + data.montoParcial > 0
                          ? formatPorcent(
                              data.montoCumplido /
                                (data.montoCumplido + data.montoParcial)
                            )
                          : "0"}
                      </h6>
                    )}
                  </div>
                  <div className="col">
                    <h2>=</h2>
                  </div>
                  <div className="col">
                    {loading ? (
                      <Placeholder as="h2" animation="glow">
                        <Placeholder xs={6} />
                      </Placeholder>
                    ) : (
                      <h2>
                        {data.montoCumplido + data.montoParcial > 0
                          ? "100%"
                          : formatNumber(
                              data.montoCumplido + data.montoParcial
                            )}
                      </h2>
                    )}
                    <span>Pagado</span>
                  </div>
                </div>
              </ListGroup.Item>
              <ListGroup.Item variant="dark">
                <div className="row text-center">
                  <div className="col">
                    {loading ? (
                      <Placeholder as="h2" animation="glow">
                        <Placeholder xs={6} />
                      </Placeholder>
                    ) : (
                      <h2>
                        {data.montoParcial > 0
                          ? formatPorcent(
                              data.montoParcial / data.metaCumplimiento
                            )
                          : "0"}
                      </h2>
                    )}
                    <span>Alcance</span>
                  </div>
                  <div className="col">
                    <h2>/</h2>
                  </div>
                  <div className="col">
                    {loading ? (
                      <Placeholder as="h2" animation="glow">
                        <Placeholder xs={6} />
                      </Placeholder>
                    ) : (
                      <h2>
                        {data.montoCumplido > 0
                          ? formatPorcent(
                              data.montoCumplido / data.metaCumplimiento
                            )
                          : "0"}
                      </h2>
                    )}
                    <span>Logro</span>
                  </div>
                  <div className="col">
                    <h2>=</h2>
                  </div>
                  <div className="col">
                    {loading ? (
                      <Placeholder as="h2" animation="glow">
                        <Placeholder xs={6} />
                      </Placeholder>
                    ) : (
                      <h2>
                        {data.montoCumplido > 0
                          ? formatPorcent(
                              (data.montoCumplido + data.montoParcial) /
                                data.metaCumplimiento
                            )
                          : "0"}
                      </h2>
                    )}
                    <span>Avance</span>
                  </div>
                </div>
              </ListGroup.Item>
            </ListGroup>
            {/* Negociaciones del mes */}
            <NegotiationsMonth negotiations={negotiations} />
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer className="text-white">
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default Recovery;
