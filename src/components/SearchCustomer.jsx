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

const SearchCustomer = () => {
  // Consume el contexto
  const { searchResults } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true); // Estado para manejar la carga

  // Datos por defecto en caso de que no haya resultados de búsqueda
  const defaultData = {
    producto: "--",
    idCuenta: "--",
    fechaActivacion: "--",
    expediente: "--",
    numeroCliente: "--",
    rfc: "--"
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
    <>
      <br />
      <Card className="mb-3 custom-card">
        <Card.Body>
          {isLoading ? (
            // Mostrar placeholders mientras se cargan los datos
            <Row style={{ color: "white" }}>
              {[...Array(6)].map((_, i) => (
                <Col key={i} md={4}>
                  <Placeholder as="p" animation="glow">
                    <Placeholder xs={6} />
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
                { icon: <FileText />, label: "RFC", value: result.rfc || "--" }
              ].map(({ icon, label, value }, i) => (
                <Col key={i} md={4}>
                  <p>
                    {icon} <strong>{label}:</strong> {value}
                  </p>
                </Col>
              ))}
            </Row>
          )}
        </Card.Body>
      </Card>
    </>
  );
};

export default SearchCustomer;