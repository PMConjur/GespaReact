import React, { useEffect } from "react";
import PropTypes from "prop-types"; // Importar PropTypes
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
    fetchPostalCodesById,
    fetchDomiciliosVisitas,
    postalData, // Nueva prop para datos de códigos postales
}) => {
    // Función para comparar y relacionar los datos de códigos postales con formData
    const compararCodigosPostales = () => {
        const match = postalData.find(
            (postal) => postal.idCódigoPostal === formData.idCódigoPostal
        );

        if (match) {
            console.log("Match encontrado:", match);
            console.log("Valores sustituidos:", {
                códigoPostal: match.códigoPostal,
                municipio: match.municipio,
                estado: match.estado,
            });
        } else {
            console.log("No se encontró un match para idCódigoPostal:", formData.idCódigoPostal);
        }

        setFormData({
            ...formData,
            códigoPostal: match ? match.códigoPostal : "--",
            municipio: match ? match.municipio : "--",
            estado: match ? match.estado : "--",
        });
    };

    useEffect(() => {
        if (formData.idCódigoPostal) {
            compararCodigosPostales();
        }
    }, [formData.idCódigoPostal, postalData]);

    const handlePostalCodeInput = (e) => {
        const inputValue = e.target.value;
        if (/^\d{0,5}$/.test(inputValue)) {
            setFormData({ ...formData, idCódigoPostal: inputValue });
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
                            value={formData.codigoPostal || ""}
                            disabled
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group>
                        <Form.Label>C.Postal </Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.idCódigoPostal || ""}
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

FormularioDom.propTypes = {
    formData: PropTypes.object.isRequired,
    setFormData: PropTypes.func.isRequired,
    handlePostalCodeChange: PropTypes.func,
    handleSaveNewAddress: PropTypes.func.isRequired,
    isFormDisabled: PropTypes.bool.isRequired,
    clase: PropTypes.string.isRequired,
    setClase: PropTypes.func.isRequired,
    loadPostalCodesByText: PropTypes.func.isRequired,
    handlePreviousItem: PropTypes.func.isRequired,
    handleNextItem: PropTypes.func.isRequired,
    currentIndex: PropTypes.number.isRequired,
    totalItems: PropTypes.number.isRequired,
    fetchPostalCodesById: PropTypes.func.isRequired,
    fetchDomiciliosVisitas: PropTypes.func.isRequired,
    postalData: PropTypes.arrayOf(
        PropTypes.shape({
            idCódigoPostal: PropTypes.string.isRequired,
            códigoPostal: PropTypes.string,
            municipio: PropTypes.string,
            estado: PropTypes.string,
        })
    ).isRequired,
};

export default FormularioDom;
