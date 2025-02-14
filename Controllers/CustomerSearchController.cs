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
    [Authorize]
    public class CustomerSearchController : Controller

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

        [HttpGet("productividad-ejecutivo")]//Endpoint Padrino

        public async Task<ActionResult<ResultadoProductividad>> Productividad([FromQuery] int NumEmpleado)
        {
            var Productividad = await _searchService.ValidateProductividad(NumEmpleado);

            if(!Productividad.Mensaje.IsNullOrEmpty()) 
            { 
                return BadRequest(new { Productividad.Mensaje }); 
            }
            return Ok(new { Productividad.Mensaje });


        }


    }
}
