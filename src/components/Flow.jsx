import { useEffect, useState, useContext } from "react";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import { userFlow, saveManagment } from "../services/gespawebServices";
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
import Timmer from "./flowComponents/Timmer";
import SaveButton from "./flowComponents/SaveButton"; // Importa el nuevo componente SaveButton
import CalculatorSimulator from "./CalculatorSimulator"; // Importa el componente CalculatorSimulator
import Payments from "./memuHamburguesa/Informacion/Payments"; // Importa el componente Payments
import Talks from "./memuHamburguesa/Acciones/Talks"; // Importa el componente Talks

const Flow = () => {
  const {
    searchResults,
    selectedAnswer,
    setNegotiationActive,
    setFollowUpActive,
    stoppedTime,
    communicationData,
    setStoppedTime
  } = useContext(AppContext); // Agrega stoppedTime y communicationData del contexto
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
  const [startTimer, setStartTimer] = useState(false); // Estado para iniciar el timer
  const [commentData, setCommentData] = useState(""); // Estado para el comentario
  const [isCommentValid, setIsCommentValid] = useState(false); // Estado para la validez del comentario
  const [showCalculator, setShowCalculator] = useState(false); // Estado para controlar el modal CalculatorSimulator
  const [showPayments, setShowPayments] = useState(false); // Estado para controlar el modal Payments
  const [showTalks, setShowTalks] = useState(false); // Estado para controlar el modal Talks

  console.log(setStoppedTime);

  const handleSaveComment = (comment) => {
    setSavedComment(comment); // Actualiza el comentario guardado
    setTriggerLastAnswerActions(true); // Activa el disparador para ejecutar las acciones
  };

  const handleCloseFollowUps = () => {
    setShowFollowUps(false); // Cierra el modal de seguimiento
  };

  const handleOpenCalculator = () => setShowCalculator(true); // Abre el modal
  const handleCloseCalculator = () => setShowCalculator(false); // Cierra el modal

  const handleOpenPayments = () => setShowPayments(true); // Abre el modal Payments
  const handleClosePayments = () => setShowPayments(false); // Cierra el modal Payments

  const handleOpenTalks = () => setShowTalks(true); // Abre el modal Talks
  const handleCloseTalks = () => setShowTalks(false); // Cierra el modal Talks

  const handleStopTimer = () => {
    if (stoppedTime) {
      console.log("Tiempo detenido desde AppContext:", stoppedTime); // Imprime el tiempo detenido
      return stoppedTime; // Devuelve el tiempo detenido
    } else {
      console.warn("El tiempo detenido aún es null.");
      return "00:00:02"; // Valor predeterminado
    }
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

  const clearStates = () => {
    setUserFlowData([]);
    setCurrentQuestionId(null);
    setSelectedAnswers({});
    setSelectedValues({});
    setAnswerHistory([]);
    setIsFlowFinished(false);
    setSavedComment("");
    setShowFollowUps(false);
    setTriggerLastAnswerActions(false);
    setIsNegotiationActive(false);
    setIsFollowUpActive(false);
    setStartTimer(false);
  };

  //Renderiza las ventanas que continunan del flujo
  const handleLastAnswerActions = () => {
    if (answerHistory.length > 0) {
      const lastAnswer = answerHistory[answerHistory.length - 1]; // Obtiene el último elemento del historial

      if (lastAnswer.negociacion === 1 && lastAnswer.seguimiento === 1) {
        console.log("Entró a negociación.");
        setIsNegotiationActive(true); // Activa la variable de negociación
        handleOpenCalculator(); // Abre el modal CalculatorSimulator
        toast.info("Flujo preparado para negociación.");
      } else if (lastAnswer.seguimiento === 1 && lastAnswer.negociacion === 0) {
        console.log("Entró a seguimiento.");
        setIsFollowUpActive(true); // Activa la variable de seguimiento
        setShowFollowUps(true); // Muestra el modal de FollowUps
        toast.info("Flujo preparado para seguimiento.");
      } else if (idReportePago === 1013) {
        console.log("Entró a Reporte de Pago.");
        handleOpenPayments(); // Abre el modal Payments
        toast.info("Flujo preparado para reportar pago.");
      } else if (idCargoLinea === 1034) {
        console.log("Entró a Cargo Linea.");
        handleOpenTalks(); // Abre el modal Talks
        toast.info("Flujo preparado para generar Cargo Linea.");
      } else {
        toast.success(
          "Flujo finalizado aqui renderiza cuando no hay negociacion ni seguimiento."
        );
        clearStates(); // Limpia los estados
        // Renderiza nuevamente el flujo
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
          </>
        );
      }
    }
  };

  const responseData = JSON.parse(localStorage.getItem("responseData"));
  const idEjecutivo = responseData?.ejecutivo?.infoEjecutivo?.idEjecutivo;
  const idContacto = answerHistory.find(
    (item) => item.idPregunta === 3
  )?.idValor;
  const idSituacion = answerHistory.find(
    (item) => item.idPregunta === 8
  )?.idValor;
  const idAcercamiento = answerHistory.find(
    (item) => item.idPregunta === 10
  )?.idValor;
  const idParentesco = answerHistory.find(
    (item) => item.idPregunta === 6
  )?.idValor;
  const idCausaNoPago = answerHistory.find(
    (item) => item.idPregunta === 11
  )?.idValor;
  const idReportePago = answerHistory.find(
    (item) => item.idPregunta === 8
  )?.idValor;
  const idCargoLinea = answerHistory.find(
    (item) => item.idPregunta === 8
  )?.idValor;

  const handleSave = async (comment) => {
    const dataManagment = {
      idCartera: searchResults?.[0].idCartera,
      idCuenta: searchResults?.[0].idCuenta,
      idEjecutivo: idEjecutivo,
      numeroTelefonico: communicationData?.telephone
        ? communicationData.telephone
        : selectedAnswer.dataPhone.númeroTelefónico,
      idContacto: idContacto ? idContacto : null,
      idSituacion: idSituacion ? idSituacion : null,
      idSucursal: 0,
      extension: 0,
      idModo: selectedAnswer.dataPhone.idModo,
      idAcercamiento: idAcercamiento ? idAcercamiento : null,
      duracion: stoppedTime ? stoppedTime : "00:00:02", // Usa el tiempo detenido desde AppContext
      tiempoEnCuenta: "00:02:02",
      idParentesco: idParentesco ? idParentesco : null,
      nombreContacto: communicationData?.name ? communicationData.name : null,
      idCausaNoPago: idCausaNoPago ? idCausaNoPago : null,
      comentario: comment
    };
    console.log("Datos de gestión a guardar:", dataManagment);
    try {
      const response = await saveManagment(dataManagment); // Llama al servicio saveManagment
      if (response) {
        toast.success("Gestión guardada correctamente.");
        handleLastAnswerActions(); // Ejecuta las acciones según las condiciones
      } else {
        toast.error("Error al guardar la gestión.");
      }
    } catch (error) {
      console.error("Error al guardar la gestión:", error);
      toast.error("Ocurrió un error al guardar la gestión.");
    }
  };

  //No modificar
  useEffect(() => {
    // Limpiar estados antes de comenzar nuevamente
    clearStates();

    userFlow()
      .then((response) => {
        if (response && response.length > 0) {
          setUserFlowData(response);

          setStartTimer(true); // Inicia el timer cuando se recibe el flujo por defecto
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
    const idQuienContesto = answerHistory.some(
      (item) => item.idValor === 1109 || item.idValor === 1129
    );
    console.log(
      "Comunico =" + idComunico,
      "Dijo =" + idDijo,
      "Quien contesto =" + idQuienContesto
    );
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

        toast.info("Continua para finalizar el flujo.");
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

    const handleCommentChange = (value, isValid) => {
      setCommentData(value); // Actualiza el comentario
      setIsCommentValid(isValid); // Actualiza la validez del comentario
    };

    const renderContent = () => {
      if (idComunico) {
        if (idDijo) {
          return (
            <>
              {/***Aqui cuando que dijo */}
              <CommunicationPhone
                idComunico={idComunico}
                selectedAnswerValue={selectedAnswer.value} // Pasar selectedAnswer.value
              />
              <Comment
                comentario=""
                isValid={true}
                onCommentChange={handleCommentChange}
              />
            </>
          );
        } else if (shouldShowComment) {
          return (
            <>
              {/***Aqui cuando que dijo es false pero comentario va activo porque
                es un quien contesto */}

              <CommunicationPhone
                idComunico={idComunico}
                selectedAnswerValue={selectedAnswer.value} // Pasar selectedAnswer.value
              />
              <Comment
                comentario=""
                isValid={true}
                onCommentChange={handleCommentChange}
              />
            </>
          );
        } else {
          return (
            <>
              {/***Flujo finalizado */}
              <CommunicationPhone
                idComunico={idComunico}
                selectedAnswerValue={selectedAnswer.value} // Pasar selectedAnswer.value
              />
            </>
          );
        }
      } else if (idQuienContesto) {
        return (
          <CommunicationPhone
            idComunico={idComunico}
            selectedAnswerValue={selectedAnswer.value} // Pasar selectedAnswer.value
          />
        );
      } else {
        return (
          <>
            {/***Flujo finalizado */}
            <h5></h5>
            <CommunicationPhone
              idComunico={idComunico}
              selectedAnswerValue={selectedAnswer.value} // Pasar selectedAnswer.value
            />
            <Comment
              comentario=""
              isValid={true}
              onCommentChange={handleCommentChange}
            />
          </>
        );
      }
    };

    const renderContentEnter = () => {
      if (idComunico) {
        if (idDijo) {
          return (
            <>
              {/***Aqui cuando que dijo */}
              <CommunicationPhone
                idComunico={idComunico}
                selectedAnswerValue={selectedAnswer.value} // Pasar selectedAnswer.value
              />
              <Comment
                comentario=""
                isValid={true}
                onCommentChange={handleCommentChange}
              />
            </>
          );
        } else if (shouldShowComment) {
          return (
            <>
              {/***Aqui cuando que dijo es false pero comentario va activo porque
                  es un quien contesto */}
              <CommunicationPhone
                idComunico={idComunico}
                selectedAnswerValue={selectedAnswer.value} // Pasar selectedAnswer.value
              />
              <Comment
                comentario=""
                isValid={true}
                onCommentChange={handleCommentChange}
              />
            </>
          );
        } else {
          return (
            <>
              {/***Flujo finalizado */}
              <CommunicationPhone
                idComunico={idComunico}
                selectedAnswerValue={selectedAnswer.value} // Pasar selectedAnswer.value
              />
            </>
          );
        }
      } else if (idQuienContesto) {
        return (
          <CommunicationPhone
            idComunico={idComunico}
            selectedAnswerValue={selectedAnswer.value} // Pasar selectedAnswer.value
          />
        );
      } else {
        return (
          <>
            {/***Flujo finalizado */}
            <h5></h5>
            <CommunicationPhone
              idComunico={idComunico}
              selectedAnswerValue={selectedAnswer.value} // Pasar selectedAnswer.value
            />
            <Comment
              comentario=""
              isValid={true}
              onCommentChange={handleCommentChange}
            />
          </>
        );
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
            <Timmer
              start={startTimer}
              stop={!startTimer} // Detiene el temporizador si startTimer es false
              onStop={(time) => setStoppedTime(time)} // Maneja el tiempo detenido
            />{" "}
            {/* Implementación del timer */}
            {isFlowFinished ? (
              selectedAnswer.value === 10 ? (
                renderContent() //Renderiza formulario final de flujo para llamada entrada
              ) : selectedAnswer.value === 2 ? (
                renderContentEnter() //Renderiza formulario final de flujo para llamada manual
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
            <Col>
              <SaveButton
                onSave={handleSave} // Llama a handleSave
                isValid={isCommentValid} // Validez del comentario
                data={commentData} // Datos del comentario
                onStopTimer={handleStopTimer} // Detiene el temporizador y obtiene el tiempo
              />
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

      <CalculatorSimulator
        show={showCalculator}
        handleClose={handleCloseCalculator}
      />

      <Payments show={showPayments} handleClose={handleClosePayments} />
      <Talks show={showTalks} handleClose={handleCloseTalks} />

      {/* Modal de FollowUps */}
      <FollowUps
        show={showFollowUps}
        handleClose={handleCloseFollowUps}
        isFollowUpActive={isFollowUpActive}
      />
    </>
  );
};

export default Flow;
