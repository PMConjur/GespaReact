using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using NoriAPI.Models.Acciones;
using NoriAPI.Models.Busqueda;
using NoriAPI.Models.Ejecutivo;
using NoriAPI.Services;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using NoriAPI.Models.Flujo;
using NoriAPI.Models.CargaGestionamiento;

using System.ComponentModel.DataAnnotations;
using NoriAPI.Models.Ofrecimiento;
using NoriAPI.Models;
using static NoriAPI.Models.CargaGestionamiento.SeguimientoModel;

namespace NoriAPI.Controllers
{
    [ApiController]
    [Route("api/ejecutivo")]
    //[Authorize]
    public class EjecutivoController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IEjecutivoService _ejecutivoService;
        private readonly string _connectionString;

        public EjecutivoController(IEjecutivoService ejecutivoService, IConfiguration configuration)
        {
            _ejecutivoService = ejecutivoService;
            _configuration = configuration;
            _connectionString = _configuration.GetConnectionString("Piso2Amex");
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
            var tiempos = await _ejecutivoService.ValidateTimes(numEmpleado);
            return Ok(new { tiempos.ResultadosTiempos });
        }

        [HttpGet("promedios-ejecutivo")]
        public async Task<IActionResult> Promedios([FromQuery] int numEmpleado)
        {
            var promedios = await _ejecutivoService.Promedios(numEmpleado);

            return Ok(promedios);

        }

        [HttpPost("pause-ejecutivo")]
        public async Task<ActionResult> ManagePause([FromBody] InfoPausa pauseRequest)
        {
            Dictionary<bool, object> mensaje = await _ejecutivoService.PauseUnpause(pauseRequest);

            if (mensaje == null)
            {
                return BadRequest(new { Success = false, mensaje = "Error al procesar la solicitud. No se devolvió respuesta del servidor." });
            }
            else if (mensaje.Count == 0)
            {
                return BadRequest(new { Success = false, mensaje = "Error al procesar la solicitud. No se devolvió respuesta del servidor." });
            }
            else if (!mensaje.Keys.First())
            {
                return BadRequest(new { Success = false, mensaje = mensaje.Values });
            }
            else
            {
                return Ok(new { Success = true, mensaje = mensaje.Values });
            }
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
        [HttpPost("crearSeguimiento")]
        public async Task<IActionResult> CrearSeguimiento([FromBody] SeguimientoCompletoModel request)
        {
            try
            {
                // Lógica para obtener DataRow _drInfo
                var _drInfo = ObtenerDataRow(request.IdCartera, request.IdCuenta);

                // Obtiene idEjecutivo del request
                int idEjecutivo = request.IdEjecutivo;

                // Llama al servicio para crear el seguimiento
                string resultado = await _ejecutivoService.CreaSeguimientoAsync(request, _drInfo, idEjecutivo);

                if (string.IsNullOrEmpty(resultado))
                {
                    return Ok("Seguimiento creado exitosamente.");
                }
                else
                {
                    return BadRequest(resultado);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
        // Implementaciones de ObtenerDataRow y ObtenerIdEjecutivo (ejemplos)
        private DataRow ObtenerDataRow(int idCartera, string idCuenta)
        {
            // Lógica para obtener el DataRow basado en idCartera e idCuenta
            // Esto depende de cómo almacenas y accedes a tus datos
            // Ejemplo ficticio:
            DataTable dt = new DataTable();
            dt.Columns.Add("idCartera", typeof(int));
            dt.Columns.Add("idCuenta", typeof(string));

            DataRow dr = dt.NewRow();
            dr["idCartera"] = idCartera;
            dr["idCuenta"] = idCuenta;
            dt.Rows.Add(dr);

            return dt.Rows[0];
        }



		#endregion

		#region Recordatorios

		[HttpGet("recordatorios/{idEjecutivo}")]
		public async Task<IActionResult> GetRecordatorios(int idEjecutivo)
		{
			try
			{
				// Obtener los seguimientos del servicio
				var seguimientos = await _ejecutivoService.ObtenerSeguimientosEjecutivoAsync(idEjecutivo);

				if (seguimientos == null || !seguimientos.Any())
				{
					return NotFound("No se encontraron recordatorios para este ejecutivo.");
				}

				// Convertir los seguimientos en JSON y devolver la respuesta
				return Ok(seguimientos);
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

        [HttpGet("vistaAccionamientos")]
        public async Task<IActionResult> GetVistaAccionamientos(int idCartera, string idCuenta)
        {
            DataSet dsTablas = new DataSet();
            try
            {
                DataTable ViewAccionamientos = new DataTable();

                ViewAccionamientos = await _ejecutivoService.GetVistaAccionamientos(idCartera, idCuenta);

                // Convertimos el DataTable a una lista de diccionarios
                var View = ConvertDataTableToList(ViewAccionamientos);

                // Serializamos la lista a JSON
                string jsonViewAccionamientos = JsonSerializer.Serialize(View, new JsonSerializerOptions { WriteIndented = true });

                return Ok(jsonViewAccionamientos);


            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        #endregion

        #region Negociaciones
        [HttpGet("get-negociaciones")]
        public async Task<IActionResult> GetNegociaciones([FromQuery] int idEjecutivo, [FromQuery] bool? mesActual)
        {
            var negociaciones = await _ejecutivoService.GetNegociaciones(idEjecutivo, mesActual);
            if (negociaciones.ConteoHoy == null)
            {
                return BadRequest(new { Mensaje = "No se encontraron negociaciones." });
            }

            return Ok(negociaciones);
        }

        #endregion

        #region Recuperacion
        [HttpGet("get-recuperacion-Actual")]

        public async Task<IActionResult> GetRecuperacion(int idEjecutivo)
        {

            var recuperacion = await _ejecutivoService.RecuperacionActual(idEjecutivo);

            if (recuperacion == null)
            {
                return BadRequest(new { Mensaje = "Parámetros inválidos o no se encontró información de recuperación del ejecutivo." });
            }

            return Ok(recuperacion);
        }
        [HttpGet("get-recuperacion-Anterior")]

        public async Task<IActionResult> GetRecuperacionAnterior(int idEjecutivo)
        {

            var recuperacion = await _ejecutivoService.RecuperacionAnterior(idEjecutivo);

            if (recuperacion == null)
            {
                return BadRequest(new { Mensaje = "Parámetros inválidos o no se encontró información de recuperación del ejecutivo." });
            }

            return Ok(recuperacion);
        }


        #endregion

        #region Flujo Preguntas Respuestas
        [HttpGet("flujo-preguntas-respuestas")]
        public async Task<ActionResult<PreguntasRespuestasInfo>> Preguntas_Respuestas()
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

        [HttpGet("Calculadora-1erParte")]
        public async Task<ActionResult<ResultadoCalculadora>> Calculadora_Simulador([FromQuery] int Cartera, string NoCuenta, int idHerr)
        {
            var InfoCalculadora = await _ejecutivoService.ValidateInfoCalculadora1(Cartera, NoCuenta, idHerr);
            if (InfoCalculadora.Mensaje != null)
            {
                return Ok(new { Ofrecimientos = InfoCalculadora.Ofrecimientos, Mensaje = InfoCalculadora.Mensaje });
            }
            else
            {
                return Ok(InfoCalculadora);
            }
        }

        [HttpPost("Calculadora-2daParte")]
        public async Task<ActionResult<ResultadoCalculadora2>> Calculadora([FromBody] Calculadora2 InfoCalculadora)
        {
            var InfoCalucladora2 = await _ejecutivoService.ValidateInfoCalculadora2(InfoCalculadora);
            if (InfoCalucladora2.mensaje == "")
                return Ok(InfoCalucladora2);
            else
                return Ok(InfoCalucladora2.mensaje);

        }

        [HttpPost("Ofrecer-Negociacion")]
        public async Task<IActionResult> ValidaOfrecer([FromBody] OfrecerNegociacionRequest ofrecerInfo)
        {
            var infoOfrecer = await _ejecutivoService.ValidaOfrecer(ofrecerInfo);

            return Ok(infoOfrecer);

        }

        [HttpPost("save-ofrecimiento")]
        public async Task<ActionResult<OfrecimientoValidadores>> SaveOfrecimiento([FromBody] SaveOfrecimientoRequest ofrecimientoInfo)
        {
            var result = await _ejecutivoService.GuardarOfrecimiento(ofrecimientoInfo);

            if (!result.Success)
            {
                return BadRequest(result.Message);
            }

            return Ok(result);
        }

        [HttpPost("save-ofrecimiento-general")]
        public async Task<ActionResult> SaveOfrecimientoGeneral([FromBody] SaveOfrecimientoGeneralRequest ofrecimientoInfo)
        {
            var result = await _ejecutivoService.GuardarOfrecimientoGeneral(ofrecimientoInfo);

            if (!result.Success)
            {
                return BadRequest(result.Message);
            }

            return Ok(result);
        }



        [HttpPost("GuardaNegociacionPlazos")]
        public async Task<IActionResult> GuardaNegociacionPlazos([FromBody] NegociacionPlazosInput input)
        {
            var result = await _ejecutivoService.GuardaNegociacionPlazos(input);

            if (!string.IsNullOrEmpty(result.Mensaje))
            {
                return BadRequest(result.Mensaje); // Devuelve BadRequest con el mensaje de error
            }

            return Ok(result); // Devuelve el resultado si no hay error
        }

        [HttpPost("guarda-Elimina-Plazos")]
        public async Task<IActionResult> GuardaEliminaPlazos([FromBody] EliminaGuardaPlazos PlazosInfo)
        {
            var result = await _ejecutivoService.GuardaEliminaPlazos(PlazosInfo);
            //return Ok(result);
            return Ok(new { Mensaje = result });

        }

        [HttpPost ("IncrementaNegociacion")]
        public async Task<IActionResult> IncrementaNegociacion([FromBody] IncrementoNegociacion incrementaNegInfo)
        {
            var result = await _ejecutivoService.IncrementaNegociacion(incrementaNegInfo);
            if (result == "")
            {
                return Ok("Correcto");
            }
            else
            {
                return Ok(result);
            }

        }
        #endregion

        #region Conteo
        [HttpGet("ConteoCuentasAutomatico")]
        public async Task<ActionResult<ConteoResultado>> MuestraConteo([FromQuery] int idEjecutivo, int conteo)
        {
            var muestraConteo = await _ejecutivoService.MuestraConteo(idEjecutivo, conteo);
            return Ok(muestraConteo);
        }
        #endregion


        #region Busqueda
        [HttpGet("busqueda/{idCartera}/{idCuenta}")]
        public async Task<IActionResult> GetBusqueda(int idCartera, string idCuenta)
        {

            DataSet dsTablas = new DataSet();
            DataTable busquedaTable = dsTablas.Tables.Add("Busqueda");
            busquedaTable.Columns.Add("idCartera", typeof(int));
            busquedaTable.Columns.Add("idCuenta", typeof(string));

            DataRow drDatos = busquedaTable.NewRow();
            drDatos["idCartera"] = idCartera;
            drDatos["idCuenta"] = idCuenta;

            await _ejecutivoService.ObtenerBusquedaEJE(drDatos, dsTablas);


            if (!dsTablas.Tables.Contains("Busqueda") || dsTablas.Tables["Busqueda"].Rows.Count == 0)
            {
                return NotFound("No se encontraron Busquedas para este ejecutivo.");
            }

            var listaSeguimientos = ConvertDataTableToList(dsTablas.Tables["Busqueda"]);




            string jsonBusqueda = JsonSerializer.Serialize(listaSeguimientos, new JsonSerializerOptions { WriteIndented = true });

            return Content(jsonBusqueda, "application/json; charset=utf-8");


        }

        [HttpGet("ProcesosWLP")]
        public async Task<IActionResult> GetProcesoWLP(string Proceso, string idCuenta)
        {
            try
            {
                DataTable procesoWLP = new DataTable();

                procesoWLP = await _ejecutivoService.GetWlpAsync(Proceso, idCuenta);

                // Convertimos el DataTable a una lista de diccionarios
                var WLP = ConvertDataTableToList(procesoWLP);

                // Serializamos la lista a JSON
                string jsonWLP = JsonSerializer.Serialize(WLP, new JsonSerializerOptions { WriteIndented = true });

                //dsTablas.Tables.Add(Negociaciones);

                return Ok(jsonWLP);

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
        [HttpPost("GuardarBusqueda")]
        public async Task<IActionResult> GuardarBusqueda([FromBody] BusquedaNueva busqueda)
        {
            if (await _ejecutivoService.GuardarBusquedaAsync(busqueda))
            {
                return Ok("Búsqueda guardada exitosamente.");
            }
            else
            {
                return BadRequest("Error al guardar la búsqueda.");
            }
        }





        #endregion

        #region CargoEnLinea

        [HttpGet("cargosEnLinea/{idCartera}/{idCuenta}")]
        [AllowAnonymous]
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

                return Content(jsonString, "application/json; charset=utf-8");

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        [HttpPost("SaveCargoEnlinea")]
        public async Task<IActionResult> SaveCargoEnlinea(CargoEnLinea newCargoEn)
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
        [AllowAnonymous]
        public async Task<IActionResult> GetEstadoDeCuenta(int idCartera, string idCuenta)
        {
            try
            {
                DataSet dsTablas = new();
                DataTable EstadoTable = dsTablas.Tables.Add("EstadoDeCuenta");
                EstadoTable.Columns.Add("idCartera", typeof(int));
                EstadoTable.Columns.Add("idCuenta", typeof(string));
                DataRow drDatos = EstadoTable.NewRow();
                drDatos["idCartera"] = idCartera;
                drDatos["idCuenta"] = idCuenta;

                await _ejecutivoService.ObtenerPagos(drDatos, dsTablas);

                if (!dsTablas.Tables.Contains("EstadoDeCuenta") || dsTablas.Tables["EstadoDeCuenta"].Rows.Count == 0)
                {
                    return NotFound("No se encontraron Estados De Cuenta para este ejecutivo.");
                }

                var listaSeguimientos = ConvertDataTableToList(dsTablas.Tables["EstadoDeCuenta"]);
                string jsonEstadoCuenta = JsonSerializer.Serialize(listaSeguimientos, new JsonSerializerOptions { WriteIndented = true });

                return Content(jsonEstadoCuenta, "application/json; charset=utf-8");

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
        //ObtenerUsoHorario



        [HttpGet("estadoDeCuentaCorreo/{idCartera}/{idCuenta}")]
        public async Task<IActionResult> GetEstadoDeCuentaCorreo(int idCartera, string idCuenta)
        {
            try
            {
                DataSet dsTablas = new();
                DataTable EstadoTable = dsTablas.Tables.Add("EstadoDeCuenta");
                EstadoTable.Columns.Add("idCartera", typeof(int));
                EstadoTable.Columns.Add("idCuenta", typeof(string));
                DataRow drDatos = EstadoTable.NewRow();
                drDatos["idCartera"] = idCartera;
                drDatos["idCuenta"] = idCuenta;

                await _ejecutivoService.ObtenerEstadodeCuentaCorreos(drDatos, dsTablas);

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

        [HttpPost("SaveEstadoDeCuenta")]
        public async Task<IActionResult> SaveCargoEstadoDeCuenta([FromBody] EstadoDeCuentaRe newEstadoCuenta)
        {
            if (newEstadoCuenta == null)
            {
                return BadRequest("Datos de cargo en línea inválidos.");
            }

            string result = await _ejecutivoService.SaveEstadoDeCuenta(newEstadoCuenta);

            if (result.StartsWith("Error"))
            {
                return BadRequest(result); // Devuelve BadRequest para errores
            }

            return Ok(result); // Devuelve Ok con el resultado
        }
        #endregion

        #region MultiDeudores
        [HttpGet("multideudores/{idCartera}/{idCuenta}")]
        public async Task<IActionResult> GetMultideudores(int idCartera, string idCuenta)
        {
            try
            {
                DataSet dsTablas = new DataSet();
                DataTable MultideudoresTable = dsTablas.Tables.Add("Multideudores");
                MultideudoresTable.Columns.Add("idCartera", typeof(int));
                MultideudoresTable.Columns.Add("idCuenta", typeof(string));
                MultideudoresTable.Columns.Add("RFC", typeof(string)); // Agrega la columna RFC
                MultideudoresTable.Columns.Add("NúmeroCliente", typeof(string)); // Agrega la columna NúmeroCliente
                MultideudoresTable.Columns.Add("idProducto", typeof(int)); // Agrega la columna idProducto

                DataRow drDatos = MultideudoresTable.NewRow();
                drDatos["idCartera"] = idCartera;
                drDatos["idCuenta"] = idCuenta;
                // Asegúrate de que drDatos["RFC"] y drDatos["NúmeroCliente"] tengan valores apropiados
                // drDatos["RFC"] = "valorRFC"; // Reemplaza con el valor real
                // drDatos["NúmeroCliente"] = "valorNúmeroCliente"; // Reemplaza con el valor real
                // drDatos["idProducto"] = 35; // Reemplaza con el valor real

                Hashtable htProducto = new Hashtable();
                htProducto["nombreempresa"] = "Nombre de la Empresa"; // Reemplaza con el valor real si es necesario

                string sortMultideudores = "idCartera ASC, idCuenta ASC"; // Define el ordenamiento

                await _ejecutivoService.ObtenerMultideudores(drDatos, dsTablas, htProducto, sortMultideudores, _connectionString);

                if (!dsTablas.Tables.Contains("Multideudores") || dsTablas.Tables["Multideudores"].Rows.Count == 0)
                {
                    return NotFound("No se encontraron Multideudores para esta cuenta.");
                }

                var listaMultideudores = ConvertDataTableToList(dsTablas.Tables["Multideudores"]);
                string jsonString = JsonSerializer.Serialize(listaMultideudores, new JsonSerializerOptions { WriteIndented = true });

                return Ok(jsonString);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        #endregion

        #region Pagos

        [HttpGet("pagos/{idCartera}/{idCuenta}")]
        public async Task<IActionResult> GetPagos(int idCartera, string idCuenta)
        {
            try
            {
                DataSet dsTablas = new DataSet();
                DataTable PagoTable = dsTablas.Tables.Add("Pagos");
                PagoTable.Columns.Add("idCartera", typeof(int));
                PagoTable.Columns.Add("idCuenta", typeof(string));
                DataRow drDatos = PagoTable.NewRow();
                drDatos["idCartera"] = idCartera;
                drDatos["idCuenta"] = idCuenta;

                await _ejecutivoService.ObtenerPago(drDatos, dsTablas);

                if (!dsTablas.Tables.Contains("Pagos") || dsTablas.Tables["Pagos"].Rows.Count == 0)
                {
                    return NotFound("No se encontraron Pagos para este ejecutivo.");
                }

                var listaSeguimientos = ConvertDataTableToList(dsTablas.Tables["Pagos"]);
                string jsonPagos = JsonSerializer.Serialize(listaSeguimientos, new JsonSerializerOptions { WriteIndented = true });
                return Content(jsonPagos, "application/json; charset=utf-8");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        [HttpPost("GuardarPagos")]
        public async Task<IActionResult> GuardarPagos([FromBody] Pagos pago)
        {
            if (pago == null)
            {
                return BadRequest(new { Result = "Datos de Pago no válidos." });
            }

            if (await _ejecutivoService.GuardaPagos(pago))
            {
                return Ok(new { Result = "Pago guardado exitosamente." });
            }
            else
            {
                return BadRequest(new { Result = "Error al guardar el Pago." });
            }
        }

        #endregion

        #region Gestiones
        [HttpGet("gestionTe/{idCartera}/{idCuenta}/{Top}")]

        public async Task<IActionResult> GetGestionTe(int idCartera, string idCuenta, int Top)
        {
            try
            {
                // Validar el valor de Top
                if (Top <= 0)
                {
                    return BadRequest("El valor de 'Top' debe ser un entero positivo.");
                }

                // Llamar al servicio para obtener las gestiones
                DataTable gestiones = await _ejecutivoService.ObtieneGestionTeAsync(idCartera, idCuenta, Top);

                if (gestiones == null || gestiones.Rows.Count == 0)
                {
                    return NotFound("No se encontraron gestiones telefónicas para esta cuenta.");
                }

                // Convertir DataTable a JSON
                var listaSeguimientos = ConvertDataTableToList(gestiones);
                string jsonGestionTe = JsonSerializer.Serialize(listaSeguimientos, new JsonSerializerOptions { WriteIndented = true });

                return Content(jsonGestionTe, "application/json; charset=utf-8");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        [HttpGet("Domicilios/{idCartera}/{idCuenta}")]
        public async Task<IActionResult> GetDomicilios(int idCartera, string idCuenta)
        {
            try
            {
                DataSet dsTablas = new DataSet();
                DataTable DomiciliosTable = dsTablas.Tables.Add("Domicilios");
                DomiciliosTable.Columns.Add("idCartera", typeof(int));
                DomiciliosTable.Columns.Add("idCuenta", typeof(string));
                DataRow drDatos = DomiciliosTable.NewRow();
                drDatos["idCartera"] = idCartera;
                drDatos["idCuenta"] = idCuenta;

                await _ejecutivoService.ObtenerDomicilios(drDatos, dsTablas);

                if (!dsTablas.Tables.Contains("Domicilios") || dsTablas.Tables["Domicilios"].Rows.Count == 0)
                {
                    return NotFound("No se encontraron Domicilios para este ejecutivo.");
                }

                var listaSeguimientos = ConvertDataTableToList(dsTablas.Tables["Domicilios"]);
                string jsonString = JsonSerializer.Serialize(listaSeguimientos, new JsonSerializerOptions { WriteIndented = true });

                return Ok(jsonString);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        [HttpGet("gestionesDelDia/{idEjecutivo}")]
        public IActionResult ObtieneGestionesDelDia(int idEjecutivo)
        {
            try
            {
                DataTable tblDelDía = _ejecutivoService.ObtieneGestionesDelDia(idEjecutivo);

                if (tblDelDía == null)
                {
                    return NotFound("No se encontraron gestiones para el ejecutivo en el día actual.");
                }

                // Crear tablas clonadas para Cuentas y GestionesEjecutivo
                DataTable Cuentas = tblDelDía.Clone();
                DataTable GestionesEjecutivo = tblDelDía.Clone();
                bool bSeparador = false;

                // Eliminar columnas según la lógica original
                foreach (DataColumn columna in tblDelDía.Columns)
                {
                    if (!bSeparador && columna.ColumnName == "Separador")
                    {
                        bSeparador = true;
                        GestionesEjecutivo.Columns.Remove("Separador");
                        GestionesEjecutivo.Columns.Remove("idEjecutivo");
                    }
                    if (bSeparador)
                        Cuentas.Columns.Remove(columna.ColumnName);
                    else if (columna.ColumnName != "idCartera" && columna.ColumnName != "idCuenta" && columna.ColumnName != "Fecha_Insert" && columna.ColumnName != "Segundo_Insert")
                        GestionesEjecutivo.Columns.Remove(columna.ColumnName);
                }

                // Agregar las filas a las tablas filtradas
                foreach (DataRow row in tblDelDía.Rows)
                {
                    DataRow rowCuentas = Cuentas.NewRow();
                    DataRow rowGestiones = GestionesEjecutivo.NewRow();

                    foreach (DataColumn col in Cuentas.Columns)
                    {
                        rowCuentas[col.ColumnName] = row[col.ColumnName];
                    }

                    foreach (DataColumn col in GestionesEjecutivo.Columns)
                    {
                        rowGestiones[col.ColumnName] = row[col.ColumnName];
                    }

                    Cuentas.Rows.Add(rowCuentas);
                    GestionesEjecutivo.Rows.Add(rowGestiones);
                }

                // Convertir las tablas a JSON y devolver la respuesta
                var resultado = new { Cuentas = ConvertDataTableToList(Cuentas), GestionesEjecutivo = ConvertDataTableToList(GestionesEjecutivo) };
                string jsonString = JsonSerializer.Serialize(resultado, new JsonSerializerOptions { WriteIndented = true });

                return Ok(jsonString);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        #endregion

        #region Scripts
        [HttpGet("scripts/{idProducto}")]
        public IActionResult BuscaScripts(int idProducto)
        {
            try
            {
                DataTable scripts = _ejecutivoService.BuscaScripts(idProducto);

                if (scripts == null || scripts.Rows.Count == 0)
                {
                    return NotFound($"No se encontraron scripts para el producto con ID {idProducto}.");
                }

                // Convertir DataTable a JSON usando el método auxiliar
                var listaScripts = ConvertDataTableToList(scripts);
                string jsonScripts = JsonSerializer.Serialize(listaScripts, new JsonSerializerOptions { WriteIndented = true });

                return Content(jsonScripts, "application/json; charset=utf-8");

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        [HttpGet("scripts-full/{idEjecutivo}/{idProducto}/{idCartera}/{idCuenta}")]
        public async Task<IActionResult> BuscaScripts(int idEjecutivo, int idProducto, int idCartera, string idCuenta)
        {
            var resultado = await _ejecutivoService.BuscaScriptsTranslated(idEjecutivo, idProducto, idCartera, idCuenta);

            if (resultado.Rows.Count == 0)
            {
                return NotFound("No se encontraron scripts para el producto.");
            }


            var listaScripts = ConvertDataTableToList(resultado);
            string jsonScripts = JsonSerializer.Serialize(listaScripts, new JsonSerializerOptions { WriteIndented = true });

            return Content(jsonScripts, "application/json; charset=utf-8");
        }
        #endregion

        #region AccionesNegociacion

        [HttpGet("accionesNegociacion")]
        public async Task<IActionResult> GetAccionNegociacion(int idCartera, string idCuenta)
        {
            DataSet dsTablas = new DataSet();
            try
            {
                DataTable negociaciones = new DataTable();

                negociaciones = await _ejecutivoService.GetAccionesNegociacionesAsync(idCartera, idCuenta);

                // Convertimos el DataTable a una lista de diccionarios
                var listaNegociaciones = ConvertDataTableToList(negociaciones);

                // Serializamos la lista a JSON
                string jsonNegociaciones = JsonSerializer.Serialize(listaNegociaciones, new JsonSerializerOptions { WriteIndented = true });

                //return Ok(jsonNegociaciones);
                return Content(jsonNegociaciones, "application/json; charset=utf-8");


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

                //return Ok(jsonPlazos);
                return Content(jsonPlazos, "application/json; charset=utf-8");

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
                    .Where(p =>
                    {
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

                //return Ok(jsonResultado);
                return Content(jsonResultado, "application/json; charset=utf-8");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        [HttpGet("validador")]
        public async Task<IActionResult> GetValidador(int idProducto, int idEjecutivo, string Contraseña)
        {
            DataTable validador = await _ejecutivoService.GetValidadorAsync(idProducto, idEjecutivo, Contraseña);

            if (validador == null || validador.Columns.Count != 1 || !validador.Columns.Contains("Mensaje"))
            {
                return BadRequest(new { Error = "No se recibió una respuesta de la base de datos." });
            }

            // el valor de la primera fila en la columna "Mensaje"
            string mensajePrimeraFila = validador.AsEnumerable()
                .FirstOrDefault() // Obtiene la primera DataRow, o null si no hay filas
                ?.Field<string>("Mensaje");

            if (mensajePrimeraFila != "Validado")
            {
                return BadRequest(new { Error = mensajePrimeraFila });
            }


            // Convertimos el DataTable a una lista de diccionarios
            var validadores = ConvertDataTableToList(validador);

            // Serializamos la lista a JSON
            string jsonValidadores = JsonSerializer.Serialize(validadores, new JsonSerializerOptions { WriteIndented = true });

            return Content(jsonValidadores, "application/json; charset=utf-8");

        }

        [HttpGet("validadores")]
        public async Task<IActionResult> GetValidadores(int idProducto)
        {
            DataSet dsTablas = new DataSet();
            try
            {
                DataTable Validador = new DataTable();

                Validador = await _ejecutivoService.GetValidadoresAsync(idProducto);

                // Convertimos el DataTable a una lista de diccionarios
                var Validadores = ConvertDataTableToList(Validador);

                // Serializamos la lista a JSON
                string jsonValidadores = JsonSerializer.Serialize(Validadores, new JsonSerializerOptions { WriteIndented = true });

                //dsTablas.Tables.Add(Negociaciones);

                return Ok(jsonValidadores);

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }

        }

        [HttpPost("accionesComentarios")]
        public async Task<ActionResult> NewComentario(AccionesComentarioRequest request)
        {
            string mensaje = await _ejecutivoService.AccionesComentario(request);

            return Ok(new { mensaje = mensaje });
        }


        [HttpPost("quejas")]
        public async Task<ActionResult> NewQueja([FromBody] Queja quejaNueva)
        {
            (string, bool) mensaje = await _ejecutivoService.ValidateNewQueja(quejaNueva);

            if (!mensaje.Item2)
            {
                return BadRequest(new { mensaje = mensaje.Item1, exito = false });
            }

            return Ok(new { mensaje = mensaje.Item1, exito = true });
        }

        [HttpGet("ddDatos")]
        public async Task<IActionResult> GetDropDatos()
        {
            try
            {
                DataTable DDdatos = new DataTable();

                DDdatos = await _ejecutivoService.GetDropDDatosAsync();

                // Convertimos el DataTable a una lista de diccionarios
                var DatosDD = ConvertDataTableToList(DDdatos);

                // Serializamos la lista a JSON
                string jsonDDdatos = JsonSerializer.Serialize(DatosDD, new JsonSerializerOptions { WriteIndented = true });

                //dsTablas.Tables.Add(Negociaciones);

                //return Ok(jsonDDQuejas);
                return Content(jsonDDdatos, "application/json; charset=utf-8");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        [HttpGet("ddFuentes")]
        public async Task<IActionResult> GetDropFuentes()
        {
            try
            {
                DataTable DDFuentes = new DataTable();

                DDFuentes = await _ejecutivoService.GetDropDFuentesAsync();

                // Convertimos el DataTable a una lista de diccionarios
                var FuentesDD = ConvertDataTableToList(DDFuentes);

                // Serializamos la lista a JSON
                string jsonDDFuentes = JsonSerializer.Serialize(FuentesDD, new JsonSerializerOptions { WriteIndented = true });

                //dsTablas.Tables.Add(Negociaciones);

                //return Ok(jsonDDQuejas);
                return Content(jsonDDFuentes, "application/json; charset=utf-8");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        /*[HttpGet("accionesComentario")]
            public async Task<IActionResult> GetAccionesComentario(int idCartera, string idCuenta, int idEjecutivo, string Comentario, bool ModificaSituacion)
            {
                DataSet dsTablas = new DataSet();
                try
                {
                    DataTable Comentarios = new DataTable();

                    Comentarios = await _ejecutivoService.GetAccionesComentarioAsync(idCartera, idCuenta, idEjecutivo, Comentario, ModificaSituacion);

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
            **/
        #endregion

        #region Relaciones
        [HttpGet("relaciones")]

        public IActionResult CargaRelaciones()
        {
            try
            {
                DataTable relaciones = _ejecutivoService.CargaRelaciones();

                if (relaciones == null || relaciones.Rows.Count == 0)
                {
                    return NotFound("No se encontraron relaciones.");
                }

                // Transformar DataTable a lista de diccionarios
                var listaRelaciones = relaciones.AsEnumerable()
                    .Select(row => relaciones.Columns.Cast<DataColumn>()
                        .ToDictionary(column => column.ColumnName, column => row[column]))
                    .ToList();

                return Ok(listaRelaciones); // Devuelve la lista de diccionarios
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }


        //[HttpGet("accionesComentario")]
        //public async Task<IActionResult> GetAccionesComentario(int idCartera, string idCuenta, int idEjecutivo, string Comentario, bool ModificaSituacion)
        //{
        //    DataSet dsTablas = new DataSet();
        //    try
        //    {
        //        DataTable Comentarios = new DataTable();

        //        Comentarios = await _ejecutivoService.GetAccionesComentarioAsync(idCartera, idCuenta, idEjecutivo, Comentario, ModificaSituacion);

        //        // Convertimos el DataTable a una lista de diccionarios
        //        var insertaComentario = ConvertDataTableToList(Comentarios);

        //        // Serializamos la lista a JSON
        //        string jsonComentarios = JsonSerializer.Serialize(insertaComentario, new JsonSerializerOptions { WriteIndented = true });

        //        //dsTablas.Tables.Add(Negociaciones);

        //        return Ok(jsonComentarios);


        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(500, $"Error interno del servidor: {ex.Message}");
        //    }
        //}


        [HttpGet("ddQuejas")]
        public async Task<IActionResult> GetDropQuejas()
        {
            try
            {
                DataTable DDQuejas = new DataTable();

                DDQuejas = await _ejecutivoService.GetDropDQuejasAsync();

                // Convertimos el DataTable a una lista de diccionarios
                var QuejasDD = ConvertDataTableToList(DDQuejas);

                // Serializamos la lista a JSON
                string jsonDDQuejas = JsonSerializer.Serialize(QuejasDD, new JsonSerializerOptions { WriteIndented = true });

                //dsTablas.Tables.Add(Negociaciones);

                //return Ok(jsonDDQuejas);
                return Content(jsonDDQuejas, "application/json; charset=utf-8");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        [HttpGet("ddOrigenQuejas")]
        public async Task<IActionResult> GetDropOrigenQuejas()
        {
            try
            {
                DataTable DDOrigenQuejas = new DataTable();

                DDOrigenQuejas = await _ejecutivoService.GetDropDOrigenQuejasAsync();

                // Convertimos el DataTable a una lista de diccionarios
                var OrigenQuejasDD = ConvertDataTableToList(DDOrigenQuejas);

                // Serializamos la lista a JSON
                string jsonDDOrigenQuejas = JsonSerializer.Serialize(OrigenQuejasDD, new JsonSerializerOptions { WriteIndented = true });

                //return Ok(jsonDDOrigenQuejas);
                return Content(jsonDDOrigenQuejas, "application/json; charset=utf-8");

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        [HttpGet("viewQuejas")]
        [AllowAnonymous]
        public async Task<IActionResult> GetViewQuejas(int idCartera, string idCuenta)
        {
            try
            {
                DataTable viewQuejas = await _ejecutivoService.GetViewQuejasAsync(idCartera, idCuenta);

                // Convertimos el DataTable a una lista de diccionarios
                var QuejasView = ConvertDataTableToList(viewQuejas);

                // Serializamos la lista a JSON
                string jsonViewQuejas = JsonSerializer.Serialize(QuejasView, new JsonSerializerOptions { WriteIndented = true });

                return Content(jsonViewQuejas, "application/json; charset=utf-8");

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }




        #endregion

        #region Usos Horarios
        [HttpGet("UsosHorarios/{idCartera}/{idCuenta}/{Telefono}/{idEjecutivo}")]

        public async Task<IActionResult> GetUsosHorarios(int idCartera, string idCuenta, string Telefono, int idEjecutivo)
        {
            try
            {
                DataSet dsTablas = new();
                DataTable EstadoTable = dsTablas.Tables.Add("EstadoDeCuenta");
                EstadoTable.Columns.Add("idCartera", typeof(int));
                EstadoTable.Columns.Add("idCuenta", typeof(string));
                EstadoTable.Columns.Add("Telefono", typeof(string));
                EstadoTable.Columns.Add("idEjecutivo", typeof(int));
                DataRow drDatos = EstadoTable.NewRow();
                drDatos["idCartera"] = idCartera;
                drDatos["idCuenta"] = idCuenta;
                drDatos["Telefono"] = Telefono;
                drDatos["idEjecutivo"] = idEjecutivo;

                await _ejecutivoService.ObtenerUsoHorario(drDatos, dsTablas);

                if (!dsTablas.Tables.Contains("EstadoDeCuenta") || dsTablas.Tables["EstadoDeCuenta"].Rows.Count == 0)
                {
                    return NotFound("No se encontraron Estados De Cuenta para este ejecutivo.");
                }

                var listaSeguimientos = ConvertDataTableToList(dsTablas.Tables["EstadoDeCuenta"]);
                string jsonString = JsonSerializer.Serialize(listaSeguimientos, new JsonSerializerOptions { WriteIndented = true });

                return Content(jsonString, "application/json; charset=utf-8");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
        #endregion

        #region Correos
        [HttpGet("CorreosObtiene/{idCartera}/{idCuenta}")]



        public async Task<IActionResult> GetCorreos(int idCartera, string idCuenta)
        {

            DataSet dsTablas = new DataSet();
            DataTable correosTable = dsTablas.Tables.Add("Correos");
            correosTable.Columns.Add("idCartera", typeof(int));
            correosTable.Columns.Add("idCuenta", typeof(string));

            DataRow drDatos = correosTable.NewRow();
            drDatos["idCartera"] = idCartera;
            drDatos["idCuenta"] = idCuenta;

            await _ejecutivoService.ObtenerCorreosEJE(drDatos, dsTablas);

            if (!dsTablas.Tables.Contains("Correos") || dsTablas.Tables["Correos"].Rows.Count == 0)
            {
                return NotFound("No se encontraron Correos para este ejecutivo.");
            }

            var listaSeguimientos = ConvertDataTableToList(dsTablas.Tables["Correos"]);
            string jsonString = JsonSerializer.Serialize(listaSeguimientos, new JsonSerializerOptions { WriteIndented = true });

            return Ok(jsonString);

        }

        [HttpGet("CorreosEnviados/{idCartera}/{idCuenta}")]



        public async Task<IActionResult> GetCorreosEnviados(int idCartera, string idCuenta)
        {

            DataSet dsTablas = new DataSet();
            DataTable correosTable = dsTablas.Tables.Add("Correos");
            correosTable.Columns.Add("idCartera", typeof(int));
            correosTable.Columns.Add("idCuenta", typeof(string));

            DataRow drDatos = correosTable.NewRow();
            drDatos["idCartera"] = idCartera;
            drDatos["idCuenta"] = idCuenta;

            await _ejecutivoService.ObtenerEnviadosEJE(drDatos, dsTablas);

            if (!dsTablas.Tables.Contains("Correos") || dsTablas.Tables["Correos"].Rows.Count == 0)
            {
                return NotFound("No se encontraron Correos para este ejecutivo.");
            }

            var listaSeguimientos = ConvertDataTableToList(dsTablas.Tables["Correos"]);
            string jsonString = JsonSerializer.Serialize(listaSeguimientos, new JsonSerializerOptions { WriteIndented = true });

            return Ok(jsonString);

        }

        [HttpGet("CorreosCarga/{idCartera}/{idCuenta}")]
        public async Task<IActionResult> GetCorreosCarga(int idCartera, string idCuenta)
        {

            DataSet dsTablas = new DataSet();
            DataTable correosTable = dsTablas.Tables.Add("Correos");
            correosTable.Columns.Add("idCartera", typeof(int));
            correosTable.Columns.Add("idCuenta", typeof(string));

            DataRow drDatos = correosTable.NewRow();
            drDatos["idCartera"] = idCartera;
            drDatos["idCuenta"] = idCuenta;

            await _ejecutivoService.ObtenerCargaEJE(drDatos, dsTablas);

            if (!dsTablas.Tables.Contains("Correos") || dsTablas.Tables["Correos"].Rows.Count == 0)
            {
                return NotFound("No se encontraron Correos para este ejecutivo.");
            }

            var listaSeguimientos = ConvertDataTableToList(dsTablas.Tables["Correos"]);
            string jsonSeguimientos = JsonSerializer.Serialize(listaSeguimientos, new JsonSerializerOptions { WriteIndented = true });

            return Content(jsonSeguimientos, "application/json; charset=utf-8");


            //return Ok(jsonString);

        }

        [HttpPost("nuevoCorreo")]

        public async Task<IActionResult> NuevoCorreo([FromBody] CorreosRe nuevoCorreoRe, [FromQuery] int idEjecutivo, [FromQuery] int idOrigen = 1805, [FromQuery] bool ValidarDuplicidad = true)
        {
            try
            {
                string resultado = await _ejecutivoService.NuevoCorreoAsync(nuevoCorreoRe, idEjecutivo, idOrigen, ValidarDuplicidad);

                if (string.IsNullOrEmpty(resultado))
                {
                    return Ok("Correo electrónico agregado con éxito.");
                }
                else
                {
                    return BadRequest(resultado); // Devuelve el mensaje de error
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
        [HttpPut("identificar")]
        // Ruta para IdentificaCorreoAsync: /api/correos/identificar
        public async Task<IActionResult> IdentificarCorreo([FromQuery] string correoElectronico, [FromQuery] int idInformacion, [FromQuery] int idCartera, [FromQuery] string idCuenta, [FromQuery] int idEjecutivoInformacion)
        {
            try
            {
                string resultado = await _ejecutivoService.IdentificaCorreoAsync(correoElectronico, idInformacion, idCartera, idCuenta, idEjecutivoInformacion);

                if (string.IsNullOrEmpty(resultado))
                {
                    return Ok("Correo electrónico identificado con éxito.");
                }
                else
                {
                    return BadRequest(resultado); // Devuelve el mensaje de error
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
        [HttpPost("EnviarCorreo")]

        public async Task<IActionResult> EnviarCorreo(string CorreoElectronico, string Asunto, string Mensaje, int idCartera, string idCuenta, int idEjecutivo)
        {
            try
            {
                var resultado = await _ejecutivoService.EnviaCorreoAsync(CorreoElectronico, Asunto, Mensaje, idCartera, idCuenta, idEjecutivo);
                if (string.IsNullOrEmpty(resultado))
                {
                    return Ok("Correo enviado correctamente.");
                }
                else
                {
                    return BadRequest(resultado);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
        #endregion

        #region Gestiones Telefonicas


        [HttpGet("ObtenerGestiones")]
        public async Task<IActionResult> ObtenerGestiones([FromQuery] int idCartera, [FromQuery] string idCuenta)
        {
            try
            {
                DataTable table = new DataTable();
                table.Columns.Add("idCartera", typeof(int));
                table.Columns.Add("idCuenta", typeof(string));


                DataRow drInfo = table.NewRow();
                drInfo["idCartera"] = idCartera;
                drInfo["idCuenta"] = idCuenta;

                DataTable gestiones = await _ejecutivoService.ObtieneGestionesAsync(drInfo);

                if (gestiones == null || gestiones.Rows.Count == 0)
                {
                    return NotFound("No se encontraron gestiones para los parámetros proporcionados.");
                }

                var listaGestiones = ConvertDataTableToList(gestiones); // Asume que tienes este método

                string jsonString = JsonSerializer.Serialize(listaGestiones, new JsonSerializerOptions { WriteIndented = true });

                return Ok(jsonString);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }


        [HttpPost("GuardarGestionTe")]
        [ProducesResponseType(typeof(GuardarGestionResponse), 200)] // Indica la estructura de la respuesta exitosa en Swagger
        [ProducesResponseType(400)] // Indica una solicitud incorrecta en Swagger
        [ProducesResponseType(500)]
        public async Task<IActionResult> GuardarGestionTelefonica([FromBody] GestionTelefonica gestion)
        {
            if (gestion == null)
            {
                return BadRequest(new { Message = "Datos de gestión no válidos.", Data = gestion });
            }

            var resultadoGuardado = await _ejecutivoService.GuardaGestionTelefonicaAsync(gestion);

            if (resultadoGuardado.Item1) // La operación de guardado fue exitosa
            {
                var response = new GuardarGestionResponse
                {
                    Data = new
                    {
                        Gestion = gestion,
                        StoreOutput = resultadoGuardado.Item2 // Incluye los valores de salida del Stored Procedure
                    },
                    Message = "Gestión guardada exitosamente."
                };
                return Ok(response);
            }
            else
            {
                return BadRequest(new { Message = "Error al guardar la gestión.", Data = gestion });
            }
        }

        // Definición de la clase de respuesta (si no la tienes ya)
        public class GuardarGestionResponse
        {
            public object Data { get; set; }
            public string Message { get; set; }
        }

        [HttpPost("save-gestion-telefonica")]
        public async Task<IActionResult> TerminaFlujo([FromBody] EndGestionRequest infoTermina)
        {
            var resultado = await _ejecutivoService.GuardarGestionTelefonica(infoTermina);

            if (resultado != null)
            {
                return Ok(resultado);
            }
            else
            {
                return NotFound();
            }
        }
        #endregion

        #region Todo
        [HttpGet("detalles-cuenta/{idCuenta}/{idCartera}")]
        public async Task<IActionResult> GetDetallesCuenta(string idCuenta, int idCartera)
        {
            if (string.IsNullOrEmpty(idCuenta) || idCartera <= 0)
            {
                return BadRequest("Los parámetros 'idCuenta' y 'idCartera' son obligatorios y deben ser válidos.");
            }

            var detalles = await _ejecutivoService.ObtenerDetallesCuenta(idCuenta, idCartera);

            if (detalles == null)
            {
                return NotFound($"No se encontraron detalles para la cuenta '{idCuenta}' y cartera '{idCartera}'.");
            }

            return Ok(detalles);
        }
        #endregion

        #region Adicionales
        [HttpGet("Adicionales{idCartera}/{idCuenta}")]

        public async Task<IActionResult> GetAdicionales(int idCartera, string idCuenta)
        {
            try
            {
                DataTable adicionales = await _ejecutivoService.GetAdiccionalesAsync(idCartera, idCuenta);

                if (adicionales == null || adicionales.Rows.Count == 0)
                {
                    return NotFound("No se encontraron adicionales para la cartera y cuenta especificadas.");
                }

                // Convertir DataTable a lista de diccionarios
                var listaAdicionales = ConvertDataTableToList(adicionales);

                // Serializar la lista a JSON
                string jsonString = JsonSerializer.Serialize(listaAdicionales, new JsonSerializerOptions { WriteIndented = true });

                return Ok(jsonString);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }
        [HttpPost("AñadirAdicional")]
        public async Task<IActionResult> AñadirAdicional([FromBody] AñadirAdicionalRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                NoriAPI.Models.Ejecutivo.Adicional adicional = new NoriAPI.Models.Ejecutivo.Adicional
                {
                    Nombre = request.Nombre,
                    IdParentesco = request.IdParentesco,
                    NumeroTelefonico = request.NumeroTelefonico
                };

                DataTable drInfoTable = ConvertJObjectToDataTable(request.DrInfo);
                NoriAPI.Models.Ejecutivo.Ejecutivo ejecutivo = ConvertJObjectToEjecutivo(request.Ejecutivo);
                NoriAPI.Models.Catalogos catalogos = ConvertJObjectToCatalogos(request.Catalogos);

                DataRow drInfoRow = drInfoTable.Rows.Count > 0 ? drInfoTable.Rows[0] : null;

                DataTable adicionales = new DataTable();

                string resultado = await _ejecutivoService.AñadeAdicionalAsync(adicional, drInfoRow, ejecutivo, adicionales, catalogos);

                if (string.IsNullOrEmpty(resultado))
                {
                    return Ok("Adicional añadido correctamente.");
                }
                else
                {
                    return BadRequest(resultado);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        private DataTable ConvertJObjectToDataTable(JObject jObject)
        {
            DataTable dataTable = new DataTable();

            if (jObject != null && jObject["itemArray"] is JArray itemArray)
            {
                if (itemArray.Count > 0 && itemArray[0] is JObject firstRow)
                {
                    foreach (var property in firstRow.Properties())
                    {
                        dataTable.Columns.Add(property.Name, typeof(string));
                    }

                    foreach (JObject row in itemArray)
                    {
                        DataRow dataRow = dataTable.NewRow();
                        foreach (DataColumn column in dataTable.Columns)
                        {
                            dataRow[column.ColumnName] = row[column.ColumnName]?.ToString();
                        }
                        dataTable.Rows.Add(dataRow);
                    }
                }
            }
            return dataTable;
        }

        private NoriAPI.Models.Ejecutivo.Ejecutivo ConvertJObjectToEjecutivo(JObject jObject)
        {
            if (jObject != null && jObject["datos"] is JObject datos)
            {
                DataTable dt = new DataTable();
                foreach (var property in datos.Properties())
                {
                    dt.Columns.Add(property.Name, typeof(object));
                }
                DataRow dr = dt.NewRow();
                foreach (var property in datos.Properties())
                {
                    dr[property.Name] = property.Value;
                }
                dt.Rows.Add(dr);
                return new NoriAPI.Models.Ejecutivo.Ejecutivo(dt.Rows[0]);
            }
            return null;
        }

        private NoriAPI.Models.Catalogos ConvertJObjectToCatalogos(JObject jObject)
        {
            NoriAPI.Models.Catalogos catalogos = new NoriAPI.Models.Catalogos();
            if (jObject != null && jObject["respuestasFlujo"] is JObject respuestasFlujo)
            {
                catalogos.respuesta = respuestasFlujo["respuesta"]?.ToString();
            }
            return catalogos;
        }

        [HttpGet("NegociacionesDelMesEje/{idEjecutivo}")]

        public async Task<IActionResult> GetNegociacionesEjecutivo(int idEjecutivo)
        {
            try
            {
                DataSet dsTablas = new DataSet();
                DataTable ejecutivosTable = dsTablas.Tables.Add("Ejecutivos");
                ejecutivosTable.Columns.Add("idEjecutivo", typeof(int));
                DataRow drDatos = ejecutivosTable.NewRow();
                drDatos["idEjecutivo"] = idEjecutivo;

                await _ejecutivoService.ObtieneNegociacionesEjecutivosAsync(drDatos, dsTablas);

                if (!dsTablas.Tables.Contains("Negociaciones") || dsTablas.Tables["Negociaciones"].Rows.Count == 0)
                {
                    return NotFound("No se encontraron recordatorios para este ejecutivo.");
                }

                // Convertimos el DataTable a una lista de diccionarios
                var listaSeguimientos = ConvertDataTableToList(dsTablas.Tables["Negociaciones"]);

                // Serializamos la lista a JSON
                string jsonString = JsonSerializer.Serialize(listaSeguimientos, new JsonSerializerOptions { WriteIndented = true });

                return Ok(jsonString);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
        }

        [HttpPut("ClasificaTelefono")]
        public async Task<IActionResult> ClasificaTelefono(int idCartera, string idCuenta, long numeroTelefonico, int idClase, int idEjecutivoClasificacion)
        {
            string resultado = await _ejecutivoService.ClasificaTelefonoAsignadoAsync(idCartera, idCuenta, numeroTelefonico, idClase, idEjecutivoClasificacion);

            if (string.IsNullOrEmpty(resultado))
            {
                return Ok("Teléfono clasificado exitosamente.");
            }
            else
            {
                return BadRequest(resultado);
            }
        }

    }

    public class AñadirAdicionalRequest
    {
        public string Nombre { get; set; }
        public int IdParentesco { get; set; }
        public string NumeroTelefonico { get; set; }
        public JObject DrInfo { get; set; }
        public JObject Ejecutivo { get; set; }

        public JObject Catalogos { get; set; }
    }
    #endregion


}



