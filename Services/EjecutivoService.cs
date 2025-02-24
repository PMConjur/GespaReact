using Microsoft.Extensions.Configuration;
using NoriAPI.Models;
using NoriAPI.Models.Busqueda;
using NoriAPI.Repositories;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace NoriAPI.Services
{
    public interface IEjecutivoService
    {
        Task<ResultadoProductividad> ValidateProductividad(int numEmpleado);

    }

    public class EjecutivoService : IEjecutivoService
    {
        private readonly IConfiguration _configuration;
        private readonly IEjecutivoRepository _ejecutivoRepository;        


        public EjecutivoService(IConfiguration configuration, IEjecutivoRepository ejecutivoRepository)
        {
            _configuration = configuration;
            _ejecutivoRepository = ejecutivoRepository;
        }


        #region Productividad
        public async Task<ResultadoProductividad> ValidateProductividad(int numEmpleado)
        {
            // Limpiar las variables estáticas al comienzo del método
            ClasesGespa.Cuentas = new DataTable();
            ClasesGespa.Tiempos = new DataTable();
            ClasesGespa.Metas = new DataTable();
            ClasesGespa.GestionesEjecutivo = new DataTable();
            ClasesGespa.Conteos = new DataTable();
            ClasesGespa._dsTablas = new DataSet();
            ClasesGespa._alNombreId = new ArrayList();
            ClasesGespa._htValoresCatálogo = new Hashtable();
            ClasesGespa._htNombreId = new Hashtable();
            string mensaje = null;

            //Comentada la vieja llamada al método
            //var productividadInfo = await _ejecutivoRepository.ValidateProductividad(numEmpleado);
            //var prod = (IDictionary<string, object>)productividadInfo;
            // Convertir productividadInfo a DataTable

            //---------------------------------CargaCatalogos---------------------------------//            
            ClasesGespa._alNombreId = new ArrayList();
            // NUEVA LLAMADA AL REPOSITORY
            ClasesGespa.dtCatalogos = await _ejecutivoRepository.VwCatalogos();
            ClasesGespa.CargaCatalogos();           
            //---------------------------------------------IdValor----------------------------------------//







            //---------------------------------------Relaciones --------------------------------------------//
            
            ClasesGespa.dtRelaciones = await _ejecutivoRepository.VwRelaciones();
            ClasesGespa.Relaciones();            
            //------------------------------------Tiempos----------------------------------------------// 

            ClasesGespa.Tiempos = await _ejecutivoRepository.TiemposEjecutivo(numEmpleado);
            ClasesGespa.ObtieneTiempos();            
            //-----------------------------------------Metas-----------------------------------------------------//

            ClasesGespa.Metas = await _ejecutivoRepository.MetasEjecutivo(numEmpleado);
            ClasesGespa.ObtieneMetas();            
            //----------------------------------------Gestiones-------------------------------------------------------//

            ClasesGespa.tblDelDía = await _ejecutivoRepository.Gestiones(numEmpleado);

            // Aquí terminan las consultas a la base y empieza la creación y adición de tablas.
            // Crea tablas
            ClasesGespa.ObtieneNegociaciones();

            DataTable dt = ClasesGespa.Conteos;

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
        private static void CalculaTiempoPromedioTest(DataTable tiempos, string Conteo)
        {
            if (!ClasesGespa.Conteos.Columns.Contains(Conteo) || !tiempos.Columns.Contains("Tiempo" + Conteo)
                || tiempos.Rows[0]["Tiempo" + Conteo].ToString() == "")
                return;

            double dConteo = Convert.ToInt32(ClasesGespa.Conteos.Rows[0][Conteo]);
            if (dConteo == 0)
                return;

            // 🔹 Convertir correctamente el valor a TimeSpan
            TimeSpan tiempoSpan;
            object tiempoValor = tiempos.Rows[0]["Tiempo" + Conteo];

            if (tiempoValor is TimeSpan)
            {
                tiempoSpan = (TimeSpan)tiempoValor;  // ✅ Ya es TimeSpan, solo casteamos
            }
            else if (tiempoValor is string tiempoStr && TimeSpan.TryParse(tiempoStr, out TimeSpan parsedTime))
            {
                tiempoSpan = parsedTime;  // ✅ Se convierte desde string
            }
            else
            {
                return; // ❌ Si no se puede convertir, salimos del método
            }

            long lRowTicks = tiempoSpan.Ticks;
            tiempos.Rows[1]["Tiempo" + Conteo] = new TimeSpan(Convert.ToInt64(lRowTicks / dConteo));
        }
                

        #endregion


    }

}
