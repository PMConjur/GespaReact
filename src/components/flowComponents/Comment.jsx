import { useEffect } from "react";
import { FloatingLabel, Form, Button } from "react-bootstrap";
const Comment = () => {
  return (
    <>
      <Form>
        <Form.Group controlId="comment">
          <FloatingLabel controlId="commentID" label="Comentario">
            <Form.Control
              as="textarea"
              placeholder="Leave a comment here"
              style={{ height: "100px" }}
            />
          </FloatingLabel>
        </Form.Group>
        <Button variant="primary" className="mt-3">
          Guardar Comentario
        </Button>
      </Form>
    </>
  );
};

export default Comment;
