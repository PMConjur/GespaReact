import { useState } from "react";
import { FloatingLabel, Form } from "react-bootstrap";
import { toast } from "sonner"; // Importa toast para mostrar mensajes

const Comment = ({ comentario, isValid, onCommentChange }) => {
  const [comment, setComment] = useState(comentario || ""); // Estado para el comentario
  const [valid, setValid] = useState(isValid); // Estado para la validez del comentario

  const handleChange = (e) => {
    const value = e.target.value;
    const regex = /^[a-zA-Z\s]*$/; // Solo permite letras y espacios

    if (regex.test(value)) {
      setComment(value); // Actualiza el comentario si es válido
      setValid(true); // Marca como válido
      onCommentChange(value, true); // Notifica al componente padre con validez true
    } else {
      toast.warning("Los números no son válidos en el comentario."); // Muestra un mensaje de error
      setValid(false); // Marca como no válido
      onCommentChange(value, false); // Notifica al componente padre con validez false
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
    </>
  );
};

export default Comment;
