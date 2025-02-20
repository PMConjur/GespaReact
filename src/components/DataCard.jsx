import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Row, Col } from "react-bootstrap";
import { PersonFill, Cash, CurrencyDollar } from "react-bootstrap-icons";
import "../scss/styles.scss";

const DataCard = () => {
  return (
    <Row className="dashboard">
      <Col xs={12} md={3}>
        <Card
          className="warning-card text-light"
          style={{ backgroundColor: "#1d1f20" }}
        >
          <Card.Body>
            <Card.Title>Nombre:</Card.Title>
            <div className="d-flex align-items-center">
              <div className="card-icon rounded-circle d-flex align-items-center justify-content-center bg-light">
                <PersonFill
                  style={{ fontSize: "32px", color: "#55b0d5" }}
                ></PersonFill>
              </div>
              <div className="ps-3">
                <h6
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#55b0d5"
                  }}
                >
                  BRUNO DIAZ
                </h6>
                <span className="small pt-1 fw-bold">Monto reflejado</span>
              </div>
            </div>
          </Card.Body>
        </Card>
        <br />
      </Col>

      <Col xs={12} md={3}>
        <Card
          className="warning-card text-light"
          style={{ backgroundColor: "#1d1f20" }}
        >
          <Card.Body>
            <Card.Title>Saldo Actual:</Card.Title>
            <div className="d-flex align-items-center">
              <div className="card-icon rounded-circle d-flex align-items-center justify-content-center bg-light">
                <Cash style={{ fontSize: "32px", color: "#65f3a3" }}></Cash>
              </div>
              <div className="ps-3">
                <h6
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#65f3a3"
                  }}
                >
                  $31,479.83
                </h6>
                <span className="small pt-1 fw-bold">Saldo registrado</span>
              </div>
            </div>
          </Card.Body>
        </Card>
        <br />
      </Col>
      <Col xs={12} md={3}>
        <Card
          className="warning-card text-light"
          style={{ backgroundColor: "#1d1f20" }}
        >
          <Card.Body>
            <Card.Title>Mínimo Mas Atrasado:</Card.Title>
            <div className="d-flex align-items-center">
              <div className="card-icon rounded-circle d-flex align-items-center justify-content-center bg-light">
                <CurrencyDollar
                  style={{ fontSize: "32px", color: "#f1a441" }}
                ></CurrencyDollar>
              </div>
              <div className="ps-3">
                <h6
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                    color: "#f1a441"
                  }}
                >
                  $1,346.45
                </h6>
                <span className="small pt-1 fw-bold">Monto reflejado</span>
              </div>
            </div>
          </Card.Body>
        </Card>
        <br />
      </Col>
      <Col xs={12} md={3}>
        <Card
          className="warning-card text-light"
          style={{ backgroundColor: "#1d1f20" }}
        >
          <Card.Body>
            <Card.Title>Situación:</Card.Title>
            <div className="d-flex align-items-center">
              <div className="card-icon rounded-circle d-flex align-items-center justify-content-center bg-light">
                <CurrencyDollar
                  style={{ fontSize: "32px", color: "#f14b41" }}
                ></CurrencyDollar>
              </div>
              <div className="ps-3">
                <h6
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: "bold",
                    color: "#f14b41"
                  }}
                >
                  Incumplió
                </h6>
                <span className="small pt-1 fw-bold">Negociación</span>
              </div>
            </div>
          </Card.Body>
        </Card>
        <br />
      </Col>
    </Row>
  );
};

export default DataCard;
