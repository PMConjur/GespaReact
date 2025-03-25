import Maintenance from "../assets/img/maintenance.png";
import Home1 from "../assets/img/CallCenter.svg"; // Asegúrate de que la imagen está correctamente importada

import NavbarComponent from "../components/NavbarComponent";
import Productivity from "../components/Productivity";

import ProductivityModal from "../components/ProductivityModal";
import { CheckCircleFill } from "react-bootstrap-icons";
const Home = () => {
  return (
    <>
      <NavbarComponent></NavbarComponent>

      <main id="main" data-bs-theme="dark" style={{}}>
        <div className="jumbotron" style={{ marginTop: "60px" }}>
          <div className="row">
            <div
              className="col-md-4"
              style={{
                backgroundColor: "black",
                color: "white",
                height: "65vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              {/* Imagen CallCenter.svg */}
              <img
                src={Home1}
                alt="Call Center"
                style={{
                  maxWidth: "80%",
                  height: "auto",
                  marginBottom: "20px"
                }}
              />

              <h1
                className="pagetitlehome-max-size"
                style={{ fontFamily: "Poppins" }}
              >
                Bienvenido a Gespa
              </h1>
              <span
                className="pagetitlehome-max"
                style={{ fontSize: "1.2rem", fontFamily: "Poppins" }}
              >
                Gestionando Con Pasión
              </span>
            </div>

            <div
              className="col-md-8"
              style={{
                backgroundColor: "black",
                color: "black",
                height: "75vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <div className="card-body" style={{ textAlign: "center" }}>
                <span
                  className="pagetitle-max-size"
                  style={{
                    color: "White",
                    fontSize: "50px",
                    textAlign: "center",
                    display: "block", // Asegura que el span ocupe todo el ancho
                    fontFamily: "Poppins"
                  }}
                >
                  <CheckCircleFill /> Tus metas del mes son.
                </span>
                <br />
                <span className="pagetitle-max">
                  <i className="bi bi-plug"></i> Página en mantenimiento
                </span>
                <p className="card-text">
                  Actualmente estamos realizando mejoras a nuestro portal,
                  disculpe las molestias.
                </p>
                <Productivity />{" "}
                {/* Se ha agregado el componente Productivity */}
                {/* Colocando el texto en la parte inferior */}
                <span style={{ marginTop: "auto" }}>
                  <h5 style={{ textAlign: "center", color: "white" }}>
                    El éxito es la suma de pequeños esfuerzos repetidos día tras
                    día.
                  </h5>
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: "#212529",
          color: "white",
          padding: "10px",
          textAlign: "center",
          marginTop: "auto"
        }}
      >
        <p>&copy; {new Date().getFullYear()} Derechos reservados - Gespa Web</p>
      </footer>
    </>
  );
};

export default Home;
