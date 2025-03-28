import { Toast, Button } from "react-bootstrap";
import { Copy, Headset } from "react-bootstrap-icons";

const CustomToast = ({ show, onClose, numeroTelefonico, copyToClipboard }) => {
  const handleClose = () => {
    onClose(false); // Cierra el toast
    // No necesitamos hacer nada más aquí, la lógica estará en Managment
  };

  return (
    <Toast
      show={show}
      onClose={handleClose}
      delay={Infinity}
      autohide={false}
      style={{
        position: "fixed",
        top: "60px",
        right: "20px",
        minWidth: "300px",
        zIndex: '1000',
        color: 'black',
        backgroundColor: 'white'
      }}>
      <Toast.Header closeButton>
        <strong className="me-auto">Numero de Telefono</strong>
      </Toast.Header>
      <Toast.Body className="">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: 'space-between'
          }}>
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
            }}>
            <Copy/>
          </Button>
        </div>
      </Toast.Body>
    </Toast>
  );
};

export default CustomToast;