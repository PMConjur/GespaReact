import { useState, useContext, useMemo } from "react";
import { FloatingLabel, Form, Button, Row, Col } from "react-bootstrap"; // Importa Row y Col para el diseño
import { toast } from "sonner"; // Importa toast para mostrar mensajes
import Validators from "./fragments/Validators"; // Importa el componente Validators
import { AppContext } from "../pages/Managment"; // Importa el contexto para actualizar la situación
import { commentsActions } from "../services/gespawebServices"; // Corrige la ruta de importación

const NewComment = ({ comentario, isValid, onSave, handleCloseModal }) => {
  const [comment, setComment] = useState(comentario || ""); // Estado para el comentario
  const [valid, setValid] = useState(isValid); // Estado para la validez del comentario
  const [selectedOption, setSelectedOption] = useState(""); // Estado para el radio seleccionado
  const [showValidators, setShowValidators] = useState(false); // Estado para mostrar Validators
  const { setSearchResults } = useContext(AppContext); // Contexto para actualizar la situación
  const { searchResults } = useContext(AppContext);

  const idCuenta = useMemo(() => searchResults?.map((result) => result.idCuenta) || [], [searchResults]);
  const responseData = useMemo(() => JSON.parse(localStorage.getItem("responseData")), []);
  const idEjecutivo = responseData?.ejecutivo?.infoEjecutivo.idEjecutivo;

  const handleChange = (e) => {
    const value = e.target.value;
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/; // Permite letras, espacios y caracteres acentuados

    if (regex.test(value)) {
      setComment(value); // Actualiza el comentario si es válido
      setValid(true); // Marca como válido
    } else {
      toast.warning("El comentario contiene caracteres no permitidos."); // Muestra un mensaje de error
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

  const handleValidate = async () => {
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

    const payload = {
      idCartera: 1,
      idCuenta: idCuenta[0]?.trim(),
      idEjecutivo: idEjecutivo, 
      comentario: prefixedComment,
      modificaSituacion: selectedOption === "rebotado",
    };

    console.log("Payload para API:", payload);

    try {
      const response = await commentsActions(payload); // Llama al endpoint con el payload
      console.log("Respuesta del endpoint:", response); // Muestra la respuesta en consola
      toast.success(response.mensaje || "Comentario guardado correctamente."); // Muestra el mensaje del endpoint

      // Actualizar el estado global para reflejar el nuevo registro
      setSearchResults((prevResults) => [...prevResults]);

      setComment("");
      setSelectedOption("");
      setShowValidators(false);
      handleCloseModal();
    } catch (error) {
      toast.error(error.message || "Error al guardar el comentario.");
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

      <Row className="mt-3 justify-content-center align-items-center">
        <Col xs="auto">
          <Form.Check
            type="radio"
            label="Revisión"
            value="revision"
            name="commentType"
            onChange={handleRadioChange}
            checked={selectedOption === "revision"}
          />
        </Col>
        <Col xs="auto">
          <Form.Check
            type="radio"
            label="2da voz"
            value="segundaVoz"
            name="commentType"
            onChange={handleRadioChange}
            checked={selectedOption === "segundaVoz"}
          />
        </Col>
        <Col xs="auto">
          <Form.Check
            type="radio"
            label="Rebotado"
            value="rebotado"
            name="commentType"
            onChange={handleRadioChange}
            checked={selectedOption === "rebotado"}
          />
        </Col>
        <Col xs="auto">
          <Button
            variant="primary"
            disabled={!valid}
            onClick={handleSave}
          >
            Guardar Comentario
          </Button>
        </Col>
      </Row>

      {showValidators && (
        <Validators
          show={showValidators}
          handleClose={handleCloseModal} // Asegúrate de pasar handleCloseModal correctamente
          handleValidate={handleValidate}
        />
      )}
    </>
  );
};

export default NewComment;
