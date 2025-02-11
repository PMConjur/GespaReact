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

namespace NoriAPI.Controllers
{
    [ApiController]
    [Route("api/Search")]
    public class SearchController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly ISearchService _searchService;

        public SearchController(IConfiguration configuration, ISearchService searchService)
        {
            _configuration = configuration;
            _searchService = searchService;

        }



        [HttpGet("busqueda-cuenta")]//Endpoint Padrino
        //public async Task<ActionResult<ResultadoBusqueda>> Busqueda([FromBody] Busqueda request)
        public async Task<ActionResult<ResultadoBusqueda>> Busqueda([FromQuery] string filtro)
        {
            var Busqueda = await _searchService.ValidateBusqueda(filtro);

            if (!Busqueda.Mensaje.IsNullOrEmpty())
            {
                return Unauthorized(new { Busqueda });

            }

            return Ok(new { Busqueda });

        }













    }
}
