import React from "react";
import { Table, Row, Container } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import { reemplazarValores, formatearFecha } from "./ValoresCatalogos"; // Importa el método

const Tableefforts = ({ gestionesData, handleRowClick, selectedGestion }) => {
  const renderCell = (value) => {
    if (
      !value ||
      (typeof value === "object" && Object.keys(value).length === 0)
    ) {
      return ""; // Valor predeterminado para valores vacíos
    }
    if (typeof value === "object") {
      return JSON.stringify(value);
    }
    return value;
  };

  return (
    <Container>
      <Modal.Title>Gestiones</Modal.Title>
      <hr />
      <Row>
        <Table striped bordered hover responsive variant="dark">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Telefono</th>
              <th>Contacto</th>
              <th>Situacion</th>
              <th>CausaNoPago</th>
              <th>Parentesco</th>
              <th>Nombre</th>
              <th>Modo</th>
              <th>Acercamiento</th>
              <th>Duracion</th>
            </tr>
          </thead>
          <tbody>
            {gestionesData.map((item, index) => (
              <tr key={index} onClick={() => handleRowClick(item)}>
                <td>{renderCell(formatearFecha(item.Fecha_Insert))}</td>
                <td>{renderCell(item.Segundo_Insert)}</td>
                <td>{renderCell(item.NúmeroTelefónico)}</td>
                <td>{renderCell(reemplazarValores(item.idContacto))}</td>
                <td>
                  {renderCell(reemplazarValores(item.idSituaciónGestión))}
                </td>
                <td>{renderCell(reemplazarValores(item.idCausaNoPago))}</td>
                <td>{renderCell(reemplazarValores(item.idParentesco))}</td>
                <td>{renderCell(item.NombreContacto)}</td>
                <td>{renderCell(reemplazarValores(item.idModo))}</td>
                <td>{renderCell(reemplazarValores(item.idAcercamiento))}</td>
                <td>{renderCell(item.Duración)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Row>
      <Row>
        <div>
          <strong>Comentario: </strong>
          {selectedGestion && selectedGestion.Comentario
            ? renderCell(selectedGestion.Comentario)
            : "Seleccione una gestión para ver el comentario"}
        </div>
      </Row>
    </Container>
  );
};

export default Tableefforts;
