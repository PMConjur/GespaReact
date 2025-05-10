import React from "react";
import { Form, Row, Col, Button } from "react-bootstrap";

const FormularioDom = ({
    formData,
    setFormData,
    handlePostalCodeChange,
    handleSaveNewAddress,
    isFormDisabled,
    clase,
    setClase,
    loadPostalCodesByText,
    handlePreviousItem,
    handleNextItem,
    currentIndex,
    totalItems,
    fetchPostalCodesById, // Nueva función para obtener códigos postales
    fetchDomiciliosVisitas, // Nueva función para obtener domicilios visitas
}) => {
    const handlePostalCodeInput = (e) => {
        const inputValue = e.target.value;
        if (/^\d{0,5}$/.test(inputValue)) {
            setFormData({ ...formData, codigoPostal: inputValue });
            if (inputValue.length === 5) {
                loadPostalCodesByText(inputValue); // Realizar búsqueda en TablePostal
            }
        }
    };

    const handlePrevious = async () => {
        await handlePreviousItem();
        const postalResponse = await fetchPostalCodesById(formData.idCodigoPostal);
        console.log("Respuesta del endpoint de Código Postal (Anterior):", postalResponse);

        const domiciliosResponse = await fetchDomiciliosVisitas();
        console.log("Respuesta del endpoint de Domicilios Visitas (Anterior):", domiciliosResponse);
    };

    const handleNext = async () => {
        await handleNextItem();
        const postalResponse = await fetchPostalCodesById(formData.idCodigoPostal);
        console.log("Respuesta del endpoint de Código Postal (Siguiente):", postalResponse);

        const domiciliosResponse = await fetchDomiciliosVisitas();
        console.log("Respuesta del endpoint de Domicilios Visitas (Siguiente):", domiciliosResponse);
    };

    return (
        <Form>
            <Row className="mb-3">
                <Col className="d-flex justify-content-between align-items-center">
                    <Button
                        variant="primary"
                        onClick={handlePrevious}
                        disabled={currentIndex === 0 || isFormDisabled}
                    >
                        Anterior
                    </Button>
                    <span>
                        {currentIndex + 1} / {totalItems}
                    </span>
                    <Button
                        variant="primary"
                        onClick={handleNext}
                        disabled={currentIndex === totalItems - 1 || isFormDisabled}
                    >
                        Siguiente
                    </Button>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col>
                    <Form.Group>
                        <Form.Label>idCódigoPostal</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.idCodigoPostal || ""}
                            disabled
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group>
                        <Form.Label>C.Postal</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.codigoPostal || ""}
                            maxLength={5}
                            onChange={handlePostalCodeInput}
                            placeholder="Ingrese Código Postal"
                            disabled={isFormDisabled}
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group>
                        <Form.Label>Nú. Exterior</Form.Label>
                        <Form.Control
                            maxLength={8}
                            type="text"
                            value={formData.numExt}
                            onChange={(e) =>
                                setFormData({ ...formData, numExt: e.target.value })
                            }
                            disabled={isFormDisabled}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col>
                    <Form.Group>
                        <Form.Label>Nú. Interior</Form.Label>
                        <Form.Control
                            maxLength={8}
                            type="text"
                            value={formData.numInt}
                            onChange={(e) =>
                                setFormData({ ...formData, numInt: e.target.value })
                            }
                            disabled={isFormDisabled}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col>
                    <Form.Group>
                        <Form.Label>Calle</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.calle}
                            onChange={(e) =>
                                setFormData({ ...formData, calle: e.target.value })
                            }
                            disabled={isFormDisabled}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col>
                    <Form.Group>
                        <Form.Label>Colonia / Localidad</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.colonia}
                            onChange={(e) =>
                                setFormData({ ...formData, colonia: e.target.value })
                            }
                            disabled={isFormDisabled}
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group>
                        <Form.Label>Estado</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.estado}
                            onChange={(e) => {
                                const inputValue = e.target.value;
                                if (/^[a-zA-Z\s]*$/.test(inputValue)) {
                                    setFormData({ ...formData, estado: inputValue });
                                }
                            }}
                            disabled={isFormDisabled}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col>
                    <Form.Group>
                        <Form.Label>Delegación / Municipio</Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.municipio}
                            onChange={(e) =>
                                setFormData({ ...formData, municipio: e.target.value })
                            }
                            disabled={isFormDisabled}
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col>
                    <Form.Group>
                        <Form.Label>Origen</Form.Label>
                        <Form.Control type="text" value={formData.origen} disabled />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group>
                        <Form.Label>Fecha</Form.Label>
                        <Form.Control type="text" value={formData.fecha || ""} disabled />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="clase">
                        <Form.Label>Clase</Form.Label>
                        <Form.Select
                            value={clase}
                            onChange={(e) => setClase(e.target.value)}
                            disabled={isFormDisabled}
                        >
                            <option value="">Selecciona una Clase</option>
                            <option value="1505">Hogar</option>
                            <option value="1509">Tercero</option>
                            <option value="1508">Familiar</option>
                            <option value="1501">Empresa</option>
                            <option value="1506">Oficina</option>
                            <option value="1519">Baja</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>
            <Row className="mt-4">
                <Col className="d-flex justify-content-end">
                    <Button
                        variant="primary"
                        onClick={handleSaveNewAddress}
                        disabled={isFormDisabled}
                    >
                        Nuevo
                    </Button>
                </Col>
            </Row>
        </Form>
    );
};

export default FormularioDom;
