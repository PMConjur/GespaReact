import React from "react";
import PropTypes from "prop-types"; // Importar PropTypes
import { Form, Row, Col, Button } from "react-bootstrap";

const FormularioDom = ({
    formData,
    setFormData,
    handleSaveNewAddress,
    isFormDisabled,
    clase,
    setClase,
    handlePreviousItem,
    handleNextItem,
    currentIndex,
    totalItems,
    onSearchPostalCode, // Nueva prop para la función de búsqueda
}) => {
    const handlePostalCodeInputChange = (e) => {
        const inputValue = e.target.value;
        console.log("Código Postal ingresado:", inputValue);
        setFormData({ ...formData, codigoPostal: inputValue }); // Actualizamos el códigoPostal visible
        if (/^\d{5}$/.test(inputValue)) {
            console.log("Código Postal válido, iniciando búsqueda...");
            onSearchPostalCode(inputValue); // Llamamos a la búsqueda cuando se ingresan 5 dígitos
        }
    };

    return (
        <Form>
            <Row className="mb-3">
                <Col className="d-flex justify-content-between align-items-center">
                    <Button
                        variant="primary"
                        onClick={handlePreviousItem}
                        disabled={currentIndex === 0 || isFormDisabled}
                    >
                        Anterior
                    </Button>
                    <span>
                        {currentIndex + 1} / {totalItems}
                    </span>
                    <Button
                        variant="primary"
                        onClick={handleNextItem}
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
                            value={formData.idCódigoPostal || ""}
                            disabled // Este valor ahora se llena al seleccionar de la tabla
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group>
                        <Form.Label>C.Postal </Form.Label>
                        <Form.Control
                            type="text"
                            value={formData.códigoPostal || ""} // Usamos el estado codigoPostal para el input
                            maxLength={5}
                            onChange={handlePostalCodeInputChange} // Usamos el nuevo handler
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
                                console.log("Estado ingresado:", inputValue);
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
    handleSaveNewAddress: PropTypes.func.isRequired,
    isFormDisabled: PropTypes.bool.isRequired,
    clase: PropTypes.string.isRequired,
    setClase: PropTypes.func.isRequired,
    handlePreviousItem: PropTypes.func.isRequired,
    handleNextItem: PropTypes.func.isRequired,
    currentIndex: PropTypes.number.isRequired,
    totalItems: PropTypes.number.isRequired,
    onSearchPostalCode: PropTypes.func.isRequired,
};

export default FormularioDom;
