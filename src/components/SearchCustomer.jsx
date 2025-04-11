import { useContext, useState, useEffect } from "react";
import { AppContext } from "../pages/Managment";
import { Card, Row, Col, Placeholder } from "react-bootstrap";
import { CreditCard, Person, FileText, CalendarCheck, Clipboard } from "react-bootstrap-icons";
import { getRelaciones } from "../services/gespawebServices"; // Importa el servicio

const SearchCustomer = () => {
  const { searchResults } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);
  const [relaciones, setRelaciones] = useState([]); // Estado para almacenar los datos del endpoint

  // Mapeo de colores basado en Valor2
  // const colorMapping = {
  //   "Localización": { texto: "#FFFFFF", corazon: "#FFFFFF", gradiente: "header-white" },
  //   "Acuerdo": { texto: "#39fc8d", corazon: "#00FF00", gradiente: "header-green" },
  //   "Convencimiento": { texto: "#FFD700", corazon: "#FFA500", gradiente: "header-red" },
  //   "Definición": { texto: "#FF69B4", corazon: "#FF1493", gradiente: "header-pink" },
  // };

  useEffect(() => {
    const fetchRelaciones = async () => {
      try {
        const data = await getRelaciones();
        setRelaciones(data);
      } catch (error) {
        console.error("Error al obtener relaciones:", error);
      }
    };

    fetchRelaciones();
  }, []);

  const renderSituacion = (situacion) => {
    const relacion = relaciones.find((r) => r.Valor1 === situacion);
    let colores = { texto: "#f8f9fa", corazon: "#FFFFFF", gradiente: "header-white" };

    if (relacion) {
      const idValor2 = relacion.idValor2; // Usar idValor2 para la comparación

      // Asignar colores según idValor2
      switch (idValor2) {
        case 3101: // Localización
          colores = { texto: "#FFFFFF", corazon: "#FFFFFF", gradiente: "header-white" };
          break;
        case 3102: // Convencimiento
          colores = { texto: "#FF0000", corazon: "#FF0000", gradiente: "header-red" };
          break;
        case 3103: // Acuerdo
          colores = { texto: "#39fc8d", corazon: "#00FF00", gradiente: "header-green" };
          break;
        case 3104: // Definición
          colores = { texto: "#6c5ce7", corazon: "#6c5ce7", gradiente: "header-purple" };
          break;
        default:
          colores = { texto: "#f8f9fa", corazon: "#FFFFFF", gradiente: "header-white" };
          break;
      }
    }

    return (
      <Card.Body>
        <div className="d-flex align-items-center">
          <div
            className="card-icon-situation rounded-circle-situation d-flex align-items-center justify-content-center"
            style={{ color: colores.corazon }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 500 500"
              style={{
                width: "90px",
                height: "75px",
                marginTop: "3px"
              }}
            >
              <path
                fill="currentColor"
                d="M251.7,394.6c11.6-15.9,22.8-32.2,33.2-49,23.9-38.9,56.5-100.1,47-146.8-.2-1.2-1.8-8-2.5-8-6.8,5.4-17.5,8.6-26.1,9.8-27.2,3.8-54.5-11.3-52-41.5s31.5-54.3,58-61.9c50.5-14.4,96.2,11.3,107.5,62.5,19.8,89.8-43.5,161.1-113.2,206.4-16.5,10.7-33.9,20.5-51.9,28.2Z"
              />
              <path
                fill="currentColor"
                d="M170.3,190.9c-.7,2.3-1.3,4.6-1.8,6.9-9.5,43.3,18.2,99.4,39.7,136.2,12.2,20.9,26,40.9,40,60.6-16.7-7.2-32.9-16.2-48.2-25.9-72.7-46.3-139.1-120.2-115.6-213.4,17.1-67.8,100.6-81.7,146.3-33,18.2,19.4,28.1,50.2,4.2,69.7-17.8,14.5-46.5,11-64.7-1Z"
              />
            </svg>
          </div>
          <div className="ps-3 monochromatic-gradient-text">
            <h6
              style={{ fontSize: "1.8rem", color: colores.texto }}
              className={colores.gradiente}
            >
              {situacion || "N/A"}
            </h6>
            <h5 className=" pt-1">Situación</h5>
          </div>
        </div>
      </Card.Body>
    );
  };

  const defaultData = {
    producto: "--",
    idCuenta: "--",
    fechaActivacion: "--",
    expediente: "--",
    numeroCliente: "--",
    rfc: "--",
    situacion: "--"
  };

  const result = searchResults[0] || defaultData;

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchResults]);

  return (
    <Row>
      <Col>
        <Card className="mb-3 custom-card">
          <Card.Body>
            {isLoading ? (
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
                    value: `${"AMX" + result.expediente}` || "--"
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
                    <span>
                      <strong>
                        {icon} {label}:
                      </strong>{" "}
                      {value}
                    </span>
                  </Col>
                ))}
              </Row>
            )}
          </Card.Body>
        </Card>
      </Col>
      <Col xxl={4} xl={6} md={12} className="dashboard">
        <Card className="situation-card text-light">
          {renderSituacion(result.situacion)}
        </Card>
      </Col>
    </Row>
  );
};

export default SearchCustomer;
