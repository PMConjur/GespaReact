import React from "react";
import { Table, Row } from "react-bootstrap";

const TableNegotiationsMonth = ({ tableData }) => {
  return (
    <Row>
      <Table striped bordered hover responsive variant="dark">
        <thead>
          <tr>
            <th>Cuenta</th>
            <th>Herramienta</th>
            <th>Estado</th>
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
              <td>{item.idCuenta ?? "N/A"}</td>
              <td>{item.Herramienta ?? "N/A"}</td>
              <td>{item.idEstado ?? "N/A"}</td>
              <td>{item.FechaCreación ?? "N/A"}</td>
              <td>{item.FechaTérmino ?? "N/A"}</td>
              <td>{item.MontoNegociado ?? "N/A"}</td>
              <td>{item.MontoPagado ?? "N/A"}</td>
              <td>{item.Pagos ?? "N/A"}</td>
              <td>{item._CartaConvenio ? "Sí" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Row>
  );
};

export default TableNegotiationsMonth;
