import { useContext } from "react";
import { AppContext } from "../pages/Managment"; // Importa el contexto
import { Card, Row, Col } from "react-bootstrap";
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

  const defaultData = {
    producto: "-",
    idCuenta: "-",
    fechaActivacion: "-",
    expediente: "-",
    numeroCliente: "-",
    rfc: "-"
  };

  const result = searchResults[0] || defaultData;

  return (
    <>
      <br />
      <Card className="mb-3 custom-card">
        <Card.Body>
          <Row style={{ color: "white" }}>
            {[
              {
                icon: <FaRegCreditCard />,
                label: "Producto",
                value: result.producto
              },
              {
                icon: <FaClipboardList />,
                label: "Cuenta",
                value: result.idCuenta
              },
              {
                icon: <FaCalendarCheck />,
                label: "Activada",
                value: result.fechaActivacion || "N/A"
              },
              {
                icon: <FaFileAlt />,
                label: "Exp",
                value: result.expediente || "N/A"
              },
              {
                icon: <FaUser />,
                label: "No. Cliente",
                value: result.numeroCliente || "N/A"
              },
              { icon: <FaFileAlt />, label: "RFC", value: result.rfc }
            ].map(({ icon, label, value }, i) => (
              <Col key={i} md={4}>
                <p>
                  {icon} <strong>{label}:</strong> {value}
                </p>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};

export default SearchCustomer;
