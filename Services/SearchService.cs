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
        Task<ResultadoBusqueda> ValidateBusqueda(string filtro, string ValorBusqueda);
        Task<ResultadoProductividad> ValidateProductividad(int NumEmpleado);

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

        public async Task<ResultadoBusqueda> ValidateBusqueda(string filtro, string ValorBusqueda)
        {
            string mensaje = null;
            BusquedaInfo busquedaInfo = null;


            var validateBusqueda = await _searchRepository.ValidateBusqueda(filtro, ValorBusqueda);

            var busq = (IDictionary<string, object>)validateBusqueda;

            if (busq == null)
            {
                mensaje = "No se encontro Informacion";
                var resultadoBusqueda = new ResultadoBusqueda(mensaje, null);
                return resultadoBusqueda;
            }
            else
            {
                busquedaInfo = MapToInfoBusqueda(busq);
                var resultadoBusqueda = new ResultadoBusqueda(mensaje, busquedaInfo);
                return resultadoBusqueda;
            }
        }


        public async Task<ResultadoProductividad> ValidateProductividad(int NumEmpeado)
        {
            string mensaje = null;

            var validateProductividad = await _searchRepository.ValidateProductividad(NumEmpeado);

            if (validateProductividad == null)
            {
                mensaje = "No se encontro informacion";
                var resultadoProductividad = new ResultadoProductividad(mensaje);
                return resultadoProductividad;
            }
            else
            {
                var resultadoProductividad = new ResultadoProductividad(mensaje);
                return resultadoProductividad;
            }

        }

        private static BusquedaInfo MapToInfoBusqueda(IDictionary<string, object> busq)
        {
            var busqueda = new BusquedaInfo();

            if (busq.TryGetValue("Cuenta", out var idCuenta) && idCuenta != null)
                busqueda.IdCuenta = idCuenta.ToString();

            if (busq.TryGetValue("Cartera", out var cartera) && cartera != null)
                busqueda.Cartera = cartera.ToString();

            if (busq.TryGetValue("Producto", out var producto) && producto != null)
                busqueda.Producto = producto.ToString();

            if (busq.TryGetValue("Nombre", out var nombre) && nombre != null)
                busqueda.NombreDeudor = nombre.ToString();

            if (busq.TryGetValue("RFC", out var rfc) && rfc != null)
                busqueda.RFC = rfc.ToString();

            if (busq.TryGetValue("NúmeroCliente", out var numCliente) && numCliente != null)
                busqueda.NumeroCliente = numCliente.ToString();

            if (busq.TryGetValue("Situación", out var situacion) && situacion != null)
                busqueda.Situacion = situacion.ToString();

            if (busq.TryGetValue("idCartera", out var idCartera) && idCartera != null)
                busqueda.IdCartera = idCartera.ToString();

            return busqueda;

        }

    }
}
