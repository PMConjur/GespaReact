import React from "react";

const FirstNameField = () => {
  return (
    <div className="col-12">
      <label
        htmlFor="yourName"
        className="form-label"
        style={{ color: "white" }}
      >
        Nombre
      </label>
      <div className="input-group has-validation">
        <span className="input-group-text" id="inputGroupPrepend">
          <i className="bi bi-person-fill-add"></i>
        </span>
        <input
          type="text"
          name="name"
          className="form-control"
          id="yourName"
          required
        />
        <div className="invalid-feedback">Ingresa un nombre valido.</div>
      </div>
    </div>
  );
};

export default FirstNameField;
