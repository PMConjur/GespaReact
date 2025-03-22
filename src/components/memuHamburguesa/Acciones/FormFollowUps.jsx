import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";

const FormFollowUps = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        acercamiento: "",
        telefono: "",
        fecha: "",
        hora: "",
        recordatorio: false,
        situacion: "",
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
                <Col>
                    <Form.Group controlId="acercamiento">
                        <Form.Label>Acercamiento</Form.Label>
                        <Form.Control
                            as="select"
                            name="acercamiento"
                            value={formData.acercamiento}
                            onChange={handleChange}
                        >
                            <option value="">Seleccionar</option>
                            <option value="opcion1">Opción 1</option>
                            <option value="opcion2">Opción 2</option>
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="telefono">
                        <Form.Label>Teléfono</Form.Label>
                        <Form.Control
                            type="text"
                            name="telefono"
                            value={formData.telefono}
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
                            value={formData.fecha}
                            onChange={handleChange}
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="hora">
                        <Form.Label>Hora</Form.Label>
                        <Form.Control
                            type="time"
                            name="hora"
                            value={formData.hora}
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
            <Form.Group controlId="situacion" className="mb-3">
                <Form.Label>Situación</Form.Label>
                <Form.Control
                    as="select"
                    name="situacion"
                    value={formData.situacion}
                    onChange={handleChange}
                >
                    <option value="">Seleccionar</option>
                    <option value="situacion1">Se corta llamada</option>
                    <option value="situacion2">Otra situación</option>
                </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit">
                Guardar
            </Button>
        </Form>
    );
};

export default FormFollowUps;
