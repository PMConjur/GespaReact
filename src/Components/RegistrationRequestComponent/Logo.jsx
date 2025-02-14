import React from "react";
import logo from "../../assets/img/logo22.png";

const Logo = () => {
  return (
    <div className="d-flex justify-content-center py-4">
      <a href="/" className="logo d-flex align-items-center w-auto">
        <img src={logo} alt="Logo" />
        <span className="d-none d-lg-block" style={{ color: "white" }}>
          GespaWeb
        </span>
      </a>
    </div>
  );
};

export default Logo;
