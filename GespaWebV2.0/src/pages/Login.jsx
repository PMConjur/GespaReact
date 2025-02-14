import { useState } from "react";
import { Button, Form, Card, Container, InputGroup } from "react-bootstrap";
import { toast, Toaster } from "sonner"; // Import the toast and Toaster components
import axios from "axios"; // Import axios for API calls
import { PersonFillLock, KeyFill } from "react-bootstrap-icons";
import "../index.css";
import ModalChange from "../components/ModalChange"; // Import ModalChange component

function Login() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [days, setDays] = useState(null); // State to store days value
  const [expire, setExpire] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Ingresa un usuario valido"); // Show toast alert for empty user field
      return;
    }
    if (!password) {
      toast.error("Ingresa una contraseña valida"); // Show toast alert for empty password field
      return;
    }

    const login = {
      usuario: user,
      contrasenia: password,
      extension: 1870,
      bloqueo: 1,
      dominio: "DES-SIS-1870",
      computadora: "DES-SIS-1870",
      usuarioWindows: "Yoshua Rodriguez",
      ip: "192.168.7.1",
      aplicacion: "Gespa",
      version: "3.3.0"
    };

    try {
      const response = await axios.post(
        "http://192.168.7.33/api/login/iniciar-sesion",
        login
      );
      console.log("API Response:", response.data);

      if (response.data.ejecutivo.mensaje) {
        if (response.data.ejecutivo.expiro === true) {
          setExpire(response.data.ejecutivo.expiro);

          setShowModal(true); // Show the modal
        } else if (response.data.ejecutivo.expiro === false) {
          setExpire(response.data.ejecutivo.expiro);

          setShowModal(true); // Show the modal
        } else {
          toast.error("Error al iniciar sesion:", {
            description: response.data.ejecutivo.mensaje
          }); // Show toast alert with the error message from the API
        }
      } else {
        setDays(response.data.ejecutivo.infoEjecutivo.dias);

        setShowModal(true); // Show the modal
      }
    } catch (error) {
      console.error("There was a problem with the axios operation:", error);
      toast.error("Error en la conexión");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-white">Gespa Web</h1>
      <Form onSubmit={handleSubmit}>
        <Container>
          <Card
            className="p-4 text-white shadow-lg"
            style={{ backgroundColor: "#1c1f24" }}
          >
            <h3>Inicio sesión CJ</h3>

            <span className="bg-gray">
              Ingresa tu usuario de 4 dígitos y tu contraseña
            </span>

            <br />
            {/* Usuario */}
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Usuario</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <PersonFillLock></PersonFillLock>
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Teclea tu usuario"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
                />
              </InputGroup>
            </Form.Group>
            {/* Contraseña */}
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Contraseña</Form.Label>
              <InputGroup>
                <InputGroup.Text>
                  <KeyFill></KeyFill>
                </InputGroup.Text>
                <Form.Control
                  type="password"
                  placeholder="Teclea tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </InputGroup>
            </Form.Group>
            {/* Cartera */}
            <Form.Group className="mb-3">
              <Form.Label>Cartera</Form.Label>
              <Form.Select required>
                <option value="">Selecciona una cartera...</option>
                <option value="1">American Express</option>
              </Form.Select>
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Ingresar
            </Button>
          </Card>
        </Container>
      </Form>
      <Toaster richColors position="top-right" />{" "}
      {/* Add Toaster component for toast visibility */}
      {showModal && (
        <ModalChange
          user={user}
          password={password}
          days={days}
          expire={expire}
          onClose={handleCloseModal}
        />
      )}{" "}
      {/* Render ModalChange */}
    </div>
  );
}

export default Login;
