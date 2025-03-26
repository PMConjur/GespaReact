import { useState, useEffect, useContext } from "react";
import { Modal, Button, Form, Container, Row } from "react-bootstrap";
import TableTimes from "./TableTimes";
import { toast } from "sonner";
import { userTimesUpdate } from "../services/gespawebServices";
import { AppContext } from "../pages/Managment";

const Times = ({ show, handleClose }) => {

    const {idEjecutivo} = useContext(AppContext);

    const [executiveId, setExecutiveId] = useState(idEjecutivo || null);
    const [selectedReason, setSelectedReason] = useState("");
    const [timers, setTimers] = useState({});
    const [currentTimer, setCurrentTimer] = useState(0);
    const [intervalId, setIntervalId] = useState(null);
    const [isPaused, setIsPaused] = useState(false);
    const [contrasenia, setContrasenia] = useState("");

    // Inicializar timers y obtener ID de ejecutivo si no está disponible
    useEffect(() => {
        if (!executiveId) {
            const responseDataString = sessionStorage.getItem("responseData");
            if (responseDataString) {
                try {
                    const responseData = JSON.parse(responseDataString);
                    setExecutiveId(responseData?.ejecutivo?.infoEjecutivo?.idEjecutivo || null);
                } catch (error) {
                    console.error("Error al parsear responseData:", error);
                }
            }
        }

        setTimers({
            Permiso: 0,
            Curso: 0,
            Calidad: 0,
            Comida: 0,
            Baño: 0,
        });

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, []);

    const handleStartTimer = () => {
        if (!selectedReason || selectedReason === "Selecciona") {
            toast.error("Por favor seleccione una razón válida.");
            return;
        }

        setIsPaused(true);
        setCurrentTimer(0);
        const newIntervalId = setInterval(() => {
            setCurrentTimer(prev => prev + 1);
        }, 1000);
        setIntervalId(newIntervalId);
    };

    const handleStopTimer = async () => {
        if (!contrasenia || contrasenia.trim() === "") {
            toast.error("Por favor ingrese la contraseña.");
            return;
        }

        if (!selectedReason || selectedReason === "Selecciona") {
            toast.error("Error: Seleccione una razón válida.");
            return;
        }

        clearInterval(intervalId);
        setIntervalId(null);
        setIsPaused(false);

        const updatedTimers = {
            ...timers,
            [selectedReason]: (timers[selectedReason] || 0) + currentTimer,
        };

        setTimers(updatedTimers);
        setCurrentTimer(0);

        try {
            const duracion = new Date(currentTimer * 1000).toISOString().substr(11, 8);
            await userTimesUpdate({
                idEjecutivo: executiveId,
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
        const hrs = Math.floor(seconds / 3600).toString().padStart(2, "0");
        const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
        const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
        return `${hrs}:${mins}:${secs}`;
    };

    if (!executiveId) {
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
                                <option value="Permiso">Permiso</option>
                                <option value="Curso">Curso</option>
                                <option value="Calidad">Calidad</option>
                                <option value="Comida">Comida</option>
                                <option value="Baño">Baño</option>
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