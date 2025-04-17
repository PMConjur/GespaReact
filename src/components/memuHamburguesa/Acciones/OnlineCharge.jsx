import { useContext, useEffect } from "react";
import { Modal, Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import TableOnlineCharge from "../../TableOnlineCharge";
import FormOnlineCharge from "./FormOnlineCharge";
import { AppContext } from "../../../pages/Managment";

const OnlineCharge = ({
    show = false,
    handleCloseOnlineCharge = () => console.warn("handleCloseOnlineCharge no proporcionada"),
    allowClose = true,
    onFormSuccess = () => { },
}) => {
    const { isOnlineChargeActive } = useContext(AppContext);

    // Debug de estados
    useEffect(() => {
        console.log(`[Modal] Estado actualizado - 
      Active: ${isOnlineChargeActive}, 
      AllowClose: ${allowClose}, 
      Show: ${show}`);
    }, [show, isOnlineChargeActive, allowClose]);

    const handleModalClose = () => {
        console.log("Ejecutando cierre del modal");
        if (typeof handleCloseOnlineCharge === 'function') {
            handleCloseOnlineCharge();
        }
    };

    // Modal CON formulario (isOnlineChargeActive = true)
    if (isOnlineChargeActive) {
        return (
            <Modal
                show={show}
                onHide={() => {
                    console.log('[Modal] Intento de cierre con formulario activo', allowClose);
                    if (allowClose) {
                        handleModalClose();
                    }
                }}
                size="xl"
                backdrop={allowClose ? true : 'static'}
                keyboard={allowClose}
                centered
            >
                <Modal.Header
                    closeButton={allowClose}
                    className="bg-dark text-white"
                    closeVariant="white"
                >
                    <Modal.Title>Nuevo Cargo en Línea</Modal.Title>
                </Modal.Header>

                <Modal.Body className="flex-grow-1 p-0 d-flex flex-column bg-dark">
                    <Row className="flex-grow-1 g-0 m-0" style={{ minHeight: '60vh' }}>
                        <Col md={8} className="h-100 p-0 border-end border-secondary">
                            <TableOnlineCharge />
                        </Col>
                        <Col md={4} className="h-100 p-3 bg-dark text-white overflow-auto">
                            <FormOnlineCharge
                                handleSuccess={(success) => {
                                    console.log('[Modal] Formulario completado con éxito:', success);
                                    onFormSuccess(success);
                                }}
                            />
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        );
    }

    // Modal SIN formulario (isOnlineChargeActive = false)
    return (
        <Modal
            show={show}
            onHide={handleModalClose}
            size="xl"
            backdrop={true}
            keyboard={true}
            centered
        >
            <Modal.Header
                closeButton={true}
                className="bg-dark text-white"
                closeVariant="white"
            >
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

// Validación de props
OnlineCharge.propTypes = {
    show: PropTypes.bool,
    handleCloseOnlineCharge: PropTypes.func.isRequired,
    allowClose: PropTypes.bool,
    onFormSuccess: PropTypes.func,
};

export default OnlineCharge;