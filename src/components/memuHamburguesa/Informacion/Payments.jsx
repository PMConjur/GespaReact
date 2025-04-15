import { Modal, Row, Col } from "react-bootstrap";
import TablePayments from "../../TablePayments";
import FormPayments from "./FormPayments";
import { useState, useEffect } from "react";

const Payments = ({
    show,
    handleClose,
    isPaymentActive = false,
}) => {
    const [hasRegistration, setHasRegistration] = useState(false);

    // Resetear el estado cuando el modal se muestra o cambia isPaymentActive
    useEffect(() => {
        if (show) {
            // Si no es paymentActive, resetear hasRegistration
            setHasRegistration(isPaymentActive);
        }
    }, [show, isPaymentActive]);

    const handleModalClose = () => {
        if (hasRegistration || isPaymentActive) {
            handleClose();
            // Resetear el estado al cerrar
            setHasRegistration(false);
        }
    };

    return (
        <Modal
            show={show}
            onHide={handleModalClose}
            size="xl"
            backdrop="static"
            keyboard={false}
            contentClassName="d-flex flex-column"
            dialogClassName="my-custom-modal"
        >
            <Modal.Header closeButton={hasRegistration || isPaymentActive}>
                <Modal.Title>
                    {isPaymentActive ? "Pagos" : "Registro de Pagos"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="flex-grow-1 p-0 d-flex flex-column" style={{ overflow: "hidden" }}>
                <Row className="flex-grow-1 g-0" style={{ height: "100%" }}>
                    <Col
                        md={isPaymentActive ? 12 : 10}
                        className="h-100 d-flex flex-column"
                        style={{ maxHeight: "700px", overflowY: "auto" }}
                    >
                        <TablePayments />
                    </Col>
                    {!isPaymentActive && (
                        <Col
                            md={2}
                            className="h-100 d-flex flex-column"
                            style={{ maxHeight: "700px", overflowY: "auto" }}
                        >
                            <FormPayments 
                                handleClose={handleModalClose}
                                onRegistrationSuccess={() => setHasRegistration(true)}
                            />
                        </Col>
                    )}
                </Row>
            </Modal.Body>
        </Modal>
    );
};

export default Payments;