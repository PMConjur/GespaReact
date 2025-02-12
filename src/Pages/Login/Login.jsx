import React, { useEffect, useState } from "react";
import TextFielUser from "../../Components/LoginComponent/TextFielUser";
import TextFielPassword from "../../Components/LoginComponent/TextFielPassword";
import TextFieldPortfolio from "../../Components/LoginComponent/TextFieldPortfolio";
import EnterButton from "../../Components/LoginComponent/EnterButton";
import ModalPrincipal from "../../Components/LoginComponent/ModalPrincipal";
import ModalChangePassword from "../../Components/LoginComponent/ModalChangePassword";
import logo from "../../assets/img/logo22.png";
import { Modal } from "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/js/bootstrap.min.js";


const LoginForm = () => {
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showSecondModal, setShowSecondModal] = useState(false);

  useEffect(() => {
    const modalElement = document.getElementById("firstModal");
    if (modalElement) {
      new Modal(modalElement); // Inicializa el modal correctamente
    }
  }, []);

  const handleInputChange = () => {
    const form = document.querySelector(".needs-validation");
    setIsFormValid(form.checkValidity());
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const modalElement = document.getElementById("firstModal");
    if (modalElement) {
      const modalInstance = new Modal(modalElement);
      modalInstance.show(); // Abre el modal correctamente
    }
  };

  const openSecondModal = () => {
    const firstModalElement = document.getElementById("firstModal");
    const firstModalInstance = Modal.getInstance(firstModalElement);
    firstModalInstance.hide(); // Cierra el primer modal
    setShowSecondModal(true); // Abre el segundo modal
  };

  const closeSecondModal = () => setShowSecondModal(false);

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
                      onChange={handleInputChange}
                      noValidate
                    >
                      <div className="col-12">
                        <TextFielUser
                          onChange={(e) => setUser(e.target.value)}
                        />
                      </div>
                      <div className="col-12">
                        <TextFielPassword
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      <div className="col-12">
                        <TextFieldPortfolio />
                      </div>
                      <div className="col-12">
                        <EnterButton disabled={!isFormValid} />
                      </div>
                      <div className="col-12">
                        <p className="small mb-0" style={{ color: "white" }}>
                          Aún no tienes cuenta.{" "}
                          <a href="pages-register.html">Solicita tu alta.</a>
                        </p>
                      </div>
                    </form>

                    {/* Modal incluido dentro del LoginForm */}
                    <ModalPrincipal
                      openSecondModal={openSecondModal}
                      password={password}
                      user={user}
                    />
                    <ModalChangePassword
                      showSecondModal={showSecondModal}
                      closeSecondModal={closeSecondModal}
                    />
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
