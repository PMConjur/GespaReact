import React from "react";

const BotonIngresar = ({ disabled }) => {
  return (
    <div className="col-12">
      <button
        className={`btn w-100 ${disabled ? "btn-secondary" : "btn-primary"}`}
        type="submit"
        disabled={disabled}
      >
        Ingresar
      </button>
    </div>
  );
};

export default BotonIngresar;
