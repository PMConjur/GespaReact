// TextFielPassword.jsx
import React, { useState } from "react";

const TextFielPassword = () => {
  // Estado para el valor del campo y la validación
  const [contraseña, setContraseña] = useState("");
  const [esValida, setEsValida] = useState(null);

  // Función de validación
  const validatePassword = (password) => {
    const hasUppercase = /[A-Z]/.test(password); // Verifica al menos una mayúscula
    const hasLowercase = /[a-z]/.test(password); // Verifica al menos una minúscula
    const hasDigit = /\d/.test(password); // Verifica al menos un número
    const hasSymbol = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password); // Verifica al menos un símbolo
    const isValidLength = password.length === 10;

    return (
      hasUppercase && hasLowercase && hasDigit && hasSymbol && isValidLength
    );
  };

  // Manejador de cambios en el input
  const handleInputChange = (e) => {
    let value = e.target.value;
    // Limitar a 10 caracteres
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    setContraseña(value);

    if (value.length === 0) {
      setEsValida(null); // Sin validación si está vacío
    } else if (validatePassword(value)) {
      setEsValida(true);
    } else {
      setEsValida(false);
    }
  };

  return (
    <div className="col-12">
      <label
        htmlFor="yourPassword"
        className="form-label"
        style={{ color: "white" }}
      >
        Contraseña
      </label>
      <div className="input-group">
        <span className="input-group-text" id="inputGroupPrepend">
          <i className="bi bi-key-fill"></i>
        </span>
        <input
          type="password"
          name="password"
          className={`form-control ${
            esValida === false
              ? "is-invalid"
              : esValida === true
              ? "is-valid"
              : ""
          }`}
          id="yourPassword"
          value={contraseña}
          onChange={handleInputChange}
          required
          maxLength="10"
        />
      </div>

      {/* Retroalimentación para la contraseña */}
      <div
        id="passwordFeedback"
        className="invalid-feedback mt-2"
        style={{ display: esValida === false ? "block" : "none" }}
      >
        La contraseña debe tener 10 caracteres, al menos una mayúscula, una
        minúscula, un número y un símbolo.
      </div>

      <div
        id="validPasswordFeedback"
        className="valid-feedback mt-2"
        style={{ display: esValida === true ? "block" : "none" }}
      >
        Contraseña válida.
      </div>

      {/* Retroalimentación general cuando no se ingresa la contraseña */}
      <div
        className="invalid-feedback"
        style={{ display: contraseña.length === 0 ? "block" : "none" }}
      >
        Ingresa la contraseña!
      </div>
    </div>
  );
};

export default TextFielPassword;
