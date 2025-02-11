// TextFielUser.jsx
import React, { useState } from "react";

const TextFielUser = () => {
  // Estado para el valor del campo y la validación
  const [usuario, setUsuario] = useState("");
  const [esValido, setEsValido] = useState(null);

  // Función de validación
  const validateUsername = (value) => {
    const regex = /^[A-Z]{4}$/; // Expresión regular para exactamente 4 letras mayúsculas
    return regex.test(value);
  };

  // Manejador de cambios en el input
  const handleInputChange = (e) => {
    const value = e.target.value.replace(/[^A-Z]/g, ""); // Reemplazar cualquier valor no mayúscula
    setUsuario(value);

    if (validateUsername(value)) {
      setEsValido(true);
    } else {
      setEsValido(false);
    }
  };

  return (
    <div className="col-12">
      <label
        htmlFor="yourUsername"
        className="form-label"
        style={{ color: "white" }}
      >
        Usuario
      </label>
      <div className="input-group has-validation">
        <span className="input-group-text" id="inputGroupPrepend">
          <i className="bi bi-person-fill-lock"></i>
        </span>
        <input
          type="text"
          name="username"
          className={`form-control ${
            esValido === false
              ? "is-invalid"
              : esValido === true
              ? "is-valid"
              : ""
          }`}
          id="yourUsername"
          value={usuario}
          onChange={handleInputChange}
          required
          maxLength="4"
        />
        <div
          id="usernameFeedback"
          className="invalid-feedback"
          style={{ display: esValido === false ? "block" : "none" }}
        >
          Ingresa letras mayúsculas (exactamente 4 caracteres)
        </div>
        <div
          id="validUsernameFeedback"
          className="valid-feedback"
          style={{ display: esValido === true ? "block" : "none" }}
        >
          Usuario válido.
        </div>
      </div>
    </div>
  );
};

export default TextFielUser;
