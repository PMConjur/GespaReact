import { useState, useEffect } from "react";
import { Modal, Button, Form, Container, Row } from "react-bootstrap";
import TableTimes from "./TableTimes";
import { toast } from "sonner";
import { userTimesUpdate } from "../services/gespawebServices";

const Times = ({ show, handleClose }) => {
    // Obtener responseData de location.state o localStorage
    const responseData = location.state || JSON.parse(localStorage.getItem("responseData"));
    const idEjecutivo = responseData?.ejecutivo?.infoEjecutivo?.idEjecutivo;

    // Si `idEjecutivo` no se pasa como prop, intentamos obtenerlo de sessionStorage
    const [executiveId, setExecutiveId] = useState(idEjecutivo || null);
    const [selectedReason, setSelectedReason] = useState("");
    const [timers, setTimers] = useState({});
    const [currentTimer, setCurrentTimer] = useState(0);
    const [intervalId, setIntervalId] = useState(null);
    const [isPaused, setIsPaused] = useState(false);
    const [contrasenia, setContrasenia] = useState("");

    useEffect(() => {
        if (!executiveId) {
            const responseDataString = sessionStorage.getItem("responseData");

            if (responseDataString) {
                try {
                    const responseData = JSON.parse(responseDataString);
                    console.log("📌 Datos obtenidos de sessionStorage:", responseData);
                    setExecutiveId(responseData?.ejecutivo?.infoEjecutivo?.idEjecutivo || null);
                } catch (error) {
                    console.error("❌ Error al parsear responseData:", error);
                }
            } else {
                console.warn("⚠️ No se encontró responseData en sessionStorage.");
            }
        }

        setTimers({
            Permiso: 0,
            Curso: 0,
            Calidad: 0,
            Comida: 0,
            Baño: 0,
        });
    }, [executiveId]);

    if (!executiveId) {
        return (
            <div className="alert alert-warning text-center" role="alert">
                ⚠️ No se encontró un ID de ejecutivo válido. Verifica tu sesión.
            </div>
        );
    }

    const handleStartTimer = () => {
        if (!selectedReason || selectedReason === "Selecciona") {
            toast.error("⚠️ Por favor seleccione una razón válida.");
            return;
        }

        setIsPaused(true);
        setCurrentTimer(0);
        const newIntervalId = setInterval(() => {
            setCurrentTimer((prevTimer) => prevTimer + 1);
        }, 1000);
        setIntervalId(newIntervalId);
    };

    const handleStopTimer = async () => {
        if (!contrasenia || contrasenia.trim() === "") {
            toast.error("⚠️ Por favor ingrese la contraseña.");
            return;
        }

        if (!selectedReason || selectedReason === "Selecciona") {
            toast.error("⚠️ Error: Seleccione una razón válida.");
            return;
        }

        console.log(`✅ Temporizador detenido para: ${selectedReason}`);
        clearInterval(intervalId);
        setIntervalId(null);
        setIsPaused(false);
        setContrasenia("");

        setTimers((prevTimers) => {
            const updatedTimers = {
                ...prevTimers,
                [selectedReason]: (prevTimers[selectedReason] || 0) + currentTimer,
            };

            updateTableTimes(updatedTimers);
            sendDataToServer(updatedTimers);
            return updatedTimers;
        });

        setCurrentTimer(0);
    };

    const sendDataToServer = async (updatedTimers) => {
        const tiempoTotal = updatedTimers[selectedReason] || 0;
        if (tiempoTotal <= 0) {
            toast.error("⚠️ Error: La duración debe ser mayor a 0.");
            return;
        }

        const duracion = new Date(tiempoTotal * 1000).toISOString().substr(11, 8);
        if (!duracion) {
            toast.error("⚠️ Error: No se pudo calcular la duración.");
            return;
        }

        // 🔹 Datos EXACTAMENTE como los necesita tu API
        const dataToSend = {
            idEjecutivo: executiveId,
            contrasenia: contrasenia.trim(),
            peCausa: selectedReason,
            duracion: duracion, 
        };

        console.log("📤 Enviando datos actualizados al servidor:", dataToSend);

        try {
            const response = await userTimesUpdate(dataToSend);
            console.log("✅ Respuesta de la API:", response);
            toast.success("Tiempos enviados correctamente.");
        } catch (error) {
            console.error("❌ Error al enviar los datos:", error);
            toast.error("❌ Error al enviar los tiempos al servidor.");
        }
    };

    const updateTableTimes = (updatedTimers) => {
        setTimers(updatedTimers);
    };

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600).toString().padStart(2, "0");
        const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
        const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
        return `${hrs}:${mins}:${secs}`;
    };

    return (
        <Modal show={show} onHide={isPaused ? null : handleClose} size="xl">
            <Modal.Header closeButton={!isPaused}>
                <Modal.Title>Tiempos</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <div className="row">
                        <div className="col">
                            <Form.Group className="input-group mb-3">
                                <Button
                                    variant="primary"
                                    type="button"
                                    onClick={handleStartTimer}
                                    disabled={isPaused || !selectedReason || selectedReason === "Selecciona"}
                                >
                                    Pausar
                                </Button>
                                <span className="input-group-text"></span>
                                <Form.Select
                                    aria-label="Default select example"
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
                        </div>
                    </div>
                    <hr />
                    <Row>
                        <div className="col-sm-10">
                            <Form.Group className="input-group mb-3">
                                <Button
                                    variant="primary"
                                    type="button"
                                    onClick={handleStopTimer}
                                    disabled={!isPaused}
                                >
                                    Despausar
                                </Button>
                                <span className="input-group-text"></span>
                                <Form.Control
                                    type="password"
                                    placeholder="Contraseña"
                                    value={contrasenia}
                                    onChange={(e) => setContrasenia(e.target.value)}
                                    disabled={!isPaused}
                                />
                            </Form.Group>
                        </div>
                        <div className="col-sm-2">
                            <p>
                                {selectedReason.charAt(0).toUpperCase() + selectedReason.slice(1)} : <span>{formatTime(currentTimer)}</span>
                            </p>
                            <br />
                        </div>
                    </Row>
                </Container>
                <br />
                <div className="row">
                    <div className="col">
                        <TableTimes updatedTimes={timers} />
                    </div>
                </div>
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