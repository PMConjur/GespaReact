using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using NoriAPI.Models.Busqueda;
using NoriAPI.Models.Ejecutivo;
using NoriAPI.Models.Login;
using NoriAPI.Services;
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

        
    }
}
