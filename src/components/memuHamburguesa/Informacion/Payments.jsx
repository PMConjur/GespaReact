
import { Modal, Col, Row } from "react-bootstrap";
import TablePayments from "../../TablePayments";
import FormPayments from "./FormPayments";

const Payments = ({
    show,
    handleClose,
    isPaymentActive = false
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
                    {isPaymentActive ? "Reguistro de Pago" : "Listado de Pagos"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body
                className="flex-grow-1 p-0 d-flex flex-column"
                style={{ overflow: "hidden" }}
            >
                <Row className="flex-grow-1 g-0" style={{ height: "100%" }}>
                    <Col
                        md={isPaymentActive ? 12 : 6}
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
                            md={6}
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
                <TablePayments />
            </Modal.Body>
        </Modal>
    );
};

export default Payments;