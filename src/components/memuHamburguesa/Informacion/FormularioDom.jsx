import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Form, Row, Col, Button } from "react-bootstrap";

const INFORMACION_MAP = {
  1904: "Errónea",
  1902: "Incompleta",
  1903: "No corresponde",
  1905: "Inexistente",
  1906: "Correcta",
  "": "Sin información",
  null: "Sin información",
  undefined: "Sin información",
  "Sin verificar": "Sin verificar",
  "Sin información": "Sin información"
};

// Función para formatear la fecha a "AAAA/MM/DD"
const formatFecha = (fecha) => {
  if (!fecha) return "--";
  const d = new Date(fecha);
  if (isNaN(d.getTime())) return "--";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
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
  setCurrentIndex,
  focusAnimCodigoPostal,
  setFocusAnimCodigoPostal
}) => {
  const isNuevoRegistro = currentIndex === 0;

  const infoItem = formData?.informacion || "";
  const isSinInformacion =
    infoItem === "" ||
    infoItem === "Sin información" ||
    infoItem === "Sin verificar";

  const [localIdentifyDisabled, setLocalIdentifyDisabled] =
    React.useState(true);
  const [localSelectDisabled, setLocalSelectDisabled] = React.useState(false);

  // Focus animado para el campo Código Postal
  const [focusAnim, setFocusAnimState] = useState(true);
  const postalInputRef = useRef(null);

  // Sincroniza el focusAnim con el prop externo si está presente
  useEffect(() => {
    if (typeof focusAnimCodigoPostal === "boolean") {
      setFocusAnimState(focusAnimCodigoPostal);
    }
  }, [focusAnimCodigoPostal]);

  // Permite que el padre controle la animación
  const setFocusAnim = (val) => {
    setFocusAnimState(val);
    if (typeof setFocusAnimCodigoPostal === "function") {
      setFocusAnimCodigoPostal(val);
    }
  };

  const [identifyBlink, setIdentifyBlink] = useState(false);
  const [focusError, setFocusError] = useState({}); // Para animación de error por campo52436

  useEffect(() => {
    if (postalInputRef.current) {
      postalInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (/^\d{5}$/.test(formData?.codigoPostal || "")) {
      setFocusAnim(false);
    }
  }, [formData?.codigoPostal]);

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

  // Quitar animación al cambiar de item con paginador
  useEffect(() => {
    setIdentifyBlink(false);
  }, [currentIndex]);

  const handleSelectInformacion = (e) => {
    const value = e.target.value;
    setIdInformacion(value);
    if (value && value !== "" && value !== "Selecciona") {
      setIdentifyBlink(true);
    } else {
      setIdentifyBlink(false);
    }
  };

  const handleIdentifyClick = async () => {
    await handleSubmitAddressInformation();
    setLocalIdentifyDisabled(true);
    setLocalSelectDisabled(true);
    setIdentifyBlink(false); // Detener animación al terminar
  };

  const handleSaveNewAddressWithError = () => {
    // Validar campos requeridos
    const requiredFields = [
      { key: "calle", label: "calle" },
      { key: "numExt", label: "numExt" },
      { key: "codigoPostal", label: "codigoPostal" },
      { key: "colonia", label: "colonia" },
      { key: "municipio", label: "municipio" },
      { key: "estado", label: "estado" },
      { key: "clase", label: "clase" } // <-- Añade clase aquí
    ];
    let missing = {};
    let hasError = false;
    requiredFields.forEach((f) => {
      if (f.key === "clase") {
        if (!clase) {
          missing.clase = true;
          hasError = true;
        }
      } else if (!formData[f.key]) {
        missing[f.key] = true;
        hasError = true;
      }
    });
    setFocusError(missing);
    if (hasError) {
      setTimeout(() => setFocusError({}), 1200);
      return;
    }
    handleSaveNewAddress();
  };

  // El botón solo se habilita si hay selección válida
  const isIdentifyButtonEnabled =
    idInformacion && idInformacion !== "" && idInformacion !== "Selecciona";

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
          <style>
            {`
              .btn-nav-simple {
                border-radius: 18px !important;
                font-size: 1.13em !important;
                letter-spacing: 1.5px;
                font-weight: bold;
                padding-left: 22px !important;
                padding-right: 22px !important;
                margin-bottom: 2px;
                background: #222 !important;
                color: #fff !important;
                border: 3px solid;
                border-image: linear-gradient(90deg, #6dd6ff, #07fb70) 1;
                box-shadow: 0 0 8px #6dd6ff33, 0 0 8px #07fb7033;
                transition: box-shadow 0.2s, border-image 0.2s;
              }
              .btn-nav-simple:focus, .btn-nav-simple:hover {
                border-image: linear-gradient(90deg, #6dd6ff, #07fb70) 1;
                box-shadow: 0 0 16px #6dd6ff99, 0 0 16px #07fb7099;
                outline: none;
              }
              .btn-nav-label {
                font-size: 0.92em;
                font-weight: bold;
                color: #fff;
                margin-top: 2px;
                letter-spacing: 1px;
                text-align: center;
                display: block;
                user-select: none;
              }
            `}
          </style>
          <div
            className="d-flex flex-column align-items-center justify-content-center"
            style={{ width: "100%" }}
          >
            <div
              className="d-flex justify-content-center align-items-center mb-2"
              style={{ width: "100%" }}
            >
              <Button
                variant="dark"
                size="sm"
                className="me-3 btn-nav-simple rounded-pill"
                onClick={() => {
                  if (typeof setCurrentIndex === "function") {
                    setCurrentIndex(
                      currentIndex === 0 ? totalItems - 1 : currentIndex - 1
                    );
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
                className="btn-nav-simple rounded-circle"
                onClick={() => {
                  if (typeof setCurrentIndex === "function") {
                    setCurrentIndex(
                      currentIndex === totalItems - 1 ? 0 : currentIndex + 1
                    );
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
            <div
              style={{
                fontSize: "0.95rem",
                color: "#fff200",
                textAlign: "center",
                fontWeight: "bold"
              }}
            >
              {totalItems === 0
                ? "Sin registros"
                : `Registro ${
                    totalItems === 0 ? 0 : currentIndex + 1
                  } de ${totalItems}`}
            </div>
          </div>
        </Col>
      </Row>
    );
  }

  return (
    <>
      <style>
        {`
          .focus-anim-label {
            color: rgba(248, 244, 6, 0.9) !important;
            font-weight: bold;
            transition: color 0.3s;
            animation: focusPulseLabel 0.7s steps(1, end) infinite alternate, focusFlashLabel 0.7s steps(1, end) infinite alternate;
          }
          .focus-anim-input {
            border: 2.5px solid rgba(248, 244, 6, 0.616) !important;
            box-shadow: 0 0 8px rgba(248, 244, 6, 0.616);
            animation: focusPulseInput 0.7s steps(1, end) infinite alternate, focusFlashInput 0.7s steps(1, end) infinite alternate;
            transition: border 0.3s, box-shadow 0.3s;
          }
          /* Animación de parpadeo (blink) igual que en Times.jsx */
          @keyframes blink {
            0% { opacity: 1; }
            50% { opacity: 0; }
            100% { opacity: 1; }
          }
          .blink {
            animation: blink 1s steps(1, end) infinite;
          }
          @keyframes focusPulseInput {
            from { box-shadow: 0 0 8px rgba(248, 244, 6, 0.616); }
            to { box-shadow: 0 0 16px rgba(248, 244, 6, 1); }
          }
          @keyframes focusPulseLabel {
            from { color: rgba(248, 244, 6, 0.9); }
            to { color: rgba(248, 244, 6, 1); }
          }
          @keyframes focusFlashInput {
            0% { border-color: rgba(248, 244, 6, 0.616); }
            50% { border-color: #fff200; }
            100% { border-color: rgba(248, 244, 6, 0.616); }
          }
          @keyframes focusFlashLabel {
            0% { color: rgba(248, 244, 6, 0.9); }
            50% { color: #fff200; }
            100% { color: rgba(248, 244, 6, 0.9); }
          }
          .formulario-dom-reduce-size input,
          .formulario-dom-reduce-size select,
          .formulario-dom-reduce-size .form-control,
          .formulario-dom-reduce-size .btn {
            height: 75% !important;
            min-height: 30px !important;
            font-size: 0.85em !important;
            padding-top: 0.25rem !important;
            padding-bottom: 0.25rem !important;
          }
          .formulario-dom-reduce-size .btn {
            padding-top: 0.25rem !important;
            padding-bottom: 0.25rem !important;
          }
          .formulario-dom-reduce-size input:disabled,
          .formulario-dom-reduce-size select:disabled,
          .formulario-dom-reduce-size .form-control:disabled {
            background-color: rgb(97.2, 105.3, 112.5) !important;
            color: #ffffff !important;
            border-color: rgb(97.2, 105.3, 112.5) !important;
            opacity: 1 !important;
          }
          .formulario-dom-reduce-size select:disabled {
            background-image: none !important;
          }
          .identify-blink {
            animation: blink-identify 2s steps(16, end) infinite;
          }
          @keyframes blink-identify {
            0% { opacity: 1; }
            50% { opacity: 0; }
            100% { opacity: 1; }
          }
          .focus-error-anim {
            animation: focusErrorAnim 0.7s steps(1, end) 2 alternate;
            border: 2.5px solid #ff2d2d !important;
            box-shadow: 0 0 8px #ff2d2d;
          }
          @keyframes focusErrorAnim {
            0% { border-color: #ff2d2d; box-shadow: 0 0 8px #ff2d2d; }
            50% { border-color: #fff; box-shadow: 0 0 0px #fff; }
            100% { border-color: #ff2d2d; box-shadow: 0 0 8px #ff2d2d; }
          }
        `}
      </style>
      <div className="formulario-dom-reduce-size">
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
        </Row>

        {/* Primer Row: Código Postal, Calle, Nú. Exterior, Nú. Interior */}
        <Row className="mb-3">
          <Col md={3}>
            <Form.Group>
              <Form.Label className={focusAnim ? "focus-anim-label blink" : ""}>
                Digite Código Postal
              </Form.Label>
              <Form.Control
                ref={postalInputRef}
                type="text"
                value={formData?.codigoPostal || ""}
                maxLength={5}
                className={
                  (focusAnim ? "focus-anim-input " : "") +
                  (focusError.codigoPostal ? "focus-error-anim" : "")
                }
                onChange={(e) => {
                  const inputValue = e.target.value.replace(/\D/g, ""); // Solo números
                  setFormData({ ...formData, codigoPostal: inputValue });
                  if (/^\d{5}$/.test(inputValue)) {
                    onSearchPostalCode(inputValue);
                    setFocusAnim(false);
                  } else {
                    setFocusAnim(true);
                  }
                }}
                onBlur={(e) => {
                  const inputValue = e.target.value;
                  if (/^\d{5}$/.test(inputValue)) {
                    onSearchPostalCode(inputValue);
                    setFocusAnim(false);
                  }
                }}
                placeholder="Ingrese Código Postal"
                disabled={!isNuevoRegistro || isFormDisabled}
              />
            </Form.Group>
          </Col>
          <Col md={5}>
            <Form.Group>
              <Form.Label>Calle</Form.Label>
              <Form.Control
                type="text"
                value={formData?.calle}
                className={focusError.calle ? "focus-error-anim" : ""}
                onChange={(e) => handleTextInputChange("calle", e.target.value)}
                disabled={!isNuevoRegistro || isFormDisabled}
                onKeyDown={(e) => {
                  if (e.key === " ") {
                    e.stopPropagation(); // Permite espacios
                  }
                }}
              />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group>
              <Form.Label>Nú. Exterior</Form.Label>
              <Form.Control
                maxLength={20}
                type="text"
                value={formData?.numExt}
                className={focusError.numExt ? "focus-error-anim" : ""}
                onChange={(e) =>
                  setFormData({ ...formData, numExt: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === " ") {
                    e.stopPropagation(); // Permite espacios
                  }
                }}
                disabled={!isNuevoRegistro || isFormDisabled}
              />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group>
              <Form.Label>Nú. Interior</Form.Label>
              <Form.Control
                maxLength={20}
                type="text"
                value={formData?.numInt}
                onChange={(e) =>
                  setFormData({ ...formData, numInt: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === " ") {
                    e.stopPropagation(); // Permite espacios
                  }
                }}
                disabled={!isNuevoRegistro || isFormDisabled}
              />
            </Form.Group>
          </Col>
        </Row>

        {/* Segundo Row: Colonia / Localidad, Delegación / Municipio, Estado y Clase */}
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Colonia / Localidad</Form.Label>
              <Form.Control
                type="text"
                value={formData?.colonia}
                className={focusError.colonia ? "focus-error-anim" : ""}
                onChange={(e) =>
                  handleTextInputChange("colonia", e.target.value)
                }
                disabled={!isNuevoRegistro || isFormDisabled}
                onKeyDown={(e) => {
                  if (e.key === " ") {
                    e.stopPropagation();
                  }
                }}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group>
              <Form.Label>Delegación / Municipio</Form.Label>
              <Form.Control
                type="text"
                value={formData?.municipio}
                className={focusError.municipio ? "focus-error-anim" : ""}
                onChange={(e) =>
                  handleTextInputChange("municipio", e.target.value)
                }
                disabled={!isNuevoRegistro || isFormDisabled}
                onKeyDown={(e) => {
                  if (e.key === " ") {
                    e.stopPropagation();
                  }
                }}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Estado</Form.Label>
              <Form.Control
                type="text"
                value={formData?.estado}
                className={focusError.estado ? "focus-error-anim" : ""}
                onChange={(e) =>
                  handleTextInputChange("estado", e.target.value)
                }
                disabled={!isNuevoRegistro || isFormDisabled}
                onKeyDown={(e) => {
                  if (e.key === " ") {
                    e.stopPropagation();
                  }
                }}
              />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group controlId="clase">
              <Form.Label>Clase</Form.Label>
              <Form.Select
                value={clase}
                onChange={(e) => setClase(e.target.value)}
                // Solo habilitado si es nuevo registro
                disabled={isFormDisabled || !isNuevoRegistro}
                className={focusError.clase ? "focus-error-anim" : ""}
              >
                {clase &&
                  !["1505", "1509", "1508", "1501", "1506", "1519"].includes(
                    clase
                  ) && <option value={clase}>{clase}</option>}
                <option value="">Selecciona</option>
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

        <Form>
          {/* Origen, Fecha SOLO si NO es nuevo registro */}
          {!isNuevoRegistro && (
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
                  <Form.Control
                    type="text"
                    value={
                      isNuevoRegistro
                        ? "--"
                        : formatFecha(formData?.fecha_Insert || formData?.Fecha)
                    }
                    disabled
                  />
                </Form.Group>
              </Col>
            </Row>
          )}

          {/* Información Actual, Identificar, Dropdown y Registrar SOLO si NO es nuevo registro */}
          {!isNuevoRegistro && (
            <Row className="mb-3 align-items-end justify-content-center">
              <Col
                md={10}
                className="d-flex justify-content-center align-items-end"
              >
                <div className="d-flex flex-row justify-content-center align-items-end w-100">
                  <div className="me-2 flex-fill">
                    <Form.Group>
                      <Form.Label>Información Actual</Form.Label>
                      <Form.Control
                        type="text"
                        value={getInformacionString()}
                        disabled
                        placeholder="Sin información"
                      />
                    </Form.Group>
                  </div>
                  <div className="me-2 flex-fill d-flex align-items-end">
                    <Button
                      variant="success"
                      onClick={handleIdentifyClick}
                      disabled={
                        !isIdentifyButtonEnabled ||
                        localIdentifyDisabled ||
                        isFormDisabled
                      }
                      className={`w-100${
                        identifyBlink ? " identify-blink" : ""
                      }`}
                    >
                      Identificar Información
                    </Button>
                  </div>
                  <div className="flex-fill">
                    <Form.Group controlId="idInformacion">
                      <Form.Label>Seleccione Informacio</Form.Label>
                      <Form.Select
                        value={idInformacion}
                        disabled={
                          localSelectDisabled ||
                          !isEstadoVisible ||
                          isFormDisabled
                        }
                        onChange={handleSelectInformacion}
                      >
                        <option value="">Selecciona</option>
                        <option value="1904">Errónea</option>
                        <option value="1902">Incompleta</option>
                        <option value="1903">No corresponde</option>
                        <option value="1905">Inexistente</option>
                        <option value="1906">Correcta</option>
                      </Form.Select>
                    </Form.Group>
                  </div>
                </div>
              </Col>
            </Row>
          )}

          {/* Botón Registrar Domicilio SOLO si es nuevo registro */}
          {isNuevoRegistro && (
            <Row className="mb-3">
              <Col className="d-flex justify-content-center">
                <Button
                  variant="primary"
                  size="sm"
                  style={{
                    minWidth: 110,
                    maxWidth: 180,
                    fontWeight: "bold",
                    borderRadius: "8px",
                    letterSpacing: "1px"
                  }}
                  onClick={handleSaveNewAddressWithError}
                  disabled={isFormDisabled || !isNuevoRegistro}
                  className="w-75"
                >
                  Registrar Domicilio
                </Button>
              </Col>
            </Row>
          )}
        </Form>
      </div>
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
  focusAnimCodigoPostal: PropTypes.bool,
  setFocusAnimCodigoPostal: PropTypes.func
};

export default FormularioDom;
