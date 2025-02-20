import Navbar from "../components/Navbar";
import DataCard from "../components/DataCard";
import Flow from "../components/Flow";
import Telephones from "../components/Telephones";
import InformationClient from "../components/InformationClient";
import { Row, Col, Container } from "react-bootstrap";
import { Calculator } from "../components/Widgets";
import { Calendar } from "../components/Widgets";

const Managment = () => {
  return (
    <>
      <section>
        <Navbar />
        <Container fluid>
          <Row>
            <Col xs={12} md={12}>
              <h1>Productividad / Recuperación / Tiempos/ Simulador</h1>
            </Col>
            <Col xs={12} md={12}>
              <h1>Informacion Deudor</h1>
            </Col>
            <Col xs={12} md={12}>
              <DataCard />
            </Col>
            <Col xs={12} md={12}>
              <Row>
                <Col xs={12} md={8}>
                  <h1>Información</h1>
                  <InformationClient />
                </Col>
                <Col xs={12} md={4}>
                  <h1>Flujo</h1>
                  <Flow />
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={8}>
                  <h1>Telefonos</h1>
                  <Telephones />
                </Col>
                <Col xs={12} md={4}>
                  <h1>Calculadora</h1>
                  <Calculator></Calculator>
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={8}>
                  <h1>Gestiones</h1>
                </Col>
                <Col xs={12} md={4}>
                  <h1>Calendario</h1>
                  <Calendar></Calendar>
                </Col>
              </Row>
              <Row>
                <Col xs={12} md={8}>
                  <h1>Prueba</h1>
                </Col>
                <Col xs={12} md={4}>
                  <h1>Recordatorios</h1>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Managment;
