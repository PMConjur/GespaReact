import { useState, useContext, useEffect } from "react";
import { Form, Button, Spinner, Row, Col } from "react-bootstrap";
import { toast } from "sonner";
import { createFollows, fetchNotes } from "../../../services/gespawebServices";
import { AppContext } from "../../../pages/Managment";

const FormFollowUps = ({ handleClose, isFollowUpsActive, onSuccessfulRegister }) => {
    const { isManagment, searchResults, setManagment, nombreEjecutivo } = useContext(AppContext);

    if (!searchResults || searchResults.length === 0) {
        toast.error("No se encontraron resultados de búsqueda. No se puede usar este formulario.");
        return null;
    }

    const idCuenta = searchResults.map((result) => result.idCuenta);
    const responseData = JSON.parse(localStorage.getItem("responseData"));
    const idEjecutivo = responseData?.ejecutivo?.infoEjecutivo.idEjecutivo;
    const selectedAnswer = responseData?.selectedAnswer;
    
    const formatPhoneNumber = (phone) => {
        if (!phone) return "";
        const phoneStr = phone.toString();
        if (phoneStr.length <= 4) return phoneStr;
        const last4 = phoneStr.slice(-4);
        const masked = phoneStr.slice(0, -4).replace(/./g, 'X');
        return masked + last4;
    };

    const getContextPhoneNumber = () => {
        if (isManagment?.gestion?.numeroTelefonico) {
            return {
                raw: isManagment.gestion.numeroTelefonico.toString(),
                formatted: formatPhoneNumber(isManagment.gestion.numeroTelefonico)
            };
        }
        
        if (selectedAnswer?.dataPhone?.númeroTelefónico) {
            return {
                raw: selectedAnswer.dataPhone.númeroTelefónico.toString(),
                formatted: formatPhoneNumber(selectedAnswer.dataPhone.númeroTelefónico)
            };
        }
        
        return { raw: "", formatted: "" };
    };

    const [loading, setLoading] = useState(false);
    const [existingReminders, setExistingReminders] = useState([]);
    const [formData, setFormData] = useState({
        idCartera: 1,
        idCuenta: idCuenta[0].trim(),
        idEjecutivo: idEjecutivo,
        fecha: new Date().toISOString().split('T')[0], // Solo fecha sin hora
        segundo: "07:00:00",
        idAcercamiento: "1601",
        recordatorio: false,
        numeroTelefonico: "",
        displayedPhone: "",
        datoContacto: "",
        idMotivoS: "0",
    });

    // Cargar y preparar recordatorios existentes
    useEffect(() => {
        const loadReminders = async () => {
            try {
                const notes = await fetchNotes(idCuenta[0].trim());
                const reminders = notes
                    .filter(note => note.recordatorio)
                    .map(note => {
                        // Asegurar formato correcto de FechaPago
                        const fechaPago = note.FechaPago.endsWith('Z') 
                            ? note.FechaPago 
                            : `${note.FechaPago}Z`;
                        return {
                            ...note,
                            FechaPago: fechaPago,
                            segundo: note.segundo || "00:00:00"
                        };
                    });
                setExistingReminders(reminders);
            } catch (error) {
                console.error("Error al cargar recordatorios:", error);
            
            }
        };
        
        loadReminders();
    }, [idCuenta]);

    useEffect(() => {
        const phone = getContextPhoneNumber();
        setFormData(prev => ({
            ...prev,
            numeroTelefonico: phone.raw,
            displayedPhone: phone.formatted
        }));
    }, [isManagment]);

    // Función robusta para comparar fechas y horas (se actualiza para incluir la comparación del campo "hora")
    const hasReminderConflict = (date, time) => {
        try {
            const timeParts = time.split(':').map(Number);
            const [hours, minutes, seconds = 0] = timeParts; // Incluir segundos si existen
            const newDateTime = new Date(`${date}T${hours}:${minutes}:${seconds}Z`);
            
            for (const reminder of existingReminders) {
                const timeParts2 = reminder.segundo.split(':').map(Number);
                const [rHours, rMinutes, rSeconds = 0] = timeParts2; // Incluir segundos si existen
                const reminderDate = new Date(reminder.FechaPago);
                reminderDate.setUTCHours(rHours, rMinutes, rSeconds, 0);
                
                const diffMinutes = Math.abs((newDateTime - reminderDate) / (1000 * 60));
                if (diffMinutes < 5) {
                    return {
                        conflict: true,
                        existingTime: `${reminder.FechaPago.split('T')[0]} ${reminder.segundo}`
                    };
                }
            }
            return { conflict: false };
        } catch (error) {
            console.error("Error en la validación de recordatorios:", error);
            return { conflict: false };
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === "datoContacto") {
            if (value.length > 280) {
                toast.error("Máximo 280 caracteres permitidos");
                return;
            }
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        else if (name === "fecha") {
            const today = new Date().toISOString().split('T')[0];
            if (value < today) {
                toast.error("La fecha no puede ser anterior al día actual.");
                return;
            }
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        else {
            setFormData(prev => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value,
            }));
        }
    };

    const handleSave = async () => {
        setLoading(true);
    
        try {
            // 1. Validación de número telefónico
            if (!formData.numeroTelefonico || formData.numeroTelefonico.trim().length < 10) {
                toast.error("Número telefónico inválido o incompleto");
                setLoading(false);
                return;
            }
    
            // 2. Validación de fecha
            const todayStr = new Date().toISOString().split('T')[0];
            if (formData.fecha < todayStr) {
                toast.error("No puedes seleccionar una fecha anterior al día actual");
                setLoading(false);
                return;
            }

            // Nueva validación: si la fecha es hoy, la hora debe ser al menos 1 minuto mayor a la hora actual
            if (formData.fecha === todayStr) {
                const scheduledDate = new Date(`${formData.fecha}T${formData.segundo}`);
                const nowPlusOne = new Date(Date.now() + 60000);
                if (scheduledDate < nowPlusOne) {
                    toast.error("La hora debe ser al menos 1 minuto mayor a la hora actual");
                    setLoading(false);
                    return;
                }
            }
    
            // 3. Validación de horario para recordatorios
            if (formData.recordatorio) {
                const [hours, minutes] = formData.segundo.split(':').map(Number);
                const period = hours >= 12 ? "PM" : "AM";
    
                // Validar horario AM (7:00 - 11:59)
                if (period === "AM" && (hours < 7 || hours > 11)) {
                    toast.error("Horario AM inválido. Debe ser entre 7:00 AM y 11:59 AM");
                    setLoading(false);
                    return;
                }
    
                // Validar horario PM (12:00 - 22:00)
                if (period === "PM" && (hours < 12 || hours > 22)) {
                    toast.error("Horario PM inválido. Debe ser entre 12:00 PM y 10:00 PM");
                    setLoading(false);
                    return;
                }
    
                // Validar solapamiento de recordatorios
                const { conflict, existingTime } = hasReminderConflict(formData.fecha, formData.segundo);
                if (conflict) {
                    toast.error(`Conflicto con recordatorio existente a las ${existingTime}. Debe haber al menos 5 minutos de diferencia.`);
                    setLoading(false);
                    return;
                }
            }
    
            // 4. Preparar datos para enviar al servidor
            const dataToSend = {
                ...formData,
                fecha: `${formData.fecha}T${formData.segundo}`,
                datoContacto: formData.datoContacto.trim() || null,
                numeroTelefonico: formData.numeroTelefonico.toString().replace(/\D/g, '') // Limpiar formato
            };
    
            // 5. Enviar al servidor
            const response = await createFollows(dataToSend);
            
            // 6. Actualizar contexto
            setManagment(prev => ({
                ...prev,
                gestion: {
                    ...dataToSend,
                    idSeguimiento: response.idSeguimiento || Date.now(), // ID del servidor o temporal
                    timestamp: new Date().toISOString(),
                    tipo: "seguimiento",
                    ejecutivo: {
                        idEjecutivo: idEjecutivo,
                        nombre: nombreEjecutivo // Asegúrate de tener esta variable del contexto
                    }
                }
            }));
    
            // 7. Notificar éxito
            toast.success(<div>
                <strong>Seguimiento registrado</strong>
                <div>Cuenta: {formData.idCuenta}</div>
                <div>Fecha: {formData.fecha} {formData.segundo}</div>
            </div>);
    
            // 8. Resetear formulario (conservando número telefónico)
            setFormData(prev => ({
                ...prev,
                fecha: new Date().toISOString().split('T')[0],
                segundo: "07:00:00",
                recordatorio: false,
                datoContacto: "",
                idMotivoS: "0"
            }));
    
            // 9. Ejecutar callback de éxito
            if (onSuccessfulRegister) onSuccessfulRegister();
    
            // 10. Debug: Verificar contexto actualizado
            console.log("Contexto actualizado:", {
                gestion: {
                    ...dataToSend,
                    idSeguimiento: response.idSeguimiento,
                    timestamp: new Date().toISOString()
                }
            });
    
        } catch (error) {
            console.error("Error en handleSave:", error);
            
            // Manejo detallado de errores
            const errorMessage = error.response?.data?.message || 
                                error.message || 
                                "Error al guardar el seguimiento";
            
            toast.error(<div>
                <strong>Error</strong>
                <div>{errorMessage}</div>
                {error.response?.data?.details && (
                    <div>{JSON.stringify(error.response.data.details)}</div>
                )}
            </div>);
    
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
                                value={formData.displayedPhone || ""}
                                readOnly
                                placeholder={formData.displayedPhone || "No se encontró número en el contexto"}
                            />
                            {!formData.displayedPhone && (
                                <Form.Text className="text-danger">
                                    Advertencia: No se encontró número telefónico en el contexto
                                </Form.Text>
                            )}
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
                                min={new Date().toISOString().split('T')[0]}
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
                                        value={formData.segundo.split(':')[0]}
                                        onChange={(e) => {
                                            const hour = e.target.value;
                                            const [_, minute, second] = formData.segundo.split(':');
                                            setFormData({
                                                ...formData,
                                                segundo: `${hour}:${minute}:${second}`,
                                            });
                                        }}
                                        aria-label="Seleccionar hora"
                                    >
                                        {parseInt(formData.segundo.split(':')[0]) >= 12
                                            ? [...Array(11).keys()].map((h) => (
                                                <option key={h} value={h + 12}>
                                                    {(h + 12).toString().padStart(2, '0')}
                                                </option>
                                            ))
                                            : [...Array(5).keys()].map((h) => (
                                                <option key={h} value={h + 7}>
                                                    {(h + 7).toString().padStart(2, '0')}
                                                </option>
                                            ))}
                                    </Form.Select>
                                </Col>
                                <Col md={4}>
                                    <Form.Control
                                        type="text"
                                        value={formData.segundo.split(':')[1]}
                                        onChange={(e) => {
                                            const minute = e.target.value
                                                .replace(/\D/g, '')
                                                .slice(0, 2);
                                            const [hour, _, second] = formData.segundo.split(':');
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
                                            parseInt(formData.segundo.split(':')[0]) >= 12
                                                ? "PM"
                                                : "AM"
                                        }
                                        onChange={(e) => {
                                            const period = e.target.value;
                                            let [hour, minute, second] = formData.segundo.split(':');
                                            hour = parseInt(hour);
                                            if (period === "PM" && hour < 12) hour += 12;
                                            if (period === "AM" && hour >= 12) hour -= 12;
                                            setFormData({
                                                ...formData,
                                                segundo: `${hour.toString().padStart(2, '0')}:${minute}:${second}`,
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
                        style={{ height: "170px", resize: "none" }}
                        placeholder="Detalles adicionales del contacto..."
                        maxLength={280}
                    />
                    <div className="text-end text-muted small mt-1">
                        {formData.datoContacto.length}/280 caracteres
                    </div>
                </Form.Group>

                <div className="d-flex justify-content-end">
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