using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using NoriAPI.Models.Busqueda;
using NoriAPI.Models.Ejecutivo;
using NoriAPI.Models.Login;

using NoriAPI.Services;
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

        [HttpGet("productividad-ejecutivo")]//Endpoint Padrino
        public async Task<ActionResult<ResultadoProductividad>> Productividad([FromQuery] int numEmpleado)
        {
            var Productividad = await _ejecutivoService.ValidateProductividad(numEmpleado);

            if (!Productividad.Mensaje.IsNullOrEmpty())
            {
                return Ok(new { Productividad.ProductividadInfo });
            }
            return Ok(new { Productividad.ProductividadInfo });

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
            var recuperacion = await _ejecutivoService.GetRecuperacion(idEjecutivo, actual);

            if (recuperacion == null)
            {
                return BadRequest(new { Mensaje = "No se pudo obtener la recuperación del ejecutivo." });
            }

            return Ok(recuperacion);
        }
    }
}
