import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/js/bootstrap.min.js";
import "./styles.css";
import Logo from "../assets/img/logo22.png";
import User from "../assets/img/user.svg";

const Header = ({ toggleSidebar }) => {
  const [selectedOption, setSelectedOption] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log(
      "Searching for:",
      e.target.query.value,
      "in category:",
      selectedOption
    );
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleSearchBar = (e) => {
    e.preventDefault();
    setIsSearchVisible((prev) => {
      console.log("Nuevo estado de búsqueda:", !prev);
      return !prev;
    });
  };
  
  return (
    <header id="header" className="header fixed-top d-flex align-items-center">
      <div
        className="d-flex align-items-center justify-content-between"
        style={{ gap: "1rem" }}
      >
        <i
          className="bi bi-list toggle-sidebar-btn"
          onClick={toggleSidebar}
        ></i>
        <a href="/home" className="logo d-flex align-items-center">
          <img src={Logo} alt="Logo" className="d-none d-md-block"/>
          <span className="d-none d-lg-block">Gespa</span>
        </a>
      </div>

      {/* Barra de búsqueda principal (solo visible en pantallas grandes) */}
      <div className=" d-none d-lg-block" style={{marginLeft: "30px"}}>
        <form
          className=" d-flex align-items-center"
          onSubmit={handleSearch}
          style={{ gap: "1rem",  width: "100%", marginLeft:"20px"}}
        >
          <input

            type="text"
            name="query"
            placeholder="Busqueda de cuenta"
            title="Enter search keyword"
            style={{padding: "5px"}}
          />
          <select
            name="filter"
            className="form-select"
            value={selectedOption}
            onChange={handleOptionChange}
            aria-label="Selecciona el filtro"
          >
            <option>Selecciona el filtro</option>
            <option>Cuenta</option>
            <option>Nombre</option>
            <option>RFC</option>
            <option>Numero de cliente</option>
            <option>Telefono</option>
            <option>Expediente</option>
          </select>
          <button
            type="submit"
            title="Search"
            style={{
              backgroundColor: "#0d6efd",
              marginLeft: "-10px",
              color: "white",
              border: "none",
              justifyContent: "center",
              alignItems: "center",
              padding: "0 10px",
              borderRadius: "5px",
              height: "38px",
              display: "flex",
              textAlign: "center",
              gap: "5px",
            }}
          >
            <i className="bi bi-arrow-repeat" style={{ color: "white" }}></i>
            <span className="d-none d-lg-block">Automatico</span>
          </button>
        </form>
      </div>

      <nav className="header-nav ms-auto">
        <ul
          className="d-flex align-items-center"
          style={{ marginRight: "40px" }}
        >
          {/* Ícono de búsqueda en pantallas pequeñas */}
          <li className="nav-item d-block d-lg-none">
            <button
              className="nav-link nav-icon search-bar-toggle btn btn-link p-0"
              onClick={toggleSearchBar}
            >
              <i className="bi bi-search" style={{color: "white"}}></i>
            </button>
          </li>

          {isSearchVisible && (
            <li
              className="nav-item w-100 d-block d-lg-none"
              style={{ marginBottom: "-100px", zIndex: "50", position: "fixed", margin: "start" }}
            >
              <div className=" p-2" style={{right: "0", left: "0"}}>
                <form
                  className="search-form d-flex align-items-center"
                  onSubmit={handleSearch}
                >
                  <input
                    type="text"
                    name="query"
                    placeholder="Busqueda de cuenta"
                    className="form-control me-2"
                    style={{margin: "5px"}}
                  />
                  <button
                    type="submit"
                    title="Search"
                    className="btn btn-primary"
                  >
                    <i className="bi bi-search"></i>
                  </button>
                </form>
              </div>
            </li>
          )}

          {/* Perfil del usuario */}
          <li className="nav-item dropdown pe-3">


           
            <a class="nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown">
            <img src={User} alt="Profile" class="rounded-circle"/>
            <span class=" dropdown-toggle ps-2">Cesar Enrique</span>
          </a>

            <ul
              className={`dropdown-menu dropdown-menu-end dropdown-menu-arrow profile ${
                isDropdownOpen ? "show" : ""
              }`}
            >
              <li className=" dropdown-header" style={{ padding: "10px" }}>
                <p>Cesar Enrique Rodriguez Alvarez</p>
                <i className="ri-id-card-fill"></i>
                <span>23389</span>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <a
                  className="dropdown-item d-flex align-items-center"
                  href="/ejemplo"
                >
                  <i className="ri-customer-service-2-line"></i>
                  <span>Ejecutivo Telefonico</span>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </header>
  );
};

const Sidebar = ({ isSidebarOpen }) => {
  const [isMenuOpen, setIsMenuOpen] = useState({
    components: false,
    forms: false,
    tables: false,
    charts: false,
    icons: false,
    pages: false,
  });

  const toggleMenu = (menu) => {
    setIsMenuOpen((prevState) => ({
      ...prevState,
      [menu]: !prevState[menu],
    }));
  };

  return (
    <aside
      id="sidebar"
      className={`sidebar ${isSidebarOpen ? "" : "collapsed"}`}
    >
      <ul className="sidebar-nav" id="sidebar-nav">
        <li className="nav-item">
          <a className="nav-link" href="/home">
            <i className="bi bi-house"></i>
            <span>Inicio</span>
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/ejemplo">
            <i className="bi bi-nut"></i>
            <span>Gestion</span>
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/">
            <i className="bi bi-box-arrow-right"></i>
            <span>Cerrar Sesion</span>
          </a>
        </li>

        <li className="nav-heading">Grupo Consorcio</li>
      </ul>
    </aside>
  );
};

const Layout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isSidebarOpen={isSidebarOpen} />
    </div>
  );
};

export default Layout;
