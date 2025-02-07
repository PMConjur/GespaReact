import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Lógica para cerrar sesión (limpiar estado, etc.)
    navigate("/"); // Redirige al login
  };

  return (
    <div>
      <main id="main" class="main">
        <div class="jumbotron">
          <div class="row">
            <div class="mb-12">
              <div class="row g-0">
                <div class="col-sm-4">
                  <img
                    src="../assets/img/home1.png"
                    class="img-fluid rounded-start"
                    alt="..."
                  />
                </div>
                <div class="col-sm-8">
                  <div class="p-4 my-xxl-4">
                    <br />
                    <span class="pagetitlehome-max-size">
                      <i class="bi bi-house-door-fill"></i> Bienvenido a Gespa
                      web
                    </span>
                    <br />

                    <span class="pagetitlehome-max">
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
        <div class="row">
          <div class="pagetitle col-lg-12">
            <div class="card mb-12">
              <div class="row g-0">
                <div class="col-md-6">
                  <div class="card-body">
                    <br />
                    <span class="pagetitle-max-size">
                      <i class="bi bi-exclamation-triangle"></i> Oops!
                    </span>
                    <br />
                    <span class="pagetitle-max">
                      <i class="bi bi-plug"></i> Pagina en mantenimiento
                    </span>
                    <p class="card-text">
                      Actualmente estamos realizando mejoras a nuestro portal,
                      disculpe las molestias.
                    </p>
                  </div>
                </div>
                <div class="col-md-6">
                  <img
                    src="assets/img/maintenance.png"
                    class="img-fluid rounded-start"
                    alt="..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="pagetitle"></div>

        <section class="section dashboard"></section>
      </main>
    </div>
  );
};

export default Home;
