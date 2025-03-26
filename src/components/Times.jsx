import { useState, useEffect, useContext, useRef } from "react";
import { Modal, Button, Form, Container, Row } from "react-bootstrap";
import TableTimes from "./TableTimes";
import { toast } from "sonner";
import { userTimesUpdate } from "../services/gespawebServices";
import { AppContext } from "../pages/Managment";

const REASON_OPTIONS = [
    "Permiso", "Curso", "Calidad", "Comida", "Baño"
];

const Times = ({ show, handleClose }) => {
    const { idEjecutivo } = useContext(AppContext);
    const intervalRef = useRef(null);

    const [selectedReason, setSelectedReason] = useState("");
    const [timers, setTimers] = useState(
        Object.fromEntries(REASON_OPTIONS.map(reason => [reason, 0]))
    );
    const [currentTimer, setCurrentTimer] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [contrasenia, setContrasenia] = useState("");

    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    const validateReason = () => {
        if (!selectedReason || selectedReason === "Selecciona") {
            toast.error("Por favor seleccione una razón válida.");
            return false;
        }
        return true;
    };

    const handleStartTimer = () => {
        if (!validateReason()) return;

        setIsPaused(true);
        setCurrentTimer(0);
        intervalRef.current = setInterval(() => {
            setCurrentTimer(prev => prev + 1);
        }, 1000);
    };

    const handleStopTimer = async () => {
        if (!contrasenia || contrasenia.trim() === "") {
            toast.error("Por favor ingrese la contraseña.");
            return;
        }

        if (!validateReason()) return;

        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setIsPaused(false);

        const updatedTimers = {
            ...timers,
            [selectedReason]: timers[selectedReason] + currentTimer,
        };

        setTimers(updatedTimers);
        setCurrentTimer(0);

        try {
            const duracion = new Date(currentTimer * 1000).toISOString().substr(11, 8);
            await userTimesUpdate({
                idEjecutivo: idEjecutivo,
                contrasenia: contrasenia.trim(),
                peCausa: selectedReason,
                duracion: duracion,
            });
            toast.success("Tiempo registrado correctamente");
            setContrasenia("");
        } catch (error) {
            toast.error(`Error al registrar tiempo: ${error.message}`);
        }
    };

    const formatTime = (seconds) => {
        if (seconds === null || isNaN(seconds)) return "--:--:--";
        const hrs = Math.floor(seconds / 3600).toString().padStart(2, "0");
        const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
        const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
        return `${hrs}:${mins}:${secs}`;
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
                <Modal.Title>Tiempos</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Row className="mb-3">
                        <Form.Group className="input-group">
                            <Button
                                variant="primary"
                                onClick={handleStartTimer}
                                disabled={isPaused || !selectedReason || selectedReason === "Selecciona"}
                            >
                                Inicio
                            </Button>
                            <Form.Select
                                value={selectedReason}
                                onChange={(e) => setSelectedReason(e.target.value)}
                                disabled={isPaused}
                            >
                                <option>Selecciona</option>
                                {REASON_OPTIONS.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Row>
                    
                    <hr />
                    
                    <Row className="mb-3">
                        <Form.Group className="input-group">
                            <Button
                                variant="primary"
                                onClick={handleStopTimer}
                                disabled={!isPaused}
                            >
                                Fin
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
                    
                    <Row className="mb-3">
                        <div className="text-center">
                            <h5>
                                {selectedReason && selectedReason !== "Selecciona" ? 
                                    `${selectedReason}: ${formatTime(currentTimer)}` : 
                                    "Seleccione una razón"}
                            </h5>
                        </div>
                    </Row>
                </Container>
                
                <TableTimes updatedTimes={timers} />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose} disabled={isPaused}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default Times;