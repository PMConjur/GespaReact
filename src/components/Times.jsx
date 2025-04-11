import { useState, useContext, useRef } from "react";
import { Modal, Button, Form, Container, Row, Col } from "react-bootstrap";
import TableTimes from "./TableTimes";
import { toast } from "sonner";
import { userTimesUpdate } from "../services/gespawebServices";
import { AppContext } from "../pages/Managment";

const REASONS = {
    Permiso: 0,
    Curso: 0,
    Calidad: 0,
    Comida: 0,
    Baño: 0
};

const formatTime = (seconds) => {
    if (seconds === null || isNaN(seconds)) return "--:--:--";
    
    const hrs = Math.floor(seconds / 3600).toString().padStart(2, "0");
    const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
    const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
    
    return `${hrs}:${mins}:${secs}`;
};

const Times = ({ show, handleClose }) => {
    const { idEjecutivo } = useContext(AppContext);
    const intervalRef = useRef(null);
    const timerSnapshot = useRef(0);

    const [selectedReason, setSelectedReason] = useState("");
    const [timers, setTimers] = useState(REASONS);
    const [currentTimer, setCurrentTimer] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [contrasenia, setContrasenia] = useState("");
    const [updatedTimesForTable, setUpdatedTimesForTable] = useState({});

    const validateForm = () => {
        if (!selectedReason) {
            toast.error("Seleccione una razón válida");
            return false;
        }
        if (!contrasenia.trim()) {
            toast.error("Ingrese la contraseña");
            return false;
        }
        return true;
    };

    const handleStartTimer = () => {
        if (!selectedReason) {
            toast.error("Seleccione una razón primero");
            return;
        }

        setIsPaused(true);
        setCurrentTimer(0);
        timerSnapshot.current = 0;
        
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        
        intervalRef.current = setInterval(() => {
            setCurrentTimer(prev => {
                const newTime = prev + 1;
                timerSnapshot.current = newTime;
                return newTime;
            });
        }, 1000);
    };

    const handleStopTimer = async () => {
        if (!validateForm()) return;
    
        try {
            const duracion = new Date(timerSnapshot.current * 1000).toISOString().substr(11, 8);
            
            await userTimesUpdate({
                idEjecutivo,
                contrasenia: contrasenia.trim(),
                peCausa: selectedReason,
                duracion
            });

            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            
            const updatedTimers = {
                ...timers,
                [selectedReason]: timers[selectedReason] + timerSnapshot.current
            };
            
            setTimers(updatedTimers);
            setUpdatedTimesForTable({ [selectedReason]: timerSnapshot.current });
            setIsPaused(false);
            setContrasenia("");
            setSelectedReason("");
            setCurrentTimer(0);
            timerSnapshot.current = 0;
            
            toast.success("Tiempo registrado correctamente");
            
        } catch (error) {
            console.error("Error en handleStopTimer:", error);
            toast.error(`Error al registrar tiempo: ${error.message}`);
            
            if (!intervalRef.current) {
                intervalRef.current = setInterval(() => {
                    setCurrentTimer(prev => {
                        const newTime = prev + 1;
                        timerSnapshot.current = newTime;
                        return newTime;
                    });
                }, 1000);
            }
            
            setContrasenia("");
        }
    };

    const handleModalClose = () => {
        if (isPaused) {
            toast.warning("Detenga el temporizador antes de cerrar");
            return;
        }
        
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        
        handleClose();
    };

    if (!idEjecutivo) {
        return (
            <div className="alert alert-warning text-center" role="alert">
                No se encontró un ID de ejecutivo válido. Verifica tu sesión.
            </div>
        );
    }

    return (
        <Modal 
            show={show} 
            onHide={handleModalClose} 
            size="xl"
            backdrop={isPaused ? 'static' : true}
            keyboard={!isPaused}
        >
            <Modal.Header closeButton={!isPaused}>
                <Modal.Title>Registro de Tiempos</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    {/* Primera fila: Título y Temporizador */}
                    <Row className="mb-3 text-center">
                        <Col xs={12}>
                            <h4>
                                {selectedReason ? (
                                    `${selectedReason}: ${formatTime(currentTimer)}`
                                ) : (
                                    "Seleccione una razón para comenzar"
                                )}
                            </h4>
                        </Col>
                    </Row>

                    {/* Segunda fila: Controles en 2 columnas */}
                    <Row className="mb-3">
                        {/* Columna izquierda: Razón + Iniciar */}
                        <Col md={6} className="mb-3">
                            <Form.Group className="mb-3">
                                <Form.Label>Seleccione razón</Form.Label>
                                <Form.Select
                                    value={selectedReason}
                                    onChange={(e) => setSelectedReason(e.target.value)}
                                    disabled={isPaused}
                                >
                                    <option value="">Seleccione razón</option>
                                    {Object.keys(REASONS).map(reason => (
                                        <option key={reason} value={reason}>{reason}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Button
                                variant="primary"
                                onClick={handleStartTimer}
                                disabled={isPaused || !selectedReason}
                                className="w-100"
                            >
                                Iniciar Temporizador
                            </Button>
                        </Col>

                        {/* Columna derecha: Contraseña + Detener */}
                        <Col md={6} className="mb-3">
                            <Form.Group className="mb-3">
                                <Form.Label>Contraseña</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Ingrese su contraseña"
                                    value={contrasenia}
                                    onChange={(e) => setContrasenia(e.target.value)}
                                    disabled={!isPaused}
                                />
                            </Form.Group>

                            <Button
                                variant="danger"
                                onClick={handleStopTimer}
                                disabled={!isPaused}
                                className="w-100"
                            >
                                Detener Temporizador
                            </Button>
                        </Col>
                    </Row>

                    {/* Tercera fila: Tabla de tiempos */}
                    <Row className="mb-3">
                        <Col xs={12}>
                            <TableTimes updatedTimes={updatedTimesForTable} />
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
        </Modal>
    );
};

export default Times;