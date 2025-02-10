import React, { useState } from "react";

const ModalCambioContraseña = ({
  showSecondModal,
  closeSecondModal,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  handlePasswordChange,
  handleConfirmPasswordChange,
  passwordValid,
  passwordMatch,
  handleSubmit,
}) => {
  if (!showSecondModal) return null; // No se renderiza si no está visible

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
        <div className="modal-content p-4">
          <div className="modal-header">
            <h5 className="modal-title">Modificar Contraseña</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Cerrar"
              onClick={closeSecondModal}
            ></button>
          </div>
          <div className="modal-body">
            <form id="password-form" onSubmit={handleSubmit}>
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
                  required
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
                  required
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
                </ul>
              </div>

              <div className="text-center mt-3">
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={
                    !passwordMatch ||
                    !Object.values(passwordValid).every(Boolean)
                  }
                >
                  Actualizar Contraseña
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalCambioContraseña;
