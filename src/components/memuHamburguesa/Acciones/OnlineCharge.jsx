import { useContext, useEffect, useState } from "react";
import { Modal, Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import TableOnlineCharge from "../../TableOnlineCharge";
import FormOnlineCharge from "./FormOnlineCharge";
import { AppContext } from "../../../pages/Managment";

const OnlineCharge = ({
    show = false,
    handleCloseOnlineCharge = () => console.warn("handleCloseOnlineCharge no proporcionada"),
    onFormSuccess = () => { },
}) => {
    // Se elimina setShowOnlineCharge de la desestructuración
    const { isOnlineChargeActive, loading, setOnlineChargeActive } = useContext(AppContext);
    const [allowClose, setAllowClose] = useState(false);

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
        setOnlineChargeActive(false);
        handleCloseOnlineCharge(); 
        // Línea eliminada: setShowOnlineCharge(false);
    };

    const handleFormSuccess = (success) => {
        setAllowClose(success);
        onFormSuccess(success);
    };

    if (isOnlineChargeActive === true) {
        return (
            <Modal
                show={show}
                onHide={() => {
                    console.log('[Modal] Intento de cierre con formulario activo', allowClose);
                    if (allowClose === true) {
                        setOnlineChargeActive(false);
                        handleCloseOnlineCharge();
                        // Línea eliminada: setShowOnlineCharge(true);
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
                            <TableOnlineCharge />
                        </Col>
                        <Col md={4} className="h-100 p-3 bg-dark text-white overflow-auto">
                            <FormOnlineCharge
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
                <Modal.Title>Historial de Cargos</Modal.Title>
            </Modal.Header>

            <Modal.Body className="flex-grow-1 p-0 d-flex flex-column bg-dark">
                <Row className="flex-grow-1 g-0 m-0" style={{ minHeight: '70vh' }}>
                    <Col md={12} className="h-100 p-0">
                        <TableOnlineCharge />
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    );
};

OnlineCharge.propTypes = {
    show: PropTypes.bool,
    handleCloseOnlineCharge: PropTypes.func.isRequired,
    allowClose: PropTypes.bool,
    onFormSuccess: PropTypes.func,
};

export default OnlineCharge;