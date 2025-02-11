using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using NoriAPI.Repositories;
using System;
using NoriAPI.Models;
using NoriAPI.Models.Login;
using System.Threading.Tasks;
using NoriAPI.Models.Busqueda;

namespace NoriAPI.Services
{
    public interface ISearchService
    {
        Task<ResultadoBusqueda> ValidateBusqueda(string filtro);

    }


    public class SearchService : ISearchService
    {

        private readonly IConfiguration _configuration;
        private readonly ISearchRepository _searchRepository;

        public SearchService(IConfiguration configuration, ISearchRepository searchRepository)
        {
            _configuration = configuration;
            _searchRepository = searchRepository;

        }

        public async Task<ResultadoBusqueda> ValidateBusqueda(string filtro)
        {
            string mensaje = null;

            var validatebusqueda = await _searchRepository.ValidateBusqueda(filtro);

            var busq = (IDictionary<string, object>)validatebusqueda;
            if(busq.TryGetValue("Mensaje",out object mensajeObj) && mensajeObj != null)
            {
                mensaje = mensajeObj.ToString();
                return new ResultadoBusqueda(mensaje);
            }
            var resultadoBusqueda = new ResultadoBusqueda(mensaje);
            return resultadoBusqueda;

        }




    }
}
