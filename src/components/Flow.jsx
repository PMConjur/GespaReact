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
import Comment from "./flowComponents/Comment";
import FollowUps from "./memuHamburguesa/Acciones/FollowUps"; // Importa el componente FollowUps
import CommunicationPhone from "./flowComponents/CommunicationPhone"; // Importa el componente CommunicationPhone
const Flow = () => {
  const { selectedAnswer, setNegotiationActive, setFollowUpActive } =
    useContext(AppContext); // Agrega setFollowUpActive del contexto
  const [userFlowData, setUserFlowData] = useState([]);
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [selectedValues, setSelectedValues] = useState({});
  const [answerHistory, setAnswerHistory] = useState([]); // Guarda el historial de las respuestas que se van seleccionando
  const [isFlowFinished, setIsFlowFinished] = useState(false); // Estado para verificar si el flujo ha terminado
  const [savedComment, setSavedComment] = useState(""); // Estado para el comentario guardado
  const [showFollowUps, setShowFollowUps] = useState(false); // Estado para controlar el modal de FollowUps
  const [triggerLastAnswerActions, setTriggerLastAnswerActions] =
    useState(false); // Estado para controlar cuándo ejecutar las acciones
  const [isNegotiationActive, setIsNegotiationActive] = useState(false); // Variable para controlar la acción de negociación
  const [isFollowUpActive, setIsFollowUpActive] = useState(false); // Variable para controlar la acción de seguimiento

  const handleSaveComment = (comment) => {
    setSavedComment(comment); // Actualiza el comentario guardado
    setTriggerLastAnswerActions(true); // Activa el disparador para ejecutar las acciones
  };

  const handleCloseFollowUps = () => {
    setShowFollowUps(false); // Cierra el modal de seguimiento
  };

  useEffect(() => {
    if (triggerLastAnswerActions) {
      handleLastAnswerActions(); // Ejecuta las acciones basadas en seguimiento y negociación
      setTriggerLastAnswerActions(false); // Resetea el disparador
    }
  }, [triggerLastAnswerActions]);

  useEffect(() => {
    setNegotiationActive(isNegotiationActive); // Envía isNegotiationActive al contexto
  }, [isNegotiationActive, setNegotiationActive]);

  useEffect(() => {
    setFollowUpActive(isFollowUpActive); // Envía isFollowUpActive al contexto
  }, [isFollowUpActive, setFollowUpActive]);

  const handleLastAnswerActions = () => {
    if (answerHistory.length > 0) {
      const lastAnswer = answerHistory[answerHistory.length - 1]; // Obtiene el último elemento del historial

      if (lastAnswer.negociacion === 1) {
        console.log("Entró a negociación.");
        setIsNegotiationActive(true); // Activa la variable de negociación

        toast.info("Flujo preparado para negociación.");
      }

      if (lastAnswer.seguimiento === 1) {
        console.log("Entró a seguimiento.");
        setIsFollowUpActive(true); // Activa la variable de seguimiento
        setShowFollowUps(true); // Muestra el modal de FollowUps
        toast.info("Flujo preparado para seguimiento.");
      }
    }
  };

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
  }, [selectedAnswer]); //Aqui se recibe el flujo por defecto y se maneja el selectedAnswer.value el cual equivale a la llamada manual o de entrada

  //Accion de boton de regreso
  const handleBack = () => {
    setIsFlowFinished(false); // Marca el flujo como no terminado
    if (answerHistory.length > 0) {
      // Obtiene el último elemento del historial sin eliminarlo
      const lastAnswer = answerHistory[answerHistory.length - 1];

      // Busca el idPregunta en userFlowData
      const previousQuestion = userFlowData.find(
        (item) => item.idPregunta === lastAnswer.idPregunta
      );

      if (previousQuestion) {
        setCurrentQuestionId(previousQuestion.idPregunta);
      } else {
        setCurrentQuestionId(null); // Si no hay historial, no hay pregunta actual
      }

      // Ahora elimina el último elemento del historial
      const updatedHistory = [...answerHistory];
      updatedHistory.pop();
      setAnswerHistory(updatedHistory);

      // Desmarca la opción seleccionada para la pregunta actual
      setSelectedAnswers((prev) => {
        const updatedAnswers = { ...prev };
        delete updatedAnswers[lastAnswer.idPregunta];
        return updatedAnswers;
      });

      console.log("Historial del flujo actualizado:", updatedHistory); // Imprime el historial actualizado
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
        : ""; // Elimina la última respuesta seleccionada del flujo y del historial de selección

    const shouldShowComment = answerHistory.some(
      (item) => item.idValor === 1101 || item.idValor === 1102
    );

    // Calcular idComunico e idDijo basado en answerHistory
    const idComunico = answerHistory.some(
      (item) => item.idValor === 1102 || item.idPregunta === 7
    );
    const idDijo = answerHistory.some((item) => item.idPregunta === 7);

    console.log("Comunico =" + idComunico, "Dijo =" + idDijo);
    const handleAnswerChange = async (
      idPregunta,
      idRespuesta,
      idSiguientePregunta,
      valor,
      idValor,
      respuesta,
      pregunta,
      seguimiento,
      negociacion,
      identificador
    ) => {
      // Verifica si el flujo ha terminado
      if (idSiguientePregunta === 0) {
        // Guarda la última pregunta seleccionada en updatedHistory
        const updatedHistory = [
          ...answerHistory,
          {
            idPregunta: idPregunta,
            idRespuesta: idRespuesta,
            valor: valor || respuesta,
            pregunta: pregunta,
            idSiguientePregunta: idSiguientePregunta,
            idValor: idValor,
            seguimiento: seguimiento,
            negociacion: negociacion,
            identificador: identificador
          }
        ];
        setAnswerHistory(updatedHistory);
        console.log(
          "Última pregunta seleccionada guardada en historial:",
          updatedHistory
        );

        toast.info("El flujo ha terminado.");
        setIsFlowFinished(true); // Marca el flujo como terminado
        return;
      }

      // Actualiza los estados antes de realizar operaciones adicionales
      const updatedHistory = [
        ...answerHistory,
        {
          idPregunta: idPregunta,
          idRespuesta: idRespuesta,
          valor: valor || respuesta, // Usar respuesta si valor está vacío
          pregunta: pregunta,
          idSiguientePregunta: idSiguientePregunta,
          idValor: idValor,
          seguimiento: seguimiento,
          negociacion: negociacion,
          identificador: identificador
        }
      ];
      setAnswerHistory(updatedHistory);
      setSelectedAnswers((prev) => ({
        ...prev,
        [idPregunta]: idRespuesta
      }));
      setSelectedValues((prev) => ({
        ...prev,
        [idPregunta]: idSiguientePregunta
      }));

      console.log("Historial actualizado:", updatedHistory);

      const idClase = selectedAnswer?.dataPhone?.idClase;

      // Usa getValidateResponse para obtener la siguiente pregunta válida
      const validatedNextQuestion = await getValidateResponse(
        {
          idPregunta: idPregunta,
          idRespuesta: idRespuesta,
          idSiguientePregunta: idSiguientePregunta,
          valor: valor || respuesta, // Usar respuesta si valor está vacío
          idValor: idValor,
          pregunta: pregunta,
          idClase: idClase,
          seguimiento: seguimiento,
          negociacion: negociacion,
          identificador: identificador
        },
        selectedAnswer
      );

      const nextQuestionId = validatedNextQuestion.idSiguientePregunta;

      // Verifica si el flujo ha terminado
      if (nextQuestionId === 0) {
        // Guarda la última pregunta seleccionada en updatedHistory
        const updatedHistory = [
          ...answerHistory,
          {
            idPregunta: idPregunta,
            idRespuesta: idRespuesta,
            valor: valor || respuesta,
            pregunta: pregunta,
            idSiguientePregunta: idSiguientePregunta
          }
        ];
        setAnswerHistory(updatedHistory);
        console.log(
          "Última pregunta seleccionada guardada en historial:",
          updatedHistory
        );

        toast.info("El flujo ha terminado.");
        setIsFlowFinished(true); // Marca el flujo como terminado
        return;
      }

      const nextQuestion = userFlowData.find(
        (item) => item.idPregunta === nextQuestionId
      );

      if (nextQuestion) {
        setCurrentQuestionId(nextQuestion.idPregunta);
      }
    };

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
            {isFlowFinished ? (
              selectedAnswer.value === 10 ? (
                idComunico ? (
                  idDijo ? (
                    <>
                      <h1>Aqui cuando que dijo</h1>
                      <CommunicationPhone idComunico={idComunico} />
                      <Comment
                        comentario=""
                        isValid={true}
                        onSave={handleSaveComment}
                      />
                    </>
                  ) : (
                    <>
                      <h5>Flujo finalizado.</h5>
                      <CommunicationPhone idComunico={idComunico} />
                    </>
                  )
                ) : (
                  <>
                    <h1>Aqui cuando comunico</h1>
                    <CommunicationPhone idComunico={idComunico} />
                  </>
                )
              ) : selectedAnswer.value === 2 ? (
                shouldShowComment ? (
                  <>
                    <Comment
                      comentario=""
                      isValid={true}
                      onSave={handleSaveComment}
                    />
                    {savedComment && (
                      <p className="mt-3 text-success">
                        Comentario guardado: {savedComment}
                      </p>
                    )}
                  </>
                ) : (
                  <h5>
                    Flujo para guardar gestión cuando no se muestra comentario
                  </h5>
                )
              ) : (
                <h5>
                  Flujo para guardar gestión cuando no se muestra comentario
                </h5>
              )
            ) : (
              <>
                <h5>{questions[0]?.pregunta}</h5>
                {questions.map((question) => (
                  <Form.Check
                    key={question.idRespuesta}
                    type="radio"
                    id={`question-${question.idPregunta}-${question.idRespuesta}`}
                    name={`question-${question.idPregunta}`}
                    label={question.valor || question.respuesta}
                    value={question.idRespuesta}
                    checked={
                      selectedAnswers[question.idPregunta] ===
                      question.idRespuesta
                    }
                    onChange={() =>
                      handleAnswerChange(
                        question.idPregunta,
                        question.idRespuesta,
                        question.idSiguientePregunta,
                        question.valor,
                        question.idValor,
                        question.respuesta,
                        question.pregunta,
                        question.seguimiento,
                        question.negociacion,
                        question.identificador
                      )
                    }
                  />
                ))}
              </>
            )}
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
    <>
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

      {/* Modal de FollowUps */}
      <FollowUps show={showFollowUps} handleClose={handleCloseFollowUps} />
    </>
  );
};

export default Flow;
