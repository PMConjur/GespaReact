import React from "react";
import { Table, Row } from "react-bootstrap";
import { reemplazarValores, formatearFecha } from "./ValoresCatalogos"; // Importa el método

const TableNegotiationsMonth = ({ tableData }) => {
  return (
    <Row>
      <Table striped bordered hover responsive variant="dark">
        <thead>
          <tr>
            <th>Cuenta</th>
            <th>Herramienta</th>
            <th>status</th>
            <th>FechaCreacion</th>
            <th>FechaTermino</th>
            <th>Negociado</th>
            <th>Pagado</th>
            <th>Pagos</th>
            <th>CartaConvenio</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((item, index) => (
            <tr key={index}>
              <td>{item.idCuenta ?? ""}</td>
              <td>{item.Herramienta ?? ""}</td>
              <td>{reemplazarValores(item.idEstado) ?? ""}</td>
              <td>{formatearFecha(item.FechaCreación) ?? ""}</td>
              <td>{formatearFecha(item.FechaTérmino) ?? ""}</td>
              <td>{item.MontoNegociado ?? ""}</td>
              <td>{item.MontoPagado ?? ""}</td>
              <td>{item.Pagos ?? ""}</td>
              <td>{item._CartaConvenio ? "Sí" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Row>
  );
};

export default TableNegotiationsMonth;
