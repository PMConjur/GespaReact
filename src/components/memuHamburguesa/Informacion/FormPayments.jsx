import { useState, useContext, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { toast } from "sonner";
import { AppContext } from "../../../pages/Managment";
import { createPayments } from "../../../services/gespawebServices";

const FormPayments = ({ handleClose, onRegistrationSuccess }) => {
    const { searchResults } = useContext(AppContext);


    if (!searchResults || searchResults.length === 0) {
        toast.error("No se encontraron resultados de búsqueda. No se puede usar este formulario.");
        return null;
    }

    const idCuenta = searchResults?.map((result) => result.idCuenta) || [];
    const responseData = JSON.parse(localStorage.getItem("responseData"));
    const idEjecutivo = responseData?.ejecutivo?.infoEjecutivo.idEjecutivo;

    const [loading, setLoading] = useState(false);
    const today = new Date().toISOString().split("T")[0]; // Fecha actual en formato YYYY-MM-DD

    const initialFormState = {
        idCartera: 1,
        idCuenta: idCuenta[0]?.trim(),
        fechaPago: today,
        montoPago: "",
        referencia: "",
        sucursal: "",
        idEjecutivo: idEjecutivo,
    };

    const [formData, setFormData] = useState(initialFormState);

    // Resetear el formulario cuando el modal se abre/cierra o cambian las dependencias
    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            idCuenta: idCuenta[0]?.trim(),
        }));
    }, [idCuenta, idEjecutivo]);

    const resetForm = () => {
        setFormData(initialFormState);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: name === "montoPago"
                ? value.replace(/[^0-9]/g, "").slice(0, 9)
                : ["referencia", "sucursal"].includes(name)
                    ? value.replace(/[^a-zA-Z0-9\s]/g, "").slice(0, 16)
                    : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const todayDate = new Date();
        const oneYearAgo = new Date(todayDate);
        oneYearAgo.setFullYear(todayDate.getFullYear() - 1);

        const fechaPago = new Date(formData.fechaPago + "T00:00:00");

        // Validaciones
        if (!formData.fechaPago || fechaPago < oneYearAgo || fechaPago > todayDate) {
            toast.error("La fecha de pago debe estar dentro del último año y no puede ser futura.");
            setLoading(false);
            return;
        }

        if (!formData.montoPago || !formData.referencia || !formData.sucursal) {
            toast.error("Todos los campos son obligatorios.");
            setLoading(false);
            return;
        }

        try {
            const dataToSend = { ...formData, montoPago: parseInt(formData.montoPago, 10) };
            const response = await createPayments(dataToSend);

            if (response.success) {
                throw new Error(response.message || "Error en la respuesta del servidor");
            }

            toast.success("Pago registrado exitosamente.");
            resetForm();

            // 6. Notificar éxito al componente padre
            // Solo notificamos el éxito, el cierre lo maneja el padre
            if (typeof handleClose === 'function') {
                handleClose(true); // Indica que el registro fue exitoso
            }
            if (typeof onRegistrationSuccess === 'function') {
                onRegistrationSuccess(true); // Callback adicional
            }

        } catch (error) {

            console.error('Error en handleSubmit:', error);

            const errorMessage = error.response?.data?.message ||
                error.message ||
                "Error al procesar el cargo";

            toast.error(`❌ ${errorMessage}`);

            // 8. Notificar fallo al componente padre
            if (typeof handleClose === 'function') {
                handleClose(false); // Indica que hubo un error
            }
            if (typeof onRegistrationSuccess === 'function') {
                onRegistrationSuccess(false);
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <Form onSubmit={handleSubmit} className="p-3">
            <Row className="mb-3">
                <Col>
                    <Form.Group controlId="fechaPago">
                        <Form.Label>Fecha de Pago</Form.Label>
                        <Form.Control
                            type="date"
                            name="fechaPago"
                            value={formData.fechaPago}
                            onChange={handleChange}
                            max={today}
                            min={new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split("T")[0]}
                            required
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col>
                    <Form.Group controlId="montoPago">
                        <Form.Label>Monto</Form.Label>
                        <Form.Control
                            type="text"
                            name="montoPago"
                            value={formData.montoPago}
                            onChange={handleChange}
                            placeholder="$00.00"
                            required
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col>
                    <Form.Group controlId="referencia">
                        <Form.Label>Referencia</Form.Label>
                        <Form.Control
                            type="text"
                            name="referencia"
                            value={formData.referencia}
                            onChange={handleChange}
                            placeholder=""
                            required
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col>
                    <Form.Group controlId="sucursal">
                        <Form.Label>Sucursal</Form.Label>
                        <Form.Control
                            type="text"
                            name="sucursal"
                            value={formData.sucursal}
                            onChange={handleChange}
                            placeholder="Eugenia"
                            required
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col className="text-end"> {/* Alinea el botón a la derecha */}
                    <Button
                        variant="primary"
                        type="submit"
                        className="mb-2"
                        disabled={loading}
                    >
                        {loading ? "Guardando..." : "Guardar"}
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};

export default FormPayments;