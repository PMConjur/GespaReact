import { useState } from "react";
import {
  Button,
  Form,
  Card,
  Container,
  InputGroup,
  Row,
  Col,
  Image
} from "react-bootstrap";
import { toast, Toaster } from "sonner"; // Import the toast and Toaster components
import axios from "axios"; // Import axios for API calls
import { PersonFillLock, KeyFill } from "react-bootstrap-icons";
import "../index.css";
import ModalChange from "../components/ModalChange"; // Import ModalChange component
import ModalChangePassword from "../components/ModalChangePassword"; // Import ModalChangePassword component
import logo from "../assets/img/logo-login.png";

function Login() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [showModal, setShowModal] = useState(false); // State to control ModalChange visibility
  const [showPasswordModal, setShowPasswordModal] = useState(false); // State to control ModalChangePassword visibility
  const [days, setDays] = useState(""); // State to store days value
  const [expire, setExpire] = useState(null);
  const [responseData, setResponseData] = useState(""); // State to store response data

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Error 400: Ingresa las credenciales"); // Show toast alert for empty user field
      return;
    }
    if (!password) {
      toast.error("Error 401: Ingresa una contraseña valida"); // Show toast alert for empty password field
      return;
    }

    const login = {
      usuario: user,
      contrasenia: password,
      extension: 1870,
      bloqueo: 0,
      dominio: "DES-SYS-347",
      computadora: "DES-SYS-347",
      usuarioWindows: "omar.otiz",
      ip: "192.168.5.236",
      aplicacion: "Gespa",
      version: "3.3.0"
    };

    try {
      const response = await axios.post(
        "http://192.168.7.33/api/login/iniciar-sesion",
        login
      );
      console.log("API Response:", response.data);

      if (response.data.ejecutivo.mensaje != null) {
        if (response.data.ejecutivo.expiro != false) {
          setExpire(response.data.ejecutivo.expiro == true ? true : false);
          setShowModal(true); // Show the modal
        } else {
          toast.error("Error 404: Error al iniciar sesion:", {
            description: response.data.ejecutivo.mensaje
          }); // Show toast alert with the error message from the API
        }
      } else {
        setDays(response.data.ejecutivo.infoEjecutivo.dias);
        setExpire(response.data.ejecutivo.expiro == true ? true : false);
        setShowModal(true); // Show the modal

        // Store the response data
        setResponseData(response.data);

        localStorage.setItem("responseData", JSON.stringify(response.data)); // Save response data to localStorage
      }
    } catch (error) {
      console.error("There was a problem with the axios operation:", error);
      toast.error("Error 408: El servidor tardó demasiado en responder.");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowPasswordModal = () => {
    setShowModal(false); // Close the current modal
    setShowPasswordModal(true); // Show the password change modal
  };

  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
  };

  return (
    <>
       <div style={{ backgroundColor: "#000000", minHeight: "100vh" }}></div>
      <Form onSubmit={handleSubmit}>
        <Container className="position-absolute top-50 start-50 translate-middle ">
          <Row className="justify-content-center">
            <Col xxl={4} xl={8} md={6}>
              <div className="">
                <h1 className="text-white">
                  <Image src={logo} rounded className="img-logo" />
                  Gespa Web
                </h1>
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
              </div>
            </Col>
          </Row>
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
          onShowPasswordModal={handleShowPasswordModal} // Pass the function to show the password modal
          responseData={responseData} // Pass the response data
        />
      )}{" "}
      {/* Render ModalChange */}
      {showPasswordModal && (
        <ModalChangePassword
          showSecondModal={showPasswordModal}
          closeSecondModal={handleClosePasswordModal}
          user={user}
          password={password}
        />
      )}{" "}
      {/* Render ModalChangePassword */}
    </>
  );
}

export default Login;
