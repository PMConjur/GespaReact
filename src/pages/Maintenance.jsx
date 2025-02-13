import React from "react";
import Navbar from "../components/Navbar";
import Maintenance from "../assets/img/maintenance.png";

const MaintenancePage = () => {
  return (
    <>
    <Navbar/>
    <main id="main"  data-bs-theme="dark">
        
        <div className="row" style={{marginTop: "60px"}}>
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
    </>
  );
};

export default MaintenancePage;
