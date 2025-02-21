using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using NoriAPI.Models.Busqueda;
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
        private readonly IEjecutivoServiceRefactor _ejecutivoServiceRefactor;

        public EjecutivoController(IEjecutivoService ejecutivoService, IEjecutivoServiceRefactor ejecutivoServiceRefactor, IConfiguration configuration)
        {
            _ejecutivoService = ejecutivoService;
            _ejecutivoServiceRefactor = ejecutivoServiceRefactor;
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
        
        [HttpGet("productividad-ejecutivo-refactor")]//Endpoint Padrino
        public async Task<ActionResult<ResultadoProductividad>> ProductividadRefactor([FromQuery] int numEmpleado)
        {
            var Productividad = await _ejecutivoServiceRefactor.ValidateProductividad(numEmpleado);

            if (!Productividad.Mensaje.IsNullOrEmpty())
            {
                return Ok(new { Productividad.ProductividadInfo });
            }
            return Ok(new { Productividad.ProductividadInfo });

        }


    }
}
