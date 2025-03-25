import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Row, Col } from "react-bootstrap";
import { PersonFill, Cash, CurrencyDollar } from "react-bootstrap-icons";
import "../scss/styles.scss";
import { useContext } from "react";
import { AppContext } from "../pages/Managment";
import CorazonRojo from "../assets/img/CRojo.jpg";
import CorazonVerde from "../assets/img/CVerde.jpg";
import CorazonBlanco from "../assets/img/CBlanco.jpg";

const DataCard = () => {
  const { searchResults } = useContext(AppContext);

  const renderSituacion = (situacion) => {
    let iconoCorazon;
    let colorTexto;

    // Asignar la URL de la imagen y el color del texto según la situación
    switch (situacion) {
      case "Incumplió negociación":
      case "En Proceso":
      case "Accionamiento":
        iconoCorazon = CorazonRojo; // Corazón rojo
        colorTexto = "#f14b41"; // Texto rojo
        break;
      case "Sondeo":
      case "Pagada":
        iconoCorazon = CorazonVerde; // Corazón verde
        colorTexto = "#65f3a3"; // Texto verde
        break;
      case "Nueva":
      default:
        iconoCorazon = CorazonBlanco; // Corazón blanco
        colorTexto = "#ffffff"; // Texto blanco
        break;
    }

    return (
      <Card.Body>
        <Card.Title>Situación:</Card.Title>
        <div className="d-flex align-items-center">
          <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
            <img
              src={iconoCorazon} // Renderizar la imagen como <img>
              alt="Situación"
              style={{
                width: "42px",
                height: "42px",
                marginTop: "3px",
              }}
            />
          </div>
          <div className="ps-3">
            <h6 style={{ fontSize: "1.8rem", color: colorTexto }}>
              {situacion || "N/A"} {/* Mostrar "N/A" si no hay situación */}
            </h6>
            <span className="small pt-1 fw-bold">Negociación</span>
          </div>
        </div>
      </Card.Body>
    );
  };

  const defaultData = {
    nombreDeudor: "-",
    saldo: "-",
    minimoAtrasado: "-",
    situacion: "-",
  };

  const result = searchResults[0] || defaultData;

  const formatNumber = (number) => {
    if (isNaN(number)) return "-";
    return number.toLocaleString("es-MX", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
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

      <Col xxl={3} xl={6} md={6}>
        <Card className="warning-card text-light">
          <Card.Body>
            <Card.Title>Mínimo Mas Atrasado:</Card.Title>
            <div className="d-flex align-items-center">
              <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
                <CurrencyDollar
                  style={{ fontSize: "32px", color: "#f1a441" }}
                />
              </div>
              <div className="ps-3">
                <h6 style={{ fontSize: "1.5rem", color: "#f1a441" }}>
                  {result.minimoAtrasado !== "-"
                    ? "$" + formatNumber(parseFloat(result.minimoAtrasado))
                    : "-"}
                </h6>
                <span className="small pt-1 fw-bold">Monto reflejado</span>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Col>

      <Col xxl={3} xl={6} md={6}>
        <Card className="warning-card text-light">
          {renderSituacion(result.situacion)}
        </Card>
      </Col>
    </Row>
  );
};

export default DataCard;