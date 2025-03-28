// Atributos
import { Relations, userFlow } from "../services/gespawebServices";
let _Contestaciones = [];
let _Respuestas = [];
let _htContestaciones = new Map();

let _Cuenta = null;

let _pregunta1, _pregunta2, _pregunta3, _pregunta4, _pregunta5, _pregunta6;

let _FechaPagare, _FechaF, _Folio, _Juzgado;
let _Tipos_Etapas_Recursos,
  _TipoJuicio,
  _TipoVia,
  _Etapa,
  _AutoAdmisorios,
  _CausaDesechada,
  _Prevencion,
  _Emplazamiento,
  _CierreEmplazamiento,
  _ContestDemanda,
  _Prueba,
  _Incidenteliquidacion,
  _SentenciaDefinitiva,
  _SentenciaFirme,
  _EjecuSentencia,
  _Remates,
  _TipoRecursos,
  _TipoApelacion,
  _TipoAmparo,
  _CierreAmparo,
  _RecepcionPagare,
  _ComentariosJudicial;

let _idPrimeraPregunta, _NombreContacto, _Comentario;

let _ContestaróOtro = false,
  _Contacto = false,
  _Seguimiento = false,
  _Negociación = false,
  _ReportePago = false,
  _CargoEnLínea = false,
  _Defuncion = false,
  _Terminado = false,
  _Definida = false,
  _Salida = true,
  _Intermediario = false;

let _idModo, _idClase;

let _Duración = null;

/// <summary>
/// Evalua la opción, guarda la respuesta y carga la siguiente pregunta en el flujo.
/// </summary>
/// <param name="Opción">Número de la respuesta. Valores comienzan en 1. La opción "-1" vuelve a pregunta anterior.</param>
export const getResponse = async (
  selectedAnswer, // Contexto de llamada de entrada y manual
  userFlowData, //Datos seleccionados por el usuario
  setCurrentQuestionId //idPregunta seleccionada
) => {
  const { value, idClase, idSiguientePregunta } = selectedAnswer;

  switch (value) {
    case 10:
      break;
    case 2:
      switch (userFlowData.idSiguientePregunta) {
        case 2:
          if (value === 2 && userFlowData.valor === "No") {
            _ContestaróOtro = false;
            _Contacto = false;
          }
          break;
        case 3:
          _Contacto = false;
          break;
        case 10:
          if (selectedAnswer.result.idCuenta === 1) {
            console.log("Aqui omitiremos en el flujo 1608,1610,1611");
          }
          break;
        case 5:
          break;
        case 6:
          break;
        default:
          console.log("No se requiere acción específica para este value.");
      }

      break;

    default:
      console.log("No se requiere acción específica para este value.");
  }

  // Lógica para actualizar la pregunta actual
  const nextQuestion = userFlowData.find(
    (item) => item.idPregunta === idSiguientePregunta
  );
  if (nextQuestion) {
    setCurrentQuestionId(nextQuestion.idPregunta);
  } else {
    console.log("No se encontró la siguiente pregunta.");
  }
};

export const getValidateResponse = async (
  {
    idPregunta,
    idRespuesta,
    idSiguientePregunta,
    valor,
    idValor,
    pregunta,
    idClase
  }, // Añadir idClase a los parámetros
  selectedAnswer //Datos seleccionados por el usuario
) => {
  const { value } = selectedAnswer;

  console.log(
    "idSiguientePregunta que ingresa a la logica:",
    idSiguientePregunta
  );
  let Respuesta = pregunta;
  let nextIdPregunta = idSiguientePregunta; // Mantener el valor inicial de idSiguientePregunta

  let Contestacion = true;
  // Si la pregunta fue ¿Contestaron? y la respuesta No.
  if (idRespuesta == 2 && Respuesta == "No") {
    _ContestaróOtro = false;
    _Contacto = false;
  }
  // Si la pregunta fue ¿Quién contestó?
  if (idRespuesta == 3) {
    // #idCatálogo - Le conoce, no le conoce.
    if (idValor == "1102" || idValor == "1103") _ContestaróOtro = true;
    else _ContestaróOtro = false;
    // #idCatálogo - Titular o Le conoce.
    if (idValor == "1101" || idValor == "1102") _Contacto = true;
    else _Contacto = false;
  }
  // Si la pregunta fue ¿Con quién escribiste?
  if (idRespuesta == "21" || idRespuesta == "70") {
    // #idCatálogo - Le conoce, no le conoce.
    if (idValor == "1102" || idValor == "1103") _ContestaróOtro = true;
    else _ContestaróOtro = false;
  }
  // Si la pregunta fue ¿Parentesco?
  if (idRespuesta == "6" || idRespuesta == "72") {
    // #idCatálogo - Intermediario o - Preexistente
    if (Contestacion && (idValor == "1132" || idValor == "1133"))
      _Intermediario = true;
    else _Intermediario = false;
  }

  console.log("idPregunta:", idPregunta);
  console.log("idRespuesta:", idRespuesta);
  console.log("idSiguientePregunta logica del flujo:", idSiguientePregunta);
  console.log("valor:", valor);
  console.log("pregunta:", pregunta);
  console.log("idClase:", idClase);
  console.log("valor:", value);
  // Buscar idClase en Relations y traer los datos a un objeto solo si idSiguientePregunta es 12 o 13
  if (
    value === 2 &&
    (idSiguientePregunta == "12" || idSiguientePregunta == "13")
  ) {
    const relations = await Relations();
    const relation = relations.find(
      (rel) => rel.idValor2 === idClase || rel.idValor1 === idClase
    );
    console.log("Aqui solo si entro a relacion:", idClase);
    if (relation) {
      const {
        idValor1,
        idValor2,
        Relación,
        Valor1,
        Valor2,
        Catálogo1,
        Catálogo2
      } = relation;
      const relationData = {
        idValor1,
        idValor2,
        Relación,
        Valor1,
        Valor2,
        Catálogo1,
        Catálogo2
      };
      console.log("Relación encontrada:", relationData);
      // Si la siguiente pregunta es  ¿Clase de teléfono?
      if (
        idSiguientePregunta == "12" ||
        idSiguientePregunta == "13" ||
        !(
          Catálogo1 === "Clases" &&
          Catálogo2 === "Modificables" &&
          Valor2 === "Modificable"
        )
      ) {
        // Lógica adicional para manejar idClase cuando idSiguientePregunta sea 12 o 13
        try {
          const userFlowResponse = await userFlow();
          const nextQuestion = userFlowResponse.find(
            (item) => item.idPregunta === idSiguientePregunta
          );
          if (nextQuestion) {
            idValor = 0; // Fijar idValor en 0 por defecto
            console.log(
              "Siguiente pregunta encontrada:",
              nextQuestion.idPregunta
            );
            return {
              idPregunta: nextQuestion.idPregunta,
              idSiguientePregunta: nextQuestion.idSiguientePregunta
            }; // Devolver idPregunta e idSiguientePregunta del resultado
          } else {
            console.log("No se encontró la siguiente pregunta.");
          }
        } catch (error) {
          console.error("Error al obtener la siguiente pregunta:", error);
        }
      }
    } else {
      console.log("No se encontró una relación para el idClase proporcionado.");
      return { idPregunta: idPregunta, idSiguientePregunta: nextIdPregunta }; // Devolver idSiguientePregunta con su valor inicial
    }
  }
  if (
    value === 10 &&
    (idSiguientePregunta == "12" || idSiguientePregunta == "13")
  ) {
    // Lógica adicional para manejar idClase cuando value sea 10
    try {
      const userFlowResponse = await userFlow();

      let nextQuestion = userFlowResponse.find(
        (item) => item.idPregunta === idSiguientePregunta
      );

      if (!nextQuestion) {
        console.log(
          "No se encontró la siguiente pregunta, usando predeterminada."
        );
        nextQuestion = userFlowResponse.find((item) => item.idPregunta === 9); // Valor predeterminado
      }

      if (nextQuestion) {
        idValor = 0; // Fijar idValor en 0 por defecto
        console.log("Siguiente pregunta encontrada:", nextQuestion.idPregunta);
        return {
          idPregunta: nextQuestion.idPregunta,
          idSiguientePregunta: nextQuestion.idSiguientePregunta
        }; // Devolver idPregunta e idSiguientePregunta del resultado
      } else {
        console.log("No se encontró ninguna pregunta válida.");
      }
    } catch (error) {
      console.error("Error al obtener la siguiente pregunta:", error);
    }
  }
  return { idPregunta: idPregunta, idSiguientePregunta: nextIdPregunta }; // Devolver idSiguientePregunta si no se cumple ninguna condición
};
