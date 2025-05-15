import React from "react";
import PropTypes from "prop-types";
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
  onSearchPostalCode,
  handlePostalCodeChange,
  idInformacion,
  setIdInformacion,
  isEstadoVisible,
  isIdentifyButtonDisabled,
  handleSubmitAddressInformation,
}) => {
  const handlePostalCodeInputChange = (e) => {
    const inputValue = e.target.value;
    setFormData({ ...formData, codigoPostal: inputValue });
    if (/^\d{5}$/.test(inputValue)) {
      onSearchPostalCode(inputValue);
    }
  };

  return (
    <>
      <Row className="mb-3 w-100">
        <Col className="d-flex justify-content-center align-items-center">
          <Button
            variant="primary"
            onClick={handlePreviousItem}
            disabled={currentIndex === 0 || isFormDisabled}
          >
            Anterior
          </Button>
          <span className="mx-3">
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
      <Form>
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>idCódigoPostal</Form.Label>
              <Form.Control
                type="text"
                value={formData?.idCódigoPostal || ""} // Validación para evitar errores
                 // Este campo es solo de lectura
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>C.Postal</Form.Label>
              <Form.Control
                type="text"
                value={formData?.codigoPostal || ""}
                maxLength={5}
                onChange={(e) => {
                  const inputValue = e.target.value;
                  setFormData({ ...formData, codigoPostal: inputValue });
                  if (/^\d{5}$/.test(inputValue)) {
                    onSearchPostalCode(inputValue); // Actualizar la tabla Postal con el nuevo valor
                  }
                }}
                onBlur={(e) => {
                  const inputValue = e.target.value;
                  if (/^\d{5}$/.test(inputValue)) {
                    onSearchPostalCode(inputValue); // Llamar al endpoint al perder el foco
                  }
                }}
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
                value={formData?.numExt}
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
                value={formData?.numInt}
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
                value={formData?.calle}
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
                value={formData?.colonia}
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
                value={formData?.estado}
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
                value={formData?.municipio}
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
              <Form.Control type="text" value={formData?.origen} disabled />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Fecha</Form.Label>
              <Form.Control type="text" value={formData?.fecha || ""} disabled />
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
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Información Actual</Form.Label>
              <Form.Control
                type="text"
                value={
                  idInformacion === "1904"
                    ? "Errónea"
                    : idInformacion === "1902"
                    ? "Incompleta"
                    : idInformacion === "1903"
                    ? "No corresponde"
                    : idInformacion === "1905"
                    ? "Inexistente"
                    : idInformacion === "1906"
                    ? "Correcta"
                    : idInformacion || "Sin información"
                }
                disabled
                placeholder="Sin información"
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mt-4">
          <Col className="d-flex justify-content-start">
            <Button
              variant="success"
              onClick={handleSubmitAddressInformation}
              disabled={isIdentifyButtonDisabled}
            >
              Identificar
            </Button>
          </Col>
          <Col className="d-flex justify-content-center">
            <Form.Group controlId="idInformacion">
              <Form.Select
                value={idInformacion}
                onChange={(e) => setIdInformacion(e.target.value)}
                disabled={!isEstadoVisible}
              >
                <option value="">Seleccione una Información</option>
                <option value="1904">Errónea</option>
                <option value="1902">Incompleta</option>
                <option value="1903">No corresponde</option>
                <option value="1905">Inexistente</option>
                <option value="1906">Correcta</option>
              </Form.Select>
            </Form.Group>
          </Col>
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
    </>
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
  handlePostalCodeChange: PropTypes.func.isRequired,
  idInformacion: PropTypes.string.isRequired,
  setIdInformacion: PropTypes.func.isRequired,
  isEstadoVisible: PropTypes.bool.isRequired,
  isIdentifyButtonDisabled: PropTypes.bool.isRequired,
  handleSubmitAddressInformation: PropTypes.func.isRequired,
};

export default FormularioDom;
