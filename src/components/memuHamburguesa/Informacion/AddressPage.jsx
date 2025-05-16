import React from "react";
import { Row, Col, Button } from "react-bootstrap";

const AddressPage = ({
  onlyPagination = false,
  setCurrentIndex,
  currentIndex = 0,
  totalItems = 0,
  handlePreviousItem,
  handleNextItem,
  onClearForm
}) => {
  // Lógica de paginación (idéntica a la de FormularioDom)
  const handleAnterior = () => {
    if (typeof setCurrentIndex === "function") {
      setCurrentIndex(currentIndex === 0 ? totalItems - 1 : currentIndex - 1);
    } else if (typeof handlePreviousItem === "function") {
      if (currentIndex === 0) {
        handlePreviousItem(-(totalItems - 1));
      } else {
        handlePreviousItem();
      }
    }
  };

  const handleSiguiente = () => {
    if (typeof setCurrentIndex === "function") {
      setCurrentIndex(currentIndex === totalItems - 1 ? 0 : currentIndex + 1);
    } else if (typeof handleNextItem === "function") {
      if (currentIndex === totalItems - 1) {
        handleNextItem(-(totalItems - 1));
      } else {
        handleNextItem();
      }
    }
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
                onClick={handleAnterior}
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
                onClick={handleSiguiente}
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
          {onClearForm && (
            <Button
              variant="primary"
              className="mt-3"
              onClick={onClearForm}
            >
              Limpiar Formulario
            </Button>
          )}
        </Col>
      </Row>
    );
  }

  // ...puedes dejar aquí la versión "normal" si la usas en otro contexto...
  return (
    <Row className="align-items-center mb-2">
      <Col className="d-flex flex-column align-items-center justify-content-center">
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
              onClick={handleAnterior}
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
              onClick={handleSiguiente}
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
        {onClearForm && (
          <Button
            variant="primary"
            className="mt-3"
            onClick={onClearForm}
          >
            Limpiar Formulario
          </Button>
        )}
      </Col>
    </Row>
  );
};

export default AddressPage;