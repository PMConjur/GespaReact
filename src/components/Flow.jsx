import { auto } from "@popperjs/core";
import { Row, Col, Card } from "react-bootstrap";
import Maintenance from "../assets/img/maintenance.png";
import Mantenimiento from "../assets/img/mantenimiento.jpg";
const Flow = () => {
  return (
    <Row xs={auto} md={auto} className="g-2">
      {Array.from({ length: 1 }).map((_, idx) => (
        <Col key={idx} md={12}>
          <Card>
                      <div style={{ display: 'flex', justifyContent: 'center' }}> {/* Contenedor para centrar la imagen */}
                        <Card.Img
                          variant="top"
                          src={Mantenimiento}
                          style={{
                            width: "300px",
                            objectFit: "cover",
                            resize: "both",
                          }}
                        />
                      </div>
                      <Card.Body>
                        <Card.Title>Flujo de llamadas</Card.Title>
                        <Card.Text>Estamos trabajando en ello...</Card.Text>
                      </Card.Body>
                    </Card>
        </Col>
      ))}
    </Row>
  );
};

export default Flow;
