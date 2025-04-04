import { Modal, Row, Col } from "react-bootstrap";
import TablePayments from "../../TablePayments";
import FormPayments from "./FormPayments";

const Payments = ({
    show,
    handleClose,
    isPaymentActive = false, // Cambié el nombre de la prop a isPaymentActive
}) => {

    return (
        <Modal
            show={show}
            onHide={handleClose}
            size="xl"
            backdrop="static"
            keyboard={true}
            contentClassName="d-flex flex-column"
            dialogClassName="my-custom-modal"
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    {isPaymentActive ? "Pagos" : "Registro de Pagos"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body
                className="flex-grow-1 p-0 d-flex flex-column"
                style={{ overflow: "hidden" }}
            >
                <Row className="flex-grow-1 g-0" style={{ height: "100%" }}>
                    <Col
                        md={isPaymentActive ? 12 : 10} // Cambiado de 8 a 10 para que la tabla ocupe aún más espacio
                        className="h-100 d-flex flex-column"
                        style={{
                            maxHeight: "700px",
                            overflowY: "auto"
                        }}
                    >
                        <TablePayments />
                    </Col>
                    {!isPaymentActive && (
                        <Col
                            md={2} // Cambiado de 4 a 2 para reducir aún más el espacio del formulario
                            className="h-100 d-flex flex-column"
                            style={{
                                maxHeight: "700px",
                                overflowY: "auto"
                            }}
                        >
                            <FormPayments handleClose={handleClose} />
                        </Col>
                    )}
                </Row>
            </Modal.Body>
        </Modal>
    );
};

export default Payments;