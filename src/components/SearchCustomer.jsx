import { useContext, useState, useEffect } from "react";
import { AppContext } from "../pages/Managment"; // Importa el contexto
import { Card, Row, Col, Placeholder } from "react-bootstrap";
import {
  FaRegCreditCard,
  FaUser,
  FaFileAlt,
  FaCalendarCheck,
  FaClipboardList
} from "react-icons/fa";

const SearchCustomer = () => {
  // Consume el contexto
  const { searchResults } = useContext(AppContext);
  const [isLoading, setIsLoading] = useState(true);

  const defaultData = {
    producto: "--",
    idCuenta: "--",
    fechaActivacion: "--",
    expediente: "--",
    numeroCliente: "--",
    rfc: "--"
  };

  const result = searchResults[0] || defaultData;

  useEffect(() => {
    setIsLoading(true); // Reinicia el estado a "cargando"
    
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
            <Row style={{ color: "white" }}>
              {[
                {
                  icon: <FaRegCreditCard />,
                  label: "Producto",
                  value: "Amex"
                },
                {
                  icon: <FaClipboardList />,
                  label: "Cuenta",
                  value: result.idCuenta || "--"
                },
                {
                  icon: <FaCalendarCheck />,
                  label: "Activada",
                  value: result.fechaActivacion || "--"
                },
                {
                  icon: <FaFileAlt />,
                  label: "Expediente",
                  value: `AMX${result.expediente}` || "--"
                },
                {
                  icon: <FaUser />,
                  label: "No. Cliente",
                  value: result.numeroCliente || "--"
                },
                { icon: <FaFileAlt />, label: "RFC", value: result.rfc || "--" }
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