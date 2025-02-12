import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
import Logo from "../assets/img/logo22.png";
import User from "../assets/img/user.svg";

const Header = ({ toggleSidebar }) => {
  const [selectedOption, setSelectedOption] = useState("all");

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

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
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
          <img src={Logo} alt="Logo" />
          <span className="d-none d-lg-block">Gespa</span>
        </a>
      </div>

      <div className="search-bar">
        <form
          className="search-form d-flex align-items-center"
          onSubmit={handleSearch}
          style={{ gap: "1rem" }}
        >
          <input
            type="text"
            name="query"
            placeholder="Busqueda de cuenta"
            title="Enter search keyword"
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
            <i class="bi bi-arrow-repeat" style={{color: "white"}}></i>
            <span className="d-none d-lg-block">Automatico</span>     
          </button>
        </form>
      </div>

      <nav className="header-nav ms-auto">
        <ul className="d-flex align-items-center" style={{marginRight: "40px"}}>
          <li className="nav-item d-block d-lg-none">
            <a className="nav-link nav-icon search-bar-toggle">
              <i className="bi bi-search"></i>
            </a>
          </li>

          <li className="nav-item dropdown pe-3">
            <a
              className="nav-link nav-profile d-flex align-items-center pe-0"
              
              onClick={toggleDropdown}
            >
              <img
                src={User}
                alt="Profile"
                className="rounded-circle"
              ></img>
              <span className="d-none d-md-block dropdown-toggle ps-2">Cesar Rodriguez</span>
            </a>

            <ul className={`dropdown-menu dropdown-menu-end dropdown-menu-arrow profile ${isDropdownOpen ? "show" : ""}`}
                 >
              
              <li className="dropdown-header" style={{padding: "10px"}}>
                <p>Cesar Enrique Rodriguez Alvarez</p>
                <i className="ri-id-card-fill"></i>
                <span >23389</span>
              </li>

              <li>
                <hr className="dropdown-divider"/>
              </li>
  
              <li>
                <a className="dropdown-item d-flex align-items-center" href="/ejemplo">
                  <i className="ri-customer-service-2-line"></i>
                  <span href="/ejemplo">Ejecutivo Telefonico</span>
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
    <aside id="sidebar" className={`sidebar ${isSidebarOpen ? "" : "collapsed"}`}>
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