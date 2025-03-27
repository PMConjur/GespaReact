import React from "react";
import { Table } from "react-bootstrap";

const TableMultiDeptor = ({ tableData }) => {
  const renderCell = (value) => {
    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value);
    }
    return value ?? "N/A";
  };

  return (
    <div
      style={{
        maxHeight: "200px",
        maxWidth: "1100px",
        overflowY: "auto",
      }}
    >
      <Table striped bordered hover responsive variant="dark">
        <thead>
          <tr>
            <th>Cuenta</th>
            <th>Cartera</th>
            <th>Producto</th>
            <th>Situacion</th>
            <th>Nombre</th>
            <th>RFC</th>
            <th>NumeroCliente</th>
            <th>Saldo</th>
            <th>Activacion</th>
            <th>Bloqueo</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((item, index) => (
            <tr key={index}>
              <td>{item.idCuenta ?? "N/A"}</td>
              <td>{item.idCartera ?? "N/A"}</td>
              <td>{item.idProducto ?? "N/A"}</td>
              <td>{item["idSituación"] ?? "N/A"}</td>
              <td>{item.NombreDeudor ?? "N/A"}</td>
              <td>{item.RFC ?? "N/A"}</td>
              <td>{item.NumeroCliente ?? "N/A"}</td>
              <td>{item.Saldo ?? "N/A"}</td>
              <td>
                {item["Activación"]
                  ? new Date(item["Activación"]).toLocaleDateString()
                  : "N/A"}
              </td>
              <td>{item.Bloqueo ? "Sí" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TableMultiDeptor;
