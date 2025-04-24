import { Modal, Row, Col } from "react-bootstrap";
import SearchTable from "../../SearchComponents/SearchTable";
import FormSearch from "../../SearchComponents/FormSearch";

const Search = ({ show, handleClose }) => {
  const handleCloseModal = () => {
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleCloseModal} backdrop="static" size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Búsquedas</Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body">
        <Row>
          <Col xs={12} md={12} lg={12}>
            <h4 className="text-center">Buscar datos</h4>
            <FormSearch />
          </Col>

     
        </Row>
        <hr />
        <Row>
          <Col xs={12} md={12} lg={12}>
            <h4 className="text-center">Resultados</h4>
            <SearchTable /> {/* Cambiado a PascalCase */}
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default Search;
