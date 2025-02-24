using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Configuration;
using NoriAPI.Services;
using System.Threading.Tasks;
using System.Collections.Generic;
using NoriAPI.Models.Busqueda;
using Microsoft.AspNetCore.Authorization;

namespace NoriAPI.Controllers
{
    [ApiController]
    [Route("api/search-customer")]
    [Authorize]
    public class CustomerSearchController : ControllerBase

    {
        private readonly IConfiguration _configuration;
        private readonly ISearchService _searchService;

        public CustomerSearchController(IConfiguration configuration, ISearchService searchService)
        {
            _configuration = configuration;
            _searchService = searchService;

        }

        [HttpGet("busqueda-cuenta")]//Endpoint Padrino
        public async Task<ActionResult<ResultadoBusqueda>> Busqueda([FromQuery] string filtro, string ValorBusqueda)
        {
            var Busqueda = await _searchService.ValidateBusqueda(filtro, ValorBusqueda);

            if (!Busqueda.Mensaje.IsNullOrEmpty())
            {
                return BadRequest(new { Busqueda.Mensaje });

            }
            return Ok(new { Busqueda.ListaResultados });
        }

        [HttpGet("automatico-ejecutivo")]//Endpoint Padrino
        public async Task<ActionResult<ResultadoAutomatico>> Automatico([FromQuery] int numEmpleado)

        {
            var Automatico = await _searchService.ValidateAutomatico(numEmpleado);

            if (!Automatico.Mensaje.IsNullOrEmpty())
            {
                return Ok(new { Automatico.Mensaje });
            }


            return Ok(Automatico.Cuenta);

        }

        [HttpGet("phones")]
        public async Task<ActionResult<IEnumerable<Phone>>> GetPhones(string idCuenta)
        {
            var phones = await _searchService.FetchPhones(idCuenta);
            if (phones == null || phones.Count == 0)
            {
                return NotFound();
            }
            return Ok(phones);
        }

    }
}