import React from "react";

const TextAreaField = () => {
  return (
    <div className="col-12">
      <label
        htmlFor="yourComment"
        className="form-label"
        style={{ color: "white" }}
      >
        Comentario
      </label>
      <div className="input-group has-validation">
        <span className="input-group-text" id="inputGroupPrepend">
          <i className="bi bi-chat-left-text-fill"></i>
        </span>
        <textarea
          name="comment"
          className="form-control"
          id="yourComment"
          required
        ></textarea>
        <div className="invalid-feedback">Ingresa un comentario.</div>
      </div>
    </div>
  );
};

export default TextAreaField;
