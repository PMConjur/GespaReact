import { useState, useEffect, useContext } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import { ShieldFill, KeyFill, EnvelopeAtFill } from "react-bootstrap-icons";
import {
  fetchListValidators,
  fetchValidators,
  fetchEmailsCharging,
  getErrorStatus
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
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  // Función para abrir el modal de OnlineCharge


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

              // ✅ Añade este console.log ANTES de abrir el modal
              console.log('Context values (Validators - PRE apertura):', {
                isOnlineChargeActive,  // Valor del contexto
                showOnlineChargeModal, // Estado local del modal
              // Si aplica
            });

      // Abrir modales según las condiciones
      if (isOnlineChargeActive === true) {
        handleOpenOnlineCharge(); // Usamos la nueva función para abrir
        console.log(' isOnlineChargeActive sigue siendo true en el segundo intento');
        toast.success("Validación exitosa. Continua con el proceso de Cargo en Linea.", {
          position: "top-center",
        });
      }
      
      if (isPaymentActive === true) {
        setShowPaymentModal(true);
        toast.success("Validación exitosa. Continua con el proceso de Pago.", {
          position: "top-center",
        });
      }

    } catch (error) {
      console.error("Datos incorrectos, vuelva intentarlo:", error);
      const message = error.response ? getErrorStatus(error.response.status) : "Error desconocido";
      toast.error(`Datos incorrectos, vuelva intentarlo: "${message}"`, {
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleOpenOnlineCharge = () => {
    console.log('🎯 Abriendo modal con formulario');
    setOnlineChargeActive(false); // Reset primero
    setTimeout(() => {
        setOnlineChargeActive(true);
        setShowOnlineChargeModal(true);
    }, 50); // Pequeño delay para asegurar el ciclo de actualización
};

const handleCloseOnlineChargeModal = () => {
  console.log('🗑️ Cerrando y preparando para reapertura');
  setShowOnlineChargeModal(false);
  setOnlineChargeActive(false); // ¡Esto es crucial!
};

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false);
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
      <Modal show={show} onHide={handleCloseModal} size="md" backdrop="static">
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
                  style={{ maxHeight: "150px", overflowY: "auto" }}
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