import { useEffect, useState } from "react";
import { Row, Col, Card, Form, Button, Stack } from "react-bootstrap";
import { userFlow } from "../services/gespawebServices";
import { NodePlusFill } from "react-bootstrap-icons";

const Flow = () => {
  const [userFlowData, setUserFlowData] = useState([]);
  const [currentQuestionId, setCurrentQuestionId] = useState(1);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [selectedValues, setSelectedValues] = useState({});
  const [answerHistory, setAnswerHistory] = useState([]); // Add state to keep track of answer history

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
      setAnswerHistory((prev) => [
        ...prev,
        { idPregunta: currentQuestionId, idRespuesta: currentAnswer }
      ]); // Save current question and answer to history
      setCurrentQuestionId(nextQuestion.idPregunta);
    }
  };

  const handleBack = () => {
    if (answerHistory.length > 0) {
      const lastAnswer = answerHistory[answerHistory.length - 1];
      setCurrentQuestionId(lastAnswer.idPregunta);
      setSelectedAnswers((prev) => {
        const updatedAnswers = { ...prev };
        delete updatedAnswers[lastAnswer.idPregunta];
        return updatedAnswers;
      });
      setAnswerHistory((prev) => prev.slice(0, -1)); // Remove last answer from history
    }
  };

  const renderQuestions = (idPregunta) => {
    if (!userFlowData || userFlowData.length === 0) return null;

    const questions = userFlowData.filter(
      (item) => item.idPregunta === idPregunta
    );

    if (questions.length === 0) return null;

    return (
      <Card className="flow-size" border="primary">
        <Card.Header className="text-white">
          <i className="h5">
            <NodePlusFill></NodePlusFill> Flujo
          </i>
        </Card.Header>

        <Card.Body className="scroll-flow">
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
        </Card.Body>
        <Card.Footer className="text-white">
          <Row>
            <Col>
              <Button variant="primary" className="mt-3" onClick={handleBack}>
                Regresar
              </Button>
            </Col>
            <Col className="d-flex flex-row-reverse">
              <Button variant="success" className="mt-3" onClick={handleAccept}>
                Aceptar
              </Button>
            </Col>
          </Row>
        </Card.Footer>
      </Card>
    );
  };

  return (
    <Row xs="auto" md="auto" className="g-2">
      <Col md={12}>{renderQuestions(currentQuestionId)}</Col>
    </Row>
  );
};

export default Flow;
