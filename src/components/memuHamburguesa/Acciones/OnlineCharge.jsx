import { useContext, useState } from "react";
import { Modal, Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import TableOnlineCharge from "../../TableOnlineCharge";
import FormOnlineCharge from "./FormOnlineCharge";
import { AppContext } from "../../../pages/Managment";

const OnlineCharge = ({
    show ,
    handleCloseOnlineCharge, // Elimina el valor por defecto aquí
    onFormSuccess = () => { },
}) => {
    const { isOnlineChargeActive, loading, setOnlineChargeActive, setShowOnlineCharge } = useContext(AppContext);
    const [allowClose, setAllowClose, handleOpenOnlineCharge] = useState(false);

    const handleModalClose = () => {
        console.log("Intentando cerrar modal...");

        if (allowClose) return;
    setOnlineChargeActive(false);
    handleCloseOnlineCharge();

        console.log("Ejecutando handleCloseOnlineCharge");

        if (typeof handleCloseOnlineCharge === 'function') {
            handleCloseOnlineCharge();
        } else {
            console.error("handleCloseOnlineCharge no es una función");
        }
        
    };
            // Manejador para cuando el formulario tiene éxito
            const handleFormSuccess = (success) => {
                setAllowClose(success); // Permitir cierre solo si success es true
                onFormSuccess(success); // Opcional: propagar el evento al padre si es necesario
            };

       // Modal CON formulario (isOnlineChargeActive = true)
        if (isOnlineChargeActive === true) {
        return (
            <Modal
                show={show}
                onHide={() => {
                    console.log('[Modal] Intento de cierre con formulario activo', allowClose);
                    if (allowClose === true) {
                        setOnlineChargeActive(false); // Cambia el estado de isOnlineChargeActive a false
                        handleCloseOnlineCharge(); // Llama a la función proporcionada por el padre
                         // Cambia el estado de isOnlineChargeActive a false
                    }
                }}
                size="xl"
                backdrop={allowClose ? false : 'static'}
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
                                    handleClose={(success) => setAllowClose(success)} 
                                    allowClose={allowClose}
                                    onClose={(handleOpenOnlineCharge, handleModalClose)}
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

OnlineCharge.propTypes = {
    show: PropTypes.bool,
    handleCloseOnlineCharge: PropTypes.func.isRequired, // Marca como requerido
    allowClose: PropTypes.bool,
    onFormSuccess: PropTypes.func,
};



export default OnlineCharge;