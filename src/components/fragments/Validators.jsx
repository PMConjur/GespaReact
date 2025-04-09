import { useState, useEffect, useContext } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { ShieldFill, KeyFill, EnvelopeAtFill } from "react-bootstrap-icons";
import {
  fetchListValidators,
  fetchValidators,
  fetchEmailsCharging,
} from "../../services/gespawebServices";
import { toast } from "sonner";
import { AppContext } from "../../pages/Managment";
import OnlineCharge from "../memuHamburguesa/Acciones/OnlineCharge";
import Payments from "../memuHamburguesa/Informacion/Payments";

const Validators = ({ show, handleClose, handleValidate }) => {
  const [validators, setValidators] = useState([]);
  const [validator, setValidator] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailsCharing, setEmailsCharing] = useState([]);
  const [showEmailsSelect, setShowEmailsSelect] = useState(false);
  const { 
    searchResults, 
    isOnlineChargeActive, 
    isPaymentActive, 
    setOnlineChargeActive = () => {}, 
    setPaymentActive = () => {} 
  } = useContext(AppContext);
  const [emails, setEmails] = useState("");
  
  // Estados para controlar los modales
  const [showOnlineChargeModal, setShowOnlineChargeModal] = useState(false);
  const [showPaymentModal, setShowPaymentsModal] = useState(false);

  useEffect(() => {
    const fetchValidatorsList = async () => {
      try {
        const idProducto = 1;
        const response = await fetchListValidators(idProducto);
        setValidators(response);
      } catch (error) {
        console.error("Error al obtener la lista de validadores:", error);
      }
    };

    const fetchEmailsChargingData = async () => {
      try {
        if (searchResults && searchResults.length > 0) {
          const idCartera = 1;
          const idCuenta = searchResults[0]?.idCuenta?.trim();
          if (idCuenta) {
            const response = await fetchEmailsCharging(idCartera, idCuenta);
            setEmailsCharing(response);
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
        toast.error("Error al obtener la lista de correos. Verifica los datos.");
      }
    };

    if (show) {
      fetchValidatorsList();
      fetchEmailsChargingData();
    }
  }, [show, searchResults]);

  const handleCheckboxChange = (e) => {
    setShowEmailsSelect(e.target.checked);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const idProducto = 1;
      const idEjecutivo = validator;
      const Contraseña = password;

         // Imprime los datos que se enviarán al endpoint
    console.log("Datos enviados a fetchValidators:", {
      idProducto,
      idEjecutivo,
      Contraseña,
    });


      const response = await fetchValidators(
        idProducto,
        idEjecutivo,
        Contraseña
      );
      console.log("Respuesta del endpoint:", response);

      toast.success("Validación exitosa. Datos correctos.", {
        position: "top-center",
      });

      if (handleValidate) {
        handleValidate(validator, password, showEmailsSelect ? 1 : 0, emails || "");
      }

      setValidator("");
      setPassword("");
      handleClose();

      // Abrir modales según las condiciones
      if (isOnlineChargeActive && typeof setPaymentActive === 'function') {
        setShowOnlineChargeModal(true);
        setPaymentActive(true); // Asegurar que el otro modal no se active
        toast.success("Validación exitosa. Continua con el proceso de Cargo en Linea.", {
          position: "top-center",
        });
      }
      
      if (isPaymentActive && typeof setOnlineChargeActive === 'function') {
        setShowPaymentsModal(true);
        setOnlineChargeActive(true); // Asegurar que el otro modal no se active
        toast.success("Validación exitosa. Continua con el proceso de Pago.", {
          position: "top-center",
        });
      }

    } catch (error) {
      console.error("Datos incorrectos, vuelva intentarlo:", error);

      // Muestra un toast de error si ocurre un problema
      const message = error.response ? getErrorStatus(error.response.status) : "Error desconocido";
      toast.error(`${message}`, {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseOnlineChargeModal = () => {
    setShowOnlineChargeModal(false);
    setOnlineChargeActive(false);
  };

  const handleClosePaymentModal = () => {
    setShowPaymentsModal(false);
    setPaymentActive(false);
  };

  const handleCloseModal = () => {
    setValidator("");
    setPassword("");
    setShowEmailsSelect(false);
    setEmails("");
    handleClose();
  };

  return (
    <>
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
                onChange={handleCheckboxChange}
              />
            </Form.Group>

            {showEmailsSelect && (
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
      
      {/* Modal de OnlineCharge */}
      <OnlineCharge 
        show={showOnlineChargeModal}
        handleClose={handleCloseOnlineChargeModal}
      />

      {/* Modal de Payments */}
      <Payments
        show={showPaymentModal}
        handleClose={handleClosePaymentModal}
      />
    </>
  );
};

export default Validators;