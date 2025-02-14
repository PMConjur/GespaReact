import React from "react";

const FormField = ({
  label,
  type,
  name,
  id,
  icon,
  required,
  pattern,
  title,
  maxLength,
  onInput,
}) => {
  return (
    <div className="col-12">
      <label htmlFor={id} className="form-label" style={{ color: "white" }}>
        {label}
      </label>
      <div className="input-group has-validation">
        <span className="input-group-text" id="inputGroupPrepend">
          <i className={icon}></i>
        </span>
        <input
          type={type}
          name={name}
          className="form-control"
          id={id}
          required={required}
          pattern={pattern}
          title={title}
          maxLength={maxLength}
          onInput={onInput}
        />
        <div className="invalid-feedback">{title}</div>
      </div>
    </div>
  );
};

export default FormField;
