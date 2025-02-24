using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using NoriAPI.Models.Login;
using Microsoft.Extensions.Configuration;
using NoriAPI.Services;
using System.Threading.Tasks;
using System;
using System.Collections.Generic;
using NoriAPI.Models.Busqueda;
using Microsoft.AspNetCore.Authorization;

namespace NoriAPI.Controllers
{
    [ApiController]
    [Route("api/search-customer")]
<<<<<<< HEAD
    //[Authorize]
    public class CustomerSearchController : ControllerBase
=======
    [Authorize]
    public class CustomerSearchController : Controller
>>>>>>> Mark-10-Tiempos

    {
        private readonly IConfiguration _configuration;
        private readonly ISearchService _searchService;

        public CustomerSearchController(IConfiguration configuration, ISearchService searchService)
        {
            _configuration = configuration;
            _searchService = searchService;

        }

        [HttpGet("busqueda-cuenta")]//Endpoint Padrino
        //public async Task<ActionResult<ResultadoBusqueda>> Busqueda([FromBody] Busqueda request)
        public async Task<ActionResult<ResultadoBusqueda>> Busqueda([FromQuery] string filtro, string ValorBusqueda)
        {            
            var Busqueda = await _searchService.ValidateBusqueda(filtro, ValorBusqueda);

            if (!Busqueda.Mensaje.IsNullOrEmpty())
            {
                return BadRequest(new { Busqueda.Mensaje });

            }
            return Ok(new { Busqueda.ListaResultados });
        }

<<<<<<< HEAD
        [HttpGet("automatico-ejecutivo")]//Endpoint Padrino
        public async Task<ActionResult<ResultadoAutomatico>> Automatico([FromQuery] int numEmpleado)
=======
        [HttpGet("productividad-ejecutivo")]//Endpoint Padrino
        public async Task<ActionResult<ResultadoProductividad>> Productividad([FromQuery] int NumEmpleado)
>>>>>>> Mark-10-Tiempos
        {
            var Automatico = await _searchService.ValidateAutomatico(numEmpleado);

            if (!Automatico.Mensaje.IsNullOrEmpty())
            {
                return Ok(new { Automatico.Mensaje });

            }
<<<<<<< HEAD
            return Ok(Automatico.Cuenta);
=======
            return Ok(new { Productividad.Mensaje });
>>>>>>> Mark-10-Tiempos
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
