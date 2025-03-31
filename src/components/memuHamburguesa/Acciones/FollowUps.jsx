import { Modal, Button, Row, Col } from "react-bootstrap";
import TableFollowUps from "../../TableFollowUps";
import FormFollowUps from "./FormFollowUps";
import { useContext } from "react";
import { AppContext } from "../../../pages/Managment";

const FollowUps = ({ show, handleClose }) => {
  const { searchResults, idEjecutivo } = useContext(AppContext);

  // console.log(
  //   "[FollowUps] Render - idEjecutivo:",
  //   idEjecutivo,
  //   "searchResults:",
  //   searchResults
  // );

  const handleRefreshData = () => {
    //console.log('[FollowUps] Refrescando datos después de guardar seguimiento');
    // Aquí puedes agregar lógica para refrescar la tabla si es necesario
  };

  return (
    <Modal show={show} onHide={handleClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Seguimiento</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={6}>
            <TableFollowUps />
          </Col>
          <Col md={6}>
            <FormFollowUps
              onSubmitSuccess={handleRefreshData}
              handleClose={handleClose}
              searchResults={searchResults}
              idEjecutivo={idEjecutivo}
            />
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FollowUps;
