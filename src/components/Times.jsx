import { useState, useEffect, useContext, useRef } from "react";
import { Modal, Button, Form, Container, Row, Col, InputGroup } from "react-bootstrap";
import { ShieldFill, KeyFill } from "react-bootstrap-icons";
import TableTimes from "./TableTimes";
import { toast } from "sonner";
import { userTimesUpdate, fetchListValidators, fetchValidators } from "../services/gespawebServices";
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
    const [password, setPassword] = useState("");
    const [updatedTimesForTable, setUpdatedTimesForTable] = useState({});
    
    // Nuevos estados para la validación
    const [validators, setValidators] = useState([]);
    const [validator, setValidator] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchValidatorsList = async () => {
            try {
                const idProducto = 1;
                const response = await fetchListValidators(idProducto);
                setValidators(response);
            } catch (error) {
                console.error("Error al obtener la lista de validadores:", error);
                toast.error("Error al cargar validadores");
            }
        };

        if (show) {
            fetchValidatorsList();
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [show]);

    const validateForm = async () => {
        if (!selectedReason) {
            toast.error("Seleccione una razón válida");
            return false;
        }
        if (!validator) {
            toast.error("Seleccione un validador");
            return false;
        }
        if (!password.trim()) {
            toast.error("Ingrese la contraseña");
            return false;
        }
        
        // Validar credenciales con el servidor
        try {
            setLoading(true);
            const idProducto = 1;
            const idEjecutivo = validator;
            const Contraseña = password;

            await fetchValidators(idProducto, idEjecutivo, Contraseña);
            return true;
        } catch (error) {
            toast.error(`Error de validación: ${error.message}`);
            return false;
        } finally {
            setLoading(false);
        }
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
        const isValid = await validateForm();
        if (!isValid) return;

        clearInterval(intervalRef.current);
        intervalRef.current = null;

        try {
            const duracion = new Date(currentTimer * 1000).toISOString().substr(11, 8);
            
            await userTimesUpdate({
                idEjecutivo,
                contrasenia: password.trim(),
                peCausa: selectedReason,
                duracion
            });

            const updatedTimers = {
                ...timers,
                [selectedReason]: timers[selectedReason] + currentTimer
            };
            setTimers(updatedTimers);

            setUpdatedTimesForTable({ [selectedReason]: currentTimer });

            setCurrentTimer(0);
            setIsPaused(false);
            setPassword("");
            setValidator("");

            toast.success("Tiempo registrado correctamente");
        } catch (error) {
            toast.error(`Error al registrar tiempo: ${error.message}`);
            setIsPaused(true);
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
                    {/* Sección de selección de razón */}
                    <Row className="mb-3">
                        <Col xs={12}>
                            <Form.Group>
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
                        </Col>
                    </Row>
                    
                    {/* Sección de botones */}
                    <Row className="mb-3">
                        <Col xs={12} md={6} className="mb-2">
                            <Button
                                variant="primary"
                                onClick={handleStartTimer}
                                disabled={isPaused || !selectedReason}
                                className="w-100"
                            >
                                Iniciar Temporizador
                            </Button>
                        </Col>
                        <Col xs={12} md={6} className="mb-2">
                            <Button
                                variant="danger"
                                onClick={handleStopTimer}
                                disabled={!isPaused}
                                className="w-100"
                            >
                                {loading ? "Validando..." : "Detener Temporizador"}
                            </Button>
                        </Col>
                    </Row>
                    
                    {/* Sección de validación (nueva) */}
                    {isPaused && (
                        <>
                            <Row className="mb-3">
                                <Col xs={12}>
                                    <Form.Group>
                                        <Form.Label>Validador</Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text>
                                                <ShieldFill />
                                            </InputGroup.Text>
                                            <Form.Select
                                                value={validator}
                                                onChange={(e) => setValidator(e.target.value)}
                                            >
                                                <option value="" disabled>
                                                    Seleccione Validador
                                                </option>
                                                {validators.map((val) => (
                                                    <option key={val.idEjecutivo} value={val.idEjecutivo}>
                                                        {val.Nombre}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </InputGroup>
                                    </Form.Group>
                                </Col>
                            </Row>
                            
                            <Row className="mb-3">
                                <Col xs={12}>
                                    <Form.Group>
                                        <Form.Label>Contraseña</Form.Label>
                                        <InputGroup>
                                            <InputGroup.Text>
                                                <KeyFill />
                                            </InputGroup.Text>
                                            <Form.Control
                                                type="password"
                                                placeholder="Ingrese contraseña"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                            />
                                        </InputGroup>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </>
                    )}
                    
                    {/* Temporizador actual */}
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
                    
                    {/* Tabla de tiempos */}
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