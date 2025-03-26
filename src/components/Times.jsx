import { useState, useEffect, useContext, useRef } from "react";
import { Modal, Button, Form, Container, Row } from "react-bootstrap";
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

    const [selectedReason, setSelectedReason] = useState("");
    const [timers, setTimers] = useState(REASONS);
    const [currentTimer, setCurrentTimer] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [contrasenia, setContrasenia] = useState("");
    const [updatedTimesForTable, setUpdatedTimesForTable] = useState({}); // Nuevo estado para la tabla

    // Limpieza del intervalo al desmontar
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

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
        intervalRef.current = setInterval(() => {
            setCurrentTimer(prev => prev + 1);
        }, 1000);
    };      

    const handleStopTimer = async () => {
        if (!validateForm()) return;

        clearInterval(intervalRef.current);
        intervalRef.current = null;

        try {
            const duracion = new Date(currentTimer * 1000).toISOString().substr(11, 8);
            
            await userTimesUpdate({
                idEjecutivo,
                contrasenia: contrasenia.trim(),
                peCausa: selectedReason,
                duracion
            });

            // Actualizar el estado local
            const updatedTimers = {
                ...timers,
                [selectedReason]: timers[selectedReason] + currentTimer
            };
            setTimers(updatedTimers);

            // Pasar solo el valor del conteo actual a la tabla
            setUpdatedTimesForTable({ [selectedReason]: currentTimer });

            setCurrentTimer(0);
            setIsPaused(false);
            setContrasenia("");

            toast.success("Tiempo registrado correctamente");
        } catch (error) {
            toast.error(`Error al registrar tiempo: ${error.message}`);
            setIsPaused(true); // Mantener en pausa para reintentar
        }
    };

    if (!idEjecutivo) {
        return (
            <div className="alert alert-warning text-center" role="alert">
                ⚠️ No se encontró un ID de ejecutivo válido. Verifica tu sesión.
            </div>
        );
    }

    return (
        <Modal show={show} onHide={isPaused ? null : handleClose} size="xl">
            <Modal.Header closeButton={!isPaused}>
                <Modal.Title>Registro de Tiempos</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Row className="mb-3">
                        <Form.Group className="input-group">
                            <Button
                                className="btn-iniciar"
                                onClick={handleStartTimer}
                                disabled={isPaused || !selectedReason}
                            >
                                Iniciar
                            </Button>
                            <Form.Select
                                className="form-select"
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
                    </Row>
                    
                    <Row className="mb-3">
                        <Form.Group className="input-group">
                            <Button
                                className="form-detener"
                                onClick={handleStopTimer}
                                disabled={!isPaused}
                            >
                                Detener
                            </Button>
                            <Form.Control
                                type="password"
                                placeholder="Contraseña"
                                value={contrasenia}
                                onChange={(e) => setContrasenia(e.target.value)}
                                disabled={!isPaused}
                            />
                        </Form.Group>
                    </Row>
                    
                    <Row className="mb-3 text-center">
                        <h5>
                            {selectedReason ? (
                                `${selectedReason}: ${formatTime(currentTimer)}`
                            ) : (
                                "Seleccione una razón"
                            )}
                        </h5>
                    </Row>
                </Container>
                <TableTimes updatedTimes={updatedTimesForTable} />
            </Modal.Body>
        </Modal>
    );
};

export default Times;