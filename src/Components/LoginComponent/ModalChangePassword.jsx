import React, { useState } from "react";

const ModalChangePassword = ({
  showSecondModal,
  closeSecondModal,
  user,
  password,
}) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState({
    length: false,
    upperCase: false,
    lowerCase: false,
    number: false,
    symbol: false,
    differentFromCurrent: false,
  });
  const [passwordMatch, setPasswordMatch] = useState(false);

  if (!showSecondModal) return null; // No se renderiza si no está visible

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setNewPassword(value);
    setPasswordValid({
      length: value.length >= 10,
      upperCase: /[A-Z]/.test(value),
      lowerCase: /[a-z]/.test(value),
      number: /[0-9]/.test(value),
      symbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(value),
      differentFromCurrent: value !== password,
    });
  };

  const handleConfirmPasswordChange = (e) => {
    const { value } = e.target;
    setConfirmPassword(value);
    setPasswordMatch(value === newPassword);
  };

  const handleSubmitPasswordChange = (e) => {
    e.preventDefault();
    alert("La contraseña se actualizó correctamente.");
  };

  const getInputBorderColor = (isValid) => {
    return isValid ? "green" : "red";
  };

  return (
    <div
      className="modal fade show"
      id="chance-password"
      tabIndex="-1"
      role="dialog"
      style={{ display: "block" }}
      aria-hidden="false"
    >
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        role="document"
      >
        <div
          className="modal-content p-4"
          style={{ backgroundColor: "#1D1F20", color: "white" }}
        >
          <div className="modal-header">
            <h5 className="modal-title">Modificar Contraseña</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Cerrar"
              onClick={closeSecondModal}
              style={{ filter: "invert(1)" }}
            ></button>
          </div>
          <div className="modal-body">
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
                        passwordValid.symbol &&
                        passwordValid.differentFromCurrent
                    ),
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
                    borderColor: getInputBorderColor(passwordMatch),
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
                  <li
                    className={`text-${
                      passwordValid.differentFromCurrent ? "success" : "danger"
                    }`}
                  >
                    La nueva contraseña debe ser diferente de la actual
                  </li>
                  <li
                    className={`text-${passwordMatch ? "success" : "danger"}`}
                  >
                    La nueva contraseña debe coincidir con su confirmación
                  </li>
                </ul>
              </div>

              <div className="text-center mt-3">
                <button
                  type="submit"
                  className="btn btn-success"
                  style={{
                    backgroundColor:
                      !passwordMatch ||
                      !Object.values(passwordValid).every(Boolean)
                        ? "gray"
                        : "",
                  }}
                  disabled={
                    !passwordMatch ||
                    !Object.values(passwordValid).every(Boolean)
                  }
                >
                  Actualizar Contraseña
                </button>
                <p style={{ visibility: "hidden" }}>{password}</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalChangePassword;
