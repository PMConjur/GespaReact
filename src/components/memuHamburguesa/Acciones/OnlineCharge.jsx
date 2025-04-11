import { useState, useContext } from "react";
import { Modal, Row, Col } from "react-bootstrap";
import TableOnlineCharge from "../../TableOnlineCharge";
import FormOnlineCharge from "./FormOnlineCharge";
import { AppContext } from "../../../pages/Managment";

const OnlineCharge = ({ show, handleClose }) => {
    const { isOnlineChargeActive, setOnlineChargeActive } = useContext(AppContext);
    const [allowClose, setAllowClose] = useState(false);

    const handleModalClose = () => {
        if (!isOnlineChargeActive || allowClose ) {
            handleClose();
            setAllowClose(true); // Resetear para la próxima apertura
            setOnlineChargeActive(false); // Asegurar que el formulario se desactive
        }
    };

    return (
        <Modal
            show={show}
            onHide={handleModalClose}
            size="xl"
            backdrop={isOnlineChargeActive && !allowClose ? 'static' : true}
            keyboard={false}
            contentClassName="d-flex flex-column bg-dark"
            dialogClassName="my-custom-modal"
        >
            <Modal.Header 
                closeButton={!isOnlineChargeActive || allowClose}
                className="bg-dark text-white"
            >
                <Modal.Title>
                    {isOnlineChargeActive ? "Nuevo Cargo en Línea" : "Historial de Cargos"}
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className="flex-grow-1 p-0 d-flex flex-column bg-dark" style={{ overflow: "hidden" }}>
                <Row className="flex-grow-1 g-0 m-0" style={{ height: "100%" }}>
                    <Col 
                        md={isOnlineChargeActive ? 8 : 12} 
                        className="h-100 d-flex flex-column p-0" 
                        style={{ maxHeight: "700px", overflowY: "auto" }}
                    >
                        <TableOnlineCharge />
                    </Col>
                    
                    {isOnlineChargeActive && (
                        <Col 
                            md={4}
                            className="h-100 d-flex flex-column p-3 bg-dark text-white"
                            style={{ 
                                maxHeight: "700px",
                                overflowY: "auto",
                                borderLeft: "1px solid #444"
                            }}
                        >
                            <FormOnlineCharge 
                                handleClose={(success) => {
                                    if (success) {
                                        setAllowClose(false); // Permitir cierre después de registro
                                        
                                    }
                                }}
                            />
                        </Col>
                    )}
                </Row>
            </Modal.Body>
        </Modal>
    );
};

export default OnlineCharge;