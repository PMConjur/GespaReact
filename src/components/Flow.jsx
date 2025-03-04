import React, { useContext } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { AppContext } from "../pages/Managment";
import Mantenimiento from "../assets/img/mantenimiento.jpg";

const Flow = () => {
  const { flowMessage } = useContext(AppContext);

  return (
    <Row xs="auto" md="auto" className="g-2" >
      {Array.from({ length: 1 }).map((_, idx) => (
        <Col key={idx} md={12}>
          <Card className="row-flow">
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Card.Img
                variant="top"
                src={Mantenimiento}
                style={{
                  height: "250px",
                  objectFit: "cover",
                  resize: "both",
                }}
              />
            </div>
            <Card.Body>
              <Card.Title>Flujo de llamadas</Card.Title>
              <Card.Text>{flowMessage || "Estamos trabajando en ello..."}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default Flow;