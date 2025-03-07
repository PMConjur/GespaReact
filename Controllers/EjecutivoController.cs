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
        #region Productividad

        [HttpGet("productividad-ejecutivo")]
        public async Task<ActionResult<ResultadoProductividad>> Productividad([FromQuery] int numEmpleado)
        {
            var Productividad = await _ejecutivoService.ValidateProductividad(numEmpleado);
            return Ok(new { Productividad.ProductividadInfo });
        }

        #endregion

        #region Tiempos
        [HttpGet("tiempos-ejecutivo")]
        public async Task<ActionResult<TiemposEjecutivo>> Tiempos([FromQuery] int numEmpleado)
        {
            var Tiempos = await _ejecutivoService.ValidateTimes(numEmpleado);
            return Ok(new { Tiempos.ResultadosTiempos });
        }

        [HttpPost("pause-ejecutivo")]
        public async Task<ActionResult> ManagePause([FromBody] InfoPausa pauseRequest)
        {
            string mensaje = await _ejecutivoService.PauseUnpause(pauseRequest);
            return Ok(new { mensaje });
        }

        #endregion

        #region Seguimientos
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
        #endregion


        #region Recordatorios


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

        #endregion

        #region Accionamientos
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

        #endregion

        #region Negociaciones
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

        #endregion

        #region Recuperacion
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
        #endregion

        #region Flujo Preguntas Respuestas
        [HttpGet("flujo-preguntas-respuestas")]
        public async Task<ActionResult<Preguntas_Respuestas_info>> Preguntas_Respuestas()
        {
            var preguntas_respuestas = await _ejecutivoService.ValidatePreguntas_Respuestas();
            return Ok(preguntas_respuestas);
        }

        #endregion

        #region Directorio
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

        #endregion

        #region Calculadora

        [HttpGet("Calculadora-simulador")]
        public async Task<ActionResult<ResultadoCalculadora>> Calculadora_Simulador([FromQuery] int Cartera, string NoCuenta)
        {
            var InfoCalculadora = await _ejecutivoService.ValidateInfoCalculadora(Cartera, NoCuenta);
            return Ok(InfoCalculadora);
        }

        #endregion


        #region AccionesNegociacion



        [HttpGet("accionesNegociacion")]
        public async Task<IActionResult> GetAccionNegociacion(int idCartera, string idCuenta)
        {
            DataSet dsTablas = new DataSet();
            try
            {
                DataTable Negociaciones = new DataTable();

                Negociaciones = await _ejecutivoService.GetAccionesNegociacionesAsync(idCartera, idCuenta);

                // Convertimos el DataTable a una lista de diccionarios
                var listaNegociaciones = ConvertDataTableToList(Negociaciones);

                // Serializamos la lista a JSON
                string jsonString = JsonSerializer.Serialize(listaNegociaciones, new JsonSerializerOptions { WriteIndented = true });

                //dsTablas.Tables.Add(Negociaciones);

                return Ok(jsonString);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
        #endregion

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

        #region CargoEnLinea

        [HttpGet("cargosEnLinea/{idCartera}/{idCuenta}")]
        public async Task<IActionResult> GetCargosEnLinea(int idCartera, string idCuenta)
        {
            try
            {
                DataSet dsTablas = new DataSet();
                DataTable CargosTable = dsTablas.Tables.Add("Cargos");
                CargosTable.Columns.Add("idCartera", typeof(int));
                CargosTable.Columns.Add("idCuenta", typeof(string));
                DataRow drDatos = CargosTable.NewRow();
                drDatos["idCartera"] = idCartera;
                drDatos["idCuenta"] = idCuenta;

                await _ejecutivoService.ObtenerCargosEnLinea(drDatos, dsTablas);

                if (!dsTablas.Tables.Contains("Cargos") || dsTablas.Tables["Cargos"].Rows.Count == 0)
                {
                    return NotFound("No se encontraron Cargos En Linea para este ejecutivo.");
                }

                var listaSeguimientos = ConvertDataTableToList(dsTablas.Tables["Cargos"]);
                string jsonString = JsonSerializer.Serialize(listaSeguimientos, new JsonSerializerOptions { WriteIndented = true });

                return Ok(jsonString);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
        [HttpPost("SaveCargoEnlinea")]
        public async Task<IActionResult> SaveCargoEnlinea([FromBody] CargoEnLineaRe newCargoEn)
        {
            if (newCargoEn == null)
            {
                return BadRequest("Datos de cargo en línea inválidos.");
            }

            string result = await _ejecutivoService.SaveCargoEnlinea(newCargoEn);

            if (result.StartsWith("Error"))
            {
                return BadRequest(result); // Devuelve BadRequest para errores
            }

            return Ok(result); // Devuelve Ok con el resultado
        }

        #endregion

        #region Estado de Cuenta

        [HttpGet("estadoDeCuenta/{idCartera}/{idCuenta}")]
        public async Task<IActionResult> GetEstadoDeCuenta(int idCartera, string idCuenta)
        {
            try
            {
                DataSet dsTablas = new DataSet();
                DataTable EstadoTable = dsTablas.Tables.Add("EstadoDeCuenta");
                EstadoTable.Columns.Add("idCartera", typeof(int));
                EstadoTable.Columns.Add("idCuenta", typeof(string));
                DataRow drDatos = EstadoTable.NewRow();
                drDatos["idCartera"] = idCartera;
                drDatos["idCuenta"] = idCuenta;

                await _ejecutivoService.ObtenerEstadoDeCuenta(drDatos, dsTablas);

                if (!dsTablas.Tables.Contains("EstadoDeCuenta") || dsTablas.Tables["EstadoDeCuenta"].Rows.Count == 0)
                {
                    return NotFound("No se encontraron Estados De Cuenta para este ejecutivo.");
                }

                var listaSeguimientos = ConvertDataTableToList(dsTablas.Tables["EstadoDeCuenta"]);
                string jsonString = JsonSerializer.Serialize(listaSeguimientos, new JsonSerializerOptions { WriteIndented = true });

                return Ok(jsonString);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
        #endregion


    }
}