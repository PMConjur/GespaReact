import { Card, Row, Col } from "react-bootstrap";
import { AppContext } from "../pages/Managment";
import { useContext } from "react";
import {
  FaRegCreditCard,
  FaUser,
  FaFileAlt,
  FaCalendarCheck,
  FaClipboardList
} from "react-icons/fa";

const SearchCustomer = () => {
  // Consume el contexto
  const {searchResults} = useContext(AppContext);
 
  return (
    <>
      <br />
      {searchResults.map((result, index) => (
        <Card key={index} className="mb-3 custom-card bg-dark">
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
                  label: "Fecha de Activacion",
                  value: result.activada || "Ninguna"
                },
                {
                  icon: <FaFileAlt />,
                  label: "Expediente",
                  value: result.expediente || "Ninguna"
                },
                {
                  icon: <FaUser />,
                  label: "No. Cliente",
                  value: result.numeroCliente || "Ninguna"
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
      ))}
    </>
  );
};

export default SearchCustomer;