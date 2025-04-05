import { useState, useContext } from "react";
import { Modal, Container, Button } from "react-bootstrap"; // Asegúrate de importar Button
import CommentN from "../../NewComment";
import { postAccionesComentarios } from "../../../services/gespawebServices"; // Asegúrate de importar el servicio
import { toast } from "sonner"; // Importa toast para mostrar mensajes
import { AppContext } from "../../../pages/Managment";
const CommentsModal = ({ show, handleClose }) => {
  const [isLoading, setIsLoading] = useState(false); // Estado para manejar la carga
  const { searchResults } = useContext(AppContext); // Obtén el contexto
  const responseData = JSON.parse(localStorage.getItem("responseData"));
  const idEjecutivo = responseData?.ejecutivo?.infoEjecutivo?.idEjecutivo;
  const idCuenta = searchResults.length > 0 ? searchResults[0].idCuenta : null;

  // Define the handleSaveComment function
  const handleSaveComment = async (comment) => {
    setIsLoading(true); // Inicia la carga
    try {
      // Construye el objeto que se enviará al endpoint
      const dataToSend = {
        idCartera: 1, // Asegúrate de que este valor sea correcto
        idCuenta: idCuenta,
        idEjecutivo: idEjecutivo,
        comentario: comment, // Usa el comentario recibido como argumento
        modificaSituacion: true,
      };

      // Llama al servicio para guardar el comentario
      await postAccionesComentarios(dataToSend);
      toast.success("Comentario guardado correctamente."); // Muestra un mensaje de éxito
      handleClose(); // Cierra el modal después de guardar
    } catch (error) {
      toast.error("Error al guardar el comentario."); // Muestra un mensaje de error
    } finally {
      setIsLoading(false); // Finaliza la carga
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Comentarios</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <CommentN comentario="" isValid={true} onSave={handleSaveComment} />
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CommentsModal;
