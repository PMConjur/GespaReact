import { useState, useEffect, useContext } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { ShieldFill, KeyFill, EnvelopeAtFill } from "react-bootstrap-icons";
import {
  fetchListValidators,
  fetchValidators,
  fetchEmailsCharging,
} from "../../services/gespawebServices"; // Importa el servicio
import { toast } from "sonner"; // Importa Sonner para los toasts
import { AppContext } from "../../pages/Managment";

const Validators = ({ show, handleClose, handleValidate }) => {
  const [validators, setValidators] = useState([]); // Estado para almacenar la lista de validadores
  const [validator, setValidator] = useState(""); // Estado para el validador seleccionado
  const [password, setPassword] = useState(""); // Estado para la contraseña
  const [loading, setLoading] = useState(false);
  const [emailsCharing, setEmailsCharing] = useState([]);
  const [showEmailsSelect, setShowEmailsSelect] = useState(false); // Estado para controlar la visibilidad del select
  const { searchResults } = useContext(AppContext); // Obtiene la función searResult del contexto
  const [emails, setEmails] = useState(""); // Desestructura la función searResult

  useEffect(() => {
    const fetchValidatorsList = async () => {
      try {
        const idProducto = 1; // Cambia este valor según sea necesario
        const response = await fetchListValidators(idProducto);
        setValidators(response); // Almacena la lista de validadores
      } catch (error) {
        console.error("Error al obtener la lista de validadores:", error);
      }
    };

    const fetchEmailsChargingData = async () => {
      try {
        // Validar que searchResults tenga al menos un elemento
        if (searchResults && searchResults.length > 0) {
          const idCartera = 1; // Cambia este valor según sea necesario
          const idCuenta = searchResults[0]?.idCuenta?.trim(); // Elimina espacios en blanco de idCuenta
          if (idCuenta) {
            const response = await fetchEmailsCharging(idCartera, idCuenta);
            console.log(
              "Respuesta del endpoint fetchEmailsCharging:",
              response
            ); // Imprime la respuesta
            setEmailsCharing(response); // Almacena la lista de correos
          } else {
            console.error("idCuenta no es válido:", idCuenta);
            toast.error("El idCuenta no es válido. Verifica los datos.");
          }
        } else {
          console.error("searchResults no contiene datos válidos.");
          toast.error("No se encontraron resultados de búsqueda.");
        }
      } catch (error) {
        console.error("Error al obtener la lista de correos:", error);
        toast.error(
          "Error al obtener la lista de correos. Verifica los datos."
        );
      }
    };

    if (show) {
      fetchValidatorsList();
      fetchEmailsChargingData();
    }
  }, [show, searchResults]); // Solo se ejecuta cuando se abre el modal o cambia searchResults

  const handleCheckboxChange = (e) => {
    setShowEmailsSelect(e.target.checked); // Muestra u oculta el select según el estado del checkbox
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const idProducto = 1; // Cambia este valor según sea necesario
      const idEjecutivo = validator; // idEjecutivo seleccionado por el usuario
      const Contraseña = password; // Contraseña ingresada por el usuario

      const response = await fetchValidators(
        idProducto,
        idEjecutivo,
        Contraseña
      );
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

  const handleCloseModal = () => {
    setValidator(""); // Limpia el validador seleccionado
    setPassword(""); // Limpia la contraseña
    setShowEmailsSelect(false); // Oculta el select de correos
    setEmails(""); // Limpia el correo seleccionado
    handleClose(); // Cierra el modal
  };

  return (
    <Modal show={show} onHide={handleCloseModal} size="md">
      <Modal.Header closeButton className="bg-dark text-light">
        <Modal.Title>Validación</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-light d-block">
        <Form>
          <Form.Group className="mb-4">
            <Form.Check
              type="checkbox"
              label="Carta convenio"
              name="llamadaEntrada"
              onChange={handleCheckboxChange} // Maneja el cambio del checkbox
            />
          </Form.Group>

          {showEmailsSelect && ( // Muestra el select solo si el checkbox está seleccionado
            <Form.Group className="mb-3">
              <Form.Label>Correos</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <EnvelopeAtFill />
                </InputGroup.Text>
                <Form.Select
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                >
                  <option value="" disabled>
                    Seleccionar Correo
                  </option>
                  {emailsCharing.map((email, index) => (
                    <option key={index} value={email.CorreoElectrónico}>
                      {email.CorreoElectrónico}
                    </option>
                  ))}
                </Form.Select>
              </InputGroup>
            </Form.Group>
          )}

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
          <span>¿Desea registrar un cargo en línea?</span>
          <Button variant="danger" onClick={handleCloseModal} disabled={loading}>
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
