import React, { useState } from "react";
import TextFielUser from "../../Components/LoginComponent/TextFielUser";
import TextFielPassword from "../../Components/LoginComponent/TextFielPassword";
import TextFieldPortfolio from "../../Components/LoginComponent/TextFieldPortfolio";
import EnterButton from "../../Components/LoginComponent/EnterButton";
import ModalHandler from "../../Components/LoginComponent/ModalHandler";
import logo from "../../assets/img/logo22.png";
import { Modal } from "bootstrap"; // Importa Bootstrap Modal

const LoginForm = () => {
  const [password, setPassword] = useState("");
  const [user, setUser] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

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
                          value={user}
                          onChange={(e) => setUser(e.target.value)}
                        />
                      </div>
                      <div className="col-12">
                        <TextFielPassword
                          value={password}
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

                    {/* ModalHandler incluido dentro del LoginForm */}
                    <ModalHandler password={password} user={user} />
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
