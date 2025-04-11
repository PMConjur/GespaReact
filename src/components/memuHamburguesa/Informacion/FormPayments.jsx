import { useState, useContext, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { toast } from "sonner";
import { AppContext } from "../../../pages/Managment";
import { createPayments } from "../../../services/gespawebServices";

const FormPayments = ({ onRegistrationSuccess, setPaymentActive }) => {
    const { searchResults } = useContext(AppContext);
    const idCuenta = searchResults?.map((result) => result.idCuenta) || [];
    const responseData = JSON.parse(localStorage.getItem("responseData"));
    const idEjecutivo = responseData?.ejecutivo?.infoEjecutivo.idEjecutivo;

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

        const todayDate = new Date();
        const oneYearAgo = new Date(todayDate);
        oneYearAgo.setFullYear(todayDate.getFullYear() - 1);

        const fechaPago = new Date(formData.fechaPago + "T00:00:00");

        // Validaciones
        if (!formData.fechaPago || fechaPago < oneYearAgo || fechaPago > todayDate) {
            toast.error("La fecha de pago debe estar dentro del último año y no puede ser futura.");
            return;
        }

        if (!formData.montoPago || !formData.referencia || !formData.sucursal) {
            toast.error("Todos los campos son obligatorios.");
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
            // Notificar al componente padre que hubo un registro exitoso
            onRegistrationSuccess(false);
            setPaymentActive(false); // Cerrar el modal después de un registro exitoso
            
        } catch (error) {
            console.error("Error:", error);
            toast.error(error.message || "Error al registrar el pago.");
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
                        >
                            Guardar
                        </Button>
                    </Col>
                </Row>
            </Form>
        );
    };

    export default FormPayments;