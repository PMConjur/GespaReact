import "../../assets/vendor/bootstrap/css/bootstrap.min.css";
import React from "react";

const ModalCuenta = ({ openSecondModal }) => {
  return (
    <div
      className="modal fade"
      id="firstModal"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="modal-dialog" role="document">
        <div className="card-body modal-content text-center">
          <h5 className="card-title">Gestor de Cuenta</h5>
          <p>Su contraseña expira en 30 días</p>
          <p>¿Deseas cambiar ahora?</p>
          <div className="d-flex justify-content-center gap-3 mt-3">
            <button
              type="button"
              className="btn btn-success px-4"
              data-bs-dismiss="modal"
            >
              No
            </button>
            <button
              type="button"
              className="btn btn-danger px-4"
              onClick={openSecondModal}
            >
              Sí
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalCuenta;
