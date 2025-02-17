import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import PropTypes from "prop-types"; // Import PropTypes for prop validation
import { toast, Toaster } from "sonner"; // Import toast for notifications
import { userReset } from "../services/gespawebServices"; // Import userReset function

function ModalChangePassword({
  showSecondModal,
  closeSecondModal,
  user,
  oldPassword
}) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState({
    length: false,
    upperCase: false,
    lowerCase: false,
    number: false,
    symbol: false
  });
  const [passwordMatch, setPasswordMatch] = useState(false);

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setNewPassword(value);
    setPasswordValid({
      length: value.length >= 10,
      upperCase: /[A-Z]/.test(value),
      lowerCase: /[a-z]/.test(value),
      number: /[0-9]/.test(value),
      symbol: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]/.test(value)
    });
  };

  const handleConfirmPasswordChange = (e) => {
    const { value } = e.target;
    setConfirmPassword(value);
    setPasswordMatch(value === newPassword);
  };

  const handleSubmitPasswordChange = async (e) => {
    e.preventDefault();
    try {
      const dataUserReset = {
        usuario: user,
        nuevaContra: newPassword,
        contra: oldPassword
      };
      const response = await userReset(dataUserReset); // Call userReset function
      toast.success("Contraseña actualizada correctamente"); // Show success message
      closeSecondModal(); // Close the modal after submitting
    } catch (error) {
      toast.error(error.message); // Show error message
    }
  };

  const handleClose = () => {
    closeSecondModal(); // Ensure the modal closes properly
  };

  const getInputBorderColor = (isValid) => {
    return isValid ? "green" : "red";
  };

  return (
    <>
      <Modal show={showSecondModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Modificar Contraseña</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form id="password-form" onSubmit={handleSubmitPasswordChange}>
            <div className="mb-3">
              <label htmlFor="new-password" className="form-label">
                Nueva Contraseña
              </label>
              <input
                type="password"
                className="form-control"
                id="new-password"
                value={newPassword}
                onChange={handlePasswordChange}
                maxLength={10}
                required
                style={{
                  borderColor: getInputBorderColor(
                    passwordValid.length &&
                      passwordValid.upperCase &&
                      passwordValid.lowerCase &&
                      passwordValid.number &&
                      passwordValid.symbol
                  )
                }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="confirm-password" className="form-label">
                Confirmar Contraseña
              </label>
              <input
                type="password"
                className="form-control"
                id="confirm-password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                maxLength={10}
                required
                style={{
                  borderColor: getInputBorderColor(passwordMatch)
                }}
              />
            </div>

            {/* Reglas de validación de la contraseña */}
            <div className="p-3 border rounded">
              <h6>Requisitos de la contraseña</h6>
              <ul className="text-start">
                <li
                  className={`text-${
                    passwordValid.length ? "success" : "danger"
                  }`}
                >
                  Debe tener al menos 10 caracteres
                </li>
                <li
                  className={`text-${
                    passwordValid.upperCase ? "success" : "danger"
                  }`}
                >
                  Debe contener al menos una mayúscula
                </li>
                <li
                  className={`text-${
                    passwordValid.lowerCase ? "success" : "danger"
                  }`}
                >
                  Debe contener al menos una minúscula
                </li>
                <li
                  className={`text-${
                    passwordValid.number ? "success" : "danger"
                  }`}
                >
                  Debe contener al menos un número
                </li>
                <li
                  className={`text-${
                    passwordValid.symbol ? "success" : "danger"
                  }`}
                >
                  Debe contener al menos un símbolo
                </li>
                <li className={`text-${passwordMatch ? "success" : "danger"}`}>
                  La nueva contraseña debe coincidir con su confirmación
                </li>
              </ul>
            </div>

            <div className="text-center mt-3">
              <Button
                type="submit"
                variant="success"
                style={{
                  backgroundColor:
                    !passwordMatch ||
                    !Object.values(passwordValid).every(Boolean)
                      ? "gray"
                      : ""
                }}
                disabled={
                  !passwordMatch || !Object.values(passwordValid).every(Boolean)
                }
              >
                Actualizar Contraseña
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
      <Toaster richColors position="top-right" />{" "}
      {/* Add Toaster component for toast visibility */}
    </>
  );
}

ModalChangePassword.propTypes = {
  user: PropTypes.string.isRequired,
  oldPassword: PropTypes.string.isRequired,
  showSecondModal: PropTypes.bool.isRequired,
  closeSecondModal: PropTypes.func.isRequired
};

export default ModalChangePassword;
