import React from "react";
import { Modal, Container, Row, Col } from "react-bootstrap";
import FormularioDom from "./FormularioDom";
import TablePostal from "./TablePostal";
import TableVisits from "./TableVisits";

const Address = ({
  show,
  handleClose,
  formData,
  setFormData,
  handlePreviousItem,
  handleNextItem,
  currentIndex,
  totalItems,
  onSearchPostalCode,
  onSearchPostalCodeById,
  postalTableData,
  handleSelectPostalCode,
  domicilioData,
  handleRowClick,
  renderCell,
  formatearFecha,
}) => {
  return (
    <Modal show={show} onHide={handleClose} size="xl" backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Dirección</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container fluid>
          <Row>
            <Col md={8}>
              <h4>Tabla de Códigos Postales</h4>
              <TablePostal
                postalData={postalTableData}
                onSelectPostalCode={handleSelectPostalCode}
              />
            </Col>
            <Col md={4}>
              <h4>Formulario</h4>
              <FormularioDom
                formData={formData}
                setFormData={setFormData}
                handlePreviousItem={handlePreviousItem}
                handleNextItem={handleNextItem}
                currentIndex={currentIndex}
                totalItems={totalItems}
                onSearchPostalCode={onSearchPostalCode}
                onSearchPostalCodeById={onSearchPostalCodeById}
              />
            </Col>
          </Row>
          <Row>
            <h4>Visitas</h4>
            <TableVisits
              tableDomData={domicilioData}
              handleRowClick={handleRowClick}
              renderCell={renderCell}
              formatearFecha={formatearFecha}
            />
          </Row>
        </Container>
      </Modal.Body>
    </Modal>
  );
};

export default Address;