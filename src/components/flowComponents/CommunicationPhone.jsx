import { Form, Stack } from "react-bootstrap";

const CommunicationPhone = ({ idComunico }) => {
  return (
    <>
      <Stack gap={2} className="col-md-8 mx-auto">
        <div className="p-2">
          <Form.Group className="mb-2">
            <Form.Label>Telefono del que se comunico</Form.Label>
            <Form.Control type="text" placeholder="_______-_______-_______" />
          </Form.Group>
        </div>
      </Stack>

      {idComunico === true && (
        <div>
          <Form.Group className="mb-3">
            <Form.Label>Nombre de con quien de comunico:</Form.Label>
            <Form.Control type="text" placeholder="" />
          </Form.Group>
        </div>
      )}
    </>
  );
};

export default CommunicationPhone;
