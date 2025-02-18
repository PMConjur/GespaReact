import React from "react";
import { useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";

const CerrarSesion = ({ setUser, setPassword }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Limpiar los datos de usuario
    setUser("");
    setPassword("");

    // Limpiar localStorage
    localStorage.removeItem("token");

    // Limpiar sessionStorage
    sessionStorage.clear();

    // Limpiar cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    // Limpiar caché del navegador
    if ("caches" in window) {
      caches.keys().then((names) => {
        names.forEach((name) => {
          caches.delete(name);
        });
      });
    }

    // Redirigir a la página de login con la URL completa
    window.location.replace("http://192.168.7.33:90/");
  };

  return (
    <Nav.Link as="button" onClick={handleLogout}>
      <h5>Cerrar Sesion</h5>
    </Nav.Link>
  );
};

export default CerrarSesion;
