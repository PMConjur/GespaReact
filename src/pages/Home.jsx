import Navbar from "../components/Navbar";
import Maintenance from "../assets/img/maintenance.png";
import Home1 from "../assets/img/user.svg";
import { Calculator, Calendar } from "./Widgets";

const Home = () => {
  return (
    <>
      <Navbar />
      <main id="main" data-bs-theme="dark">
        <div className="jumbotron" style={{ marginTop: "60px" }}>
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
                    <span
                      className="pagetitlehome-max-size "
                      style={{ color: "white" }}
                    >
                      Bienvenido a Gespa web
                    </span>
                    <br />

                    <span
                      className="pagetitlehome-max"
                      style={{ color: "white" }}
                    >
                      Gestionando con pasión
                    </span>
                    <br />
                    <p style={{ color: "white" }}>
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

        <div className="row">
          <div className="card mb-12"></div>
          <Calculator />
        </div>
        <div className="row">
          <div className="card mb-12"></div>
          <Calendar />
        </div>

        <div className="pagetitle"></div>

        <section className="section dashboard"></section>
      </main>
    </>
  );
};

export default Home;
