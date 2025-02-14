import React from "react";
import Logo from "../../Components/RegistrationRequestComponent/Logo";
import FirstNameField from "../../Components/RegistrationRequestComponent/FirstNameField";
import LastNameField from "../../Components/RegistrationRequestComponent/LastNameField";
import UsernameField from "../../Components/RegistrationRequestComponent/UsernameField";
import TextAreaField from "../../Components/RegistrationRequestComponent/TextAreaField";
import SubmitButton from "../../Components/RegistrationRequestComponent/SubmitButton";

const RegistrationRequest = () => {
  return (
    <div className="container">
      <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
              <Logo />
              <div className="card mb-3">
                <div className="card-body">
                  <div>
                    <h5
                      className="card-title text-center pb-0 fs-4"
                      style={{ color: "white" }}
                    >
                      <i className="bi bi-person-plus-fill"></i> Solicita alta
                    </h5>
                    <p className="text-center small" style={{ color: "white" }}>
                      Ingrese datos del usuario
                    </p>
                  </div>
                  <form className="row g-1 needs-validation" noValidate>
                    <FirstNameField />
                    <LastNameField />
                    <UsernameField />
                    <TextAreaField />
                    <hr />
                    <SubmitButton />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RegistrationRequest;
