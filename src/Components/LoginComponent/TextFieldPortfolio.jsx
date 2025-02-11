// TextFieldPortfolio.jsx
import React, { useState } from "react";

const TextFieldPortfolio = () => {
  const [cartera, setCartera] = useState("");

  // Función para manejar el cambio de selección
  const handleSelectChange = (e) => {
    setCartera(e.target.value);
  };

  return (
    <div className="col-12">
      <label
        htmlFor="bankDropdown"
        className="form-label"
        style={{ color: "white" }}
      >
        Cartera
      </label>
      <select
        name="bank"
        id="bankDropdown"
        className={`form-control ${cartera === "" ? "is-invalid" : ""}`}
        value={cartera}
        onChange={handleSelectChange}
        required
      >
        <option value="">Selecciona una cartera...</option>
        <option value="012345">American Express</option>
        {/* Puedes añadir más opciones aquí */}
      </select>
      {/* Retroalimentación si no se selecciona una cartera */}
      <div
        className="invalid-feedback"
        style={{ display: cartera === "" ? "block" : "none" }}
      >
        Selecciona una cartera.
      </div>
    </div>
  );
};

export default TextFieldPortfolio;
