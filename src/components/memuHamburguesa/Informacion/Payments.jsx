import { useState, useEffect, useContext } from "react";
import { Modal, Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import TablePayments from "../../TablePayments";
import FormPayments from "./FormPayments";
import { AppContext } from "../../../pages/Managment";

const Payments = ({
    show = false,
    handleClosePayments = () => console.warn("handleClosePayments no proporcionada"),
    onFormSuccess = () => { },
}) => {
     // Se elimina setShowPaymenst de la desestructuración
    const { isPaymentActive, loading, setPaymentActive } = useContext(AppContext);
    const [ allowClose, setAllowClose ] = useState(false);

    // Resetear el estado cuando el modal se muestra o cambia isPaymentActive
    useEffect(() => {
        if (show) {
            setAllowClose(false);
        }
    }, [show]);

    const handleModalClose = () => {
        if (loading) {
            console.log("[Modal] Bloqueando cierre durante carga");
            return;
        }
        setPaymentActive(false);
        handleClosePayments(); 
        // Línea eliminada: setShowPayments(false);
    };

    const handleFormSuccess = (success) => {
        setAllowClose(success);
        onFormSuccess(success);
    };

    if (isPaymentActive === true) {
        return (
            <Modal
                show={show}
                onHide={() => {
                    console.log('[Modal] Intento de cierre con formulario activo', allowClose);
                    if (allowClose === true) {
                        setPaymentActive(false);
                        handleClosePayments();
                        // Línea eliminada: setShowPayments(true);
                    }
                }}
                size="xl"
                backdrop={allowClose ? true : 'static'}
                keyboard={allowClose}
                centered
            >
                <Modal.Header closeButton={allowClose} className="bg-dark text-white" closeVariant="white">
                    <Modal.Title>Nuevo Cargo en Línea</Modal.Title>
                </Modal.Header>

                <Modal.Body className="flex-grow-1 p-0 d-flex flex-column bg-dark">
                    <Row className="flex-grow-1 g-0 m-0" style={{ minHeight: '60vh' }}>
                        <Col md={8} className="h-100 p-0 border-end border-secondary">
                            <TablePayments />
                        </Col>
                        <Col md={4} className="h-100 p-3 bg-dark text-white overflow-auto">
                            <FormPayments
                                handleClose={(success) => setAllowClose(success)}
                                allowClose={allowClose}
                                onClose={handleModalClose}
                                onRegistrationSuccess={handleFormSuccess}
                            />
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        );
    }

    return (
        <Modal
            show={show}
            onHide={handleModalClose}
            size="xl"
            backdrop={true}
            keyboard={true}
            centered
        >
            <Modal.Header closeButton className="bg-dark text-white" closeVariant="white">
                <Modal.Title> Historial de Pagos </Modal.Title>
            </Modal.Header>

            <Modal.Body className="flex-grow-1 p-0 d-flex flex-column bg-dark">
            <Row className="flex-grow-1 g-0 m-0" style={{ minHeight: '70vh' }}>
            <Col md={12} className="h-100 p-0">
                        <TablePayments />
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    );
};

Payments.propTypes = {
    show: PropTypes.bool,
    handleClosePayments: PropTypes.func.isRequired,
    allowClose: PropTypes.bool,
    onFormSuccess: PropTypes.func,
};

export default Payments;