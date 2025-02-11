import React, { useEffect, useState } from "react";
import TextFielUser from "../../Components/LoginComponent/TextFielUser";
import TextFielPassword from "../../Components/LoginComponent/TextFielPassword";
import TextFieldPortfolio from "../../Components/LoginComponent/TextFieldPortfolio";
import EnterButton from "../../Components/LoginComponent/EnterButton";
import ModalPrincipal from "../../Components/LoginComponent/ModalPrincipal";
import ModalChangePassword from "../../Components/LoginComponent/ModalChangePassword";
import logo from "../../assets/img/logo22.png";
import { Modal } from "bootstrap";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // Importa Bootstrap JS

const LoginForm = () => {
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [showSecondModal, setShowSecondModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState({
    length: false,
    upperCase: false,
    lowerCase: false,
    number: false,
    symbol: false,
  });
  const [passwordMatch, setPasswordMatch] = useState(false);

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

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setNewPassword(value);
    setPasswordValid({
      length: value.length >= 10,
      upperCase: /[A-Z]/.test(value),
      lowerCase: /[a-z]/.test(value),
      number: /[0-9]/.test(value),
      symbol: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(value),
    });
  };

  const handleConfirmPasswordChange = (e) => {
    const { value } = e.target;
    setConfirmPassword(value);
    setPasswordMatch(value === newPassword);
  };

  const handleSubmitPasswordChange = (e) => {
    e.preventDefault();
    // Lógica para manejar el cambio de contraseña
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
                      newPassword={newPassword}
                      setNewPassword={setNewPassword}
                      confirmPassword={confirmPassword}
                      setConfirmPassword={setConfirmPassword}
                      handlePasswordChange={handlePasswordChange}
                      handleConfirmPasswordChange={handleConfirmPasswordChange}
                      passwordValid={passwordValid}
                      passwordMatch={passwordMatch}
                      handleSubmit={handleSubmitPasswordChange}
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
