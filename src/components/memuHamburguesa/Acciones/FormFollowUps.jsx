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

    useEffect(() => {
        if (!isFollowUpsActive) {
            setFormData({
                idCartera: "",
                idCuenta: "",
                idAcercamiento: "1601",
                idMotivoS: "0",
                fecha: new Date().toISOString().split('T')[0],
                segundo: "",
                recordatorio: false,
                datoContacto: "",
                numeroTelefonico: "",
                displayedPhone: ""
            });
        }
    }, [isFollowUpsActive]);

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
            idCartera: 1, // Restaurar idCartera
            idCuenta: searchResults[0]?.idCuenta?.trim() || "", // Restaurar idCuenta
            idEjecutivo: idEjecutivo, // Restaurar idEjecutivo
            idAcercamiento: "1601", // Restaurar idAcercamiento
            recordatorio: false, // Restaurar recordatorio
            idMotivoS: "0", // Restaurar idMotivoS
            datoContacto: "", // Restaurar datoContacto
            fecha: new Date().toISOString().split('T')[0], // Fecha al día actual
            segundo: "", // Elimina la hora actual
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
                        const fechaPago = note.FechaPago?.endsWith('Z')
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
            newRecordDateTime.setSeconds(0, 0); // Normaliza segundos y milisegundos

            for (const reminder of existingReminders) {
                const reminderDateTime = reminder.rawDate
                    ? new Date(reminder.rawDate) // Usa la fecha cruda si está disponible
                    : new Date(`${reminder.date}T${reminder.time || "00:00:00"}`);
                reminderDateTime.setSeconds(0, 0); // Normaliza segundos y milisegundos

                const diff = Math.abs(newRecordDateTime - reminderDateTime);
                if (diff === 0 || diff < 5 * 60 * 1000) { // Conflicto exacto o dentro de 5 minutos
                    return {
                        conflict: true,
                        existingDate: reminder.date,
                        existingTime: reminder.time
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
        if (!timeStr) timeStr = ""; // Usa una cadena vacía como predeterminado
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
            const segundo = formData.segundo; // Usa el valor proporcionado en lugar de la hora actual

            // Validación para hora no seleccionada
            if (!segundo || segundo.startsWith(":")) {
                toast.error("Debe seleccionar una hora válida antes de enviar el formulario.");
                setLoading(false);
                return;
            }

            // Validación para minutos con 2 dígitos
            const minute = segundo.split(':')[1];
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

            // Validación para motivo válido
            if (!formData.idMotivoS || formData.idMotivoS === "" || formData.idMotivoS === "0") {
                toast.error("Debe seleccionar un motivo válido antes de enviar el formulario.");
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
                const scheduledTimeNormalized = normalizeTime(segundo);
                const scheduledDate = new Date(`${formData.fecha}T${scheduledTimeNormalized}`);
                const nowPlusOne = new Date(Date.now() + 60000);
                if (scheduledDate < nowPlusOne) {
                    toast.error("Debe seleccionar un horario superior a la hora actual");
                    setLoading(false);
                    return;
                }
            }

            if (formData.recordatorio === true) {
                const [hours, minutes] = segundo.split(':').map(Number);
                const period = hours >= 12 ? "PM" : "AM";

                if (period === "AM" && (hours < 7 || hours > 11)) {
                    toast.error("Horario AM inválido. Debe ser entre 7:00 AM y 11:59 AM");
                    setLoading(false);
                    return;
                }

                if (period === "PM" && (hours < 12 || hours > 22)) {
                    toast.error("Horario PM inválido. Debe ser entre 12:00 PM y 22:00 PM");
                    setLoading(false);
                    return;
                }
            }

            if (formData.recordatorio === true || formData.recordatorio === false) {
                const { conflict, existingDate, existingTime } = hasReminderConflict(formData.fecha, segundo);
                if (conflict) {
                    toast.error(`Conflicto detectado: ya existe un seguimiento registrado el ${existingDate} a las ${existingTime}.`);
                    setLoading(false);
                    return;
                }
            }

            const normalizedTime = normalizeTime(segundo);
            const dataToSend = {
                ...formData,
                idEjecutivo,
                fecha: `${formData.fecha}T${normalizedTime}`,
                datoContacto: FollowClipboardActive ? null : formData.datoContacto?.trim() || null,
                numeroTelefonico: formData.numeroTelefonico.toString().replace(/\D/g, ''),
                segundo: normalizedTime
            };

            console.log("DEBUG: Intentando enviar seguimiento con datos:", dataToSend);

            const response = await createFollows(dataToSend);
            console.log("Código de respuesta del endpoint:", response.status);
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
                idCartera:  1,
                idCuenta: searchResults[0]?.idCuenta?.trim() || "",
                idEjecutivo: idEjecutivo,
                idAcercamiento: "1601",
                idMotivoS: "0",
                fecha: new Date().toISOString().split('T')[0],
                segundo: "", // Restablece a una cadena vacía
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
                        <Col md={12}>
                            <Form.Group>
                                <Form.Label>Motivo *</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="idMotivoS"
                                    value={formData.idMotivoS}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Seleccione un motivo</option>
                                    <option value="4401">Se corta llamada</option>
                                    <option value="4402">Seguimiento llamada</option>
                                    <option value="4403">Solicitud titular</option>
                                    <option value="4404">Se realizará PEX</option>
                                    <option value="4405">No puede atender</option>
                                    <option value="4406">Reportará pago</option>
                                    <option value="4407">Cierre de gestión</option>
                                </Form.Control>
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
                                        <option value="">Seleccione alguno</option>
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
                                            if (period === "PM" && hour < 12) {
                                                hour += 12; // Convierte a formato PM
                                            }
                                            if (period === "AM" && hour >= 12) {
                                                hour -= 12; // Convierte a formato AM
                                            }
                                            const updatedHour = hour.toString().padStart(2, '0');
                                            setFormData({
                                                ...formData,
                                                segundo: updatedHour === "00" ? "" : `${updatedHour}:${minute}:${second}`, // Si la hora es inválida, establece vacío
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

                <div className="d-flex justify-content-end">
                    <Button
                        variant="primary"
                        onClick={handleSave}
                        disabled={
                            loading ||
                            formData.segundo === "" ||
                            formData.segundo === "Seleccione alguno" ||
                            formData.segundo.split(':')[0] === "" // Verifica si la hora es inválida
                        } // Deshabilita si no se selecciona una hora válida
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