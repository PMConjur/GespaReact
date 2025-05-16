import React from "react";
import { Table } from "react-bootstrap";

const TablePostal = ({ postalTableData, handlePostalRowClick, renderCell }) => {
  // Campos a ocultar
  const hiddenFields = ["idCódigoPostal"];

  // Definir los headers base (orden y nombres fijos, sin idCódigoPostal)
  const baseHeaders = [
    { key: "códigoPostal", label: "C. Postal" },
    { key: "colonia", label: "Colonia" },
    { key: "municipio", label: "Municipio" },
    { key: "estado", label: "Estado" },
    { key: "zona", label: "Zona" },
    { key: "asentamiento", label: "Asentamiento" },
    { key: "periferia", label: "Periferia" },
    { key: "estancia", label: "Estancia" },
    { key: "sucursal", label: "Sucursal" },
    { key: "zonaRiesgo", label: "Zona Riesgo" }
  ];

  // Si hay datos, usar los headers dinámicos (pero nunca mostrar los ocultos)
  // Si no hay datos, usar los baseHeaders para mostrar los encabezados
  const headers =
    Array.isArray(postalTableData) &&
    postalTableData.length > 0 &&
    postalTableData[0] &&
    typeof postalTableData[0] === "object"
      ? Object.keys(postalTableData[0])
          .filter((header) => !hiddenFields.includes(header))
          .map((key) => {
            const found = baseHeaders.find((h) => h.key === key || h.key === key.toLowerCase());
            return found || { key, label: key };
          })
      : baseHeaders;

  return (
    <div
      className="scroll-container"
      style={{
        width: "100%",
        maxHeight: "550px",
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
            top: -1,
            zIndex: 1,
            backgroundColor: "#343a40",
          }}
        >
          <tr style={{ height: "55px" }}>
            {headers.map((header, idx) => (
              <th key={idx}>{header.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {postalTableData?.length > 0 ? (
            postalTableData.map((item, index) => (
              <tr
                key={index}
                onClick={() => handlePostalRowClick(item)}
                style={{ cursor: "pointer" }}
              >
                {headers.map((header, idx) => (
                  <td key={idx}>
                    {header.key === "zonaRiesgo"
                      ? renderCell(item[header.key] ? "Sí" : "No")
                      : renderCell(item[header.key])}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length} style={{ textAlign: "center", color: "#bbb" }}>
                Sin datos para mostrar
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default TablePostal;
