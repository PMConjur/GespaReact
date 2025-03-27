import { useState, useContext } from "react"; // Añadido useContext
import { Form, Button, Row, Col } from "react-bootstrap";
import { AppContext } from "../../../pages/Managment"; // Descomentado
import { createFollows } from "../../../services/gespawebServices"; // Añadido
import "../../../scss/styles.scss";

const FormFollowUps = ({ onSubmit }) => {
    const { searchResults, responseData, selectedDateRange } = useContext(AppContext); // Añadidos responseData y selectedDateRange

    const idEjecutivo = responseData?.ejecutivo?.infoEjecutivo?.idEjecutivo;
    
    // Corregido el useState (eliminado requestData y formData del array)
    const [formData, setFormData] = useState({
        idCartera: 1,
        idCuenta: searchResults?.[0]?.idCuenta?.trim() || "string", // Añadido ? después de idCuenta
        idEjecutivo: idEjecutivo,
        fecha: selectedDateRange?.startDate ? new Date(selectedDateRange.startDate).toISOString() : new Date().toISOString(), // Manejo de fecha por defecto
        segundo: "",
        idAcercamiento: "",
        recordatorio: true,
        numeroTelefonico: "",
        datoContacto: "",
        idMotivoS: ""
    });

    const [loading, setLoading] = useState(false); // Nuevo estado para manejar la carga

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Inicia el estado de carga
        try {
            const response = await createFollows(formData); // Llama a la función createFollows con los datos del formulario
            console.log("Seguimiento creado:", response); // Manejo de la respuesta
            onSubmit(formData); // Llama a la función onSubmit con los datos del formulario
        } catch (error) {
            console.error("Error al crear seguimiento:", error); // Manejo de errores
        } finally {
            setLoading(false); // Finaliza el estado de carga
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
                <Col>
                    <Form.Group controlId="idAcercamiento"> 
                        <Form.Label>Acercamiento</Form.Label>
                        <Form.Control
                            as="select"
                            name="idAcercamiento" // Cambiado para coincidir con el estado
                            value={formData.idAcercamiento}
                            onChange={handleChange}
                        >
                            <option value="">Seleccionar</option>
                            <option value="opcion1">Opción 1</option>
                            <option value="opcion2">Opción 2</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="numeroTelefonico">
                        <Form.Label>Teléfono</Form.Label>
                        <Form.Control
                            type="text"
                            name="numeroTelefonico" // Cambiado para coincidir con el estado
                            value={formData.numeroTelefonico}
                            onChange={handleChange}
                            placeholder="xxx-xxx-xxxx"
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col>
                    <Form.Group controlId="fecha">
                        <Form.Label>Fecha</Form.Label>
                        <Form.Control
                            type="date"
                            name="fecha"
                            value={formData.fecha.split('T')[0]} // Formatear para input date
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="segundo"> 
                        <Form.Label>Hora</Form.Label>
                        <Form.Control
                            type="time"
                            name="segundo" // Cambiado para coincidir con el estado
                            value={formData.segundo}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Form.Group controlId="recordatorio" className="mb-3">
                <Form.Check
                    type="checkbox"
                    name="recordatorio"
                    label="Recordatorio"
                    checked={formData.recordatorio}
                    onChange={handleChange}
                />
            </Form.Group>
            <Form.Group controlId="idMotivoS" className="mb-3"> 
                <Form.Label>Situación</Form.Label>
                <Form.Control
                    as="select"
                    name="idMotivoS" // Cambiado para coincidir con el estado
                    value={formData.idMotivoS}
                    onChange={handleChange}
                >
                    <option value="">Seleccionar</option>
                    <option value="situacion1">Se corta llamada</option>
                    <option value="situacion2">Otra situación</option>
                </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit" disabled={loading}>
                {loading ? "Guardando..." : "Guardar"} {/* Cambia el texto del botón según el estado de carga */}
            </Button>
        </Form>
    );
};

export default FormFollowUps;