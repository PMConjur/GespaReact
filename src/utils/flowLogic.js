// Atributos
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

export const handleFlowLogic = (idValor, setComment, setPhoneNumber) => {
  switch (idValor) {
    case 1:
      // Acción para idValor 1: Crear un comentario
      setComment("Comentario generado automáticamente.");
      _Comentario = "Comentario generado automáticamente.";
      break;
    case 2:
      // Acción para idValor 2: Ingresar un número telefónico
      const phoneNumber = prompt("Ingrese un número telefónico:");
      setPhoneNumber(phoneNumber);
      _NombreContacto = phoneNumber;
      break;
    // Agregar más casos según sea necesario
    default:
      console.log("No se requiere acción específica para este idValor.");
  }
};
