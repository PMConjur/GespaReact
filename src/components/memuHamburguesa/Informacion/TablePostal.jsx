import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { fetchPostalCodes } from "../../../services/gespawebServices"; // Importar el servicio

const TablePostal = ({ idCodigoPostal }) => {
  const [postalData, setPostalData] = useState([]);

  useEffect(() => {
    const loadPostalCodes = async () => {
      if (idCodigoPostal) {
        try {
          const response = await fetchPostalCodes(idCodigoPostal);
          setPostalData(response.codigosPostales || []);
        } catch (error) {
          console.error("Error al cargar códigos postales:", error);
        }
      }
    };

    loadPostalCodes();
  }, [idCodigoPostal]);

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
            <th>idCódigoPostal</th>
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
          {postalData?.map((item, index) => (
            <tr key={index}>
              <td>{item.idCódigoPostal || ""}</td>
              <td>{item.códigoPostal || ""}</td>
              <td>{item.colonia || ""}</td>
              <td>{item.municipio || ""}</td>
              <td>{item.estado || ""}</td>
              <td>{item.zona || ""}</td>
              <td>{item.asentamiento || ""}</td>
              <td>{item.periferia || ""}</td>
              <td>{item.estancia || ""}</td>
              <td>{item.sucursal || ""}</td>
              <td>{item.zonaRiesgo ? "Sí" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TablePostal;
