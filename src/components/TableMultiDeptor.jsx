import React from "react";
import { Table } from "react-bootstrap";
import {
  reemplazarValores,
  reemplazarValoresProducto,
  reemplazarValoresCartera,
  agregarSignoDolar,
} from "./ValoresCatalogos"; // Importa el método

const TableMultiDeptor = ({ tableData }) => {
  const renderCell = (value) => {
    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value);
    }
    return value ?? "";
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
              <td>{item.idCuenta ?? ""}</td>
              <td>{reemplazarValoresProducto(item.idCartera) ?? ""}</td>
              <td>{reemplazarValoresCartera(item.idProducto) ?? ""}</td>
              <td>{reemplazarValores(item["idSituación"])}</td>
              <td>{item.NombreDeudor ?? ""}</td>
              <td>{item.RFC ?? ""}</td>
              <td>{item.NumeroCliente ?? ""}</td>
              <td>{agregarSignoDolar(item.Saldo) ?? ""}</td>
              <td>
                {item["Activación"]
                  ? new Date(item["Activación"]).toLocaleDateString()
                  : ""}
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
