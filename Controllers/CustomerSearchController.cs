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
    //[Authorize]
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
        //public async Task<ActionResult<ResultadoBusqueda>> Busqueda([FromBody] Busqueda request)
        public async Task<ActionResult<ResultadoBusqueda>> Busqueda([FromQuery] string filtro, string ValorBusqueda)
        {
            // Lista de valores permitidos para el filtro
            var valoresPermitidos = new List<string> { "Cuenta", "Nombre", "RFC", "Numero Cliente", "Telefono", "Expediente" }; // Valores contenidos en ValidateBusqueda de SearchRepository.

            // Validar si el filtro está en la lista de valores permitidos
            if (!valoresPermitidos.Contains(filtro))
            {
                return BadRequest(new { Mensaje = "El valor del filtro no es válido." });
            }

            var Busqueda = await _searchService.ValidateBusqueda(filtro, ValorBusqueda);

            if (!Busqueda.Mensaje.IsNullOrEmpty())
            {
                return BadRequest(new { Busqueda.Mensaje });

            }
            return Ok(new { Busqueda.ListaResultados });
        }

        [HttpGet("productividad-ejecutivo")]//Endpoint Padrino
        public async Task<ActionResult<ResultadoProductividad>> Productividad([FromQuery] int NumEmpleado)
        {
            var Productividad = await _searchService.ValidateProductividad(NumEmpleado);

            if (!Productividad.Mensaje.IsNullOrEmpty())
            {
                return Ok(new { Productividad.Mensaje });
            }
            return Ok(new { Productividad.Mensaje });


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

    }
}
