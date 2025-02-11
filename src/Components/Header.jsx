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
    // Aquí puedes hacer algo con la búsqueda y la opción seleccionada
    console.log("Searching for:", e.target.query.value, "in category:", selectedOption);
  };

  return (
    <header id="header" className="header fixed-top d-flex align-items-center">
      <div className="d-flex align-items-center justify-content-between" style={{ gap: "1rem" }}>
      <i className="bi bi-list toggle-sidebar-btn" onClick={toggleSidebar}></i>
        <a href="/" className="logo d-flex align-items-center">
          <img src={Logo} alt="Logo" />
          <span className="d-none d-lg-block">Gespa</span>
        </a>  
      </div>
      
      <div className="search-bar">
        <form className="search-form d-flex align-items-center" onSubmit={handleSearch} style={{ gap: "1rem" }}>
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
            aria-label="Search category"
            style={{ border: "none" }}
          >
            <option value="all">Seleccionar Filtro</option>
            <option value="alerts">Nombre</option>
            <option value="users">ID</option>
            <option value="components">No. Empleado</option>
          </select>
          <button type="submit" title="Search" style={{ 
            backgroundColor: "#0d6efd",    
            marginLeft: "-14px",         
            color: "white", 
            border: "none", 
            justifyContent: "center",
            alignItems: "center",
            padding: "0 10px", 
            borderRadius: "5px",
          height: "38px",}}>
              <span className="d-none d-lg-block">Automatico</span>
          </button>
        </form>
      </div>

      <nav className="header-nav ms-auto">
        <ul className="d-flex align-items-center">
          <li className="nav-item d-block d-lg-none">
            <a className="nav-link nav-icon search-bar-toggle" href="/home">
              <i className="bi bi-search"></i>
            </a>
          </li>

          <li className="nav-item dropdown pe-3">
            <a className="nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown">
              <img src={User} alt="Usuario" className="rounded-circle" />
              <span className="d-none d-md-block dropdown-toggle ps-2">K. Anderson</span>
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

const Sidebar = ({ isSidebarOpen }) => {
  return (
    <aside id="sidebar" className={`sidebar ${isSidebarOpen ? "" : "collapsed"}`}>
      <ul className="sidebar-nav" id="sidebar-nav">
        <li className="nav-item">
          <a className="nav-link" href="/">
            <i className="bi bi-grid"></i>
            <span>Inicio</span>
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/">
            <i className="bi bi-grid"></i>
            <span>Informacion</span>
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/">
            <i className="bi bi-grid"></i>
            <span>Acciones</span>
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/">
            <i className="bi bi-grid"></i>
            <span>Ejecutivo</span>
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/">
            <i className="bi bi-grid"></i>
            <span>Cuenta</span>
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link" href="/">
            <i className="bi bi-grid"></i>
            <span>Mas</span>
          </a>
        </li>
        <li className="nav-item">
          <a className="nav-link collapsed" data-bs-target="#components-nav" data-bs-toggle="collapse" href="#">
            <i className="bi bi-menu-button-wide"></i>
            <span>Pages</span>
            <i className="bi bi-chevron-down ms-auto"></i>
          </a>
          <ul id="components-nav" className="nav-content collapse" data-bs-parent="#sidebar-nav">
            <li>
              <a href="/components-alerts">
                <i className="bi bi-circle"></i>
                <span>Perfil</span>
              </a>
            </li>
            <li>
              <a href="/components-alerts">
                <i className="bi bi-circle"></i>
                <span>FAQ</span>
              </a> 
            </li>
            <li>
              <a href="/components-alerts">
                <i className="bi bi-circle"></i>
                <span>Contact</span>
              </a> 
            </li>
            <li>
              <a href="/components-alerts">
                <i className="bi bi-circle"></i>
                <span>Register</span>
              </a> 
            </li>
            <li>
              <a href="/components-alerts">
                <i className="bi bi-circle"></i>
                <span>Login</span>
              </a> 
            </li>
            <li>
              <a href="/components-alerts">
                <i className="bi bi-circle"></i>
                <span>Error 404</span>
              </a> 
            </li>
          </ul>
        </li>
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
