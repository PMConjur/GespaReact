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
        <a href="/" className="logo d-flex align-items-center">
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
            aria-label="Search category"
            style={{ border: "none" }}
          >
            <option value="all">Seleccionar Filtro</option>
            <option value="alerts">Nombre</option>
            <option value="users">ID</option>
          </select>
          <button
            type="submit"
            title="Search"
            style={{
              backgroundColor: "#0d6efd",
              marginLeft: "-14px",
              color: "white",
              border: "none",
              justifyContent: "center",
              alignItems: "center",
              padding: "0 10px",
              borderRadius: "5px",
              height: "38px",
            }}
          >
            <span className="d-none d-lg-block">Automatico</span>
          </button>
        </form>
      </div>

      <nav className="header-nav ms-auto">
        <ul className="d-flex align-items-center" style={{marginRight: "40px"}}>
          <li className="nav-item d-block d-lg-none">
            <a className="nav-link nav-icon search-bar-toggle" href="/home">
              <i className="bi bi-search"></i>
            </a>
          </li>

          <li className="nav-item dropdown pe-3">
            <a
              className="nav-link nav-profile d-flex align-items-center pe-0"
              href="#"
              onClick={toggleDropdown}
            >
              <img
                src={User}
                alt="Profile"
                className="rounded-circle"
              ></img>
              <span className="d-none d-md-block dropdown-toggle ps-2">
                K. Anderson
              </span>
            </a>

            <ul className={`dropdown-menu dropdown-menu-end dropdown-menu-arrow profile ${isDropdownOpen ? "show" : ""}`}
                 style={{minWidth: "180px"}}>
              <li className="dropdown-header">
                <h6>Kevin Anderson</h6>
                <span>Web Designer</span>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>

              <li>
                <a
                  className="dropdown-item d-flex align-items-center"
                  href="/ejemplo"
                >
                  <i className="bi bi-person"></i>
                  <span>My Profile</span>
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>

              <li>
                <a
                  className="dropdown-item d-flex align-items-center"
                  href="users-profile.html"
                >
                  <i className="bi bi-gear"></i>
                  <span>Account Settings</span>
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>

              <li>
                <a
                  className="dropdown-item d-flex align-items-center"
                  href="pages-faq.html"
                >
                  <i className="bi bi-question-circle"></i>
                  <span>Need Help?</span>
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>

              <li>
                <a className="dropdown-item d-flex align-items-center" href="#">
                  <i className="bi bi-box-arrow-right"></i>
                  <span>Sign Out</span>
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
          <a className="nav-link" href="index.html">
            <i className="bi bi-buildings-fill"></i>
            <span>Inicio</span>
          </a>
        </li>
        {/* End Dashboard Nav */}

        <li className="nav-item">
          <a
            className={`nav-link ${isMenuOpen.components ? "" : "collapsed"}`}
            onClick={() => toggleMenu("components")}
            href="#"
          >
            <i className="bi bi-journal-text"></i><span>Información</span>
            <i className={`bi bi-chevron-${isMenuOpen.components ? "up" : "down"} ms-auto`}></i>
          </a>
          <ul
            id="components-nav"
            className={`nav-content collapse ${isMenuOpen.components ? "show" : ""}`}
          >
            <li>
              <a href="components-alerts.html">
                <i className="bi bi-circle"></i><span>Alerts</span>
              </a>
            </li>
            <li>
              <a href="components-accordion.html">
                <i className="bi bi-circle"></i><span>Accordion</span>
              </a>
            </li>
            <li>
              <a href="components-badges.html">
                <i className="bi bi-circle"></i><span>Badges</span>
              </a>
            </li>
            <li>
              <a href="components-breadcrumbs.html">
                <i className="bi bi-circle"></i><span>Breadcrumbs</span>
              </a>
            </li>
            <li>
              <a href="components-buttons.html">
                <i className="bi bi-circle"></i><span>Buttons</span>
              </a>
            </li>
            <li>
              <a href="components-cards.html">
                <i className="bi bi-circle"></i><span>Cards</span>
              </a>
            </li>
            <li>
              <a href="components-carousel.html">
                <i className="bi bi-circle"></i><span>Carousel</span>
              </a>
            </li>
            <li>
              <a href="components-list-group.html">
                <i className="bi bi-circle"></i><span>List group</span>
              </a>
            </li>
            <li>
              <a href="components-modal.html">
                <i className="bi bi-circle"></i><span>Modal</span>
              </a>
            </li>
            <li>
              <a href="components-tabs.html">
                <i className="bi bi-circle"></i><span>Tabs</span>
              </a>
            </li>
            <li>
              <a href="components-pagination.html">
                <i className="bi bi-circle"></i><span>Pagination</span>
              </a>
            </li>
            <li>
              <a href="components-progress.html">
                <i className="bi bi-circle"></i><span>Progress</span>
              </a>
            </li>
            <li>
              <a href="components-spinners.html">
                <i className="bi bi-circle"></i><span>Spinners</span>
              </a>
            </li>
            <li>
              <a href="components-tooltips.html">
                <i className="bi bi-circle"></i><span>Tooltips</span>
              </a>
            </li>
          </ul>
        </li>
        {/* End Components Nav */}

        <li className="nav-item">
          <a
            className={`nav-link ${isMenuOpen.forms ? "" : "collapsed"}`}
            onClick={() => toggleMenu("forms")}
            href="#"
          >
            <i className="bi bi-arrow-down-up"></i><span>Acciones</span>
            <i className={`bi bi-chevron-${isMenuOpen.forms ? "up" : "down"} ms-auto`}></i>
          </a>
          <ul
            id="forms-nav"
            className={`nav-content collapse ${isMenuOpen.forms ? "show" : ""}`}
          >
            <li>
              <a href="forms-elements.html">
                <i className="bi bi-circle"></i><span>Form Elements</span>
              </a>
            </li>
            <li>
              <a href="forms-layouts.html">
                <i className="bi bi-circle"></i><span>Form Layouts</span>
              </a>
            </li>
            <li>
              <a href="forms-editors.html">
                <i className="bi bi-circle"></i><span>Form Editors</span>
              </a>
            </li>
            <li>
              <a href="forms-validation.html">
                <i className="bi bi-circle"></i><span>Form Validation</span>
              </a>
            </li>
          </ul>
        </li>
        {/* End Forms Nav */}

        <li className="nav-item">
          <a
            className={`nav-link ${isMenuOpen.tables ? "" : "collapsed"}`}
            onClick={() => toggleMenu("tables")}
            href="#"
          >
            <i className="bi bi-person-lines-fill"></i><span>Ejecutivo</span>
            <i className={`bi bi-chevron-${isMenuOpen.tables ? "up" : "down"} ms-auto`}></i>
          </a>
          <ul
            id="tables-nav"
            className={`nav-content collapse ${isMenuOpen.tables ? "show" : ""}`}
          >
            <li>
              <a href="tables-general.html">
                <i className="bi bi-circle"></i><span>General Tables</span>
              </a>
            </li>
            <li>
              <a href="tables-data.html">
                <i className="bi bi-circle"></i><span>Data Tables</span>
              </a>
            </li>
          </ul>
        </li>
        {/* End Tables Nav */}

        <li className="nav-item">
          <a
            className={`nav-link ${isMenuOpen.charts ? "" : "collapsed"}`}
            onClick={() => toggleMenu("charts")}
            href="#"
          >
            <i className="bi bi-person-vcard"></i><span>Cuenta</span>
            <i className={`bi bi-chevron-${isMenuOpen.charts ? "up" : "down"} ms-auto`}></i>
          </a>
          <ul
            id="charts-nav"
            className={`nav-content collapse ${isMenuOpen.charts ? "show" : ""}`}
          >
            <li>
              <a href="charts-chartjs.html">
                <i className="bi bi-circle"></i><span>Chart.js</span>
              </a>
            </li>
            <li>
              <a href="charts-apexcharts.html">
                <i className="bi bi-circle"></i><span>ApexCharts</span>
              </a>
            </li>
            <li>
              <a href="charts-echarts.html">
                <i className="bi bi-circle"></i><span>ECharts</span>
              </a>
            </li>
          </ul>
        </li>
        {/* End Charts Nav */}

        <li className="nav-item">
          <a
            className={`nav-link ${isMenuOpen.icons ? "" : "collapsed"}`}
            onClick={() => toggleMenu("icons")}
            href="#"
          >
            <i className="bi bi-gem"></i><span>Icons</span>
            <i className={`bi bi-chevron-${isMenuOpen.icons ? "up" : "down"} ms-auto`}></i>
          </a>
          <ul
            id="icons-nav"
            className={`nav-content collapse ${isMenuOpen.icons ? "show" : ""}`}
          >
            <li>
              <a href="icons-bootstrap.html">
                <i className="bi bi-circle"></i><span>Bootstrap Icons</span>
              </a>
            </li>
            <li>
              <a href="icons-remix.html">
                <i className="bi bi-circle"></i><span>Remix Icons</span>
              </a>
            </li>
            <li>
              <a href="icons-boxicons.html">
                <i className="bi bi-circle"></i><span>Boxicons</span>
              </a>
            </li>
          </ul>
        </li>
        {/* End Icons Nav */}

        <li className="nav-item">
          <a
            className={`nav-link ${isMenuOpen.pages ? "" : "collapsed"}`}
            onClick={() => toggleMenu("pages")}
            href="#"
          >
            <i className="bi bi-menu-button-wide"></i>
            <span>Pages</span>
            <i className={`bi bi-chevron-${isMenuOpen.pages ? "up" : "down"} ms-auto`}></i>
          </a>
          <ul id="components-nav" className={`nav-content collapse ${isMenuOpen.pages ? "show" : ""}`}>
            <li>
              <a href="/perfil">
                <i className="bi bi-circle"></i>
                <span>Perfil</span>
              </a>
            </li>
            <li>
              <a href="/faq">
                <i className="bi bi-circle"></i>
                <span>FAQ</span>
              </a>
            </li>
            <li>
              <a href="/contact">
                <i className="bi bi-circle"></i>
                <span>Contact</span>
              </a>
            </li>
            <li>
              <a href="/register">
                <i className="bi bi-circle"></i>
                <span>Register</span>
              </a>
            </li>
            <li>
              <a href="/login">
                <i className="bi bi-circle"></i>
                <span>Login</span>
              </a>
            </li>
            <li>
              <a href="/error-404">
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