import { useState, useContext, useEffect } from "react";
import { Form, Button, Spinner, Row, Col } from "react-bootstrap";
import { toast } from "sonner";
import { createFollows, fetchNotes } from "../../../services/gespawebServices";
import { AppContext } from "../../../pages/Managment";
import { getPhoneNumberFromContext } from "../../../utils/phoneUtils"; // Importa la función centralizada

const FormFollowUps = ({ handleClose, isFollowUpsActive, onSuccessfulRegister, FollowClipboardActive = false }) => {
    const {
        isManagment,
        searchResults,
        setManagment,
        nombreEjecutivo,
        formData,
        setFormData,
        selectedAnswer,
        responseData,
        isDataAllPhones,
        setAllPhones,
        selectedPhoneForFollowUps, // Obtener el número del contexto
        idEjecutivo // Obtener idEjecutivo del contexto
    } = useContext(AppContext);

    useEffect(() => {
        console.log("DEBUG: idEjecutivo obtenido desde el contexto:", idEjecutivo);
        if (!idEjecutivo) {
            console.warn("Advertencia: idEjecutivo no está definido. Verifica el contexto.");
        }
    }, [idEjecutivo]);

    if (!searchResults || searchResults.length === 0) {
        toast.error("No se encontraron resultados de búsqueda. No se puede usar este formulario.");
        return null;
    }

    const idCuenta = searchResults.map((result) => result.idCuenta);

    const [loading, setLoading] = useState(false);
    const [existingReminders, setExistingReminders] = useState([]);

    useEffect(() => {
        const phone = getPhoneNumberFromContext({
            isManagment,
            selectedAnswer,
            isDataAllPhones,
            selectedPhoneForFollowUps
        }); // Usa la función centralizada

        setFormData(prev => ({
            ...prev,
            idCartera: searchResults[0]?.idCartera || 1, // Restaurar idCartera
            idCuenta: searchResults[0]?.idCuenta?.trim() || "", // Restaurar idCuenta
            idAcercamiento: "1601", // Restaurar idAcercamiento
            idMotivoS: "0", // Restaurar idMotivoS
            fecha: new Date().toISOString().split('T')[0], // Fecha al día actual
            numeroTelefonico: phone.raw,
            displayedPhone: phone.formatted
        }));
    }, [isManagment, selectedAnswer, isDataAllPhones, selectedPhoneForFollowUps, searchResults]);

    useEffect(() => {
        if (FollowClipboardActive) {
            setFormData(prev => ({
                ...prev,
                datoContacto: null // Internamente se establece como nulo
            }));
        }
    }, [FollowClipboardActive]);

    useEffect(() => {
        const loadReminders = async () => {
            if (!idCuenta[0]?.trim()) {
                console.warn("No se encontró un idCuenta válido para cargar recordatorios.");
                return;
            }

            try {
                console.log("Enviando solicitud a fetchNotes con idCuenta:", idCuenta[0]?.trim());
                const notes = await fetchNotes(idCuenta[0]?.trim());
                const reminders = notes
                    .filter(note => note.recordatorio)
                    .map(note => {
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
                console.error("Error al cargar recordatorios:", error.response?.data || error.message);
            }
        };

        loadReminders();
    }, [idCuenta]);

    useEffect(() => {
        const logFetchedNotes = async () => {
            if (!idEjecutivo) {
                console.warn("No se encontró un idEjecutivo válido para cargar notas.");
                return;
            }

            try {
                console.log("Enviando solicitud a fetchNotes con idEjecutivo:", idEjecutivo);
                const notes = await fetchNotes(idEjecutivo);
                console.log("Notas obtenidas:", notes);
                setExistingReminders(notes);
            } catch (error) {
                console.error("Error fetching notes in logFetchedNotes:", error.response?.data || error.message);
            }
        };
        if (idEjecutivo) {
            logFetchedNotes();
        }
    }, [idEjecutivo]);

    const hasReminderConflict = (date, time) => {
        try {
            const newRecordDateTime = new Date(`${date}T${time}`);
            newRecordDateTime.setSeconds(0, 0);

            for (const reminder of existingReminders) {
                const reminderDateTime = reminder.date
                    ? new Date(reminder.date)
                    : new Date(`${date}T${reminder.segundo}`);
                reminderDateTime.setSeconds(0, 0);

                const diff = Math.abs(newRecordDateTime - reminderDateTime);
                if (diff < 5 * 60 * 1000) {
                    return {
                        conflict: true,
                        existingTime: reminderDateTime.toTimeString().split(" ")[0]
                    };
                }
            }
            return { conflict: false };
        } catch (error) {
            console.error("Error en la validación de recordatorios:", error);
            return { conflict: false };
        }
    };

    const normalizeTime = (timeStr) => {
        const parts = timeStr.split(':');
        parts[0] = parts[0].padStart(2, '0'); // Asegura que las horas tengan 2 dígitos
        parts[1] = (parts[1] || '00').padStart(2, '0'); // Asegura que los minutos tengan 2 dígitos
        parts[2] = (parts[2] || '00').padStart(2, '0'); // Asegura que los segundos tengan 2 dígitos
        return parts.join(':');
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (!formData) return;

        if (name === "segundo") {
            const normalizedTime = normalizeTime(value); // Normaliza el tiempo ingresado
            setFormData(prev => ({ ...prev, [name]: normalizedTime }));
        } else if (name === "datoContacto") {
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
        if (!formData) return;

        setLoading(true);
        try {
            // Validación para minutos con 2 dígitos
            const minute = (formData.segundo || "00:00:00").split(':')[1];
            if (!/^\d{2}$/.test(minute) || parseInt(minute) < 0 || parseInt(minute) > 59) {
                toast.error("El campo de minutos (MM) debe tener exactamente 2 dígitos válidos (01-59).");
                setLoading(false);
                return;
            }

            if (!idEjecutivo) {
                console.error("Error: idEjecutivo no está definido. No se puede enviar el seguimiento.");
                toast.error("Error: No se puede enviar el seguimiento porque el idEjecutivo no está definido.");
                setLoading(false);
                return;
            }

            if (!formData.numeroTelefonico || formData.numeroTelefonico.trim().length < 10) {
                toast.error("Número telefónico inválido o incompleto");
                setLoading(false);
                return;
            }

            const todayStr = new Date().toISOString().split('T')[0];
            if (formData.fecha < todayStr) {
                toast.error("No puedes seleccionar una fecha anterior al día actual");
                setLoading(false);
                return;
            }

            if (formData.fecha === todayStr) {
                const scheduledTimeNormalized = normalizeTime(formData.segundo);
                const scheduledDate = new Date(`${formData.fecha}T${scheduledTimeNormalized}`);
                const nowPlusOne = new Date(Date.now() + 60000);
                if (scheduledDate < nowPlusOne) {
                    toast.error("Debe seleccionar un horario superior a la hora actual");
                    setLoading(false);
                    return;
                }
            }

            if (formData.recordatorio === true) {
                const [hours, minutes] = formData.segundo.split(':').map(Number);
                const period = hours >= 12 ? "PM" : "AM";

                if (period === "AM" && (hours < 7 || hours > 11)) {
                    toast.error("Horario AM inválido. Debe ser entre 7:00 AM y 11:59 AM");
                    setLoading(false);
                    return;
                }

                if (period === "PM" && (hours < 12 || hours > 22)) {
                    toast.error("Horario PM inválido. Debe ser entre 12:00 PM y 9:59 PM");
                    setLoading(false);
                    return;
                }
            }

            const { conflict, existingTime } = hasReminderConflict(formData.fecha, formData.segundo);
            if (conflict) {
                toast.error(`Conflicto con seguimiento existente a las ${existingTime}. Debe haber al menos 5 minutos de diferencia.`);
                setLoading(false);
                return;
            }

            if (!formData.recordatorio) {
                const newDateTime = `${formData.fecha}T${formData.segundo}`;
                const existingNonReminder = existingReminders.find(reminder => {
                    return reminder.date && reminder.recordatorio === false &&
                        reminder.date.substring(0, 16) === newDateTime.substring(0, 16);
                });
                if (existingNonReminder) {
                    toast.error("Ya existe un seguimiento sin recordatorio para la misma fecha y hora");
                    setLoading(false);
                    return;
                }
            }

            const normalizedTime = normalizeTime(formData.segundo || "00:00:00"); // Normaliza el formato de 'segundo'
            const dataToSend = {
                ...formData,
                idEjecutivo, // Aseguramos que idEjecutivo esté incluido
                fecha: `${formData.fecha}T${normalizedTime}`, // Usa el tiempo normalizado
                datoContacto: FollowClipboardActive ? null : formData.datoContacto?.trim() || null, // Enviar como nulo si FollowClipboardActive está activo
                numeroTelefonico: formData.numeroTelefonico.toString().replace(/\D/g, ''),
                segundo: normalizedTime // Asegura que 'segundo' también esté normalizado
            };

            console.log("DEBUG: Intentando enviar seguimiento con datos:", dataToSend);

            const response = await createFollows(dataToSend);
            console.log("Registro de seguimiento exitoso enviado:", dataToSend);

            setExistingReminders(prev => [
                ...prev,
                {
                    date: dataToSend.fecha,
                    recordatorio: formData.recordatorio
                }
            ]);

            setManagment(prev => ({
                ...prev,
                gestion: {
                    ...dataToSend,
                    timestamp: new Date().toISOString(),
                    tipo: "seguimiento",
                    ejecutivo: {
                        idEjecutivo: idEjecutivo,
                        nombre: nombreEjecutivo
                    }
                }
            }));

            toast.success(<div>
                <strong>Seguimiento registrado</strong>
                <div>Cuenta: {formData.idCuenta}</div>
                <div>Fecha: {formData.fecha} {formData.segundo}</div>
            </div>);

            setFormData(prev => ({
                ...prev,
                idCartera: searchResults[0]?.idCartera || 1,
                idCuenta: searchResults[0]?.idCuenta?.trim() || "",
                idAcercamiento: "1601",
                idMotivoS: "0",
                fecha: new Date().toISOString().split('T')[0],
                segundo: "07:00:00",
                recordatorio: false,
                datoContacto: "",
                numeroTelefonico: "",
                displayedPhone: ""
            }));

            if (onSuccessfulRegister) onSuccessfulRegister();
            if (handleClose) handleClose();

        } catch (error) {
            console.error("Error en handleSave:", error);

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

    if (!formData) {
        return <div>Cargando formulario...</div>;
    }

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
                                        value={(formData.segundo || "00:00:00").split(':')[0]} // Asigna un valor predeterminado
                                        onChange={(e) => {
                                            const hour = e.target.value;
                                            const [_, minute, second] = (formData.segundo || "00:00:00").split(':'); // Asigna un valor predeterminado
                                            const newMinute = (hour === "22") ? "00" : minute;
                                            setFormData({
                                                ...formData,
                                                segundo: `${hour}:${newMinute}:${second}`,
                                            });
                                        }}
                                        aria-label="Seleccionar hora"
                                    >
                                        {parseInt((formData.segundo || "00:00:00").split(':')[0]) >= 12
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
                                        value={(formData.segundo || "00:00:00").split(':')[1]} // Asigna un valor predeterminado
                                        onChange={(e) => {
                                            const minute = e.target.value.replace(/\D/g, '').slice(0, 2);
                                            if (minute.length < 2) {
                                                toast.error("El campo de minutos (MM) debe tener exactamente 2 dígitos.");
                                            }
                                            const [hour, , second] = (formData.segundo || "00:00:00").split(':'); // Asigna un valor predeterminado
                                            setFormData({
                                                ...formData,
                                                segundo: `${hour}:${minute}:${second}`,
                                            });
                                        }}
                                        placeholder="MM"
                                        maxLength={2}
                                        pattern="[0-5][0-9]"
                                        disabled={(formData.segundo || "00:00:00").split(':')[0] === "22"} // Asigna un valor predeterminado
                                    />
                                </Col>
                                <Col md={4}>
                                    <Form.Select
                                        value={
                                            parseInt((formData.segundo || "00:00:00").split(':')[0]) >= 12
                                                ? "PM"
                                                : "AM"
                                        } // Asigna un valor predeterminado
                                        onChange={(e) => {
                                            const period = e.target.value;
                                            let [hour, minute, second] = (formData.segundo || "00:00:00").split(':'); // Asigna un valor predeterminado
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

                {!FollowClipboardActive && ( // Ocultar el campo de comentarios si FollowClipboardActive está activo
                    <Form.Group className="mb-3">
                        <Form.Label>Comentarios</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="datoContacto"
                            value={formData.datoContacto || ""} // Asigna un valor predeterminado
                            onChange={handleChange}
                            style={{ height: "170px", resize: "none" }}
                            placeholder="Detalles adicionales del contacto..."
                            maxLength={280}
                        />
                        <div className="text-end text-muted small mt-1">
                            {(formData.datoContacto || "").length}/280 caracteres {/* Asigna un valor predeterminado */}
                        </div>
                    </Form.Group>
                )}

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