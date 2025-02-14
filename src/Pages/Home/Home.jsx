import { useNavigate } from "react-router-dom";
import Layout from "../../Components/Header";
import Home1 from "../../assets/img/not-found.svg";
import Maintenance from "../../assets/img/maintenance.png";
import { useEffect, useState } from "react";

const Home = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const session = localStorage.getItem("session");
    const expires = localStorage.getItem("expires");
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const message = localStorage.getItem("message");

    if (message) {
      console.log("Message:", message);
    } else {
      setUserData({ session, expires, token, user });
    }
  }, []);

  const handleLogout = () => {
    // Lógica para cerrar sesión (limpiar estado, etc.)
    localStorage.clear();
    navigate("/"); // Redirige al login
  };

  return (
    <div>
      <Layout />
      <main id="main" className="main">
        <div className="jumbotron">
          <div className="row">
            <div className="mb-12">
              <div className="row g-0">
                <div className="col-sm-4">
                  <img
                    src={Home1}
                    className="img-fluid rounded-start"
                    alt="..."
                  />
                </div>
                <div className="col-sm-8">
                  <div className="p-4 my-xxl-4">
                    <br />
                    <span className="pagetitlehome-max-size">
                      <i className="bi bi-house-door-fill"></i> Bienvenido a
                      Gespa web
                    </span>
                    <br />

                    <span className="pagetitlehome-max">
                      Gestionando con pasión
                    </span>
                    <br />
                    <p>
                      - El éxito es la suma de pequeños esfuerzos repetidos día
                      tras día.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="pagetitle col-lg-12">
            <div className="card mb-12">
              <div className="row g-0">
                <div className="col-md-6">
                  <div className="card-body" style={{ height: "100%" }}>
                    <br />
                    <span className="pagetitle-max-size">
                      <i className="bi bi-exclamation-triangle"></i> Oops!
                    </span>
                    <br />
                    <span className="pagetitle-max">
                      <i className="bi bi-plug"></i> Pagina en mantenimiento
                    </span>
                    <p className="card-text">
                      Actualmente estamos realizando mejoras a nuestro portal,
                      disculpe las molestias.
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <img
                    src={Maintenance}
                    className="img-fluid rounded-start"
                    alt="..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pagetitle"></div>

        <section className="section dashboard"></section>
      </main>
    </div>
  );
};

export default Home;
