import "bootstrap/dist/css/bootstrap.min.css";
import { useMemo, useEffect, useState, useContext } from "react";
import { Card, Row, Col, Stack, Modal, Button } from "react-bootstrap";
import {
  PersonFill,
  Cash,
  ListOl,
  ChatLeftDotsFill,
  EnvelopePaperFill,
  TelephoneInboundFill,
  EnvelopeAtFill,
  Headset
} from "react-bootstrap-icons";
import { AppContext } from "../pages/Managment";
import { fetchDrives } from "../services/gespawebServices";

const DataCard = () => {
  const { searchResults } = useContext(AppContext);

  const [actionCounts, setActionCounts] = useState({
    SMS: 0,
    Carta: 0,
    Blaster: 0,
    Email: 0
  });

  const [showModal, setShowModal] = useState(false);
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const defaultData = {
    nombreDeudor: "-",
    saldo: "-",
    minimoAtrasado: "-",
    idCuenta: null
  };

  const result = useMemo(() => {
    return searchResults[0] || defaultData;
  }, [searchResults]);

  const { idCuenta, nombreDeudor, saldo } = result;

  useEffect(() => {
    const fetchData = async () => {
      if (!idCuenta) return;

      try {
        const idCartera = 1;
        const data = await fetchDrives(idCartera, idCuenta);

        const counts = data.reduce(
          (acc, item) => {
            if (item.Acercamiento === "SMS") acc.SMS++;
            if (item.Acercamiento === "Carta") acc.Carta++;
            if (item.Acercamiento === "Blaster") acc.Blaster++;
            if (item.Acercamiento === "Email") acc.Email++;
            return acc;
          },
          { SMS: 0, Carta: 0, Blaster: 0, Email: 0 }
        );

        setActionCounts(counts);
      } catch (error) {
        console.error("Error fetching drives:", error);
        setActionCounts({ SMS: 0, Carta: 0, Blaster: 0, Email: 0 });
      }
    };

    fetchData();
  }, [idCuenta]);

  return (
    <>
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
                    style={{ fontSize: "1.3rem", color: "#6dd6ff" }}
                    id="nombreDeudor"
                  >
                    {nombreDeudor}
                  </h6>
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
                    {saldo !== "-"
                      ? "$" +
                        parseFloat(saldo).toLocaleString("es-MX", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })
                      : "-"}
                  </h6>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col xxl={6} xl={12} md={12}>
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
                      <span> SMS : {actionCounts.SMS}</span>
                    </div>
                    <div className="p-2 action">
                      <EnvelopePaperFill />
                      <span> Carta : {actionCounts.Carta}</span>
                    </div>
                    <div className="p-2 action">
                      <TelephoneInboundFill />
                      <span> Blaster : {actionCounts.Blaster}</span>
                    </div>
                    <div className="p-2 action d-flex align-items-center gap-2">
                      <EnvelopeAtFill />
                      <span> Correo : {actionCounts.Email}</span>
                      <Headset
                        role="button"
                        onClick={handleShow}
                        style={{
                          fontSize: "20px",
                          color: "#007bff",
                          cursor: "pointer"
                        }}
                      />
                    </div>
                  </Stack>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal emergente */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Mensaje</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Hola Nuxiba</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DataCard;
