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
                string jsonString = JsonSerializer.Serialize(listaNegociaciones, new JsonSerializerOptions { WriteIndented = true });

                //dsTablas.Tables.Add(Negociaciones);

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
