import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Row, Col, Stack } from "react-bootstrap";
import {
  PersonFill,
  Cash,
  ListOl,
  ChatLeftDotsFill,
  EnvelopePaperFill,
  TelephoneInboundFill,
  EnvelopeAtFill
} from "react-bootstrap-icons";
import "../scss/styles.scss";
import { useContext } from "react";
import { AppContext } from "../pages/Managment";

const DataCard = () => {
  const { searchResults } = useContext(AppContext);

  // Datos predeterminados en caso de que no haya resultados
  const defaultData = {
    nombreDeudor: "-",
    saldo: "-",
    minimoAtrasado: "-"
  };

  // Usar el primer resultado o los datos predeterminados
  const result = searchResults[0] || defaultData;

  // Formatear números con validación adicional
  const formatNumber = (number) => {
    if (number === null || number === undefined || isNaN(number)) return "-";
    return number.toLocaleString("es-MX", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <Row className="dashboard">
      <Col xxl={3} xl={6} md={6}>
        <Card className="warning-card text-light">
          <Card.Body>
            <Card.Title>Nombre:</Card.Title>
            <div className="d-flex align-items-center">
              <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                <PersonFill style={{ fontSize: "32px", color: "#6dd6ff" }} />
              </div>
              <div className="ps-3">
                <h6
                  style={{ fontSize: "1.2rem", color: "#6dd6ff" }}
                  id="nombreDeudor"
                >
                  {result.nombreDeudor}
                </h6>
                <span className="small pt-1 fw-bold">Deudor</span>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Col xxl={3} xl={6} md={6}>
        <Card className="warning-card text-light">
          <Card.Body>
            <Card.Title>Saldo Actual:</Card.Title>
            <div className="d-flex align-items-center">
              <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                <Cash style={{ fontSize: "32px", color: "#39FC8D" }} />
              </div>
              <div className="ps-3">
                <h6 style={{ fontSize: "1.5rem", color: "#39FC8D" }}>
                  {result.saldo !== "-"
                    ? "$" + formatNumber(parseFloat(result.saldo))
                    : "-"}
                </h6>
                <span className="small pt-1 fw-bold">Saldo registrado</span>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Col xxl={6} xl={6} md={6}>
        <Card className="warning-card text-light">
          <Card.Body>
            <Card.Title>Accionamiento:</Card.Title>
            <div className="d-flex align-items-center">
              <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                <ListOl style={{ fontSize: "32px", color: "#D3BBF8" }} />
              </div>
              <div className="ps-3">
                <Stack direction="horizontal" gap={6}>
                  <div className="p-2 action">
                    <ChatLeftDotsFill />
                    <span> SMS : 191</span>
                  </div>
                  <div className="p-2 action">
                    <EnvelopePaperFill />
                    <span> Carta : 1</span>
                  </div>
                  <div className="p-2 action">
                    <TelephoneInboundFill />
                    <span> Blaster : 33</span>
                    </div>
                  <div className="p-2 action">
                    <EnvelopeAtFill />
                    <span> Correo : 4</span>
                  </div>
                </Stack>
                <span className="small pt-1 fw-bold">Conteo</span>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default DataCard;
