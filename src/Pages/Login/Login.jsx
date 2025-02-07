import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [displayPassword, setDisplayPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Por favor, completa los campos.");
      return;
    }

    // Mostrar la contraseña real durante 250ms solo en el input
    setDisplayPassword(password);

    setTimeout(() => {
      setDisplayPassword("•".repeat(password.length)); // Ocultar con "•" después de 250ms
    }, 250);

    // Redirigir después de la breve visualización de la contraseña
    navigate("/home");
  };

  return (
    <div>
      <header></header>
      <div classNameName="container">
        <section className="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">
                <div className="d-flex justify-content-center py-4">
                  <h2 className="logo d-flex align-items-center w-auto">
                    <img src="{assets/img/logo-login.png}" alt="" />
                    <span className="d-none d-lg-block">Gespa Web</span>
                  </h2>
                </div>

                <div className="card mb-3 border border-0">
                  <div className="card-body">
                    <div className="pt-4 pb-2">
                      <h5 className="card-title text-center pb-0 fs-4">
                        Inicio de Sesión CJ
                      </h5>
                      <p className="text-center small">
                        Ingresa tu usuario de 4 dígitos y tu contraseña
                      </p>
                    </div>

                    <form
                      className="row g-3 needs-validation"
                      noValidate
                      onSubmit={handleSubmit}
                    >
                      <div className="col-12">
                        <label for="yourUsername" className="form-label">
                          Usuario (Ingresa letras mayúsculas)
                        </label>
                        <div className="input-group has-validation">
                          <span
                            className="input-group-text"
                            id="inputGroupPrepend"
                          >
                            <i className="bi bi-person-fill-lock"></i>
                          </span>
                          <input
                            type="text"
                            name="username"
                            className="form-control"
                            id="yourUsername"
                            required
                            pattern="[A-Z]{4}"
                            title="Debe contener exactamente 4 letras mayúsculas"
                            maxLength="4"
                            //onInput="this.value = this.value.replace(/[^A-Z]/g, '')"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                          />
                          <div className="invalid-feedback">
                            Ingresa exactamente 4 letras mayúsculas.
                          </div>
                        </div>
                      </div>

                      <div className="col-12">
                        <label for="yourPassword" className="form-label">
                          Contraseña
                        </label>
                        <div className="input-group">
                          <span
                            className="input-group-text"
                            id="inputGroupPrepend"
                          >
                            <i className="bi bi-key-fill"></i>
                          </span>
                          <input
                            type="password"
                            name="password"
                            className="form-control"
                            id="yourPassword"
                            required
                            value={displayPassword}
                            onChange={(e) => {
                              setPassword(e.target.value);
                              setDisplayPassword(e.target.value); // Muestra la contraseña real temporalmente
                              setTimeout(() => {
                                setDisplayPassword(
                                  "•".repeat(e.target.value.length)
                                ); // Ocultar con "•"
                              }, 250);
                            }}
                          />
                        </div>
                        <div className="invalid-feedback">
                          Ingresa la contraseña!
                        </div>
                      </div>

                      <div className="col-12">
                        <label for="bankDropdown" className="form-label">
                          Cartera
                        </label>
                        <select
                          name="bank"
                          id="bankDropdown"
                          className="form-control"
                          required
                        >
                          <option value="">Selecciona una cartera...</option>
                        </select>
                        <div className="invalid-feedback">
                          Por favor, selecciona una cartera.
                        </div>
                      </div>

                      <div className="col-12">
                        <button
                          className="btn btn-primary w-100"
                          type="submit"
                          id="loginButton"
                        >
                          Ingresar
                        </button>
                      </div>
                      <div className="col-12">
                        <p className="small mb-0">
                          Aun no tienes cuenta.
                          <a href="pages-register.html">Solicita tu alta.</a>
                        </p>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <footer>Gespa web 2025.</footer>
    </div>
  );
};

export default Login;
