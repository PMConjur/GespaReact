import { useState, useContext } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { toast } from "sonner";
import { AppContext } from "../../../pages/Managment";
import { createPayments } from "../../../services/gespawebServices";

const FormPayments = () => {
    const { searchResults } = useContext(AppContext);
    const idCuenta = searchResults?.map((result) => result.idCuenta) || [];
    const responseData = JSON.parse(localStorage.getItem("responseData"));
    const idEjecutivo = responseData?.ejecutivo?.infoEjecutivo.idEjecutivo;

    const today = new Date().toISOString().split("T")[0]; // Fecha actual en formato YYYY-MM-DD


    
    const [formData, setFormData] = useState({
        idCartera: 1,
        idCuenta: idCuenta[0]?.trim(),
        fechaPago: today, // Inicializa con la fecha actual
        montoPago: "",
        referencia: "",
        sucursal: "",
        idEjecutivo: idEjecutivo,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === "montoPago"
                ? value.replace(/[^0-9]/g, "").slice(0, 10)
                : name === "fechaPago"
                ? value // Asigna directamente el valor de la fecha
                : value.replace(/[^a-zA-Z0-9\s]/g, "").slice(0, 16),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const today = new Date();
        const oneYearAgo = new Date(today);
        oneYearAgo.setFullYear(today.getFullYear() - 1);

        const fechaPago = new Date(formData.fechaPago + "T00:00:00"); // Asegura el formato correcto
        if (!formData.fechaPago || fechaPago < oneYearAgo || fechaPago > today) {
            toast.error("La fecha de pago debe estar dentro del último año y no puede ser futura.");
            return;
        }

        if (!formData.montoPago || !formData.referencia || !formData.sucursal) {
            toast.error("Todos los campos son obligatorios.");
            return;
        }

        try {
            const dataToSend = {
                ...formData,
                montoPago: parseInt(formData.montoPago, 10),
            };

            console.log("Datos enviados al endpoint:", dataToSend); // Log para verificar los datos enviados

            const response = await createPayments(dataToSend);

            console.log("Respuesta del endpoint:", response); // Log para verificar la respuesta del endpoint

            if (response.success) {
                toast.success("Pago registrado exitosamente."); // Notificación de éxito
                setFormData({
                    idCartera: 1,
                    idCuenta: idCuenta[0]?.trim(),
                    fechaPago: today, // Inicializa con la fecha actual
                    montoPago: "",
                    referencia: "",
                    sucursal: "",
                    idEjecutivo: idEjecutivo,
                });
            }
        } catch (error) {
            console.error("Error al registrar el pago:", error); // Log para errores
            toast.error("Error al registrar el pago.");
        }
    };

    return (
        <Form onSubmit={handleSubmit} className="p-3">
            <Row className="mb-3">
                <Col>
                    <Form.Group>
                        <Form.Label>Fecha de Pago</Form.Label>
                        <Form.Control
                            type="date"
                            name="fechaPago"
                            value={formData.fechaPago}
                            onChange={handleChange}
                            max={today} // Restringe fechas futuras
                            min={new Date(new Date().setFullYear(new Date().getFullYear() - 1)).toISOString().split("T")[0]} // Restringe más de un año atrás
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col>
                    <Form.Group>
                        <Form.Label>Monto</Form.Label>
                        <Form.Control
                            type="text"
                            name="montoPago"
                            value={formData.montoPago}
                            onChange={handleChange}
                            placeholder="00.00"
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col>
                    <Form.Group>
                        <Form.Label>Referencia</Form.Label>
                        <Form.Control
                            type="text"
                            name="referencia"
                            value={formData.referencia}
                            onChange={handleChange}
                            placeholder=""
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col>
                    <Form.Group>
                        <Form.Label>Sucursal</Form.Label>
                        <Form.Control
                            type="text"
                            name="sucursal"
                            value={formData.sucursal}
                            onChange={handleChange}
                            placeholder="Eugenia"
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button variant="primary" type="submit" className="w-100">
                        Guardar
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};

export default FormPayments;