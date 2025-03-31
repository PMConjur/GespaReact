import { useContext, useState, useEffect } from "react";
import { AppContext } from "../pages/Managment"; // Importa el contexto
import { Card, Row, Col, Placeholder } from "react-bootstrap";
import {
  CreditCard,
  Person,
  FileText,
  CalendarCheck,
  Clipboard
} from "react-bootstrap-icons";
import CorazonRojo from "../assets/img/CRojo.jpg";
import CorazonVerde from "../assets/img/CVerde.jpg";
import CorazonBlanco from "../assets/img/CBlanco.jpg";

const SearchCustomer = () => {
  // Consume el contexto
  const { searchResults } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true); // Estado para manejar la carga

  const renderSituacion = (situacion) => {
    let iconoCorazon;
    let colorTexto;
    let gradientText;

    // Asignar la URL de la imagen y el color del texto según la situación
    switch (situacion) {
      case "En Proceso":
      case "Seguimiento":
      case "Precaución":
        iconoCorazon = CorazonRojo; // Corazón rojo
        colorTexto = "#4285F6"; // Texto rojo
        gradientText = "header-red";
        break;
      case "Negociación titular":
      case "Sondeo":
      case "Pagada":
      case "Reporte de pago":
        iconoCorazon = CorazonVerde; // Corazón verde
        colorTexto = "#39fc8d"; // Texto verde
        gradientText = "header-green";
        break;
      case "Accionamiento":
      case "Nueva":
      case "Recado":
      case "Búsqueda Datos":
      case "Localización":
      default:
        iconoCorazon = CorazonBlanco; // Corazón blanco
        colorTexto = "#f8f9fa"; // Texto blanco
        gradientText = "header-white";
        break;
    }

    return (
      <Card.Body>
        <div className="d-flex align-items-center">
          <div className="card-icon-situation rounded-circle-situation d-flex align-items-center justify-content-center">
            <img
              src={iconoCorazon} // Renderizar la imagen como <img>
              alt="Situación"
              style={{
                width: "90px",
                height: "75px",
                marginTop: "3px"
              }}
            />
          </div>
          <div className="ps-3 monochromatic-gradient-text">
            <h6
              style={{ fontSize: "1.8rem", color: colorTexto }}
              className={gradientText}
            >
              {situacion || "N/A"} {/* Mostrar "N/A" si no hay situación */}
            </h6>
            <h5 className=" pt-1">Situación</h5>
          </div>
        </div>
      </Card.Body>
    );
  };

  // Datos por defecto en caso de que no haya resultados de búsqueda
  const defaultData = {
    producto: "--",
    idCuenta: "--",
    fechaActivacion: "--",
    expediente: "--",
    numeroCliente: "--",
    rfc: "--",
    situacion: "--"
  };

  // Obtener el primer resultado de búsqueda o usar los datos por defecto
  const result = searchResults[0] || defaultData;

  useEffect(() => {
    setIsLoading(true); // Reinicia el estado a "cargando"

    // Simula un tiempo de carga
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // Tiempo de carga simulado

    return () => clearTimeout(timer);
  }, [searchResults]); // Se ejecuta cada vez que searchResults cambia

  return (
    <Row>
      <Col>
        <Card className="mb-3 custom-card">
          <Card.Body>
            {isLoading ? (
              // Mostrar placeholders mientras se cargan los datos
              <Row style={{ color: "white" }}>
                {[...Array(6)].map((_, i) => (
                  <Col key={i} md={6}>
                    <Placeholder as="p" animation="glow">
                      <Placeholder xs={2} />
                    </Placeholder>
                  </Col>
                ))}
              </Row>
            ) : (
              // Mostrar los datos del cliente una vez cargados
              <Row style={{ color: "white" }}>
                {[
                  {
                    icon: <CreditCard />,
                    label: "Producto",
                    value: "Amex"
                  },
                  {
                    icon: <Clipboard />,
                    label: "Cuenta",
                    value: result.idCuenta || "--"
                  },
                  {
                    icon: <CalendarCheck />,
                    label: "Activada",
                    value: result.fechaActivacion || "--"
                  },
                  {
                    icon: <FileText />,
                    label: "Expediente",
                    value: `AMX${result.expediente}` || "--"
                  },
                  {
                    icon: <Person />,
                    label: "No. Cliente",
                    value: result.numeroCliente || "--"
                  },
                  {
                    icon: <FileText />,
                    label: "RFC",
                    value: result.rfc || "--"
                  }
                ].map(({ icon, label, value }, i) => (
                  <Col key={i} md={6}>
                    <p>
                      {icon} <strong>{label}:</strong> {value}
                    </p>
                  </Col>
                ))}
              </Row>
            )}
          </Card.Body>
        </Card>
      </Col>
      <Col xxl={4} xl={6} md={6} className="dashboard">
        <Card className="situation-card text-light">
          {renderSituacion(result.situacion)}
        </Card>
      </Col>
    </Row>
  );
};

export default SearchCustomer;
