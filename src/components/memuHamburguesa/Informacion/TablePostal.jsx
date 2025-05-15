import React from "react";
import { Table } from "react-bootstrap";

const TablePostal = ({ postalTableData, handlePostalRowClick, renderCell }) => {
  return (
    <div
      className="scroll-container"
      style={{
        width: "100%",
        maxHeight: "350px",
        overflowY: "auto",
        display: "flex",
        backgroundColor: "#343a40",
        color: "#ffffff",
        scrollbarColor: "#6c757d #343a40",
        scrollbarWidth: "thin",
      }}
    >
      <Table
        striped
        bordered
        hover
        responsive
        variant="dark"
        style={{ fontSize: "13px" }}
      >
        <thead
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            backgroundColor: "#343a40",
          }}
        >
          <tr style={{ height: "55px" }}>
            <th>Id código Postal</th>
            <th>Código Postal</th>
            <th>Colonia</th>
            <th>Municipio</th>
            <th>Estado</th>
            <th>Zona</th>
            <th>Asentamiento</th>
            <th>Periferia</th>
            <th>Estancia</th>
            <th>Sucursal</th>
            <th>Zona de Riesgo</th>
          </tr>
        </thead>
        <tbody>
          {postalTableData?.map((item, index) => (
            <tr
              key={index}
              onClick={() => handlePostalRowClick(item)}
              style={{ cursor: "pointer" }}
            >
              <td>{renderCell(item.idCódigoPostal)}</td>
              <td>{renderCell(item.códigoPostal)}</td>
              <td>{renderCell(item.colonia)}</td>
              <td>{renderCell(item.municipio)}</td>
              <td>{renderCell(item.estado)}</td>
              <td>{renderCell(item.zona)}</td>
              <td>{renderCell(item.asentamiento)}</td>
              <td>{renderCell(item.periferia)}</td>
              <td>{renderCell(item.estancia)}</td>
              <td>{renderCell(item.sucursal)}</td>
              <td>{renderCell(item.zonaRiesgo ? "Sí" : "No")}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TablePostal;
