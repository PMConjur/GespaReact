import { useEffect, useState } from "react";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import { userFlow } from "../services/gespawebServices";

const Flow = () => {
  const [userFlowData, setUserFlowData] = useState([]);
  const [currentQuestionId, setCurrentQuestionId] = useState(1);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [selectedValues, setSelectedValues] = useState({});

  useEffect(() => {
    userFlow()
      .then((response) => {
        if (response && response.length > 0) {
          setUserFlowData(response);
        } else {
          console.error("No data received from userFlow");
        }
      })
      .catch((error) => {
        console.error("Error fetching user flow data:", error);
      });
  }, []);
  console.log("El flujo es:" + userFlowData);
  const handleAnswerChange = (idPregunta, idRespuesta, idValor) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [idPregunta]: idRespuesta
    }));
    setSelectedValues((prev) => ({
      ...prev,
      [idPregunta]: idValor
    }));
  };

  const handleAccept = () => {
    const currentAnswer = selectedAnswers[currentQuestionId];
    const nextQuestion = userFlowData.find(
      (item) => item.idPregunta === currentAnswer
    );
    if (nextQuestion) {
      setCurrentQuestionId(nextQuestion.idPregunta);
    }
  };

  const renderQuestions = (idPregunta) => {
    if (!userFlowData || userFlowData.length === 0) return null;

    const questions = userFlowData.filter(
      (item) => item.idPregunta === idPregunta
    );

    if (questions.length === 0) return null;

    return (
      <Card>
        <Card.Body>
          <Form>
            <h5>{questions[0].pregunta}</h5>
            {questions.map((question) => (
              <Form.Check
                key={question.idRespuesta}
                type="radio"
                id={`question-${question.idPregunta}-${question.idRespuesta}`}
                name={`question-${question.idPregunta}`}
                label={question.valor || question.respuesta}
                value={question.idRespuesta}
                checked={
                  selectedAnswers[question.idPregunta] === question.idRespuesta
                }
                onChange={() =>
                  handleAnswerChange(
                    question.idPregunta,
                    question.idRespuesta,
                    question.idValor
                  )
                }
              />
            ))}
          </Form>
          <Button variant="primary" className="mt-3" onClick={handleAccept}>
            Aceptar
          </Button>
        </Card.Body>
      </Card>
    );
  };

  return (
    <Row xs="auto" md="auto" className="g-2">
      <Col md={12}>
        <h6 className="text-white">Flujo</h6>
        {renderQuestions(currentQuestionId)}
      </Col>
    </Row>
  );
};

export default Flow;