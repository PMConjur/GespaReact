import { Row, Col } from "react-bootstrap";

const DebtorInformation = () => {
  return (
    <Row>
      <h4 className="text-secondary">
        Cartera: <strong className="text-white">American Express</strong>
      </h4>{" "}
      <Col xs={12} md={6} className="d-block d-md-flex">
        {[
          { href: "#", label: "Inicio", color: "lightgreen" },
          { href: "#", label: "Productividad", color: "lightblue" },
          { href: "#", label: "Recuperación", color: "#6495ED" },
          { href: "#", label: "Tiempos", color: "orange" },
          { href: "#", label: "Simulador", color: "lightblue" }
        ].map(({ href, label, color }, index) => (
          <div>
          <a
            key={index}
            href={href}
            style={{ color, textDecoration: "none", marginRight: "5px" }}
          >     
            {label}
          </a>
          </div>
        ))}
      </Col>
    </Row>
  );
};

export default DebtorInformation;
