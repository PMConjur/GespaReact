import Maintenance from "../assets/img/maintenance.png";
import Home1 from "../assets/img/CallCenter.svg"; // Asegúrate de que la imagen está correctamente importada

import NavbarComponent from "../components/NavbarComponent";

const Home = () => {
  return (
    <>
      <NavbarComponent></NavbarComponent>

      <main id="main" data-bs-theme="dark" style={{ minHeight: "100vh" }}>
        <div className="jumbotron" style={{ marginTop: "60px" }}>
          <div className="row">
            <div className="col-md-4" style={{ backgroundColor: "black", color: "white", height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              
              {/* Imagen CallCenter.svg */}
              <img src={Home1} alt="Call Center" style={{ maxWidth: "80%", height: "auto", marginBottom: "20px" }} />

              <span className="pagetitlehome-max-size" style={{ fontSize: "2rem" }}>
                Bienvenido a Gespa Web
              </span>
              <span className="pagetitlehome-max" style={{ fontSize: "1.5rem" }}>
                Gestionando Con Pasión
              </span>

              {/* Colocando el texto en la parte inferior */}
              <span style={{ marginTop: "auto" }}>
                <p style={{ textAlign: "left", color: "white" }}>
                  El éxito es la suma de pequeños esfuerzos repetidos día tras día.
                </p>
              </span>
            </div>

            <div className="col-md-8" style={{ backgroundColor: "white", color: "black", height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
              <div className="card-body" style={{ textAlign: "center" }}>
                <span className="pagetitle-max-size">
                  <i className="bi bi-exclamation-triangle"></i> Oops!
                </span>
                <br />
                <span className="pagetitle-max">
                  <i className="bi bi-plug"></i> Página en mantenimiento
                </span>
                <p className="card-text">
                  Actualmente estamos realizando mejoras a nuestro portal, disculpe las molestias.
                </p>
              </div>
            </div>
          </div>
        </div>

        <section className="section dashboard"></section>

      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: "#6c757d", 
        color: "white", 
        padding: "10px", 
        textAlign: "center",
        marginTop: "auto"
      }}>
        <p>&copy; {new Date().getFullYear()} Derechos reservados - Gespa Web</p>
      </footer>
    </>
  );
};

export default Home;
