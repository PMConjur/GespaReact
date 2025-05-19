import { Modal, Container } from "react-bootstrap";
import CommentN from "../../NewComment";

const CommentsModal = ({ show, handleClose }) => {
  // Define the handleSaveComment function
  const handleSaveComment = (comment) => {
    console.log("Comment saved:", comment);
    // Add logic to handle saving the comment
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
    </Modal>
  );
};

export default CommentsModal;
