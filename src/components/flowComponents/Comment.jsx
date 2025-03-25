import { useState } from "react";
import { FloatingLabel, Form, Button } from "react-bootstrap";
import { toast } from "sonner"; // Importa toast para mostrar mensajes

const Comment = ({ comentario, isValid, onSave }) => {
  const [comment, setComment] = useState(comentario || ""); // Estado para el comentario
  const [valid, setValid] = useState(isValid); // Estado para la validez del comentario

  const handleChange = (e) => {
    const value = e.target.value;
    const regex = /^[a-zA-Z\s]*$/; // Solo permite letras y espacios

    if (regex.test(value)) {
      setComment(value); // Actualiza el comentario si es válido
      setValid(true); // Marca como válido
    } else {
      toast.warning("Los números no son válidos en el comentario."); // Muestra un mensaje de error
      setValid(false); // Marca como no válido
    }
  };

  const handleSave = () => {
    if (valid) {
      if (comment === "") {
        toast.warning("El comentario no puede estar vacío."); // Muestra un mensaje de error
        setValid(false); // Marca como no válido
      } else {
        onSave(comment); // Envía el comentario al componente padre
        toast.success("Comentario guardado correctamente.");
        setComment(""); // Limpia el campo de comentario
      }
    }
  };

  return (
    <>
      <Form.Group controlId="comment">
        <FloatingLabel controlId="commentID" label="Comentario">
          <Form.Control
            as="textarea"
            placeholder="Leave a comment here"
            style={{ height: "100px" }}
            value={comment} // Usa el estado del comentario
            onChange={handleChange} // Maneja el evento onChange
            isInvalid={!valid} // Marca el campo como inválido si no es válido
          />
        </FloatingLabel>
      </Form.Group>
      <Button
        variant="primary"
        className="mt-3"
        disabled={!valid}
        onClick={handleSave}
      >
        Guardar Comentario
      </Button>
    </>
  );
};

export default Comment;
