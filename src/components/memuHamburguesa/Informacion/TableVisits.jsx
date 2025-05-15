import React from "react";
import { Table } from "react-bootstrap";
import PropTypes from "prop-types";

const TableVisits = ({ tableDomData, handleRowClick, renderCell, formatearFecha }) => {
  // Asegurarse de que tableDomData sea un array
  const data = Array.isArray(tableDomData) ? tableDomData : [];

  return (
    <div
      className="scroll-container"
      style={{
        width: "100%",
        maxHeight: "200px",
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
            <th>Fecha</th>
            <th>Hora</th>
            <th>Contacto</th>
            <th>Situación</th>
            <th>Causa No Pago</th>
            <th>Nombre</th>
            <th>Parentesco</th>
            <th>Sucursal</th>
            <th>Color Fachada</th>
            <th>Color Puerta</th>
            <th>Color Herrería</th>
            <th>Pisos</th>
            <th>Vivienda</th>
            <th>Habitación</th>
            <th>Económico</th>
            <th>NombrePropietario</th>
            <th>AutoMapeo</th>
            <th>AutoMarca</th>
            <th>AutoAño</th>
            <th>CalleHorizontalNorte</th>
            <th>CalleHorizontalSur</th>
            <th>CalleVerticalOeste</th>
            <th>CalleVerticalEste</th>
            <th>Visitador</th>
            <th>Capturista</th>
            <th>FechaPagoNegociación</th>
            <th>MontoNegociación</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <tr key={index} onClick={() => handleRowClick(item)}>
                <td>{renderCell(formatearFecha(item.Fecha))}</td>
                <td>{renderCell(item.Hora)}</td>
                <td>{renderCell(item.idContacto)}</td>
                <td>{renderCell(item.idSituación)}</td>
                <td>{renderCell(item.idCausaNoPago)}</td>
                <td>{renderCell(item.NombreContacto)}</td>
                <td>{renderCell(item.idParentesco)}</td>
                <td>{renderCell(item.idSucursal)}</td>
                <td>{renderCell(item.ColorFachada)}</td>
                <td>{renderCell(item.ColorPuerta)}</td>
                <td>{renderCell(item.ColorHerrería)}</td>
                <td>{renderCell(item.Pisos)}</td>
                <td>{renderCell(item.idVivienda)}</td>
                <td>{renderCell(item.idHabitación)}</td>
                <td>{renderCell(item.idEconómico)}</td>
                <td>{renderCell(item.NombrePropietario)}</td>
                <td>{renderCell(item.AutoMapeo)}</td>
                <td>{renderCell(item.AutoMarca)}</td>
                <td>{renderCell(item.AutoAño)}</td>
                <td>{renderCell(item.CalleHorizontalNorte)}</td>
                <td>{renderCell(item.CalleHorizontalSur)}</td>
                <td>{renderCell(item.CalleVerticalOeste)}</td>
                <td>{renderCell(item.CalleVerticalEste)}</td>
                <td>{renderCell(item.Visitador)}</td>
                <td>{renderCell(item.Capturista)}</td>
                <td>{renderCell(item.FechaPagoNegociación)}</td>
                <td>{renderCell(item.MontoNegociación)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="27" style={{ textAlign: "center" }}>
                No hay datos disponibles.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

TableVisits.propTypes = {
  tableDomData: PropTypes.array,
  handleRowClick: PropTypes.func.isRequired,
  renderCell: PropTypes.func.isRequired,
  formatearFecha: PropTypes.func.isRequired,
};

TableVisits.defaultProps = {
  tableDomData: [], // Valor predeterminado como un array vacío
};

export default TableVisits;
