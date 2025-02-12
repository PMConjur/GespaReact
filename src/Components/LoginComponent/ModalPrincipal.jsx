import "../../assets/vendor/bootstrap/css/bootstrap.min.css";
import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ModalPrincipal = ({ openSecondModal, user, password }) => {
  const navigate = useNavigate();

  const handleNoClick = () => {
    const login = {
      user,
      password,
      extension: 0,
      bloqueo: 0,
      dominio: "SIS-DES-2021",
      computadora: "SIS-DES-2021.gespaWeb.cj",
      usuarioWindows: "gespa.web",
      ip: "192.168.7.1",
      aplicacion: "GespaWeb",
      version: "1.0.0",
    };
    navigate("/home");
    axios
      .post("http://192.168.7.33/api/Login/iniciar-sesion", login)
      .then((response) => {
        console.log("login exitoso");

        const userData = response.data;
        localStorage.setItem("ejecutivo,mensaje,sesion", userData.storedUser);
      })
      .catch((error) => console.log("error no hay permisos", error));
  };

  return (
    <div
      className="modal fade"
      id="firstModal"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="modal-dialog" role="document">
        <div
          className="card-body modal-content text-center"
          style={{ backgroundColor: "#1D1F20", color: "white" }}
        >
          <h5 className="card-title">Gestor de Cuenta</h5>
          <p>Su contraseña expira en 30 días</p>
          <p>¿Deseas cambiar ahora?</p>
          <div className="mb-3">
            <label htmlFor="modalUser" className="form-label">
              Usuario
            </label>
            <input
              type="text"
              className="form-control"
              id="modalUser"
              value={user}
              readOnly
            />
          </div>
          <div className="mb-3">
            <label htmlFor="modalPassword" className="form-label">
              Contraseña
            </label>
            <input
              type="text"
              className="form-control"
              id="modalPassword"
              value={password}
              readOnly
            />
          </div>
          <div className="d-flex justify-content-center gap-3 mt-3">
            <button
              type="button"
              className="btn btn-success px-4"
              data-bs-dismiss="modal"
              onClick={handleNoClick}
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

export default ModalPrincipal;
