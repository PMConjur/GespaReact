
import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
function ModalChange({ user, password, days }) {
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);
  const navigate = useNavigate();
  const handleNoClick = async () => {
    setShow(false);
    navigate("/home");
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Gestor de Cuenta</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Su contraseña expira en {days} días</p>
        <p>¿Deseas cambiar ahora?</p>
       
          <label htmlFor="modalPassword" className="form-label">
            Contraseña
          </label>
          <input
            type="text"
            className="form-control"
            id="modalPassword"
            value={password}
            readOnly
          />
      
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={handleNoClick}>
          No
        </Button>
        <Button variant="danger">Sí</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalChange;
