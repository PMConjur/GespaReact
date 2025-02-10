import React from "react";

const BotonIngresar = ({ onClick }) => {
  return (
    <div className="text-center" class="d-grid gap-2">
      <button
        className="btn btn-primary"
        id="openSecondModal" // Esto es para identificar el botón y asociarlo al script
        onClick={onClick} // Llamamos la función onClick pasada como prop
        class="btn btn-primary"
      >
        Ingresar
      </button>
    </div>
  );
};

export default BotonIngresar;
