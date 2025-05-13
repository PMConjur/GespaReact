import React from "react";
import { Table } from "react-bootstrap";
import {
  reemplazarValores,
  reemplazarValoresProducto,
  reemplazarValoresCartera,
} from "./ValoresCatalogos.js"; // Importa el método

const TableMultiDeptor = ({ tableData, onRowClick }) => { // Agregamos onRowClick como prop
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
            <th>Nú. Cliente</th>
            <th>Saldo</th>
            <th>Activacion</th>
            <th>Bloqueo</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(tableData) && tableData.length > 0 ? (
            tableData.map((item, index) => (
              <tr
                key={index}
                onClick={() => onRowClick(item.idCuenta)} // Pasamos idCuenta al hacer clic
                style={{ cursor: "pointer" }}
              >
                <td>{item.idCuenta ? item.idCuenta.slice(-5) : "--"}</td>
                <td>{reemplazarValoresCartera(item.idCartera) ?? "--"}</td>
                <td>{reemplazarValoresProducto(item.idProducto) ?? "--"}</td>
                <td>{reemplazarValores(item.idSituación) ?? "--"}</td>
                <td>{item.NombreDeudor ?? "--"}</td>
                <td>{item.RFC ?? "--"}</td>
                <td>
                  {Object.keys(item.NúmeroCliente || {}).length === 0
                    ? "--"
                    : JSON.stringify(item.NúmeroCliente)}
                </td>
                <td>{item.Saldo ? `$${item.Saldo.toFixed(2)}` : "--"}</td>
                <td>
                  {item.Activación
                    ? new Date(item.Activación).toLocaleDateString()
                    : "--"}
                </td>
                <td>{item.Bloqueo ? "Sí" : "No"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10">No se encontraron datos.</td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default TableMultiDeptor;
