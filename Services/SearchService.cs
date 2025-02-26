using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using NoriAPI.Repositories;
using System;
using NoriAPI.Models;
using NoriAPI.Models.Login;
using System.Threading.Tasks;
using NoriAPI.Models.Busqueda;
using System.Linq;
using System.Data;
using Microsoft.AspNetCore.Mvc;
using System.Numerics;
using Microsoft.Data.SqlClient;
using NoriAPI.Models.Ejecutivo;
using System.Reflection;
using System.Text.RegularExpressions;


namespace NoriAPI.Services
{
    public interface ISearchService
    {
        Task<ResultadoBusqueda> ValidateBusqueda(string filtro, string ValorBusqueda);
        Task<ResultadoAutomatico> ValidateAutomatico(int numEmpleado);
        Task<List<Phone>> FetchPhones(string idCuenta);
        Task<Dictionary<string, object>> CalculateProductData(string idCuenta);
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

            if (dict == null)
            {
                mensaje = "Sin información.";
                return new ResultadoAutomatico(mensaje, null);
            }
            else
            {
                if (dict.TryGetValue("Mensaje", out object mensajeAuto) && mensajeAuto != null)//
                {
                    mensaje = mensajeAuto.ToString();
                    return new ResultadoAutomatico(mensaje, null);
                }
                else
                {
                    var automatico = MapInfoAutomatico(dict);
                    var resultadoAutomatico = new ResultadoAutomatico(mensaje, automatico);
                    return resultadoAutomatico;
                }
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

            if (busq.TryGetValue("Saldo", out var saldo) && saldo != null)
                busqueda.Saldo = saldo.ToString();

            if (busq.TryGetValue("Fecha_CambioActivación", out var activada) && activada != null && activada is DateTime dateTime)
            {
                busqueda.FechaActivacion = DateOnly.FromDateTime(dateTime);
            }

            if (busq.TryGetValue("Expediente", out var expediente) && expediente != null)
                busqueda.Expediente = expediente.ToString();


            return busqueda;

        }
        private static AutomaticoInfo MapInfoAutomatico(IDictionary<string, object> auto)
        {
            var automatico = new AutomaticoInfo();

            if (auto.TryGetValue("idCartera", out var idcartera) && idcartera != null)
                automatico.idCartera = idcartera.ToString();

            if (auto.TryGetValue("idCuenta", out var idcuenta) && idcuenta != null)
                automatico.idCuenta = idcuenta.ToString();

            if (auto.TryGetValue("NúmeroTelefónico", out var numerotelefonico) && numerotelefonico != null)
                automatico.numeroTelefonico = numerotelefonico.ToString();
            return automatico;
        }

        public async Task<List<Phone>> FetchPhones(string idCuenta)
        {
            var phonesList = await _searchRepository.GetPhones(idCuenta, 1);

            return phonesList;
        }

        public async Task<Dictionary<string, object>> CalculateProductData(string idCuenta)
        {
            var resultado = new Dictionary<string, object>();

            var camposPantalla = await _searchRepository.GetCamposPantalla(1, 1);
            var producto = await _searchRepository.GetProducto(idCuenta);

            DateTime? limitDay = null;
            if (((IDictionary<string, object>)producto).ContainsKey("batchdate"))
            {
                limitDay = Convert.ToDateTime(producto.batchdate);
                resultado["Dif_diasTotales"] = (DateTime.Now - limitDay.Value).Days;
            }

            foreach (var campo in camposPantalla)
            {
                string nombreCampo = campo.NombreCampo;

                // ✅ Asegurar que el resultado de CampoCalculado se espere correctamente
                object valorCampo = await CampoCalculado(producto, nombreCampo, idCuenta);
                object valorFormateado = Formato(valorCampo, campo.IdFormatoCampo);

                resultado[nombreCampo] = valorFormateado;
            }

            return resultado;
        }




        public async Task<object> CampoCalculado(dynamic producto, string expresion, string idCuenta)
        {
            // Obtener los valores del producto desde la base de datos
            //var producto = await _searchRepository.GetProducto(idCuenta);
            if (producto == null)
                return "";

            // Convertir el resultado en un diccionario (clave: nombre del campo, valor: contenido del campo)
            var valoresProducto = ((IDictionary<string, object>)producto)
                .ToDictionary(k => k.Key, v => v.Value ?? "");

            string[] campos = expresion.Split(new char[] { '[', ']' }, StringSplitOptions.RemoveEmptyEntries);
            string resultado = expresion;

            foreach (var campo in campos)
            {
                if (valoresProducto.ContainsKey(campo))
                {
                    resultado = resultado.Replace("[" + campo + "]", valoresProducto[campo].ToString().Trim());
                }
            }

            if (expresion.StartsWith("#"))
            {
                return EvaluateDate(resultado.Replace("#", ""));
            }
            else if (campos.Length > 1 && (expresion.Contains("+") || expresion.Contains("-") || expresion.Contains("*") || expresion.Contains("/") || expresion.Contains("^")))
            {
                return Evaluate(resultado);
            }

            return resultado;
        }

        /// <summary>
        /// Cambia el formato del texto
        /// </summary>
        /// <param name="Texto">Texto que va cambiar el formato.</param>
        /// <param name="Formato">1 Texto, 2 Número, 3 Moneda, 4 Fecha</param>
        static public string Formato(object Texto, object Formato)
        {

            if (Texto == null)
                return "";

            string sTexto = Texto.ToString();

            switch (Formato.ToString())
            {
                case "2":
                    double fTexto;
                    sTexto = double.TryParse(sTexto, out fTexto) ? fTexto.ToString("#,#") : sTexto;
                    break;

                case "3":
                    double dTexto;
                    sTexto = double.TryParse(sTexto, out dTexto) ? dTexto.ToString("$ #,#.00") : sTexto; //C2
                    break;

                case "4":
                    sTexto = sTexto.Replace("12:00:00 a.m.", "");
                    DateTime dtTexto = new DateTime();
                    if (TryParseDate(sTexto, out dtTexto))
                        sTexto = dtTexto.ToString("dd/MM/yyyy");
                    break;

                case "5":
                    double pTexto;
                    sTexto = double.TryParse(sTexto, out pTexto) ? Math.Round(pTexto * 100, 0) + " %" : sTexto;
                    break;
            }

            return sTexto;
        }

        /// <summary>
        /// Evalua una expresión aritmética y devuelve el resultado, 0 si fue incorrecta.
        /// </summary>
        /// <param name="Tabla">Expresión aritmética.</param>  
        /// <param name="Número">Indica si se va a devolver un número</param>
        /// <param name="Fecha">Indica si se va a evaluar una fecha</param>
        static public double Evaluate(string expression)
        {

            if (Regex.Matches(expression, @"[a-zA-Z]").Count > 0)
                return 0;

            DataTable dtExpression = new DataTable();
            double dEvaluation = 0;
            expression = expression.Replace("%", "/100");

            try
            {
                dtExpression.Columns.Add(new DataColumn("Eval", typeof(double), expression));
                dtExpression.Rows.Add(dtExpression.NewRow());
                double.TryParse(dtExpression.Rows[0]["Eval"].ToString(), out dEvaluation);
            }
            catch (Exception)
            {
                //ErrorLogClass.LogError("Evaluate", expression);
            }

            return dEvaluation;
        }

        static public object EvaluateDate(string expression)
        {

            if (Regex.Matches(expression, @"[a-zA-Z]").Count > 0)
                return new DateTime(0);

            DateTime dtPrimero = new DateTime();
            DateTime dtSegundo = new DateTime();
            int iDías = 0;

            string[] sExpresión = expression.Trim().Split(' ');


            if (sExpresión.Length != 3 || !TryParseDate(sExpresión[0], out dtPrimero))
                return "";

            switch (sExpresión[1])
            {

                case "+":
                    if (int.TryParse(sExpresión[2], out iDías))
                        return dtPrimero.AddDays(iDías);
                    break;

                case "-":
                    if (TryParseDate(sExpresión[2], out dtSegundo))
                        return (dtPrimero - dtSegundo).TotalDays;
                    else if (int.TryParse(sExpresión[2], out iDías))
                        return dtPrimero.AddDays(-iDías);
                    break;
            }

            return sExpresión[0];
        }

        static public bool TryParseDate(string Text, out DateTime Date)
        {
            if (DateTime.TryParse(Text, out Date) ||
                        DateTime.TryParseExact(Text, new string[] { "yyyyMMdd" }, null, System.Globalization.DateTimeStyles.None, out Date))
                return true;
            return false;
        }

    }
}
