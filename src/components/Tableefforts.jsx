import React from "react";
import { Table, Row, Container } from "react-bootstrap";
import { Modal } from "react-bootstrap";
const Tableefforts = ({ gestionesData, handleRowClick, selectedGestion }) => {
  const renderCell = (value) => {
    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value);
    }
    return value ?? "N/A";
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
                <td>{renderCell(item.Fecha_Insert)}</td>
                <td>{renderCell(item.Segundo_Insert)}</td>
                <td>{renderCell(item.NúmeroTelefónico)}</td>
                <td>{renderCell(item.idContacto)}</td>
                <td>{renderCell(item.idSituaciónGestión)}</td>
                <td>{renderCell(item.idCausaNoPago)}</td>
                <td>{renderCell(item.idParentesco)}</td>
                <td>{renderCell(item.NombreContacto)}</td>
                <td>{renderCell(item.idModo)}</td>
                <td>{renderCell(item.idAcercamiento)}</td>
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
