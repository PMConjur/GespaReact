import { Row, Col, Card } from "react-bootstrap";
import Maintenance from "../assets/img/maintenance.png";
import { auto } from "@popperjs/core";
const Managments = () => {
  return (
    <Row xs={auto} md={auto} className="g-2">
      {Array.from({ length: 1 }).map((_, idx) => (
        <Col key={idx}>
          <Card>
            <Card.Img
              variant="top"
              src={Maintenance}
              style={{
                width: "250px",

                objectFit: "cover",
                resize: "both"
              }}
            />
            <Card.Body>
              <Card.Title>Gestiones</Card.Title>
              <Card.Text>Estamos trabajando en ello...</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default Managments;
