import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Form, Row, Col, Button } from "react-bootstrap";

const INFORMACION_MAP = {
  "1904": "Errónea",
  "1902": "Incompleta",
  "1903": "No corresponde",
  "1905": "Inexistente",
  "1906": "Correcta",
  "": "Sin información",
  null: "Sin información",
  undefined: "Sin información",
  "Sin verificar": "Sin verificar",
  "Sin información": "Sin información"
};

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
  idInformacion,
  setIdInformacion,
  isEstadoVisible,
  handleSubmitAddressInformation,
  onlyPagination = false,
  setCurrentIndex
}) => {
  const isNuevoRegistro = currentIndex === 0;

  const infoItem = formData?.informacion || "";
  const isSinInformacion =
    infoItem === "" || infoItem === "Sin información" || infoItem === "Sin verificar";

  const [localIdentifyDisabled, setLocalIdentifyDisabled] = React.useState(true);
  const [localSelectDisabled, setLocalSelectDisabled] = React.useState(false);

  useEffect(() => {
    if (isNuevoRegistro) {
      setLocalIdentifyDisabled(true);
      setLocalSelectDisabled(true);
    } else {
      if (isSinInformacion) {
        setLocalIdentifyDisabled(false);
        setLocalSelectDisabled(false);
      } else {
        setLocalIdentifyDisabled(true);
        setLocalSelectDisabled(true);
      }
    }
  }, [isNuevoRegistro, isSinInformacion]);

  const handleIdentifyClick = async () => {
    await handleSubmitAddressInformation();
    setLocalIdentifyDisabled(true);
    setLocalSelectDisabled(true);
  };

  const getInformacionString = () => {
    const infoValue = formData?.informacion;
    if (typeof infoValue === "string" && INFORMACION_MAP[infoValue]) {
      return INFORMACION_MAP[infoValue];
    }
    if (typeof infoValue === "number" && INFORMACION_MAP[String(infoValue)]) {
      return INFORMACION_MAP[String(infoValue)];
    }
    if (
      [
        "Errónea",
        "Incompleta",
        "No corresponde",
        "Inexistente",
        "Correcta",
        "Sin verificar",
        "Sin información"
      ].includes(infoValue)
    ) {
      return infoValue;
    }
    return infoValue || "Sin información";
  };

  const handleTextInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value
        .replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s]/g, "") // Permite letras, números y espacios
        .replace(/(.)\1{3,}/g, "$1$1$1") // Evita repeticiones excesivas
        .slice(0, 120) // Limita la longitud
    });
  };

  if (onlyPagination) {
    return (
      <Row className="mb-3 w-100">
        <Col>
          <div className="d-flex flex-column align-items-center justify-content-center" style={{ width: "100%" }}>
            <div className="d-flex justify-content-center align-items-center mb-2" style={{ width: "100%" }}>
              <Button
                variant="dark"
                size="sm"
                className="me-3"
                style={{
                  minWidth: 110,
                  fontWeight: "bold",
                  borderRadius: "8px",
                  letterSpacing: "1px",
                }}
                onClick={() => {
                  if (typeof setCurrentIndex === "function") {
                    setCurrentIndex(currentIndex === 0 ? totalItems - 1 : currentIndex - 1);
                  } else {
                    if (currentIndex === 0) {
                      handlePreviousItem(-(totalItems - 1));
                    } else {
                      handlePreviousItem();
                    }
                  }
                }}
                disabled={totalItems === 0}
              >
                ⟵ Anterior
              </Button>
              <Button
                variant="dark"
                size="sm"
                style={{
                  minWidth: 110,
                  fontWeight: "bold",
                  borderRadius: "8px",
                  letterSpacing: "1px",
                }}
                onClick={() => {
                  if (typeof setCurrentIndex === "function") {
                    setCurrentIndex(currentIndex === totalItems - 1 ? 0 : currentIndex + 1);
                  } else {
                    if (currentIndex === totalItems - 1) {
                      handleNextItem(-(totalItems - 1));
                    } else {
                      handleNextItem();
                    }
                  }
                }}
                disabled={totalItems === 0}
              >
                Siguiente ⟶
              </Button>
            </div>
            <div style={{ fontSize: "0.95rem", color: "#888", textAlign: "center" }}>
              {totalItems === 0
                ? "Sin registros"
                : `Registro ${totalItems === 0 ? 0 : currentIndex + 1} de ${totalItems}`}
            </div>
          </div>
        </Col>
      </Row>
    );
  }

  return (
    <>
      <Row>
        {/* Campo oculto idCódigoPostal */}
        <Col style={{ display: "none" }}>
          <Form.Group>
            <Form.Label>idCódigoPostal</Form.Label>
            <Form.Control
              type="text"
              value={formData?.idCódigoPostal || ""}
              disabled={true}
              readOnly
              tabIndex={-1}
              autoComplete="off"
            />
          </Form.Group>
        </Col>
        
        {/* C.Postal, Nú. Exterior y Nú. Interior */}
        <Col>
          <Form.Group>
            <Form.Label>C.Postal</Form.Label>
            <Form.Control
              type="text"
              value={formData?.codigoPostal || ""}
              maxLength={5}
              onChange={(e) => {
                const inputValue = e.target.value.replace(/\D/g, ''); // Solo números
                setFormData({ ...formData, codigoPostal: inputValue });
                if (/^\d{5}$/.test(inputValue)) {
                  onSearchPostalCode(inputValue);
                }
              }}
              onBlur={(e) => {
                const inputValue = e.target.value;
                if (/^\d{5}$/.test(inputValue)) {
                  onSearchPostalCode(inputValue);
                }
              }}
              placeholder="Ingrese Código Postal"
              disabled={!isNuevoRegistro}
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
                setFormData({ ...formData, numExt: e.target.value.replace(/[^a-zA-Z0-9\s]/g, '') })
              }
              disabled={!isNuevoRegistro}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group>
            <Form.Label>Nú. Interior</Form.Label>
            <Form.Control
              maxLength={8}
              type="text"
              value={formData?.numInt}
              onChange={(e) =>
                setFormData({ ...formData, numInt: e.target.value.replace(/[^a-zA-Z0-9\s]/g, '') })
              }
              disabled={!isNuevoRegistro}
            />
          </Form.Group>
        </Col>
      </Row>
      
      <Form>
        {/* Campo Calle */}
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Calle</Form.Label>
              <Form.Control
                type="text"
                value={formData?.calle}
                onChange={(e) => handleTextInputChange('calle', e.target.value)}
                disabled={!isNuevoRegistro}
                onKeyDown={(e) => {
                  if (e.key === ' ') {
                    e.stopPropagation(); // Permite espacios
                  }
                }}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Campos Colonia/Localidad y Estado */}
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Colonia / Localidad</Form.Label>
              <Form.Control
                type="text"
                value={formData?.colonia}
                onChange={(e) => handleTextInputChange('colonia', e.target.value)}
                disabled={!isNuevoRegistro}
                onKeyDown={(e) => {
                  if (e.key === ' ') {
                    e.stopPropagation();
                  }
                }}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Estado</Form.Label>
              <Form.Control
                type="text"
                value={formData?.estado}
                onChange={(e) => handleTextInputChange('estado', e.target.value)}
                disabled={!isNuevoRegistro}
                onKeyDown={(e) => {
                  if (e.key === ' ') {
                    e.stopPropagation();
                  }
                }}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Campo Delegación/Municipio */}
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Delegación / Municipio</Form.Label>
              <Form.Control
                type="text"
                value={formData?.municipio}
                onChange={(e) => handleTextInputChange('municipio', e.target.value)}
                disabled={!isNuevoRegistro}
                onKeyDown={(e) => {
                  if (e.key === ' ') {
                    e.stopPropagation();
                  }
                }}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Origen, Fecha y Clase */}
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
                disabled={isFormDisabled || (clase && clase !== "" && clase !== "Sin verificar")}
              >
                {clase && !["1505", "1509", "1508", "1501", "1506", "1519"].includes(clase) && (
                  <option value={clase}>{clase}</option>
                )}
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

        {/* Información Actual */}
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Información Actual</Form.Label>
              <Form.Control
                type="text"
                value={getInformacionString()}
                disabled
                placeholder="Sin información"
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Botones de acción */}
        <Row className="mt-4">
          <Col className="d-flex justify-content-start">
            <Button
              variant="success"
              onClick={handleIdentifyClick}
              disabled={localIdentifyDisabled}
            >
              Identificar Información
            </Button>
          </Col>
          <Col className="d-flex justify-content-center">
            <Form.Group controlId="idInformacion">
              <Form.Select
                value={idInformacion}
                disabled={localSelectDisabled || !isEstadoVisible}
                onChange={e => setIdInformacion(e.target.value)}
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
              disabled={isFormDisabled || !isNuevoRegistro}
            >
              Registrar Domicilio
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
  idInformacion: PropTypes.string.isRequired,
  setIdInformacion: PropTypes.func.isRequired,
  isEstadoVisible: PropTypes.bool.isRequired,
  handleSubmitAddressInformation: PropTypes.func.isRequired,
  onlyPagination: PropTypes.bool,
  setCurrentIndex: PropTypes.func,
};

export default FormularioDom;