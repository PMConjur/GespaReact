import React from "react";
import { Toast, Button } from "react-bootstrap";
import { Copy, Headset } from "react-bootstrap-icons";

const CustomToast = ({ show, onClose, numeroTelefonico, copyToClipboard}) => {
    
  return (
    <Toast
    show={show} // Controla la visibilidad del toast
    onClose={() => onClose(false)} // Cierra el toast
    delay={Infinity} // Duración infinita
    autohide={false} // No se oculta automáticamente
    style={{
      position: "fixed",
      top: "60px",
      right: "20px",
      minWidth: "300px",
      zIndex: '1000',
      color: 'black',
      backgroundColor: 'white'
    }}
  >
    <Toast.Header closeButton>
      <strong className="me-auto">Numero de Telefono</strong>
    </Toast.Header>
    <Toast.Body className="">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: 'space-between'
        }}
      >
        <Headset style={{fontSize: '28px'}}/> 
        <span style={{fontSize: '18px'}}>{numeroTelefonico}</span>
        <Button
          onClick={copyToClipboard}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            padding: "5px 10px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          <Copy/>
        </Button>
      </div>
    </Toast.Body>
  </Toast>
  );
};

export default CustomToast;