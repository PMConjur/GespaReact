import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { toast, Toaster } from "sonner"; // Import the toast and Toaster components
import axios from "axios"; // Import axios for API calls
import { useNavigate } from "react-router-dom";

function Login() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const f = new Date();

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

      if (response.data.mensaje) {
        toast.error(response.data.mensaje); // Show toast alert with the error message from the API
      } else {
        toast.success(
          "Inicio de sesión correcto",
          {
            description: f.toLocaleDateString()
          },
          navigate("/home")
        );
      }
    } catch (error) {
      console.error("There was a problem with the axios operation:", error);
      toast.error("Error en la conexión");
    }
  };

  return (
    <div className="container mt-5">
      <h1>LOGIN</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>User</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter user"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Ingresar
        </Button>
      </Form>
      <Toaster richColors position="top-right" />{" "}
      {/* Add Toaster component for toast visibility */}
    </div>
  );
}

export default Login;
