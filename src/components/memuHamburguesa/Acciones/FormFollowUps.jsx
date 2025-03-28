import { useState, useContext } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { toast } from "sonner"; // Importar toast
import { createFollows } from "../../../services/gespawebServices"; // Servicio para crear seguimiento
import { AppContext } from "../../../pages/Managment"; // Contexto de la aplicación

const FormFollowUps = ({ handleClose }) => {
    const { searchResults } = useContext(AppContext);

    // Validar si searchResults está vacío o es undefined
    if (!searchResults || searchResults.length === 0) {
        toast.error("No se encontraron resultados de búsqueda. No se puede usar este formulario.");
        return null; // Bloquear el uso del componente
    }

    // Mapear searchResults para obtener idCuenta
    const idCuenta = searchResults?.map((result) => result.idCuenta) || [];
    console.log("idCuentas mapeados:", idCuenta);
    const responseData = JSON.parse(localStorage.getItem("responseData"));
    const idEjecutivo = responseData?.ejecutivo?.infoEjecutivo.idEjecutivo;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null); // Mensaje de éxito

    const [formData, setFormData] = useState({
        idCartera: 1, // ID de la cartera fijo como 1
        idCuenta: idCuenta[0].trim(), // ID de la cuenta desde el contexto
        idEjecutivo: idEjecutivo, // ID del ejecutivo desde el contexto
        fecha: new Date().toISOString().split("T")[0],
        segundo: "11:00:00", // Hora inicial ajustada a 11:00 AM
        idAcercamiento: "1601", // Valor inicial del primer elemento en Acercamiento
        recordatorio: false,
        numeroTelefonico: "",
        datoContacto: "",
        idMotivoS: "0",
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === "numeroTelefonico") {
            // Limitar a solo números y longitud entre 10 y 13
            const numericValue = value.replace(/\D/g, ""); // Eliminar caracteres no numéricos
            if (numericValue.length <= 13) {
                setFormData((prev) => ({
                    ...prev,
                    [name]: numericValue,
                }));
            }
        } else if (name === "datoContacto") {
            // Permitir letras, números y espacios
            const sanitizedValue = value.replace(/[^a-zA-Z0-9\s]/g, ""); // Permitir solo letras, números y espacios
            setFormData((prev) => ({
                ...prev,
                [name]: sanitizedValue,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value,
            }));
        }
    };

    const handleTimeChange = (e) => {
        const timeValue = e.target.value;
        setFormData((prev) => ({
            ...prev,
            segundo: timeValue + ":00", // Agregar segundos para el formato esperado
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            // Validar que el número telefónico tenga al menos 10 dígitos
            if (formData.numeroTelefonico.length < 10) {
                toast.error("El número telefónico debe tener al menos 10 dígitos.");
                setLoading(false);
                return;
            }

            // Crear una copia de formData sin datoContacto si está vacío
            const dataToSend = { ...formData };
            if (!dataToSend.datoContacto.trim()) {
                dataToSend.datoContacto = null; // Enviar como null si está vacío
            }

            // Imprimir dataToSend en la consola
            console.log("Datos a enviar:", dataToSend);

            // Llamar al servicio createFollows
            const response = await createFollows(dataToSend);

            // Mostrar el mensaje de éxito como toast
            toast.success(response.mensaje || "Seguimiento guardado exitosamente.");
        } catch (error) {
            console.error("Error al guardar el seguimiento:", error);
            // Mostrar el mensaje de error como toast
            toast.error(error.message || "Ocurrió un error al guardar el seguimiento.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Form>
                {/* Campos del formulario */}
                <Form.Group className="mb-3">
                    <Form.Label>Acercamiento *</Form.Label>
                    <Form.Control
                        as="select"
                        name="idAcercamiento"
                        value={formData.idAcercamiento}
                        onChange={handleChange}
                        required
                    >
                        <option value="1601">Telefónico</option> {/* Primer elemento mostrado por defecto */}
                    </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Teléfono *</Form.Label>
                    <Form.Control
                        type="tel"
                        name="numeroTelefonico"
                        value={formData.numeroTelefonico}
                        onChange={handleChange}
                        placeholder="Ej: 5512345678"
                        pattern="[0-9]{10,13}" // Validación de longitud mínima y máxima
                        title="Debe contener entre 10 y 13 dígitos numéricos"
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Fecha *</Form.Label>
                    <Form.Control
                        type="date"
                        name="fecha"
                        value={formData.fecha} // Fecha inicial ajustada al día actual
                        onChange={handleChange}
                        max={new Date().toISOString().split("T")[0]} // Permitir seleccionar hasta el día actual
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Hora *</Form.Label>
                    <Form.Control
                        type="time"
                        name="segundo"
                        value={formData.segundo.split(":").slice(0, 2).join(":")}
                        onChange={handleTimeChange}
                        step="60"
                        required
                    />
                </Form.Group>

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
                        rows={3}
                        placeholder="Detalles adicionales del contacto..."
                        maxLength={500} // Limitar longitud máxima
                    />
                </Form.Group>

                <div className="d-flex justify-content-between">
                    <Button variant="secondary" onClick={handleClose} disabled={loading}>
                        Cancelar
                    </Button>
                    <Button
                        variant="primary"
                        id="btnGuardarSeg"
                        onClick={handleSave} // Evento onClick
                        disabled={loading}
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