import React from "react";

const UsernameField = () => {
  return (
    <div className="col-12">
      <label
        htmlFor="yourUsername"
        className="form-label"
        style={{ color: "white" }}
      >
        Usuario (Ingresa letras mayúsculas)
      </label>
      <div className="input-group has-validation">
        <span className="input-group-text" id="inputGroupPrepend">
          <i className="bi bi-person-fill-lock"></i>
        </span>
        <input
          type="text"
          name="username"
          className="form-control"
          id="yourUsername"
          required
          pattern="[A-Z]{4}"
          title="Debe contener exactamente 4 letras mayúsculas"
          maxLength="4"
          onInput={(e) =>
            (e.target.value = e.target.value.replace(/[^A-Z]/g, ""))
          }
        />
        <div className="invalid-feedback">
          Ingresa exactamente 4 letras mayúsculas.
        </div>
      </div>
    </div>
  );
};

export default UsernameField;
