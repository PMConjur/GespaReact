using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using NoriAPI.Models.Busqueda;
using NoriAPI.Models.Ejecutivo;
using NoriAPI.Models.Login;
using NoriAPI.Services;
using System.Collections.Generic;
using System.Data;
using System.Text.Json;
using System;
using System.Threading.Tasks;

namespace NoriAPI.Controllers
{
    [ApiController]
    [Route("api/ejecutivo")]
    public class EjecutivoController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IEjecutivoService _ejecutivoService;

        public EjecutivoController(IEjecutivoService ejecutivoService, IConfiguration configuration)
        {
            _ejecutivoService = ejecutivoService;
            _configuration = configuration;

        }

        [HttpGet("tiempos-ejecutivo")]//Endpoint C#
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
        [HttpGet("seguimientos/{idCartera}/{idCuenta}")]
        public async Task<IActionResult> GetSeguimiento(int idCartera,string idCuenta)
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

                // Convertimos el DataTable a una lista de diccionarios
                var listaSeguimientos = ConvertDataTableToList(dsTablas.Tables["Seguimiento"]);

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

                // Convertimos el DataTable a una lista de diccionarios
                var listaSeguimientos = ConvertDataTableToList(dsTablas.Tables["Accionamiento"]);

                // Serializamos la lista a JSON
                string jsonString = JsonSerializer.Serialize(listaSeguimientos, new JsonSerializerOptions { WriteIndented = true });

                return Ok(jsonString);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno del servidor: {ex.Message}");
            }
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


    }
}
