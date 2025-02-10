import React, { useState, useEffect } from "react";
import CampoUsuario from "../../components/LoginComponent/CampoUsuario";
import CampoContraseña from "../../components/LoginComponent/CampoContraseña";
import CampoCartera from "../../components/LoginComponent/CampoCartera";
import BotonIngresar from "../../components/LoginComponent/BotonIngresar";
import ModalCuenta from "../../components/LoginComponent/ModalCuenta";
import logo from "../../assets/img/logo22.png";
import { Modal } from "bootstrap";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Importa Bootstrap JS

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [bank, setBank] = useState("");

  useEffect(() => {
    const modalElement = document.getElementById("firstModal");
    if (modalElement) {
      new Modal(modalElement); // Inicializa el modal correctamente
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const modalElement = document.getElementById("firstModal");
    if (modalElement) {
      const modalInstance = new Modal(modalElement);
      modalInstance.show(); // Abre el modal correctamente
    }
  };

  return (
    <main>
      <div className="container">
        <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
                <div className="d-flex justify-content-center py-4">
                  <a className="logo d-flex align-items-center w-auto">
                    <img src={logo} alt="Logo" />
                    <span className="d-none d-lg-block">Gespa Web</span>
                  </a>
                </div>
                <div className="card mb-3">
                  <div className="card-body">
                    <div className="pt-4 pb-2">
                      <h5
                        className="card-title text-center pb-0 fs-4"
                        style={{ color: "white" }}
                      >
                        Inicio de Sesión CJ
                      </h5>
                    </div>
                    <form
                      className="row g-3 needs-validation"
                      onSubmit={handleSubmit}
                      noValidate
                    >
                      <div className="col-12">
                        <CampoUsuario value={username} setValue={setUsername} />
                      </div>
                      <div className="col-12">
                        <CampoContraseña
                          value={password}
                          setValue={setPassword}
                        />
                      </div>
                      <div className="col-12">
                        <CampoCartera value={bank} setValue={setBank} />
                      </div>
                      <div className="col-12">
                        <BotonIngresar />
                      </div>
                      <div className="col-12">
                        <p className="small mb-0" style={{ color: "white" }}>
                          Aún no tienes cuenta.{" "}
                          <a href="pages-register.html">Solicita tu alta.</a>
                        </p>
                      </div>
                    </form>

                    {/* Modal incluido dentro del LoginForm */}
                    <ModalCuenta />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default LoginForm;
