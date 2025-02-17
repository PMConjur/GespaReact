using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using NoriAPI.Models.Ejecutivo;
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


        [HttpGet("obtiene-negociaciones")]
        public async Task<IActionResult> ObtieneNegociaciones([FromQuery] int idEjecutivo)
        {
            var negociaciones = await _ejecutivoService.ObtenerNegociaciones(idEjecutivo);

            if (negociaciones.ConteoHoy == null)
            {
                return BadRequest(new { Mensaje = "No se encontraron negociaciones" });
            }

            return Ok( negociaciones );
        }
      

    }
}
