import "../../assets/vendor/bootstrap/css/bootstrap.min.css";
import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ModalPrincipal = ({ openSecondModal, user, password }) => {
  const navigate = useNavigate();

  const handleNoClick = async () => {
    const login = {
      usuario: user,
      contrasenia: password,
      extension: 0,
      bloqueo: 0,
      dominio: "SIS-DES-2021",
      computadora: "SIS-DES-2021.gespaWeb.cj",
      usuarioWindows: "gespa.web",
      ip: "192.168.7.1",
      aplicacion: "GespaWeb",
      version: "1.0.0",
    };

    try {
      const response = await axios.post(
        "http://192.168.7.33/api/Login/iniciar-sesion",
        login
      );
      const userData = response.data.user;

      if (userData.message) {
        console.log("Message:", userData.message);
        localStorage.setItem("message", userData.message);
      } else {
        const { message, session, expires, token, UserInfo } = userData;
        localStorage.setItem("session", session);
        localStorage.setItem("expires", expires);
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(UserInfo));
      }

      navigate("/home");
    } catch (error) {
      console.log("error no hay permisos", error);
    }
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
