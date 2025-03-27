import React, { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { createFollows } from "../../../services/gespawebServices";

const FormFollowUps = ({ onSubmitSuccess, handleClose, searchResults, idEjecutivo }) => {
    console.log('[FormFollowUps] Props recibidos:', {
        idEjecutivo,
        searchResults: searchResults?.[0]
    });

    // Estado del formulario
    const [formData, setFormData] = useState({
        idCartera: 1,
        idCuenta: "",
        idEjecutivo: idEjecutivo || "",
        fecha: "",
        segundo: "",
        idAcercamiento: "",
        recordatorio: true,
        numeroTelefonico: "",
        datoContacto: "",
        idMotivoS: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Inicializar datos del formulario
    useEffect(() => {
        console.log('[FormFollowUps] Inicializando formulario con searchResults:', searchResults?.[0]);

        const initialData = {
            ...formData,
            idCuenta: searchResults?.[0]?.idCuenta?.trim() || "",
            idEjecutivo: idEjecutivo || "",
            fecha: new Date().toISOString()
        };

        console.log('[FormFollowUps] Datos iniciales:', initialData);
        setFormData(initialData);
    }, [searchResults, idEjecutivo]);

    // Manejar cambios en los campos
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        console.log(`[FormFollowUps] Cambio en campo ${name}:`, newValue);

        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));
    };

    // Validar formulario
    const validateForm = () => {
        console.log('[FormFollowUps] Validando formulario...');

        if (!formData.idAcercamiento) {
            setError('Seleccione un tipo de acercamiento');
            return false;
        }

        if (!formData.numeroTelefonico) {
            setError('Ingrese un número telefónico');
            return false;
        }

        if (!formData.idMotivoS) {
            setError('Seleccione una situación');
            return false;
        }

        if (!formData.idEjecutivo) {
            console.error('[FormFollowUps] Error: idEjecutivo no está definido');
            setError('Error interno: No se identificó al ejecutivo');
            return false;
        }

        setError(null);
        return true;
    };

    // Manejar envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('[FormFollowUps] Iniciando envío del formulario');

        if (!validateForm()) {
            console.log('[FormFollowUps] Validación fallida');
            return;
        }

        setLoading(true);
        setSuccess(false);
        console.log('[FormFollowUps] Enviando datos:', formData);

        try {
            const response = await createFollows(formData);
            console.log('[FormFollowUps] Respuesta del servidor:', response);

            setSuccess(true);
            if (onSubmitSuccess) onSubmitSuccess();

            // Resetear el formulario después de 2 segundos
            setTimeout(() => {
                console.log('[FormFollowUps] Reseteando formulario');
                setSuccess(false);
                setFormData(prev => ({
                    ...prev,
                    idAcercamiento: "",
                    numeroTelefonico: "",
                    idMotivoS: "",
                    datoContacto: "",
                    segundo: ""
                }));
            }, 2000);

        } catch (err) {
            console.error('[FormFollowUps] Error al crear seguimiento:', err);
            setError(err.message || 'Error al guardar el seguimiento');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            {error && (
                <Alert variant="danger" onClose={() => setError(null)} dismissible>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert variant="success" onClose={() => setSuccess(false)} dismissible>
                    Seguimiento guardado exitosamente!
                </Alert>
            )}

            <Form.Group className="mb-3">
                <Form.Label>Acercamiento</Form.Label>
                <Form.Control
                    as="select"
                    name="idAcercamiento"
                    value={formData.idAcercamiento}
                    onChange={handleChange}
                    required
                >
                    <option value="">Seleccionar</option>
                    <option value="1">Llamada telefónica</option>
                    <option value="2">Correo electrónico</option>
                    <option value="3">Visita presencial</option>
                </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                    type="text"
                    name="numeroTelefonico"
                    value={formData.numeroTelefonico}
                    onChange={handleChange}
                    placeholder="xxx-xxx-xxxx"
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Fecha</Form.Label>
                <Form.Control
                    type="date"
                    name="fecha"
                    value={formData.fecha.split('T')[0]}
                    onChange={handleChange}
                    required
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Hora</Form.Label>
                <Form.Control
                    type="time"
                    name="segundo"
                    value={formData.segundo}
                    onChange={handleChange}
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
                <Form.Label>Situación</Form.Label>
                <Form.Control
                    as="select"
                    name="idMotivoS"
                    value={formData.idMotivoS}
                    onChange={handleChange}
                    required
                >
                    <option value="">Seleccionar</option>
                    <option value="1">Se corta llamada</option>
                    <option value="2">Otra situación</option>
                </Form.Control>
            </Form.Group>

            <div className="d-flex justify-content-between">
                <Button variant="secondary" onClick={handleClose} disabled={loading}>
                    Cancelar
                </Button>
                <Button variant="primary" type="submit" disabled={loading}>
                    {loading ? 'Guardando...' : 'Guardar'}
                </Button>
            </div>
        </Form>
    );
};

export default FormFollowUps;