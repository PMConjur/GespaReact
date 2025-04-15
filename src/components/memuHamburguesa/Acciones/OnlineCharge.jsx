import { useState, useContext, useEffect } from "react";
import { Modal, Row, Col } from "react-bootstrap";
import TableOnlineCharge from "../../TableOnlineCharge";
import FormOnlineCharge from "./FormOnlineCharge";
import { AppContext } from "../../../pages/Managment";

const OnlineCharge = ({ show, handleClose }) => {
    const { isOnlineChargeActive, setOnlineChargeActive } = useContext(AppContext);
    const [allowClose, setAllowClose] = useState(false);

            // ✅ Añade este console.log ANTES de abrir el modal
            console.log('Context values (OnlineCharge - RENDER):', {
                isOnlineChargeActive, // Valor del contexto recibido
                show,                // Prop que controla visibilidad del modal
                allowClose           // Estado local
            });

    // Resetear estados cuando el modal se cierra
    useEffect(() => {
        if (!show) {
            console.log('🔄 Reseteando estados para nueva apertura');
            setAllowClose(false);
            setOnlineChargeActive(false);
        }
    }, [show, setOnlineChargeActive]);

    // Manejar cierre del modal
    const handleModalClose = () => {
        console.log('🔘 Close conditions:', {
            canClose: !isOnlineChargeActive || allowClose,
            isOnlineChargeActive,
            allowClose
        });

        if (!isOnlineChargeActive || allowClose) {
            console.log('✅ Closing modal');
            handleClose(); // Esto debería cambiar show a false
        }
    };

    // Manejar éxito del formulario
    const handleFormSuccess = (success) => {
        if (success) {
            console.log('🟢 Registro exitoso - Habilitando cierre');
            setAllowClose(true);
        }
    };
    
    

    return (
        <Modal
            show={show}
            onHide={handleModalClose}
            size="xl"
            backdrop={isOnlineChargeActive && !allowClose ? 'static' : true}
            keyboard={isOnlineChargeActive && !allowClose ? false : true}
        >
            <Modal.Header 
                closeButton={!isOnlineChargeActive || allowClose}
                className="bg-dark text-white"
            >
                <Modal.Title>
                    {isOnlineChargeActive ? "Nuevo Cargo en Línea" : "Historial de Cargos"}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className="flex-grow-1 p-0 d-flex flex-column bg-dark">
                <Row className="flex-grow-1 g-0 m-0" style={{ height: "100%" }}>
                    <Col md={isOnlineChargeActive ? 8 : 12} className="h-100 p-0">
                        <TableOnlineCharge />
                    </Col>
                    
                    {isOnlineChargeActive && (
                        <Col md={4} className="h-100 p-3 bg-dark text-white">
                            <FormOnlineCharge 
                                handleClose={handleFormSuccess}
                            />
                        </Col>
                    )}
                </Row>
            </Modal.Body>
        </Modal>
    );
};

export default OnlineCharge;