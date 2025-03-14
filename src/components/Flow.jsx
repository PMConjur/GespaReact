import { useEffect, useState, useContext } from "react";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import { userFlow } from "../services/gespawebServices";
import {
  NodePlusFill,
  Check2Circle,
  ArrowLeftCircleFill
} from "react-bootstrap-icons";
import { toast } from "sonner"; // Import toast and Toaster
import { AppContext } from "../pages/Managment"; // Import AppContext
import { getResponse, getValidateResponse } from "../utils/flowLogic"; // Import Response function, para la logica del funcionamiento del flujo

const Flow = () => {
  const [userFlowData, setUserFlowData] = useState([]);
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [selectedValues, setSelectedValues] = useState({});
  const [answerHistory, setAnswerHistory] = useState([]); // Guarda el historial de las respuestas que se van seleccionando
  const { selectedAnswer } = useContext(AppContext); // Contexto de llamada de entrada o manual
  console.log("Selected Answer:", selectedAnswer);
  //No modificar
  useEffect(() => {
    userFlow()
      .then((response) => {
        if (response && response.length > 0) {
          setUserFlowData(response);
          if (selectedAnswer && selectedAnswer.value !== null) {
            if (selectedAnswer.value === 2 || selectedAnswer.value === 10) {
              const firstQuestions = response.filter(
                (item) => item.idPregunta === selectedAnswer.value
              );
              if (firstQuestions.length > 0) {
                setCurrentQuestionId(firstQuestions[0].idPregunta);
                console.log(
                  "First Questions:",
                  firstQuestions.map((q) => q.idPregunta)
                );
              }
            } else {
              getResponse(selectedAnswer, response, setCurrentQuestionId);
            }
          }
        } else {
          console.error("No data received from userFlow");
        }
      })
      .catch((error) => {
        console.error("Error fetching user flow data:", error);
      });
  }, [selectedAnswer]); //Aqui se recibe el flujo por defecto y se maneja el selectedAnswer.value

  const handleAnswerChange = async (
    idPregunta,
    idRespuesta,
    idSiguientePregunta,
    valor,
    idValor,
    respuesta,
    pregunta
  ) => {
    // Guarda los parámetros seleccionados en el historial
    setAnswerHistory((prev) => [
      ...prev,
      {
        idPregunta: idPregunta,
        idRespuesta: idRespuesta,
        valor: valor || respuesta, // Usar respuesta si valor está vacío
        pregunta: pregunta,
        idSiguientePregunta: idSiguientePregunta
      }
    ]);
    console.log("Historial guardado");
    setSelectedAnswers((prev) => ({
      ...prev,
      [idPregunta]: idRespuesta
    }));
    setSelectedValues((prev) => ({
      ...prev,
      [idPregunta]: idSiguientePregunta
    }));

    const idClase = selectedAnswer?.dataPhone?.idClase;

    // Usa getValidateResponse para obtener la siguiente pregunta válida
    let validatedNextQuestion = await getValidateResponse(
      {
        idPregunta: idPregunta,
        idRespuesta: idRespuesta,
        idSiguientePregunta: idSiguientePregunta,
        valor: valor || respuesta, // Usar respuesta si valor está vacío
        idValor: idValor,
        pregunta: pregunta,
        idClase: idClase
      },
      userFlowData,
      setCurrentQuestionId
    );

    let nextQuestionId = validatedNextQuestion.idSiguientePregunta;

    let nextQuestion = userFlowData.find(
      (item) => item.idPregunta === nextQuestionId
    );

    if (nextQuestion) {
      setCurrentQuestionId(nextQuestion.idPregunta);
    }

    // Asegúrate de que el bucle no se ejecute más de una vez
    while (nextQuestion && nextQuestion.idPregunta !== idSiguientePregunta) {
      validatedNextQuestion = await getValidateResponse(
        {
          idPregunta: nextQuestion.idPregunta,
          idRespuesta: idRespuesta,
          idSiguientePregunta: nextQuestion.idSiguientePregunta,
          valor: valor || nextQuestion.respuesta, // Usar respuesta si valor está vacío
          idValor: idValor,
          pregunta: nextQuestion.pregunta,
          idClase: idClase
        },
        userFlowData,
        setCurrentQuestionId
      );

      nextQuestionId = validatedNextQuestion.idSiguientePregunta;

      nextQuestion = userFlowData.find(
        (item) => item.idPregunta === nextQuestionId
      );

      if (nextQuestion) {
        setAnswerHistory((prev) => [
          ...prev,
          {
            idPregunta: nextQuestion.idPregunta,
            idRespuesta: idRespuesta,
            valor: valor || nextQuestion.respuesta, // Usar respuesta si valor está vacío
            pregunta: nextQuestion.pregunta,
            idSiguientePregunta: nextQuestion.idSiguientePregunta
          }
        ]); // Guarda el historial de las preguntas que se van seleccionando
        setCurrentQuestionId(nextQuestion.idPregunta);
      }
    }

    if (!nextQuestion || nextQuestion.length === 0) {
      toast.info("Información de flujo terminada");
    }

    console.log("Answer History:", answerHistory); // imprime el historial de respuestas para poder verlo en consola
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
          } `
        : ""; // Elimina la utlima respuesta seleccionada del flujo y del historial de selección

    return (
      <Card className="flow-size" border="primary">
        <Card.Header className="text-white">
          <Row>
            <Col>
              {" "}
              <i className="h5 card-title">
                <NodePlusFill></NodePlusFill> Flujo
              </i>
            </Col>
            <Col md="auto  text-right">
              {" "}
              <span className="elemento">
                {" "}
                {lastAnswer}
                <Check2Circle></Check2Circle>
              </span>
            </Col>
          </Row>
        </Card.Header>

        <Card.Body className="scroll-flow">
          <Form>
            <h5>{questions[0]?.pregunta}</h5>
            {questions.map((question) => (
              <Form.Check
                key={question.idRespuesta}
                type="radio"
                id={question.idPregunta}
                name={`${question.respuesta}` || `${question.valor}`}
                label={question.valor || question.respuesta}
                value={question.idRespuesta}
                checked={
                  selectedAnswers[question.idPregunta] ===
                  question.idSiguientePregunta
                }
                onChange={() =>
                  handleAnswerChange(
                    question.idPregunta,
                    question.idRespuesta,
                    question.idSiguientePregunta,
                    question.valor,
                    question.idValor,
                    question.respuesta,
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
              <Button variant="primary" className="mt-3 " onClick={handleBack}>
                <ArrowLeftCircleFill></ArrowLeftCircleFill> Regresar
              </Button>
            </Col>
          </Row>
        </Card.Footer>
      </Card>
    );
  };

  return (
    <Row xs="auto" md="auto" className="g-2">
      <Col md={12}>
        {currentQuestionId ? (
          renderQuestions(currentQuestionId)
        ) : (
          <Card className="flow-size" border="primary">
            <Card.Header className="text-white">
              <i className="h5">
                <NodePlusFill></NodePlusFill> Flujo
              </i>
            </Card.Header>
            <Card.Body className="scroll-flow">
              <h5>Selecciona una cuenta para trabajar en el flujo</h5>
            </Card.Body>
          </Card>
        )}
      </Col>
    </Row>
  );
};

export default Flow;
