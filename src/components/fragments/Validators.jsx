import { useState, useEffect } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { ShieldFill, KeyFill } from "react-bootstrap-icons";
import { fetchListValidators, fetchValidators} from "../../services/gespawebServices"; // Importa el servicio
import { toast } from "sonner"; // Importa Sonner para los toasts


const Validators = ({ show, handleClose, handleValidate }) => {
  const [validators, setValidators] = useState([]); // Estado para almacenar la lista de validadores
  const [validator, setValidator] = useState(""); // Estado para el validador seleccionado
  const [password, setPassword] = useState(""); // Estado para la contraseña
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchValidators = async () => {
      try {
        const idProducto = 1; // Cambia este valor según sea necesario
        const response = await fetchListValidators(idProducto);
        setValidators(response); // Almacena la lista de validadores
      } catch (error) {
        console.error("Error al obtener la lista de validadores:", error);
      }
    };

    fetchValidators();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const idEjecutivo = validator; // idEjecutivo seleccionado por el usuario
      const Contraseña = password; // Contraseña ingresada por el usuario

      const response = await fetchValidators(idEjecutivo, Contraseña);
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
                {validators.map((val) => (
                  <option key={val.idEjecutivo} value={val.idEjecutivo}>
                    {val.Nombre}
                  </option>
                ))}
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
