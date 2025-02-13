import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { toast, Toaster } from "sonner"; // Import the toast and Toaster components

const Login = () => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log("User:", user);
    console.log("Password:", password);
    toast.success("Login successful!"); // Add toast notification
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
      <Toaster /> {/* Add Toaster component for toast visibility */}
    </div>
  );
};

export default Login;
