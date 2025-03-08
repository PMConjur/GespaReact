using Microsoft.Extensions.Configuration;
using NoriAPI.Models;
using NoriAPI.Models.Busqueda;
using NoriAPI.Repositories;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using NoriAPI.Models.Ejecutivo;
using System.Threading.Tasks;
using NoriAPI.Models.Login;
using System.Diagnostics;
using static NoriAPI.Models.ClasesGespa;
using Microsoft.Identity.Client;

namespace NoriAPI.Services
{

    public interface IEjecutivoService
    {
        Task<ResultadoProductividad> ValidateProductividad(int numEmpleado);
        Task<TiemposEjecutivo> ValidateTimes(int numEmpleado);
        Task<string> PauseUnpause(InfoPausa pausa);
        Task<NegociacionesResponse> GetNegociaciones(int idEjecutivo);
        Task<Recuperacion> GetRecuperacion(int idEjecutivo, int actual);
        Task<List<Preguntas_Respuestas_info>> ValidatePreguntas_Respuestas();
        Task<ResultadoCalculadora> ValidateInfoCalculadora1(int Cartera, string NoCuenta, int idHerr);
        Task<ResultadoCalculadora2> ValidateInfoCalculadora2(int idherramienta, string fechaplazo, string nocuenta);
    }

    public class EjecutivoService : IEjecutivoService
    {
        private readonly IConfiguration _configuration;

        private readonly IEjecutivoRepository _ejecutivoRepository;

        #region PropiedadesProductividad
        private static string[] _NombreColumnasConteos = { "Titulares", "Conocidos", "Desconocidos", "SinContacto" };
        private static DataTable Cuentas;
        private static DataTable Tiempos;
        private static DataTable Metas;
        private static DataTable GestionesEjecutivo;
        private static DataTable Conteos;
        private static DataSet _dsTablas = new DataSet();
        private static ArrayList _alNombreId;
        private static Hashtable _htValoresCatálogo;
        private static Hashtable _htNombreId;
        #endregion
       
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

            //---------------------------------CargaCatalogos---------------------------------//
            ClasesGespa._alNombreId = new ArrayList();
            // NUEVA LLAMADA AL REPOSITORY
            ClasesGespa.dtCatalogos = await _ejecutivoRepository.VwCatalogos();
            ClasesGespa.CargaCatalogos();

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
        #endregion

        #region Preguntas_Respuestas
        public async Task<List<Preguntas_Respuestas_info>> ValidatePreguntas_Respuestas()
        {
            var validatePreg_Resp_list = await _ejecutivoRepository.ValidatePreguntas_Respuestas();

            return validatePreg_Resp_list;
        }
        #endregion

        #region Calculadora-1raparte
        public async Task<ResultadoCalculadora> ValidateInfoCalculadora1(int Cartera, string NoCuenta, int idHerr)
        {
            string mensaje = null;
            int MaxDescuento = 0, MinDescuento, _iMensualidades = 1;
            DataTable dtnegociaciones = new DataTable();
            DataTable dtfiltrado = new DataTable();
            DataTable dtPlazos = new DataTable();
            DataTable dtPagos = new DataTable();
            DataTable dtHerramientas = new DataTable();
            DataTable dtHerrFiltradas = new DataTable();
            DataTable dtDescuentos = new DataTable();
            DataTable InfoProducto = new DataTable();
            DataTable HerramientasC = new DataTable();
            DataTable tblCuenta = new DataTable();
            DataTable produc = new DataTable();

            //---------------------------------------Negociaciones--------------------------------//
            //con el Idestado se valida si la promesa esta vigente


            dtnegociaciones = await _ejecutivoRepository.ObtieneNegociaciones(Cartera, NoCuenta);

            dtnegociaciones.PrimaryKey = new DataColumn[] {
                dtnegociaciones.Columns["Fecha_Insert"],
                dtnegociaciones.Columns["Segundo_Insert"],
                dtnegociaciones.Columns["idHerramienta"]
            };
            dtnegociaciones.DefaultView.Sort = "FechaHora DESC";

            // Crear nuevo DataTable solo con las columnas que quieres
            DataTable dtFiltrado = new DataTable();
            dtFiltrado.Columns.Add("Fecha_Insert", typeof(DateTime));
            dtFiltrado.Columns.Add("Segundo_Insert", typeof(string));
            dtFiltrado.Columns.Add("Herramienta", typeof(string));
            dtFiltrado.Columns.Add("idEstado", typeof(string)); // Aquí lo dejamos como string para poder poner "Incumplida"
            dtFiltrado.Columns.Add("Vencimiento", typeof(string));
            dtFiltrado.Columns.Add("SaldoInterés", typeof(decimal));

            foreach (DataRow row in dtnegociaciones.Rows)
            {
                DateTime fechaInsert = Convert.ToDateTime(row["Fecha_Insert"].ToString());
                string segundoInsert = row["Segundo_Insert"].ToString();
                string herramienta = row["Herramienta"].ToString();
                string estado = row["idEstado"].ToString();
                string vencimiento = row["Vencimiento"].ToString().Replace("12:00:00 a. m.", "");
                decimal saldo = Convert.ToDecimal(row["SaldoInterés"]);

                // Validación del estado
                if (estado == "2901")
                    estado = "Vigente";
                else if (estado == "2902")
                    estado = "Cumplida";
                else if (estado == "2903")
                    estado = "Incumplida";
                else if (estado == "2904")
                    estado = "Parcialmente Cumplida";
                else if (estado == "2905")
                    estado = "Cancelada";
                else if (estado == "2906")
                    estado = "Plazo vencido";
                else if (estado == "2907")
                    estado = "Pendiente";
                else if (estado == "2908")
                    estado = "Permanente";
                else if (estado == "2909")
                    estado = "Reestructurada";
                else if (estado == "")
                    estado = "";

                // Agregamos la fila con los valores al nuevo DataTable
                dtFiltrado.Rows.Add(fechaInsert, segundoInsert, herramienta, estado, vencimiento, saldo);
                dtFiltrado.DefaultView.Sort = "Fecha_Insert DESC";
                dtFiltrado = dtFiltrado.DefaultView.ToTable();

            }                    

            //-----------------------------------Plazos------------------------------------------//

            dtPlazos = await _ejecutivoRepository.ObtienePlazos(Cartera, NoCuenta);

            DataColumn dcFechaHora = new DataColumn("FechaHora_Insert", typeof(DateTime));
            dtPlazos.Columns.Add(dcFechaHora);
            for (int i = 0; i < dtPlazos.Rows.Count; i++)
            {                
                DateTime dtFecha = Convert.ToDateTime(dtPlazos.Rows[i]["Fecha_Insert"]);

                // Intentar convertir "Segundo_Insert" a un TimeSpan
                if (TimeSpan.TryParse(dtPlazos.Rows[i]["Segundo_Insert"].ToString(), out TimeSpan tsSegundo))
                {
                    dtPlazos.Rows[i]["FechaHora_Insert"] = dtFecha.Add(tsSegundo);
                }
                else if (double.TryParse(dtPlazos.Rows[i]["Segundo_Insert"].ToString(), out double segundos))
                {
                    dtPlazos.Rows[i]["FechaHora_Insert"] = dtFecha.AddSeconds(segundos);
                }
                else
                {
                    throw new InvalidCastException($"No se pudo convertir 'Segundo_Insert' en la fila {i} a TimeSpan.");
                }
                //DateTime dtFecha = Convert.ToDateTime(dtPlazos.Rows[i]["Fecha_Insert"]);
                //TimeSpan tsSegundo = (TimeSpan)dtPlazos.Rows[i]["Segundo_Insert"];
                //dtPlazos.Rows[i]["FechaHora_Insert"] = dtFecha.Add(tsSegundo);
            }

            //----------------------------------------Pagos----------------------------------------------//

            dtPagos = await _ejecutivoRepository.ObtienePagos(Cartera, NoCuenta);
            dtPagos.DefaultView.Sort = "FechaPago DESC";

            //------------------------------------Herramientas------------------------------------------//
            
            dtHerramientas = await _ejecutivoRepository.ObtieneHerramientas(NoCuenta);

            //----------------------------------Herramientas completas ---------------------------------//

            HerramientasC = await _ejecutivoRepository.ObtieneHerramientasCompletas();
            HerramientasC.PrimaryKey = new DataColumn[] { HerramientasC.Columns["idHerramienta"] };
            // IDs que quieres filtrar
            int[] idsFiltrar = { 0, 136, 137, 138, 139, 1010, 142, 684 };

            dtHerrFiltradas.Columns.Add("idHerramienta", typeof(int));
            dtHerrFiltradas.Columns.Add("Nombre", typeof(string));

            // Recorrer las filas y filtrar
            foreach (DataRow row in HerramientasC.Rows)
            {
                int idHerramienta = Convert.ToInt32(row["idHerramienta"]);
                if (idsFiltrar.Contains(idHerramienta))
                {
                    DataRow newRow = dtHerrFiltradas.NewRow();
                    newRow["idHerramienta"] = idHerramienta;
                    newRow["Nombre"] = row["Nombre"].ToString();
                    dtHerrFiltradas.Rows.Add(newRow);
                }
            }

            //----------------------------------------Saldo----------------------------------------------//

            tblCuenta = await _ejecutivoRepository.InfoCuenta(Cartera, NoCuenta);


            //-----------------------------------------------------------------------------------------//

            dtDescuentos.Columns.Add("idHerramienta");
            dtDescuentos.Columns.Add("Descuento");
            dtDescuentos.Columns.Add("MáxDescuento");
            dtDescuentos.Columns.Add("MaxDías");

            string sHerramientas = "idHerramienta IN (0";
            double fDescuento = 0, fMaxDesc = 0;
            int iMaxDias = 0, idHerramienta_ = 0;

            for (int i = 0; i < dtHerramientas.Columns.Count; i++)
            {
                //Herramientas que no aplica (0 en idHerramienta)
                if (dtHerramientas.Rows[0][i].ToString().Equals("0") || dtHerramientas.Columns[i].ColumnName.Contains("Tasa"))
                {  // Convenios 
                    if (dtHerramientas.Columns[i].ColumnName.Contains("136") || dtHerramientas.Columns[i].ColumnName.Contains("144"))
                        i += 2;
                    continue;
                }

                // Agrega idHerramienta para filtro y días
                if (int.TryParse(dtHerramientas.Columns[i].ColumnName, out idHerramienta_))
                {
                    sHerramientas += "," + dtHerramientas.Columns[i].ColumnName;
                    iMaxDias = Convert.ToInt16(dtHerramientas.Rows[0][i].ToString());
                }

                //Solo si tiene descuento.
                if (dtHerramientas.Columns[i + 1].ColumnName.Contains("Descuento"))
                {
                    i++;
                    fDescuento = Convert.ToDouble(dtHerramientas.Rows[0][i].ToString());
                }

                if (dtHerramientas.Columns[i + 1].ColumnName.Contains("Máximo"))
                {
                    i++;
                    fMaxDesc = Convert.ToDouble(dtHerramientas.Rows[0][i].ToString());
                }

                DataRow drDescuento = dtDescuentos.NewRow();
                drDescuento["idHerramienta"] = idHerramienta_;
                drDescuento["Descuento"] = fDescuento;
                drDescuento["MáxDescuento"] = fMaxDesc;
                drDescuento["MaxDías"] = iMaxDias;
                dtDescuentos.Rows.Add(drDescuento);

                fDescuento = fMaxDesc = iMaxDias = idHerramienta_ = 0;
                dtDescuentos.PrimaryKey = new DataColumn[] { dtDescuentos.Columns["idHerramienta"] };
            }
            sHerramientas = sHerramientas.TrimEnd(',') + ")";

            //----------------------------------------Producto Y ---------------------------------//
            produc = await _ejecutivoRepository.ObtieneProducto(NoCuenta);

            //------------------------------------------------------------------------------------//
            static DateTime FechaCorte_(string CorteOfecha)
            {
                DateTime dtFechaCorte = new DateTime();

                int iCorte;
                if (int.TryParse(CorteOfecha, out iCorte))
                {
                    dtFechaCorte = new DateTime(DateTime.Today.Year, DateTime.Today.Month, iCorte);
                    if (dtFechaCorte <= DateTime.Today)
                        dtFechaCorte = dtFechaCorte.AddMonths(1);
                }
                else
                    DateTime.TryParse(CorteOfecha, out dtFechaCorte);

                return dtFechaCorte;
            }

            DateTime fechaReferencia = DateTime.Now;

            if (InfoProducto.Columns.Contains("Fechacorte") && InfoProducto.Columns["Fechacorte"].ToString() != "")
            {
                DateTime FechaCorte = FechaCorte_(InfoProducto.Rows[0]["Fechacorte"].ToString().Replace("00:00:00:000", ""));
                FechaCorte = new DateTime(fechaReferencia.Year, fechaReferencia.Month, FechaCorte.Day);
                if (FechaCorte >= DateTime.Today)
                    FechaCorte = FechaCorte.AddMonths(-1);

                int DíasRes = 0, DíasSum = 3;

                //Aumenta fecha corte.
                for (int i = 1; i <= DíasSum; i++)
                    if (FechaCorte.AddDays(i).DayOfWeek == DayOfWeek.Sunday || FechaCorte.AddDays(i).DayOfWeek == DayOfWeek.Saturday)
                        DíasSum++;

                if (FechaCorte.AddDays(DíasSum) < DateTime.Today)
                    FechaCorte = FechaCorte.AddMonths(1);

                DíasRes = 3;// 5;
                DíasSum = 2;// 3;
                for (int i = 1; i <= DíasSum; i++)
                    if (FechaCorte.AddDays(i).DayOfWeek == DayOfWeek.Sunday || FechaCorte.AddDays(i).DayOfWeek == DayOfWeek.Saturday)
                        DíasSum++;

                for (int i = 1; i <= DíasRes; i++)
                    if (FechaCorte.AddDays(-i).DayOfWeek == DayOfWeek.Sunday || FechaCorte.AddDays(-i).DayOfWeek == DayOfWeek.Saturday)
                        DíasRes++;

                if (DateTime.Today >= FechaCorte.AddDays(-DíasRes) && DateTime.Today <= FechaCorte.AddDays(DíasSum))
                    sHerramientas = sHerramientas.Replace("142", "0");

            }            
            HerramientasC.DefaultView.RowFilter = sHerramientas;

            //aqui se busca dependiendo de lo que escoja///////////////////////////
            DataRow drHerramienta = HerramientasC.Rows.Find(idHerr);//convenio
            DataRow drHerramientaAmex = dtDescuentos.Rows.Find(idHerr);//convenio 136

            //////////////Metodo EstableceHerramienta/////////////////////
            string Herramienta = drHerramienta["Nombre"].ToString();
            double Saldo, MontoRequerido, Montodescuento;
            int días1erPago = 0;

            //Falta validar el saldo 
            if (!double.TryParse(tblCuenta.Rows[0]["Saldo"].ToString(), out Saldo))
            {
                //mandar error
            }
            if (Saldo <= 0)
            {
                //mandar error
            }

            // Cálculo del descuento.
            MaxDescuento = Convert.ToInt16(drHerramientaAmex["MáxDescuento"].ToString());
            MinDescuento = Convert.ToInt16(drHerramientaAmex["Descuento"].ToString());

            //  Cálculo de días de corte
            DateTime Fecha_Corte = new DateTime();
            if (drHerramienta["CampoFechaCorte"].ToString() != "")
            {
                Fecha_Corte = FechaCorte_(_ejecutivoRepository.CampoCalculado(drHerramienta["CampoFechaCorte"].ToString()).ToString().Replace("00:00:00:000", ""));
                días1erPago = Math.Min(días1erPago, (int)Math.Abs((Fecha_Corte - DateTime.Today).TotalDays));

                if (!Fecha_Corte.ToString().Contains("01/01/0001") && Fecha_Corte <= DateTime.Today)
                    Fecha_Corte = Fecha_Corte.AddMonths(1);
            }

            // Cálculo de monto requerido.
            if (double.TryParse(
               _ejecutivoRepository.CampoCalculado(drHerramienta["CálculoMontoRequerido"].ToString()).ToString(),
               out MontoRequerido) || MontoRequerido == 0)
            {
                MontoRequerido = MontoRequerido * (1 - MinDescuento / (float)100);
            }
            else
            {
                //Mandar error
            }

            //  Días primer pago
            MontoRequerido = Math.Round(MontoRequerido, 2);
            Montodescuento = (Saldo * (MinDescuento / (float)100));
            Montodescuento = Math.Round(Montodescuento, 2);

            //Math.Ceiling(MontoRequerido * 100) / 100;
            días1erPago = Convert.ToInt32(drHerramienta["Días1erPago"]);

            DataRow[] drParcial = dtnegociaciones.Select("idHerramienta IN (145,137) AND Fecha_Insert > '" + DateTime.Today.AddMonths(-1).ToShortDateString() + "'");
            if (drParcial.Length > 0)
                días1erPago = 28;

            _iMensualidades = Convert.ToInt16(drHerramienta["Mensualidades"]);

            //Días Máximos
            iMaxDias = Convert.ToInt32(drHerramientaAmex["MaxDías"]);

            /////////////////////////////Aqui termina el metodo///////////////////////////////////////////

            //Convierte datatable a list 

            List<OfrecimientosInfo> listaOfrecimientos = _ejecutivoRepository.ConvertirDataTableALista(dtFiltrado);
            List<HerramientasInfo> listaHerramientas = _ejecutivoRepository.ConvertirDataTableALista_(dtHerrFiltradas);

            var resultadoCalculadora = new ResultadoCalculadora {
                Ofrecimientos = listaOfrecimientos,
                Herramientas = listaHerramientas,
                MontoRequerido = MontoRequerido,
                Descuento = MinDescuento,
                MaxDias = días1erPago,
                MontoDescuento = Montodescuento,
                Saldo = Saldo,
                FechaCorte = Convert.ToString(Fecha_Corte)
            };
            return resultadoCalculadora;
        }

        #endregion

        #region Calculadora-2daParte

        public async Task<ResultadoCalculadora2> ValidateInfoCalculadora2(int idherramienta, string fechaplazo, string nocuenta)
        {
            DataTable dtDescuentos = new DataTable();
            DataTable HerramientasC = new DataTable();
            DataTable dtHerramientas = new DataTable();

            //------------------------------------Herramientas------------------------------------------//            

            dtHerramientas = await _ejecutivoRepository.ObtieneHerramientas(nocuenta);
            HerramientasC = await _ejecutivoRepository.ObtieneHerramientasCompletas();
            DataRow drHerramienta = HerramientasC.Rows.Find(idherramienta);// aqui va la herramienta elegida
            dtDescuentos.Columns.Add("idHerramienta");
            dtDescuentos.Columns.Add("Descuento");
            dtDescuentos.Columns.Add("MáxDescuento");
            dtDescuentos.Columns.Add("MaxDías");

            string sHerramientas = "idHerramienta IN (0";
            double fDescuento = 0, fMaxDesc = 0;
            int iMaxDias = 0, idHerramienta_ = 0;

            for (int i = 0; i < dtHerramientas.Columns.Count; i++)
            {
                //Herramientas que no aplica (0 en idHerramienta)
                if (dtHerramientas.Rows[0][i].ToString().Equals("0") || dtHerramientas.Columns[i].ColumnName.Contains("Tasa"))
                {  // Convenios 
                    if (dtHerramientas.Columns[i].ColumnName.Contains("136") || dtHerramientas.Columns[i].ColumnName.Contains("144"))
                        i += 2;
                    continue;
                }

                // Agrega idHerramienta para filtro y días
                if (int.TryParse(dtHerramientas.Columns[i].ColumnName, out idHerramienta_))
                {
                    sHerramientas += "," + dtHerramientas.Columns[i].ColumnName;
                    iMaxDias = Convert.ToInt16(dtHerramientas.Rows[0][i].ToString());
                }

                //Solo si tiene descuento.
                if (dtHerramientas.Columns[i + 1].ColumnName.Contains("Descuento"))
                {
                    i++;
                    fDescuento = Convert.ToDouble(dtHerramientas.Rows[0][i].ToString());
                }

                if (dtHerramientas.Columns[i + 1].ColumnName.Contains("Máximo"))
                {
                    i++;
                    fMaxDesc = Convert.ToDouble(dtHerramientas.Rows[0][i].ToString());
                }

                DataRow drDescuento = dtDescuentos.NewRow();
                drDescuento["idHerramienta"] = idHerramienta_;
                drDescuento["Descuento"] = fDescuento;
                drDescuento["MáxDescuento"] = fMaxDesc;
                drDescuento["MaxDías"] = iMaxDias;
                dtDescuentos.Rows.Add(drDescuento);

                fDescuento = fMaxDesc = iMaxDias = idHerramienta_ = 0;
                dtDescuentos.PrimaryKey = new DataColumn[] { dtDescuentos.Columns["idHerramienta"] };
            }
            sHerramientas = sHerramientas.TrimEnd(',') + ")";

            DataRow drDescuentos = dtDescuentos.Rows.Find(idherramienta);//Aqui va nuevamente el idHerramienta para el descuento.

            //aqui se va a repetir el metodo EstableceHerramienta









            /////Aun no se que voy a regresar///////////////////////
            string mensaje = "prueba";

            var ResultadoCalculadora2 = new ResultadoCalculadora2
            {
                mensaje = mensaje
            };            
            return ResultadoCalculadora2;

        }



        #endregion

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
        public async Task<TiemposEjecutivo> ValidateTimes(int numEmpleado)
        {
            ResultadoTiempos tiempos = null;

            try
            {
                var validateTimes = await _ejecutivoRepository.ValidateTimes(numEmpleado);
                tiempos = validateTimes;

            }
            catch (Exception ex)
            {
                return new TiemposEjecutivo($"Hubo un problema al obtener los tiempos del ejecutivo: {ex.Message} ", null);
            }

            return new TiemposEjecutivo(null, tiempos);



            // var resultadoTiempos = new TiemposEjecutivo(mensaje);
            //return validateTimes;


        }
        public async Task<string> PauseUnpause(InfoPausa pausa)
        {
            try
            {
                // Intenta despausar al ejecutivo validando su contraseña.
                // Si la contraseña es incorrecta, retorna un mensaje de error.
                if (!await Despausar(pausa))
                {
                    return "Contraseña Incorrecta.";
                }

                // Cambia el modo del ejecutivo a "Consulta".
                await _ejecutivoRepository.ChangeEjecutivoMode(pausa.IdEjecutivo, "Consulta");

                // Registra la pausa del ejecutivo en la base de datos con el idCatálogo1 3001 y la duración especificada.
                // TODO: Asignar propiamente los valores del idCatalogo según el valor de PeCausa.
                await _ejecutivoRepository.Pausa210(pausa.IdEjecutivo, 3001, pausa.Duracion);

                // Aumenta el tiempo de actividad del ejecutivo con la duración de la pausa y la causa asociada.
                await _ejecutivoRepository.IncreaseEjecutivoTime(pausa.IdEjecutivo, pausa.Duracion, pausa.PeCausa);
            }
            catch
            {
                // Si ocurre un error en cualquier parte del proceso, devuelve un mensaje de error.
                return "Ocurrió un error al reanudar la sesión.";
            }

            // Retorna una cadena vacía si todo el proceso se ejecutó correctamente.
            return "";
        }
        private async Task<bool> Despausar(InfoPausa tiempos)
        {
            // Valida la contraseña del ejecutivo en la base de datos.
            var validatePass = await _ejecutivoRepository.ValidatePasswordEjecutivo(tiempos.IdEjecutivo, tiempos.Contrasenia);

            // Si la validación falla (es nula), retorna false indicando que la contraseña es incorrecta.
            if (validatePass is null)
            {
                return false;
            }

            // Si la validación es exitosa, retorna true.
            return true;
        }
        public async Task<NegociacionesResponse> GetNegociaciones(int idEjecutivo)
        {
            var negociaciones = (await _ejecutivoRepository.Negociaciones(idEjecutivo)).ToList();

            if (negociaciones.Count == 0)
            {
                return new NegociacionesResponse
                {
                    Negociaciones = new List<Negociacion>(),
                    ConteoHoy = 0,
                    TiempoPromedio = null
                };
            }

            // ConteoHoy de negociaciones del día actual
            int conteo = negociaciones.Count(n => n.FechaCreacion == DateTime.Today);

            // Calcular tiempo promedio con base en FechaCreacion y FechaTermino
            TimeSpan? tiempoPromedio = CalculateAverageTime(negociaciones);

            return new NegociacionesResponse
            {
                Negociaciones = negociaciones,
                ConteoHoy = conteo,
                TiempoPromedio = tiempoPromedio.HasValue
                    ? new TiempoPromedioResponse
                    {
                        Horas = (int)tiempoPromedio.Value.TotalHours,
                        Minutos = tiempoPromedio.Value.Minutes,
                        Segundos = tiempoPromedio.Value.Seconds,
                        TotalMinutos = (int)tiempoPromedio.Value.TotalMinutes,
                        TotalSegundos = (int)tiempoPromedio.Value.TotalSeconds
                    }
                    : new TiempoPromedioResponse()
            };
        }
        private static TimeSpan? CalculateAverageTime(IEnumerable<Negociacion> negociaciones)
        {
            var tiempos = negociaciones
                .Where(n => n.FechaCreacion.HasValue && n.FechaTermino.HasValue) // Asegura que ambos valores existen
                .Select(n => (n.FechaTermino.Value - n.FechaCreacion.Value).Ticks) // Aquí ya no hay `null`
                .ToList();

            if (tiempos.Count == 0 || tiempos.Sum() == 0) return null;  // Evita divisiones por cero

            long totalTicks = tiempos.Sum();
            return new TimeSpan(totalTicks / tiempos.Count);
        }
        public async Task<Recuperacion?> GetRecuperacion(int idEjecutivo, int actual)
        {
            if (idEjecutivo <= 0 || (actual != 0 && actual != 1))
            {
                return null;
            }

            return actual == 1
                ? await _ejecutivoRepository.RecuperacionActual(idEjecutivo)
                : await _ejecutivoRepository.RecuperacionAnterior(idEjecutivo);
        }


    }

}