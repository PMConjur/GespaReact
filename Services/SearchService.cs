﻿using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using NoriAPI.Repositories;
using System;
using NoriAPI.Models;
using NoriAPI.Models.Login;
using System.Threading.Tasks;
using NoriAPI.Models.Busqueda;
using System.Linq;
using System.Data;

namespace NoriAPI.Services
{
    public interface ISearchService
    {
        Task<ResultadoBusqueda> ValidateBusqueda(string filtro, string ValorBusqueda);
        Task<ResultadoProductividad> ValidateProductividad(int NumEmpleado);
        Task<ResultadoAutomatico> ValidateAutomatico(int numEmpleado);
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
            List<BusquedaInfo> listaBusquedaInfo = new List<BusquedaInfo>();

            var validateBusqueda = await _searchRepository.ValidateBusqueda(filtro, ValorBusqueda);

            if (validateBusqueda == null)
            {
                mensaje = "No se encontró información";
                return new ResultadoBusqueda(mensaje, null);
            }

            // 🔹 Si Dapper devuelve una sola fila, lo convierte en un diccionario
            if (validateBusqueda is IDictionary<string, object> singleRow)
            {
                var busquedaInfo = MapToInfoBusqueda(singleRow);
                return new ResultadoBusqueda(mensaje, new List<BusquedaInfo> { busquedaInfo });
            }

            // 🔹 Si Dapper devuelve múltiples filas, las convertimos en una lista de diccionarios
            var listaDiccionarios = ((IEnumerable<dynamic>)validateBusqueda)
                .Select(item => (IDictionary<string, object>)item)
                .ToList();

            if (!listaDiccionarios.Any())
            {
                mensaje = "No se encontró información";
                return new ResultadoBusqueda(mensaje, new List<BusquedaInfo>());
            }

            // 🔹 Convertir a lista de `BusquedaInfo`
            listaBusquedaInfo = listaDiccionarios.Select(MapToInfoBusqueda).ToList();

            return new ResultadoBusqueda(mensaje, listaBusquedaInfo);

        }        
        public async Task<ResultadoAutomatico> ValidateAutomatico(int numEmpleado)
        {
            string mensaje = null;
            var automaticoInfo = await _searchRepository.ValidateAutomatico(numEmpleado);
            var dict = (IDictionary<string, object>)automaticoInfo;
                      
            if(dict.TryGetValue("Mensaje", out object mensajeAuto) && mensajeAuto != null)
            {
                mensaje = mensajeAuto.ToString();
                return new ResultadoAutomatico(mensaje, null);
            }

            var automatico = MapInfoAutomatico(dict);
            var resultadoAutomatico = new ResultadoAutomatico(mensaje, automatico);
            return resultadoAutomatico;
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
        private static AutomaticoInfo MapInfoAutomatico(IDictionary<string, object> auto)
        {
            var automatico = new AutomaticoInfo();

            if(auto.TryGetValue("idCartera", out var idcartera) && idcartera != null)
                automatico.idCartera = idcartera.ToString();

            if (auto.TryGetValue("idCuenta", out var idcuenta) && idcuenta != null)
                automatico.idCuenta = idcuenta.ToString();

            if (auto.TryGetValue("NúmeroTelefónico", out var numerotelefonico) && numerotelefonico != null)
                automatico.numeroTelefonico = numerotelefonico.ToString();

            return automatico;
        }
        

        #region Productividad
        public async Task<ResultadoProductividad> ValidateProductividad(int NumEmpleado)
        {
            string mensaje = null;

            var productividadInfo = await _searchRepository.ValidateProductividad(NumEmpleado);
            //var prod = (IDictionary<string, object>)productividadInfo;
            // Convertir productividadInfo a DataTable
            DataTable dt = (DataTable)productividadInfo;

            // Verificar que tenga al menos una fila
            //if (dt.Rows.Count > 0)
            //{
            //    
            //}

            // Tomar la primera fila y convertirla en un diccionario
            var prod = dt.Rows[0]
                .Table.Columns.Cast<DataColumn>()
                .ToDictionary(col => col.ColumnName, col => dt.Rows[0][col]);
            // Ahora 'prod' es un Dictionary<string, object> con los valores de la primera fila

            var productividad = MapToInfoProductividad(prod);
            var resultadoProductividad = new ResultadoProductividad(mensaje, productividad);
            return resultadoProductividad;
        }
        private static ProductividadInfo MapToInfoProductividad(IDictionary<string, object> prod)
        {
            var productividad = new ProductividadInfo();

            if (prod.TryGetValue("Negociaciones", out var negociaciones) && negociaciones != null)
                productividad.Negociaciones = negociaciones.ToString();

            if (prod.TryGetValue("Cuentas", out var cuentas) && cuentas != null)
                productividad.Cuentas = cuentas.ToString();

            if (prod.TryGetValue("Titulares", out var titulares) && titulares != null)
                productividad.Titulares = titulares.ToString();

            if (prod.TryGetValue("Conocidos", out var conocidos) && conocidos != null)
                productividad.Conocidos = conocidos.ToString();

            if (prod.TryGetValue("Desconocidos", out var desconocidos) && desconocidos != null)
                productividad.Desconocidos = desconocidos.ToString();

            if (prod.TryGetValue("SinContacto", out var sincontacto) && sincontacto != null)
                productividad.SinContacto = sincontacto.ToString();

            return productividad;

        }

        #endregion






    }
}
