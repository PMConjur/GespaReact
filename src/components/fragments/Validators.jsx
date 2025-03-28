import { useState } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { ShieldFill, KeyFill } from "react-bootstrap-icons";
import { fetchValidators } from "../../services/gespawebServices"; // Importa el servicio
import { toast } from "sonner"; // Importa Sonner para los toasts

const Validators = ({ show, handleClose, handleValidate }) => {
  const [validator, setValidator] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const idEjecutivo = 18967; // Valor fijo para idEjecutivo

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const idProducto = 1; // Valor fijo para idProducto
      const Contraseña = password; // Contraseña ingresada por el usuario

      const response = await fetchValidators(idProducto, idEjecutivo, Contraseña);
      console.log("Respuesta del endpoint:", response);

      // Muestra un toast de éxito si la validación es correcta
      toast.success("Validación exitosa. Datos correctos.", {
        position: "top-center",
      });

      handleValidate(validator, password); // Llama a la función de validación externa
      setValidator("");
      setPassword("");
      handleClose(); // Cierra el modal
    } catch (error) {
      console.error("Error al validar:", error);

      // Muestra un toast de error si ocurre un problema
      toast.error(`Error al validar: ${error.message}`, {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="md">
      <Modal.Header closeButton className="bg-dark text-light">
        <Modal.Title>
          Validación
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-light">
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Validador</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <ShieldFill />
              </InputGroup.Text>
              <Form.Select
                value={validator}
                onChange={(e) => setValidator(e.target.value)}
              >
                <option value="" disabled>
                  Seleccione Validador
                </option>
                <option value={idEjecutivo}>Admin 1</option>
              </Form.Select>
            </InputGroup>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <InputGroup>
              <InputGroup.Text>
                <KeyFill />
              </InputGroup.Text>
              <Form.Control
                type="password"
                placeholder="Ingrese contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </InputGroup>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="p-3 bg-dark text-light">
        <div>
          <span>
            ¿Desea registrar un cargo en línea?
          </span>
          <Button variant="danger" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="success" onClick={handleSubmit} disabled={loading}>
            {loading ? "Validando..." : "Validar"}
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default Validators;
