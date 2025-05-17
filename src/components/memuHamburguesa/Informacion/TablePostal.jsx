import React from "react";
import { Table } from "react-bootstrap";

const TablePostal = ({ postalTableData, handlePostalRowClick, renderCell, isFocused }) => {
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
    <>
      <style>
        {`
          .postal-table-focus {
            border: 3px solid #fff200 !important;
            box-shadow: 0 0 16px #fff200;
            transition: border 0.3s, box-shadow 0.3s;
            /* Solo el borde parpadea */
            animation: borderBlink 1s steps(1, end) infinite;
          }
          @keyframes borderBlink {
            0% { border-color: #fff200; }
            50% { border-color: #343a40; }
            100% { border-color: #fff200; }
          }
          @keyframes postalFocusAnim {
            from { box-shadow: 0 0 16px #fff200; }
            to { box-shadow: 0 0 32px #fff200; }
          }
          /* Scrollbar y sticky header igual que tabla de visitas */
          .postal-scroll-container {
            width: 100%;
            max-height: 250px;
            overflow-y: auto;
            display: flex;
            background-color: #343a40;
            color: #ffffff;
            scrollbar-color: #6c757d #343a40;
            scrollbar-width: thin;
          }
          .postal-scroll-container::-webkit-scrollbar {
            width: 8px;
          }
          .postal-scroll-container::-webkit-scrollbar-thumb {
            background: #6c757d;
          }
          .postal-scroll-container::-webkit-scrollbar-track {
            background: #343a40;
          }
          .postal-table th {
            position: sticky;
            top: -1px;
            z-index: 1;
            background-color: #343a40;
          }
        `}
      </style>
      <div
        className={`postal-scroll-container${isFocused ? " postal-table-focus" : ""}`}
      >
        <Table
          striped
          bordered
          hover
          responsive
          variant="dark"
          className="postal-table"
          style={{ fontSize: "13px" }}
        >
          <thead>
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
                <td colSpan={headers.length} style={{ textAlign: "center", fontWeight: "bold" }}>
                  Sin datos para mostrar
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default TablePostal;
