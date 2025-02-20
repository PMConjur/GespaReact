import React from "react";
import { Card } from "react-bootstrap";

const DebtorInformation = () => {
  return (
    <div className="w-50 text-left mt-5">
      <Card className="p-3 bg-dark text-white border-0">
        <Card.Title>
          <span className="text-secondary">Cartera:</span> <strong>American Express</strong>
        </Card.Title>
        <Card.Body className="p-0">
          {[
            { href: "#", label: "Inicio", color: "lightgreen" },
            { href: "#", label: "Productividad", color: "lightblue" },
            { href: "#", label: "Recuperación", color: "#6495ED" },
            { href: "#", label: "Tiempos", color: "orange" },
            { href: "#", label: "Simulador", color: "lightblue" },
          ].map(({ href, label, color }, index) => (
            <a key={index} href={href} style={{ color, textDecoration: "none", marginRight: "5px" }}>{label}</a>
          ))}
        </Card.Body>
      </Card>
    </div>
  );
};

export default DebtorInformation;