import React from "react";

const LastNameField = () => {
  return (
    <div className="col-12">
      <label
        htmlFor="yourSurname"
        className="form-label"
        style={{ color: "white" }}
      >
        Apellido
      </label>
      <div className="input-group has-validation">
        <span className="input-group-text" id="inputGroupPrepend">
          <i className="bi bi-person-plus-fill"></i>
        </span>
        <input
          type="text"
          name="surname"
          className="form-control"
          id="yourSurname"
          required
        />
        <div className="invalid-feedback">Ingresa un Apellido valido.</div>
      </div>
    </div>
  );
};

export default LastNameField;
