import { useState, useContext } from "react";
import { Form, Button, Spinner, Row, Col } from "react-bootstrap";
import { toast } from "sonner";
import { createFollows } from "../../../services/gespawebServices";
import { AppContext } from "../../../pages/Managment";

const FormFollowUps = ({ handleClose }) => {
    const { searchResults } = useContext(AppContext);

    if (!searchResults || searchResults.length === 0) {
        toast.error(
            "No se encontraron resultados de búsqueda. No se puede usar este formulario."
        );
        return null;
    }

    const idCuenta = searchResults?.map((result) => result.idCuenta) || [];
    const responseData = JSON.parse(localStorage.getItem("responseData"));
    const idEjecutivo = responseData?.ejecutivo?.infoEjecutivo.idEjecutivo;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        idCartera: 1,
        idCuenta: idCuenta[0].trim(),
        idEjecutivo: idEjecutivo,
        fecha: new Date().toISOString().split("T")[0],
        segundo: "07:00:00",
        idAcercamiento: "1601",
        recordatorio: false,
        numeroTelefonico: "",
        datoContacto: "",
        idMotivoS: "0",
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === "numeroTelefonico") {
            const numericValue = value.replace(/\D/g, "");
            if (numericValue.length <= 13) {
                setFormData((prev) => ({
                    ...prev,
                    [name]: numericValue,
                }));
            }
        } else if (name === "datoContacto") {
            if (value.length > 280) {
                toast.error("Máximo 280 caracteres permitidos");
                return;
            }
            const sanitizedValue = value.replace(/[^a-zA-Z0-9\s]/g, "");
            setFormData((prev) => ({
                ...prev,
                [name]: sanitizedValue,
            }));
        } else if (name === "fecha") {
            const today = new Date().toISOString().split("T")[0];
            if (value < today) {
                toast.error("La fecha no puede ser anterior al día actual.");
                return;
            }
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value,
            }));
        }
    };

    const handleSave = async () => {
        setLoading(true);
        setError(null);

        try {
            // Validación del teléfono
            if (formData.numeroTelefonico.length < 10) {
                toast.error("El número telefónico debe tener al menos 10 dígitos.");
                setLoading(false);
                return;
            }

            // Validación de fecha
            const today = new Date().toISOString().split("T")[0];
            if (formData.fecha < today) {
                toast.error("La fecha no puede ser anterior al día actual.");
                setLoading(false);
                return;
            }

            // Validación de horario
            if (formData.recordatorio) {
                const [hours, minutes] = formData.segundo.split(":").map(Number);
                const period = hours >= 12 ? "PM" : "AM";

                if (period === "AM" && (hours < 7 || hours > 11)) {
                    toast.error("Horario AM inválido. Debe ser entre 7:00 AM y 11:59 AM");
                    setLoading(false);
                    return;
                }

                if (period === "PM" && (hours < 12 || hours > 22)) {
                    toast.error(
                        "Horario PM inválido. Debe ser entre 12:00 PM y 10:00 PM"
                    );
                    setLoading(false);
                    return;
                }

                if (minutes < 0 || minutes > 59) {
                    toast.error("Los minutos deben estar entre 00 y 59");
                    setLoading(false);
                    return;
                }
            }

            const dataToSend = { ...formData };
            if (!dataToSend.datoContacto.trim()) {
                dataToSend.datoContacto = null;
            }

            console.log("Datos a enviar al endpoint:", dataToSend); // Agregado para depuración

            const response = await createFollows(dataToSend);
            toast.success(response.mensaje || "Seguimiento guardado exitosamente.");

            // Limpiar los campos del formulario
            setFormData({
                idCartera: 1,
                idCuenta: idCuenta[0].trim(),
                idEjecutivo: idEjecutivo,
                fecha: new Date().toISOString().split("T")[0],
                segundo: "07:00:00",
                idAcercamiento: "1601",
                recordatorio: false,
                numeroTelefonico: "",
                datoContacto: "",
                idMotivoS: "0",
            });
        } catch (error) {
            console.error("Error al guardar el seguimiento:", error);
            toast.error(
                error.message || "Ocurrió un error al guardar el seguimiento."
            );
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="p-3">
            <Form>
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Acercamiento *</Form.Label>
                            <Form.Control
                                as="select"
                                name="idAcercamiento"
                                value={formData.idAcercamiento}
                                onChange={handleChange}
                                required
                            >
                                <option value="1601">Telefónico</option>
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Teléfono *</Form.Label>
                            <Form.Control
                                type="tel"
                                name="numeroTelefonico"
                                value={formData.numeroTelefonico}
                                onChange={handleChange}
                                placeholder="Ej: 5512345678"
                                pattern="[0-9]{10,13}"
                                title="Debe contener entre 10 y 13 dígitos numéricos"
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className="mb-3">
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>Fecha *</Form.Label>
                            <Form.Control
                                type="date"
                                name="fecha"
                                value={formData.fecha}
                                onChange={handleChange}
                                min={new Date().toISOString().split("T")[0]}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col md={8}>
                        <Form.Group>
                            <Form.Label>Hora *</Form.Label>
                            <Row className="g-2">
                                <Col md={4}>
                                    <Form.Select
                                        value={formData.segundo.split(":")[0]}
                                        onChange={(e) => {
                                            const hour = e.target.value;
                                            const [_, minute, second] = formData.segundo.split(":");
                                            setFormData({
                                                ...formData,
                                                segundo: `${hour}:${minute}:${second}`,
                                            });
                                        }}
                                        aria-label="Seleccionar hora"
                                    >
                                        {parseInt(formData.segundo.split(":")[0]) >= 12
                                            ? [...Array(11).keys()].map((h) => (
                                                <option key={h} value={h + 12}>
                                                    {(h + 12).toString().padStart(2, "0")}
                                                </option>
                                            ))
                                            : [...Array(5).keys()].map((h) => (
                                                <option key={h} value={h + 7}>
                                                    {(h + 7).toString().padStart(2, "0")}
                                                </option>
                                            ))}
                                    </Form.Select>
                                </Col>
                                <Col md={4}>
                                    <Form.Control
                                        type="text"
                                        value={formData.segundo.split(":")[1]}
                                        onChange={(e) => {
                                            const minute = e.target.value
                                                .replace(/\D/g, "")
                                                .slice(0, 2);
                                            const [hour, _, second] = formData.segundo.split(":");
                                            setFormData({
                                                ...formData,
                                                segundo: `${hour}:${minute}:${second}`,
                                            });
                                        }}
                                        placeholder="MM"
                                        maxLength={2}
                                        pattern="[0-5][0-9]"
                                    />
                                </Col>
                                <Col md={4}>
                                    <Form.Select
                                        value={
                                            parseInt(formData.segundo.split(":")[0]) >= 12
                                                ? "PM"
                                                : "AM"
                                        }
                                        onChange={(e) => {
                                            const period = e.target.value;
                                            let [hour, minute, second] = formData.segundo.split(":");
                                            hour = parseInt(hour);
                                            if (period === "PM" && hour < 12) hour += 12;
                                            if (period === "AM" && hour >= 12) hour -= 12;
                                            setFormData({
                                                ...formData,
                                                segundo: `${hour
                                                    .toString()
                                                    .padStart(2, "0")}:${minute}:${second}`,
                                            });
                                        }}
                                        aria-label="Seleccionar AM/PM"
                                    >
                                        <option value="AM">AM</option>
                                        <option value="PM">PM</option>
                                    </Form.Select>
                                </Col>
                            </Row>
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-3">
                    <Form.Check
                        type="checkbox"
                        name="recordatorio"
                        label="Recordatorio"
                        checked={formData.recordatorio}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Comentarios</Form.Label>
                    <Form.Control
                        as="textarea"
                        name="datoContacto"
                        value={formData.datoContacto}
                        onChange={handleChange}
                        style={{
                            height: "170px",
                            resize: "none",
                            overflowY: "auto",
                        }}
                        placeholder="Detalles adicionales del contacto..."
                        maxLength={280}
                    />
                    <div className="text-end text-muted small mt-1">
                        {formData.datoContacto.length}/280 caracteres
                    </div>
                </Form.Group>

                <div className="d-flex justify-content-between">
                    <Button
                        variant="danger"
                        onClick={handleClose}
                        disabled={loading}
                        className="px-4"
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSave}
                        disabled={loading}
                        className="px-4"
                    >
                        {loading ? (
                            <>
                                <Spinner as="span" animation="border" size="sm" />
                                <span className="ms-2">Guardando...</span>
                            </>
                        ) : (
                            "Guardar"
                        )}
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default FormFollowUps;
