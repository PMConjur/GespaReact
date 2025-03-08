using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using NoriAPI.Models.Busqueda;
using NoriAPI.Models.Ejecutivo;
using NoriAPI.Models.Login;
using NoriAPI.Services;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;


namespace NoriAPI.Controllers
{
    [ApiController]
    [Route("api/ejecutivo")]
    [Authorize]
    public class EjecutivoController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IEjecutivoService _ejecutivoService;

        public EjecutivoController(IEjecutivoService ejecutivoService, IConfiguration configuration)
        {
            _ejecutivoService = ejecutivoService;
            _configuration = configuration;
        }

        [HttpGet("productividad-ejecutivo")]
        public async Task<ActionResult<ResultadoProductividad>> Productividad([FromQuery] int numEmpleado)
        {
            var Productividad = await _ejecutivoService.ValidateProductividad(numEmpleado);
            return Ok(new { Productividad.ProductividadInfo });
        }

        [HttpGet("tiempos-ejecutivo")]
        public async Task<ActionResult<TiemposEjecutivo>> Tiempos([FromQuery] int numEmpleado)
        {
            var Tiempos = await _ejecutivoService.ValidateTimes(numEmpleado);
            return Ok(new { Tiempos.ResultadosTiempos });
        }

        [HttpPost("pause-ejecutivo")]
        public async Task<ActionResult> ManagePause([FromBody] InfoPausa pauseRequest)
        {
            Dictionary<string, object> mensaje = await _ejecutivoService.PauseUnpause(pauseRequest);
            return Ok(new { mensaje });
        }

        /**
        Promedios Ejecutivo
        Diseñado por Yoshiiiii
        */

        [HttpGet("promedio-ejecutivo")]
        public async Task<ActionResult> Averages([FromQuery] int idEjecutivo)
        {
            Dictionary<string, object> mensaje = await _ejecutivoService.Promedios(idEjecutivo);
            return Ok(new { mensaje });
        }


        [HttpGet("seguimientos/{idCartera}/{idCuenta}")]
        public async Task<IActionResult> GetSeguimiento(int idCartera, string idCuenta)
        {
            try
            {
                DataSet dsTablas = new DataSet();
                DataTable seguimientoTable = dsTablas.Tables.Add("Seguimiento");
                seguimientoTable.Columns.Add("idCartera", typeof(int));
                seguimientoTable.Columns.Add("idCuenta", typeof(string));
                DataRow drDatos = seguimientoTable.NewRow();
                drDatos["idCartera"] = idCartera;
                drDatos["idCuenta"] = idCuenta;

                await _ejecutivoService.ObtenerSeguimientos(drDatos, dsTablas);

                if (!dsTablas.Tables.Contains("Seguimiento") || dsTablas.Tables["Seguimiento"].Rows.Count == 0)
                {
                    return NotFound("No se encontraron recordatorios para este ejecutivo.");
                }

                var listaSeguimientos = ConvertDataTableToList(dsTablas.Tables["Seguimiento"]);
                string jsonString = JsonSerializer.Serialize(listaSeguimientos, new JsonSerializerOptions { WriteIndented = true });

                return Ok(jsonString);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }


/**
Ejecutivo Buqueda 
Diseñado por Ramon Alias Tony 

*/

        #region Busqueda
        [HttpGet("busqueda/{idCartera}/{idCuenta}/{Jerarquia}")]
        public async Task<IActionResult> GetBusqueda(int idCartera, string idCuenta, int Jerarquia)
        {
            try
            {
                DataSet dsTablas = new DataSet();
                DataTable busquedaTable = dsTablas.Tables.Add("Busqueda");
                busquedaTable.Columns.Add("idCartera", typeof(int));
                busquedaTable.Columns.Add("idCuenta", typeof(string));
                busquedaTable.Columns.Add("Jerarquía", typeof(int));

                DataRow drDatos = busquedaTable.NewRow();
                drDatos["idCartera"] = idCartera;
                drDatos["idCuenta"] = idCuenta;
                drDatos["Jerarquía"] = Jerarquia;

                await _ejecutivoService.ObtenerBusquedaEJE(drDatos, dsTablas);

                if (!dsTablas.Tables.Contains("Busqueda") || dsTablas.Tables["Busqueda"].Rows.Count == 0)
                {
                    return NotFound("No se encontraron Busquedas para este ejecutivo.");
                }

                var listaSeguimientos = ConvertDataTableToList(dsTablas.Tables["Busqueda"]);
                string jsonString = JsonSerializer.Serialize(listaSeguimientos, new JsonSerializerOptions { WriteIndented = true });

                return Ok(jsonString);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        [HttpPost("guardar")]
        public async Task<IActionResult> GuardaBusqueda([FromBody] BusquedaClass busqueda, [FromQuery] int idCartera, [FromQuery] string idCuenta, [FromQuery] int idEjecutivo)
        {
            try
            {
                TimeSpan tiempoEnCuenta = TimeSpan.Zero; // Debes definir cómo obtener esto en tu lógica

                bool resultado = await _ejecutivoService.GuardaBusquedaAsync(busqueda, idCartera, idCuenta, idEjecutivo, tiempoEnCuenta);

                return Ok(new
                {
                    success = resultado,
                    message = resultado ? "Búsqueda guardada con éxito." : "Error al guardar la búsqueda."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = $"Error interno: {ex.Message}" });
            }
        }
        #endregion

        #endregion



[HttpGet("recordatorios/{idEjecutivo}")]
        public async Task<IActionResult> GetRecordatorios(int idEjecutivo)
        {
            try
            {
                DataSet dsTablas = new DataSet();
                DataTable ejecutivosTable = dsTablas.Tables.Add("Ejecutivos");
                ejecutivosTable.Columns.Add("idEjecutivo", typeof(int));
                DataRow drDatos = ejecutivosTable.NewRow();
                drDatos["idEjecutivo"] = idEjecutivo;

                await _ejecutivoService.ObtieneRecordatoriosAsync(drDatos, dsTablas);

                if (!dsTablas.Tables.Contains("Seguimientos") || dsTablas.Tables["Seguimientos"].Rows.Count == 0)
                {
                    return NotFound("No se encontraron recordatorios para este ejecutivo.");
                }

                // Convertimos el DataTable a una lista de diccionarios
                var listaSeguimientos = ConvertDataTableToList(dsTablas.Tables["Seguimientos"]);

                // Serializamos la lista a JSON
                string jsonString = JsonSerializer.Serialize(listaSeguimientos, new JsonSerializerOptions { WriteIndented = true });

                return Ok(jsonString);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }



        [HttpGet("accionamientos/{idCartera}/{idCuenta}")]
        public async Task<IActionResult> GetAccionamiento(int idCartera, string idCuenta)
        {
            try
            {
                DataSet dsTablas = new DataSet();
                DataTable accionamientoTable = dsTablas.Tables.Add("Accionamiento");
                accionamientoTable.Columns.Add("idCartera", typeof(int));
                accionamientoTable.Columns.Add("idCuenta", typeof(string));
                DataRow drDatos = accionamientoTable.NewRow();
                drDatos["idCartera"] = idCartera;
                drDatos["idCuenta"] = idCuenta;

                await _ejecutivoService.ObtenerAccionamiento(drDatos, dsTablas);

                if (!dsTablas.Tables.Contains("Accionamiento") || dsTablas.Tables["Accionamiento"].Rows.Count == 0)
                {
                    return NotFound("No se encontraron recordatorios para este ejecutivo.");
                }

                var listaSeguimientos = ConvertDataTableToList(dsTablas.Tables["Accionamiento"]);
                string jsonString = JsonSerializer.Serialize(listaSeguimientos, new JsonSerializerOptions { WriteIndented = true });

                return Ok(jsonString);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        [HttpGet("get-negociaciones")]
        public async Task<IActionResult> GetNegociaciones([FromQuery] int idEjecutivo)
        {
            var negociaciones = await _ejecutivoService.GetNegociaciones(idEjecutivo);
            if (negociaciones.ConteoHoy == null)
            {
                return BadRequest(new { Mensaje = "No se encontraron negociaciones." });
            }

            return Ok(negociaciones);
        }

        [HttpGet("get-recuperacion")]
        public async Task<IActionResult> GetRecuperacion([FromQuery] int idEjecutivo, [FromQuery] int actual)
        {
            if (idEjecutivo <= 0)
            {
                return BadRequest(new { Mensaje = "El ID del ejecutivo debe ser un número positivo." });
            }

            if (actual != 0 && actual != 1)
            {
                return BadRequest(new { Mensaje = "El parámetro 'actual' debe ser 0 (anterior) o 1 (actual)." });
            }

            var recuperacion = await _ejecutivoService.GetRecuperacion(idEjecutivo, actual);

            if (recuperacion == null)
            {
                return BadRequest(new { Mensaje = "Parámetros inválidos o no se encontró información de recuperación del ejecutivo." });
            }

            return Ok(recuperacion);
        }

        [HttpGet("flujo-preguntas-respuestas")]
        public async Task<ActionResult<Preguntas_Respuestas_info>> Preguntas_Respuestas()
        {
            var preguntas_respuestas = await _ejecutivoService.ValidatePreguntas_Respuestas();
            return Ok(preguntas_respuestas);
        }

        private List<Dictionary<string, object>> ConvertDataTableToList(DataTable dataTable)
        {
            var list = new List<Dictionary<string, object>>();

            foreach (DataRow row in dataTable.Rows)
            {
                var dict = new Dictionary<string, object>();
                foreach (DataColumn column in dataTable.Columns)
                {
                    dict[column.ColumnName] = row[column];
                }
                list.Add(dict);
            }

            return list;
        }

        [HttpGet("Calculadora-simulador")]
        public async Task<ActionResult<ResultadoCalculadora>> Calculadora_Simulador([FromQuery] int Cartera, string NoCuenta)
        {
            var InfoCalculadora = await _ejecutivoService.ValidateInfoCalculadora(Cartera, NoCuenta);
            return Ok(InfoCalculadora);
        }












        [HttpGet("accionesNegociacion")]
        public async Task<IActionResult> GetAccionNegociacion(int idCartera, string idCuenta)
        {
            DataSet dsTablas = new DataSet();
            try
            {
                DataTable Negociaciones = new DataTable();

                Negociaciones = await _ejecutivoService.GetAccionesNegociacionesAsync( idCartera,  idCuenta);

                // Convertimos el DataTable a una lista de diccionarios
                var listaNegociaciones = ConvertDataTableToList(Negociaciones);

                // Serializamos la lista a JSON
                string jsonNegociaciones = JsonSerializer.Serialize(listaNegociaciones, new JsonSerializerOptions { WriteIndented = true });

                //dsTablas.Tables.Add(Negociaciones);

                return Ok(jsonNegociaciones);

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        [HttpGet("accionesPlazos")]
        public async Task<IActionResult> GetAccionPlazos(int idCartera, string idCuenta)
        {
            DataSet dsTablas = new DataSet();
            try
            {
                DataTable Plazos = new DataTable();

                Plazos = await _ejecutivoService.GetAccionesPlazosAsync(idCartera, idCuenta);

                // Convertimos el DataTable a una lista de diccionarios
                var listaPlazos = ConvertDataTableToList(Plazos);

                // Serializamos la lista a JSON
                string jsonPlazos = JsonSerializer.Serialize(listaPlazos, new JsonSerializerOptions { WriteIndented = true });

                //dsTablas.Tables.Add(Negociaciones);

                return Ok(jsonPlazos);

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        [HttpGet("accionesNegociacionConPlazos")]
        public async Task<IActionResult> GetAccionNegociacionConPlazos(int idCartera, string idCuenta)
        {
            try
            {
                // Obtener las negociaciones
                DataTable Negociaciones = await _ejecutivoService.GetAccionesNegociacionesAsync(idCartera, idCuenta);

                // Convertir el DataTable de Negociaciones a una lista de diccionarios
                var listaNegociaciones = ConvertDataTableToList(Negociaciones);

                // Obtener los plazos
                DataTable Plazos = await _ejecutivoService.GetAccionesPlazosAsync(idCartera, idCuenta);

                // Convertir el DataTable de Plazos a una lista de diccionarios
                var listaPlazos = ConvertDataTableToList(Plazos);

                // Combinar la información de negociaciones y plazos
                var resultadoCombinado = new List<object>();

                foreach (var negociacion in listaNegociaciones)
                {
                    var fechaInsert = negociacion.ContainsKey("FechaHora") ? Convert.ToDateTime(negociacion["FechaHora"]) : DateTime.MinValue;
                    // Aquí, debes agregar lógica para relacionar las negociaciones con los plazos,
                    // por ejemplo, basándote en la fecha de la negociación y los plazos.

                    // Supongamos que la relación es por la fecha o algún otro campo,
                    // entonces puedes agregar los plazos correspondientes a cada negociación
                    var plazosRelacionados = listaPlazos
                    .Where(p => {
                        // Verificar si existen los campos necesarios en el diccionario
                        if (p.ContainsKey("Fecha_Insert") && p.ContainsKey("Segundo_Insert"))
                        {
                            // Obtener la fecha de Fecha_Insert
                            var fechaPlazo = Convert.ToDateTime(p["Fecha_Insert"]).Date;

                            // Obtener la hora de Segundo_Insert y combinarla con la fecha
                            var horaPlazo = (TimeSpan)p["Segundo_Insert"];

                            // Crear la fecha completa de plazo combinando la fecha de Fecha_Insert con la hora de Segundo_Insert
                            var fechaHoraPlazo = fechaPlazo.Add(horaPlazo);

                            // Comparar si la fecha y hora combinadas coinciden con la fecha completa de la negociación
                            return fechaHoraPlazo == fechaInsert;
                        }
                        return false;
                    }).ToList();
                    // Agregar la negociación junto con los plazos relacionados
                    var negociacionConPlazos = new
                    {
                        Negociacion = negociacion,
                        Plazos = plazosRelacionados
                    };

                    resultadoCombinado.Add(negociacionConPlazos);
                }

                // Serializar la respuesta combinada a JSON
                string jsonResultado = JsonSerializer.Serialize(resultadoCombinado, new JsonSerializerOptions { WriteIndented = true });

                return Ok(jsonResultado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        [HttpGet("validador")]
        public async Task<IActionResult> GetValidador(int idProducto, int idEjecutivo, string Contraseña)
        {
            DataSet dsTablas = new DataSet();
            try
            {
                if (idEjecutivo != 0 && Contraseña != "")
                {
                    DataTable passValidador = new DataTable();

                    passValidador = await _ejecutivoService.GetValidadorAsync(idProducto, idEjecutivo,Contraseña);

                    // Convertimos el DataTable a una lista de diccionarios
                    var passValidadores = ConvertDataTableToList(passValidador);

                    // Serializamos la lista a JSON
                    string jsonPassValidadores = JsonSerializer.Serialize(passValidadores, new JsonSerializerOptions { WriteIndented = true });

                    //dsTablas.Tables.Add(Negociaciones);

                    return Ok(jsonPassValidadores);
                }
                else
                {
                    DataTable Validador = new DataTable();

                    Validador = await _ejecutivoService.GetValidadorAsync(idProducto, idEjecutivo, Contraseña);

                    // Convertimos el DataTable a una lista de diccionarios
                    var Validadores = ConvertDataTableToList(Validador);

                    // Serializamos la lista a JSON
                    string jsonValidadores = JsonSerializer.Serialize(Validadores, new JsonSerializerOptions { WriteIndented = true });

                    //dsTablas.Tables.Add(Negociaciones);

                    return Ok(jsonValidadores);
                }

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        [HttpGet("accionesComentario")]
        public async Task<IActionResult> GetAccionesComentario(int idCartera, string idCuenta, int idEjecutivo, string Comentario, bool ModificaSituacion)
        {
            DataSet dsTablas = new DataSet();
            try
            {
                    DataTable Comentarios = new DataTable();

                    Comentarios = await _ejecutivoService.GetAccionesComentarioAsync(idCartera, idCuenta, idEjecutivo,Comentario,ModificaSituacion);

                    // Convertimos el DataTable a una lista de diccionarios
                    var insertaComentario = ConvertDataTableToList(Comentarios);

                    // Serializamos la lista a JSON
                    string jsonComentarios = JsonSerializer.Serialize(insertaComentario, new JsonSerializerOptions { WriteIndented = true });

                    //dsTablas.Tables.Add(Negociaciones);

                    return Ok(jsonComentarios);


            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }


    }
}