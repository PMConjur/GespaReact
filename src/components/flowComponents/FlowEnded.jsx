import { Row, Col, Card } from "react-bootstrap";
import { NodePlusFill } from "react-icons";
const FlowEnded = () => {
  return (
    <>
      <Row xs="auto" md="auto" className="g-2">
        <Col md={12}>
          <Card className="flow-size" border="primary">
            <Card.Header className="text-white">
              <i className="h5">
                <NodePlusFill></NodePlusFill> Flujo
              </i>
            </Card.Header>
            <Card.Body className="scroll-flow">
              <h5>Selecciona una cuenta para trabajar en el flujo</h5>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default FlowEnded;
