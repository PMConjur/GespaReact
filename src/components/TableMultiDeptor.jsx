import React, { useContext } from "react";
import { Table } from "react-bootstrap";
import { AppContext } from "../pages/Managment"; // Importa el contexto
import { toast } from "sonner"; // Importa toast
import {
  reemplazarValores,
  reemplazarValoresProducto,
  reemplazarValoresCartera,
} from "./ValoresCatalogos.js"; // Importa el método

const TableMultiDeptor = ({ tableData, onRowClick }) => {
  const { selectedAnswer } = useContext(AppContext); // Obtiene el estado del flujo activo

  const handleRowClick = (idCuenta) => {
    if (selectedAnswer?.value && selectedAnswer.value !== null) {
      toast.error("No puedes cambiar de cuenta mientras hay un flujo activo.");
      return;
    }
    onRowClick(idCuenta); // Llama a la función original si no hay flujo activo
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
                onClick={() => handleRowClick(item.idCuenta)} // Usa la nueva función handleRowClick
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
