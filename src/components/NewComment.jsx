import { useState, useContext } from "react";
import { FloatingLabel, Form, Button } from "react-bootstrap";
import { toast } from "sonner"; // Importa toast para mostrar mensajes
import Validators from "./fragments/Validators"; // Importa el componente Validators
import { AppContext } from "../pages/Managment"; // Importa el contexto para actualizar la situación

const CommentN = ({ comentario, isValid, onSave, handleCloseModal }) => {
  const [comment, setComment] = useState(comentario || ""); // Estado para el comentario
  const [valid, setValid] = useState(isValid); // Estado para la validez del comentario
  const [selectedOption, setSelectedOption] = useState(""); // Estado para el radio seleccionado
  const [showValidators, setShowValidators] = useState(false); // Estado para mostrar Validators
  const { setSearchResults } = useContext(AppContext); // Contexto para actualizar la situación

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

  const handleRadioChange = (e) => {
    setSelectedOption(e.target.value); // Actualiza el radio seleccionado
  };

  const handleSave = () => {
    if (!selectedOption) {
      toast.warning("Debe seleccionar una opción antes de guardar."); // Valida que se seleccione un radio
      return;
    }

    if (valid) {
      if (comment === "") {
        toast.warning("El comentario no puede estar vacío."); // Muestra un mensaje de error
        setValid(false); // Marca como no válido
      } else {
        setShowValidators(true); // Muestra el componente Validators para validar
      }
    }
  };

  const handleValidate = () => {
    let prefixedComment = comment;

    switch (selectedOption) {
      case "revision":
        prefixedComment = `Rev: ${comment}`;
        break;
      case "segundaVoz":
        prefixedComment = `2da: ${comment}`;
        break;
      case "rebotado":
        prefixedComment = `Situación: Reporte de Pago ->Rebotado - ${comment}`;
        // Actualiza la situación en el contexto
        setSearchResults((prevResults) => {
          const updatedResults = [...prevResults];
          if (updatedResults[0]) {
            updatedResults[0].situacion = "Rebotado";
          }
          return updatedResults;
        });
        break;
      default:
        break;
    }

    onSave(prefixedComment); // Envía el comentario con prefijo al componente padre
    toast.success("Comentario guardado correctamente.");
    setComment(""); // Limpia el campo de comentario
    setSelectedOption(""); // Limpia la selección del radio
    setShowValidators(false); // Oculta el componente Validators
    handleCloseModal(); // Cierra el modal de comentarios justo después de enviar la data
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

      <Form.Group className="mt-3">
        <Form.Check
          type="radio"
          label="Revisión"
          value="revision"
          name="commentType"
          onChange={handleRadioChange}
          checked={selectedOption === "revision"}
        />
        <Form.Check
          type="radio"
          label="2da voz"
          value="segundaVoz"
          name="commentType"
          onChange={handleRadioChange}
          checked={selectedOption === "segundaVoz"}
        />
        <Form.Check
          type="radio"
          label="Rebotado"
          value="rebotado"
          name="commentType"
          onChange={handleRadioChange}
          checked={selectedOption === "rebotado"}
        />
      </Form.Group>

      <Button
        variant="primary"
        className="mt-3"
        disabled={!valid}
        onClick={handleSave}
      >
        Guardar Comentario
      </Button>

      {showValidators && (
        <Validators
          show={showValidators}
          handleClose={() => setShowValidators(false)}
          handleValidate={handleValidate}
        />
      )}
    </>
  );
};

export default CommentN;
