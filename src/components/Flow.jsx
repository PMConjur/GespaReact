import { useEffect, useState, useContext } from "react";
import { Row, Col, Card, Form, Button, Stack } from "react-bootstrap";
import { userFlow } from "../services/gespawebServices";
import { NodePlusFill } from "react-bootstrap-icons";
import { toast, Toaster } from "sonner"; // Import toast and Toaster
import { AppContext } from "../pages/Managment"; // Import AppContext

const Flow = () => {
  const [userFlowData, setUserFlowData] = useState([]);
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [selectedValues, setSelectedValues] = useState({});
  const [answerHistory, setAnswerHistory] = useState([]); // Guarda el historial de las respuestas que se van seleccioando
  const { selectedAnswer } = useContext(AppContext); // Contexto de llamada de entrada

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

  useEffect(() => {
    if (selectedAnswer !== null) {
      if (selectedAnswer === 2 || selectedAnswer === 10) {
        setCurrentQuestionId(selectedAnswer);
      } else {
        const firstQuestion = userFlowData.find(
          (item) => item.idSiguientePregunta === selectedAnswer
        );
        if (firstQuestion) {
          setCurrentQuestionId(firstQuestion.idPregunta);
        }
      }
    }
  }, [selectedAnswer, userFlowData]);

  const handleAnswerChange = (
    idPregunta,
    idRespuesta,
    idSiguientePregunta,
    valor,
    pregunta
  ) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [idPregunta]: idRespuesta
    }));
    setSelectedValues((prev) => ({
      ...prev,
      [idPregunta]: idSiguientePregunta
    }));

    const nextQuestion = userFlowData.find(
      (item) => item.idPregunta === idSiguientePregunta
    );
    if (nextQuestion) {
      setAnswerHistory((prev) => [
        ...prev,
        {
          idPregunta: idPregunta,
          idRespuesta: idRespuesta,
          valor: valor,
          pregunta: pregunta
        }
      ]); // Save current question, answer, value, and question to history
      setCurrentQuestionId(nextQuestion.idPregunta);
    } else {
      toast.info("Información de flujo terminada");
    }

    console.log("Answer History:", answerHistory); // Print answer history to console
  };
  //Accion de boton de regreso
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
  //Renderiza las preguntas e historial que guarda en un objeto los datos que va seleccionando
  const renderQuestions = (idPregunta) => {
    if (!userFlowData || userFlowData.length === 0 || idPregunta === null)
      return null;

    const questions = userFlowData.filter(
      (item) => item.idPregunta === idPregunta
    );

    if (questions.length === 0) return null;

    const lastAnswer =
      answerHistory.length > 0
        ? `${answerHistory[answerHistory.length - 1].pregunta} - ${
            answerHistory[answerHistory.length - 1].valor
          }`
        : "";

    return (
      <Card className="flow-size" border="primary">
        <Card.Header className="text-white">
          <Row>
            <Col>
              {" "}
              <i className="h5">
                <NodePlusFill></NodePlusFill> Flujo
              </i>
            </Col>
            <Col md="auto">
              {" "}
              <span> {lastAnswer}</span>
            </Col>
          </Row>
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
                    question.idSiguientePregunta,
                    question.valor,
                    question.pregunta
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
