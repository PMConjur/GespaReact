import { Form, Stack } from "react-bootstrap";
import { useState, useEffect, useContext } from "react";
import { AppContext } from "../../pages/Managment";

const CommunicationPhone = ({ idComunico, selectedAnswerValue }) => {
  const { setCommunicationData } = useContext(AppContext); // Contexto para actualizar los datos
  const [telephone, setTelephone] = useState("");
  const [name, setName] = useState("");
  const [isTelephoneValid, setIsTelephoneValid] = useState(false);
  const [isNameValid, setIsNameValid] = useState(false);

  const handleTelephoneChange = (e) => {
    const value = e.target.value;
    const regex = /^[0-9]*$/; // Solo permite números
    if (regex.test(value)) {
      setTelephone(value);
      setIsTelephoneValid(value.length === 10); // Valida que tenga exactamente 10 dígitos
    } else {
      setIsTelephoneValid(false);
    }
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    const regex = /^[a-zA-Z\s]*$/; // Solo permite letras y espacios
    if (regex.test(value)) {
      setName(value);
      setIsNameValid(true);
    } else {
      setIsNameValid(false); // Marca como inválido si contiene números o símbolos
    }
  };

  useEffect(() => {
    // Actualizar el contexto dependiendo de las condiciones
    if (selectedAnswerValue === 2) {
      if (idComunico && isNameValid) {
        setCommunicationData({ name });
      }
    } else if (selectedAnswerValue === 10) {
      if (idComunico) {
        if (isTelephoneValid && isNameValid) {
          setCommunicationData({ telephone, name });
        }
      } else {
        if (isTelephoneValid) {
          setCommunicationData({ telephone });
        }
      }
    }
  }, [
    telephone,
    name,
    isTelephoneValid,
    isNameValid,
    idComunico,
    selectedAnswerValue,
    setCommunicationData
  ]);

  return (
    <>
      {selectedAnswerValue === 10 && (
        <Stack gap={2} className="col-md-8 mx-auto">
          <div className="p-2">
            <Form.Group className="mb-2">
              <Form.Label>Teléfono del que se comunicó</Form.Label>
              <Form.Control
                id="ComTelephone"
                type="text"
                placeholder="_______-_______-_______"
                value={telephone}
                onChange={handleTelephoneChange}
                isInvalid={!isTelephoneValid}
              />
              <Form.Control.Feedback type="invalid">
                El teléfono debe contener exactamente 10 dígitos.
              </Form.Control.Feedback>
            </Form.Group>
          </div>
        </Stack>
      )}

      {idComunico && (
        <div>
          <Form.Group className="mb-3">
            <Form.Label>Nombre de con quien se comunicó</Form.Label>
            <Form.Control
              id="ComName"
              type="text"
              placeholder=""
              value={name}
              onChange={handleNameChange}
              isInvalid={!isNameValid}
            />
            <Form.Control.Feedback type="invalid">
              El nombre solo puede contener letras y espacios.
            </Form.Control.Feedback>
          </Form.Group>
        </div>
      )}
    </>
  );
};

export default CommunicationPhone;
