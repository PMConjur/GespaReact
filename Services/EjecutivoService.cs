using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using NoriAPI.Models;
using NoriAPI.Models.Busqueda;
using NoriAPI.Models.Ejecutivo;
using NoriAPI.Models.Login;
using NoriAPI.Repositories;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using System.Diagnostics;
using static NoriAPI.Models.ClasesGespa;
using System.Text.Json;
using NoriAPI.Models.Phones;
using Dapper;
using System.Globalization;
using Microsoft.AspNetCore.Mvc;
using System.Net.Mail;

namespace NoriAPI.Services
{
    public interface IEjecutivoService
    {
        #region Productividad
        Task<ResultadoProductividad> ValidateProductividad(int numEmpleado);
        #endregion

        #region Tiempos

        Task<TiemposEjecutivo> ValidateTimes(int numEmpleado);
        Task<Dictionary<string, object>> PauseUnpause(InfoPausa pausa);
        Task<Dictionary<string, object>> Promedios(int idEjecutivo);

        #endregion
        #region AccionesDropDown
        Task ObtenerSeguimientos(DataRow drDatos, DataSet dsTablas);
        Task ObtenerAccionamiento(DataRow drDatos, DataSet dsTablas);

        Task<NegociacionesResponse> GetNegociaciones(int idEjecutivo);
        Task<Recuperacion> GetRecuperacion(int idEjecutivo, int actual);
        Task<List<PreguntasRespuestasInfo>> ValidatePreguntas_Respuestas();
        Task<ResultadoCalculadora> ValidateInfoCalculadora(int Cartera, string NoCuenta);

        Task ObtenerBusquedaEJE(DataRow drDatos, DataSet dsTablas);

        Task<bool> GuardaBusquedaAsync(BusquedaClass busqueda, int idCartera, string idCuenta, int idEjecutivo, TimeSpan tiempoEnCuenta);
        Task<DataTable> GetSeguimientosEjecutivoAsync(int idEjecutivo);
        Task ObtieneRecordatoriosAsync(DataRow drDatos, DataSet dsTablas);
        Task<DataTable> GetCargosEnLineaAsync(int idCartera, string idCuenta);
        Task ObtenerCargosEnLinea(DataRow drDatos, DataSet dsTablas);
        Task<string> SaveCargoEnlinea(CargoEnLineaRe newCargoEn);
        Task<string> SaveEstadoDeCuenta(EstadoDeCuentaRe newEstadoEn);
        Task ObtenerMultideudores(DataRow drDatos, DataSet dsTablas, Hashtable htProducto, string sortMultideudores, string connectionString);
        Task ObtenerPagos(DataRow drDatos, DataSet dsTablas);
        Task ObtenerPago(DataRow drDatos, DataSet dsTablas);
        Task<DataTable> ObtieneGestionTeAsync(int idCartera, string idCuenta);
        Task ObtenerDomicilios(DataRow drDatos, DataSet dsTablas);
        DataTable ObtieneGestionesDelDia(int idEjecutivo);
        DataTable BuscaScripts(int idProducto);

        DataTable CargaRelaciones();
        Task ObtenerCorreosEJE(DataRow drDatos, DataSet dsTablas);
        Task ObtenerEnviadosEJE(DataRow drDatos, DataSet dsTablas);
        Task ObtenerCargaEJE(DataRow drDatos, DataSet dsTablas);
        Task<string> NuevoCorreoAsync(CorreosRe nuevoCorreoRe, int idEjecutivo, int idOrigen = 1805, bool ValidarDuplicidad = true);
        Task<string> IdentificaCorreoAsync(string CorreoElectronico, int idInformacion, int idCartera, string idCuenta, int idEjecutivoInformacion);
        string EnviaCorreo(string CorreoElectrónico, string Asunto, string Mensaje);



        #region Acciones
        Task<DataTable> GetAccionesNegociacionesAsync(int idCartera, string idCuenta);
        Task<DataTable> GetAccionesPlazosAsync(int idCartera, string idCuenta);
        Task<DataTable> GetValidadorAsync(int idProducto, int idEjecutivo, string Contraseña);
        Task<DataTable> GetAccionesComentarioAsync(int idCartera, string idCuenta, int idEjecutivo, string Comentario, bool ModificaSituacion);
        Task<DataTable> GetWlpAsync(string Proceso, string idCuenta);
        #endregion


    }

    public class EjecutivoService : IEjecutivoService
    {
        private readonly ISearchRepository _searchRepository;
        private readonly IConfiguration _configuration;
        private readonly IEjecutivoRepository _ejecutivoRepository;
        private readonly ISearchService _searchService;
        private readonly string _connectionString;
        private readonly IBusquedaRepository _busquedaRepository;
        private List<Correos> _correosList = new List<Correos>();
        private readonly Catalogos _catalogos;
        private readonly DataTable _correos;
        private readonly DataTable _enviados;
      





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

        public EjecutivoService(IConfiguration configuration, IEjecutivoRepository ejecutivoRepository, IBusquedaRepository busquedaRepository, ISearchRepository searchRepository, ISearchService searchService, Catalogos catalogos, DataTable correos, DataTable enviados)
        {
            _configuration = configuration;
            _ejecutivoRepository = ejecutivoRepository;
            _connectionString = _configuration.GetConnectionString("Piso2Amex");
            _searchService = searchService;
            _busquedaRepository = busquedaRepository;
            _catalogos = catalogos;
            _correos = correos;
            _enviados = CreaTablaEnviados();
            _correos = CreaTablaCorreos();


        }
        private DataTable CreaTablaCorreos()
        {
            DataTable correos = new DataTable();
            correos.Columns.Add("CorreoElectrónico", typeof(string));
            correos.PrimaryKey = new DataColumn[] { correos.Columns["CorreoElectrónico"] };
            // Aquí puedes agregar filas a la tabla si es necesario
            return correos;
        }
        private DataTable CreaTablaEnviados()
        {
            DataTable enviados = new DataTable();
            // Aquí puedes agregar las columnas a la tabla de enviados
            return enviados;
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

            // Carga de catálogos
            ClasesGespa._alNombreId = new ArrayList();
            ClasesGespa.dtCatalogos = await _ejecutivoRepository.VwCatalogos();
            ClasesGespa.CargaCatalogos();

            // Relaciones
            ClasesGespa.dtRelaciones = await _ejecutivoRepository.VwRelaciones();
            ClasesGespa.Relaciones();

            // Tiempos
            ClasesGespa.Tiempos = await _ejecutivoRepository.TiemposEjecutivo(numEmpleado);
            ClasesGespa.ObtieneTiempos();

            // Metas
            ClasesGespa.Metas = await _ejecutivoRepository.MetasEjecutivo(numEmpleado);
            ClasesGespa.ObtieneMetas();

            // Gestiones
            ClasesGespa.tblDelDía = await _ejecutivoRepository.Gestiones(numEmpleado);
            ClasesGespa.ObtieneNegociaciones();

            DataTable dt = ClasesGespa.Conteos;
            var prod = dt.Rows[0].Table.Columns.Cast<DataColumn>().ToDictionary(col => col.ColumnName, col => dt.Rows[0][col]);
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
        public async Task<List<PreguntasRespuestasInfo>> ValidatePreguntas_Respuestas()
        {
            var validatePreg_Resp_list = await _ejecutivoRepository.ValidatePreguntas_Respuestas();
            return validatePreg_Resp_list;
        }
        #endregion

        #region Acciones Negociables
        public async Task<DataTable> GetAccionesNegociacionesAsync(int idCartera, string idCuenta)
        {
            DataTable negociacion = new DataTable();
            string query = "SELECT * FROM fn_OfrecimientosNegociaciones(@idCartera, @idCuenta)"; // Evita inyección SQL

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand(query, connection))
                {
                    // Usar Add con tipo explícito para evitar problemas con tipos de datos
                    command.Parameters.Add("@idCartera", SqlDbType.Int).Value = idCartera;
                    command.Parameters.Add("@idCuenta", SqlDbType.VarChar).Value = idCuenta;

                    using (var adapter = new SqlDataAdapter(command))
                    {
                        adapter.Fill(negociacion);
                    }
                }
            }

            return negociacion;
        }

        public async Task<DataTable> GetAccionesPlazosAsync(int idCartera, string idCuenta)
        {
            DataTable plazos = new DataTable();
            string query = "SELECT * FROM fn_Plazos(@idCartera, @idCuenta)"; // Evita inyección SQL

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand(query, connection))
                {
                    // Usar Add con tipo explícito para evitar problemas con tipos de datos
                    command.Parameters.Add("@idCartera", SqlDbType.Int).Value = idCartera;
                    command.Parameters.Add("@idCuenta", SqlDbType.VarChar).Value = idCuenta;

                    using (var adapter = new SqlDataAdapter(command))
                    {
                        adapter.Fill(plazos);
                    }
                }
            }

            return plazos;
        }

        public async Task<DataTable> GetValidadorAsync(int idProducto, int idEjecutivo, string Contraseña)
        {
            if (idEjecutivo != 0 && Contraseña != "")
            {
                DataTable passValidadores = new DataTable();
                string query = "EXEC dbCollection..[2.8.Validación] @idProducto, @idEjecutivo, @Contraesña"; // Evita inyección SQL

                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    using (var command = new SqlCommand(query, connection))
                    {
                        // Usar Add con tipo explícito para evitar problemas con tipos de datos
                        command.Parameters.Add("@idProducto", SqlDbType.Int).Value = idProducto;
                        command.Parameters.Add("@idEjecutivo", SqlDbType.Int).Value = idEjecutivo;
                        command.Parameters.Add("@Contraesña", SqlDbType.VarChar).Value = Contraseña;

                        using (var adapter = new SqlDataAdapter(command))
                        {
                            adapter.Fill(passValidadores);
                        }
                    }
                }

                return passValidadores;
            }
            else
            {
                DataTable validadores = new DataTable();
                string query = "SELECT  E.idEjecutivo, E.NombreEjecutivo Nombre " +
                    "FROM Ejecutivos E (NOLOCK) " +
                    "INNER JOIN Validadores V (NOLOCK) " +
                    "ON E.idEjecutivo = V.idEjecutivo " +
                    "WHERE V.idProducto = @idProducto"; // Evita inyección SQL

                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    using (var command = new SqlCommand(query, connection))
                    {
                        // Usar Add con tipo explícito para evitar problemas con tipos de datos
                        command.Parameters.Add("@idProducto", SqlDbType.Int).Value = idProducto;

                        using (var adapter = new SqlDataAdapter(command))
                        {
                            adapter.Fill(validadores);
                        }
                    }
                }

                return validadores;
            }

        }

        public async Task<DataTable> GetAccionesComentarioAsync(int idCartera, string idCuenta, int idEjecutivo, string Comentario, bool ModificaSituacion)
        {

            DataTable comentario = new DataTable();
            string query = "EXEC [2.13.InsertaComentario] @idCartera, @idCuenta, @idEjecutivo, @Comentario, @ModificaSituación "; // Evita inyección SQL

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand(query, connection))
                {
                    // Usar Add con tipo explícito para evitar problemas con tipos de datos
                    command.Parameters.Add("@idCartera", SqlDbType.Int).Value = idCartera;
                    command.Parameters.Add("@idCuenta", SqlDbType.VarChar).Value = idCuenta;
                    command.Parameters.Add("@idEjecutivo", SqlDbType.Int).Value = idEjecutivo;
                    command.Parameters.Add("@Comentario", SqlDbType.VarChar).Value = Comentario;
                    command.Parameters.Add("@ModificaSituación", SqlDbType.Bit).Value = ModificaSituacion;

                    using (var adapter = new SqlDataAdapter(command))
                    {
                        adapter.Fill(comentario);
                    }
                }
            }

            return comentario;
        }

        public async Task<DataTable> GetWlpAsync(string Proceso, string idCuenta)
        {
            DataTable WLP = new DataTable();
            if (Proceso == "Arrangement")
            {
                string query = "SELECT * FROM [Amex_LSC].[WLP].[OB.Arrangement] WHERE CM15 = @idCuenta "; // Evita inyección SQL

                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    using (var command = new SqlCommand(query, connection))
                    {
                        // Usar Add con tipo explícito para evitar problemas con tipos de datos
                        command.Parameters.Add("@idCuenta", SqlDbType.VarChar).Value = idCuenta;

                        using (var adapter = new SqlDataAdapter(command))
                        {
                            adapter.Fill(WLP);
                        }
                    }
                }

                //return WLP;
            }
            else if (Proceso == "ArrangementDetails")
            {
                string query = "SELECT * FROM [Amex_LSC].[WLP].[OB.ArrangementDetails] WHERE CM15 = @idCuenta "; // Evita inyección SQL

                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    using (var command = new SqlCommand(query, connection))
                    {
                        // Usar Add con tipo explícito para evitar problemas con tipos de datos
                        command.Parameters.Add("@idCuenta", SqlDbType.VarChar).Value = idCuenta;

                        using (var adapter = new SqlDataAdapter(command))
                        {
                            adapter.Fill(WLP);
                        }
                    }
                }

                //return WLP;
            }
            else if (Proceso == "Dispute")
            {
                string query = "SELECT * FROM [Amex_LSC].[WLP].[OB.Dispute]  WHERE CM15 = @idCuenta "; // Evita inyección SQL

                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    using (var command = new SqlCommand(query, connection))
                    {
                        // Usar Add con tipo explícito para evitar problemas con tipos de datos
                        command.Parameters.Add("@idCuenta", SqlDbType.VarChar).Value = idCuenta;

                        using (var adapter = new SqlDataAdapter(command))
                        {
                            adapter.Fill(WLP);
                        }
                    }
                }

                //return WLP;
            }
            else if (Proceso == "EmailAddress")
            {
                string query = "SELECT * FROM [Amex_LSC].[WLP].[OB.EmailAddress] WHERE CM15 = @idCuenta "; // Evita inyección SQL

                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    using (var command = new SqlCommand(query, connection))
                    {
                        // Usar Add con tipo explícito para evitar problemas con tipos de datos
                        command.Parameters.Add("@idCuenta", SqlDbType.VarChar).Value = idCuenta;

                        using (var adapter = new SqlDataAdapter(command))
                        {
                            adapter.Fill(WLP);
                        }
                    }
                }

                //return WLP;
            }
            else if (Proceso == "EmailEvent")
            {
                string query = "SELECT * FROM [Amex_LSC].[WLP].[OB.EmailEvent] WHERE CM15 = @idCuenta "; // Evita inyección SQL

                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    using (var command = new SqlCommand(query, connection))
                    {
                        // Usar Add con tipo explícito para evitar problemas con tipos de datos
                        command.Parameters.Add("@idCuenta", SqlDbType.VarChar).Value = idCuenta;

                        using (var adapter = new SqlDataAdapter(command))
                        {
                            adapter.Fill(WLP);
                        }
                    }
                }

                //return WLP;
            }
            else if (Proceso == "EmailSent")
            {
                string query = "SELECT * FROM [Amex_LSC].[WLP].[OB.EmailSent] WHERE CM15 = @idCuenta "; // Evita inyección SQL

                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    using (var command = new SqlCommand(query, connection))
                    {
                        // Usar Add con tipo explícito para evitar problemas con tipos de datos
                        command.Parameters.Add("@idCuenta", SqlDbType.VarChar).Value = idCuenta;

                        using (var adapter = new SqlDataAdapter(command))
                        {
                            adapter.Fill(WLP);
                        }
                    }
                }

                //return WLP;
            }
            else if (Proceso == "EmailUnsubscribe")
            {
                string query = "SELECT * FROM [Amex_LSC].[WLP].[OB.EmailUnsubscribe] WHERE CM15 = @idCuenta "; // Evita inyección SQL

                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    using (var command = new SqlCommand(query, connection))
                    {
                        // Usar Add con tipo explícito para evitar problemas con tipos de datos
                        command.Parameters.Add("@idCuenta", SqlDbType.VarChar).Value = idCuenta;

                        using (var adapter = new SqlDataAdapter(command))
                        {
                            adapter.Fill(WLP);
                        }
                    }
                }

                // return WLP;
            }
            else if (Proceso == "SmsOptOut")
            {
                string query = "SELECT * FROM [Amex_LSC].[WLP].[OB.SmsOptOut] WHERE CM15 = @idCuenta "; // Evita inyección SQL

                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    using (var command = new SqlCommand(query, connection))
                    {
                        // Usar Add con tipo explícito para evitar problemas con tipos de datos
                        command.Parameters.Add("@idCuenta", SqlDbType.VarChar).Value = idCuenta;

                        using (var adapter = new SqlDataAdapter(command))
                        {
                            adapter.Fill(WLP);
                        }
                    }
                }

                //return WLP;
            }
            else if (Proceso == "SmsSent")
            {
                string query = "SELECT * FROM [Amex_LSC].[WLP].[OB.SmsSent] WHERE CM15 = @idCuenta "; // Evita inyección SQL

                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    using (var command = new SqlCommand(query, connection))
                    {
                        // Usar Add con tipo explícito para evitar problemas con tipos de datos
                        command.Parameters.Add("@idCuenta", SqlDbType.VarChar).Value = idCuenta;

                        using (var adapter = new SqlDataAdapter(command))
                        {
                            adapter.Fill(WLP);
                        }
                    }
                }

                //return WLP;
            }
            else if (Proceso == "SpecialCircumstances")
            {
                string query = "SELECT * FROM [Amex_LSC].[WLP].[OB.SpecialCircumstances] WHERE CM15 = @idCuenta "; // Evita inyección SQL

                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    using (var command = new SqlCommand(query, connection))
                    {
                        // Usar Add con tipo explícito para evitar problemas con tipos de datos
                        command.Parameters.Add("@idCuenta", SqlDbType.VarChar).Value = idCuenta;

                        using (var adapter = new SqlDataAdapter(command))
                        {
                            adapter.Fill(WLP);
                        }
                    }
                }

                //return WLP;
            }
            return WLP;

        }



        #endregion

        #region Calculadora
        public async Task<ResultadoCalculadora> ValidateInfoCalculadora(int Cartera, string NoCuenta)
        {
            string mensaje = null;
            DataTable dtnegociaciones = new DataTable();
            DataTable dtPlazos = new DataTable();
            DataTable dtPagos = new DataTable();
            DataTable dtHerramientas = new DataTable();
            DataTable dtDescuentos = new DataTable();
            DataTable InfoProducto = new DataTable();

            // Negociaciones
            dtnegociaciones = await _ejecutivoRepository.ObtieneNegociaciones(Cartera, NoCuenta);
            dtnegociaciones.PrimaryKey = new DataColumn[] {
                dtnegociaciones.Columns["Fecha_Insert"],
                dtnegociaciones.Columns["Segundo_Insert"],
                dtnegociaciones.Columns["idHerramienta"]
            };
            dtnegociaciones.DefaultView.Sort = "FechaHora DESC";

            // Plazos
            dtPlazos = await _ejecutivoRepository.ObtienePlazos(Cartera, NoCuenta);
            DataColumn dcFechaHora = new DataColumn("FechaHora_Insert", typeof(DateTime));
            dtPlazos.Columns.Add(dcFechaHora);
            for (int i = 0; i < dtPlazos.Rows.Count; i++)
            {
                DateTime dtFecha = Convert.ToDateTime(dtPlazos.Rows[i]["Fecha_Insert"]);
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
            }

            // Pagos
            dtPagos = await _ejecutivoRepository.ObtienePagos(Cartera, NoCuenta);
            dtPagos.DefaultView.Sort = "FechaPago DESC";

            // Herramientas
            dtHerramientas = await _ejecutivoRepository.ObtieneHerramientas(NoCuenta);

            // Descuentos
            dtDescuentos.Columns.Add("idHerramienta");
            dtDescuentos.Columns.Add("Descuento");
            dtDescuentos.Columns.Add("MáxDescuento");
            dtDescuentos.Columns.Add("MaxDías");

            string sHerramientas = "idHerramienta IN (0";
            double fDescuento = 0, fMáxDesc = 0;
            int iMáxDías = 0, idHerramienta = 0;

            for (int i = 0; i < dtHerramientas.Columns.Count; i++)
            {
                if (dtHerramientas.Rows[0][i].ToString().Equals("0") || dtHerramientas.Columns[i].ColumnName.Contains("Tasa"))
                {
                    if (dtHerramientas.Columns[i].ColumnName.Contains("136") || dtHerramientas.Columns[i].ColumnName.Contains("144"))
                        i += 2;
                    continue;
                }

                if (int.TryParse(dtHerramientas.Columns[i].ColumnName, out idHerramienta))
                {
                    sHerramientas += "," + dtHerramientas.Columns[i].ColumnName;
                    iMáxDías = Convert.ToInt16(dtHerramientas.Rows[0][i].ToString());
                }

                if (dtHerramientas.Columns[i + 1].ColumnName.Contains("Descuento"))
                {
                    i++;
                    fDescuento = Convert.ToDouble(dtHerramientas.Rows[0][i].ToString());
                }

                if (dtHerramientas.Columns[i + 1].ColumnName.Contains("Máximo"))
                {
                    i++;
                    fMáxDesc = Convert.ToDouble(dtHerramientas.Rows[0][i].ToString());
                }

                DataRow drDescuento = dtDescuentos.NewRow();
                drDescuento["idHerramienta"] = idHerramienta;
                drDescuento["Descuento"] = fDescuento;
                drDescuento["MáxDescuento"] = fMáxDesc;
                drDescuento["MaxDías"] = iMáxDías;
                dtDescuentos.Rows.Add(drDescuento);

                fDescuento = fMáxDesc = iMáxDías = idHerramienta = 0;
                dtDescuentos.PrimaryKey = new DataColumn[] { dtDescuentos.Columns["idHerramienta"] };
            }
            sHerramientas = sHerramientas.TrimEnd(',') + ")";

            // Producto
            InfoProducto = await _ejecutivoRepository.ObtieneProducto(NoCuenta);

            var resultadoCalculadora = new ResultadoCalculadora();
            return resultadoCalculadora;
        }
        #endregion

        #region Tiempos
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
        }

        public async Task<Dictionary<string, object>> PauseUnpause(InfoPausa pausa)
        {
            try
            {
                if (!await Despausar(pausa))
                {
                    return new Dictionary<string, object> { { "Error", "Contraseña Incorrecta." } };
                }


                DataTable catalogosTable = await _ejecutivoRepository.VwCatalogos();

                // Obtener IdPeCausa desde los catálogos
                int idPeCausa = await _searchService.GetIdValor(catalogosTable, "Pausas", pausa.PeCausa);


                await _ejecutivoRepository.ChangeEjecutivoMode(pausa.IdEjecutivo, "Consulta");
                await _ejecutivoRepository.Pausa210(pausa.IdEjecutivo, idPeCausa, pausa.Duracion);
                await _ejecutivoRepository.IncreaseEjecutivoTime(pausa.IdEjecutivo, pausa.Duracion, pausa.PeCausa);

                return new Dictionary<string, object> { { "Éxito", "Sesión reanudada." } };
            }
            catch
            {
                return new Dictionary<string, object> { { "Error", "Ocurrió un error al reanudar la sesión." } };
            }
        }

        private async Task<bool> Despausar(InfoPausa tiempos)
        {
            var validatePass = await _ejecutivoRepository.ValidatePasswordEjecutivo(tiempos.IdEjecutivo, tiempos.Contrasenia);
            return validatePass != null;
        }

        #endregion

        #region Promedios

        public async Task<Dictionary<string, object>> Promedios(int idEjecutivo)
        {
            try
            {
                // Instancia temporal de ClasesGespa (en lugar de usar estática)
                var gespa = new ClasesGespaNonStatic();

                // Cargar catálogos
                gespa.dtCatalogos = await _ejecutivoRepository.VwCatalogos();
                gespa.CargaCatalogos();

                gespa.dtRelaciones = await _ejecutivoRepository.VwRelaciones();
                gespa.Relaciones();

                // Calcular tiempos después de la pausa
                gespa.Tiempos = await _ejecutivoRepository.TiemposEjecutivo(idEjecutivo);
                gespa.ObtieneTiempos();


                DataTable teibolDelDia = await _ejecutivoRepository.CuentasEjecutivo(idEjecutivo);
                gespa.ObtieneGestionesDelDia(teibolDelDia);
                gespa.ConteosGestiones();

                // Extraer la fila adicional con los tiempos calculados
                if (gespa.Tiempos.Rows.Count > 1)
                {
                    var filaAdicional = gespa.Tiempos.Rows[1]
                        .Table.Columns.Cast<DataColumn>()
                        .ToDictionary(col => col.ColumnName, col => gespa.Tiempos.Rows[1][col]);

                    return filaAdicional;
                }

                return new Dictionary<string, object> { { "Error", "No se pudo calcular el tiempo." } };
            }
            catch
            {
                return new Dictionary<string, object> { { "Error", "No se pudo calcular el tiempo." } };
            }
        }

        #endregion

        #region Seguimientos
        public async Task<DataTable> GetSeguimientosAsync(int idCartera, string idCuenta)
        {
            DataTable seguimiento = new DataTable();
            string query = "SELECT * FROM fn_Seguimientos(@idCartera, @idCuenta)";

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.Add("@idCartera", SqlDbType.Int).Value = idCartera;
                    command.Parameters.Add("@idCuenta", SqlDbType.VarChar).Value = idCuenta;

                    using (var adapter = new SqlDataAdapter(command))
                    {
                        adapter.Fill(seguimiento);
                    }
                }
            }
            return seguimiento;
        }

        public async Task ObtenerSeguimientos(DataRow drDatos, DataSet dsTablas)
        {
            if (drDatos == null)
                return;

            if (!drDatos.Table.Columns.Contains("idCartera") || !drDatos.Table.Columns.Contains("idCuenta"))
                throw new ArgumentException("Las columnas 'idCartera' y/o 'idCuenta' no existen en el DataRow");

            var idCartera = Convert.ToInt32(drDatos["idCartera"]);
            var idCuenta = Convert.ToString(drDatos["idCuenta"]);

            DataTable seguimientosGet = await GetSeguimientosAsync(idCartera, idCuenta);

            if (seguimientosGet == null || seguimientosGet.Rows.Count == 0)
                return;

            if (dsTablas.Tables.Contains("Seguimiento"))
            {
                dsTablas.Tables.Remove("Seguimiento");
            }

            seguimientosGet.TableName = "Seguimiento";
            dsTablas.Tables.Add(seguimientosGet);
        }
        #endregion

        #region Accionamiento
        public async Task<DataTable> GetAccionamientoAsync(int idCartera, string idCuenta)
        {
            DataTable accionamiento = new DataTable();
            string query = "SELECT * FROM fn_Accionamientos(@idCartera, @idCuenta)";

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.Add("@idCartera", SqlDbType.Int).Value = idCartera;
                    command.Parameters.Add("@idCuenta", SqlDbType.VarChar).Value = idCuenta;

                    using (var adapter = new SqlDataAdapter(command))
                    {
                        adapter.Fill(accionamiento);
                    }
                }
            }
            return accionamiento;
        }

        public async Task ObtenerAccionamiento(DataRow drDatos, DataSet dsTablas)
        {
            if (drDatos == null)
                return;

            if (!drDatos.Table.Columns.Contains("idCartera") || !drDatos.Table.Columns.Contains("idCuenta"))
                throw new ArgumentException("Las columnas 'idCartera' y/o 'idCuenta' no existen en el DataRow");

            var idCartera = Convert.ToInt32(drDatos["idCartera"]);
            var idCuenta = Convert.ToString(drDatos["idCuenta"]);

            DataTable accionamientoGet = await GetAccionamientoAsync(idCartera, idCuenta);

            if (accionamientoGet == null || accionamientoGet.Rows.Count == 0)
                return;

            if (dsTablas.Tables.Contains("Accionamiento"))
            {
                dsTablas.Tables.Remove("Accionamiento");
            }

            accionamientoGet.TableName = "Accionamiento";
            dsTablas.Tables.Add(accionamientoGet);
        }
        #endregion

        #region Negociaciones
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

            int conteo = negociaciones.Count(n => n.FechaCreacion == DateTime.Today);
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
                .Where(n => n.FechaCreacion.HasValue && n.FechaTermino.HasValue)
                .Select(n => (n.FechaTermino.Value - n.FechaCreacion.Value).Ticks)
                .ToList();

            if (tiempos.Count == 0 || tiempos.Sum() == 0) return null;

            long totalTicks = tiempos.Sum();
            return new TimeSpan(totalTicks / tiempos.Count);
        }
        #endregion

        #region Recuperacion
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

        #endregion


        public async Task<DataTable> GetSeguimientosEjecutivoAsync(int idEjecutivo)
        {
            DataTable recordatorios = new DataTable();
            string query = "SELECT * FROM fn_SeguimientosEjecutivo(@idEjecutivo)"; // Evita inyección SQL

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand(query, connection))
                {
                    // Usar Add con tipo explícito para evitar problemas con tipos de datos
                    command.Parameters.Add("@idEjecutivo", SqlDbType.Int).Value = idEjecutivo;

                    using (var adapter = new SqlDataAdapter(command))
                    {
                        adapter.Fill(recordatorios);
                    }
                }
            }
            //string jsonString = JsonSerializer.Serialize();
            return recordatorios;
        }
        public async Task ObtieneRecordatoriosAsync(DataRow drDatos, DataSet dsTablas)
        {
            if (drDatos == null || dsTablas.Tables.Contains("Seguimientos"))
                return;

            // Verifica que drDatos tenga la columna 'idEjecutivo'
            if (!drDatos.Table.Columns.Contains("idEjecutivo"))
                throw new ArgumentException("La columna 'idEjecutivo' no existe en el DataRow");

            var idEjecutivo = drDatos["idEjecutivo"];
            DataTable recordatorios = await GetSeguimientosEjecutivoAsync(Convert.ToInt32(idEjecutivo));

            if (recordatorios == null || recordatorios.Rows.Count == 0)
                return;

            recordatorios.TableName = "Seguimientos";
            dsTablas.Tables.Add(recordatorios);
            recordatorios.DefaultView.Sort = "SegundoSeguimiento ASC";
        }
        #region Búsqueda
        public async Task<DataTable> GetBusquedaAsync(int idCartera, string idCuenta, int Jararquia)
        {
            DataTable busqueda = new DataTable();
            string query = "SELECT * FROM fn_Búsquedas(@idCartera, @idCuenta, @Jerarquía)";

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.Add("@idCartera", SqlDbType.Int).Value = idCartera;
                    command.Parameters.Add("@idCuenta", SqlDbType.VarChar).Value = idCuenta;
                    command.Parameters.Add("@Jerarquía", SqlDbType.Int).Value = Jararquia;

                    using (var adapter = new SqlDataAdapter(command))
                    {
                        adapter.Fill(busqueda);
                    }
                }
            }
            return busqueda;
        }

        public async Task ObtenerBusquedaEJE(DataRow drDatos, DataSet dsTablas)
        {
            if (drDatos == null)
                return;

            if (!drDatos.Table.Columns.Contains("idCartera") || !drDatos.Table.Columns.Contains("idCuenta"))
                throw new ArgumentException("Las columnas 'idCartera' y/o 'idCuenta' no existen en el DataRow");

            var idCartera = Convert.ToInt32(drDatos["idCartera"]);
            var idCuenta = Convert.ToString(drDatos["idCuenta"]);
            var Jerarquia = Convert.ToInt32(drDatos["Jerarquía"]);

            DataTable busquedaGet = await GetBusquedaAsync(idCartera, idCuenta, Jerarquia);

            if (busquedaGet == null || busquedaGet.Rows.Count == 0)
                return;

            if (dsTablas.Tables.Contains("Busqueda"))
            {
                dsTablas.Tables.Remove("Busqueda");
            }

            busquedaGet.TableName = "Busqueda";
            dsTablas.Tables.Add(busquedaGet);
        }
        // Usar la interfaz

        public EjecutivoService(string connectionString, IBusquedaRepository busquedaRepository) // Inyectar la interfaz
        {
            _connectionString = connectionString;
            _busquedaRepository = busquedaRepository;
        }

        public async Task<bool> GuardaBusquedaAsync(BusquedaClass busqueda, int idCartera, string idCuenta, int idEjecutivo, TimeSpan tiempoEnCuenta)
        {
            if (busqueda == null)
                throw new ArgumentNullException(nameof(busqueda), "El objeto búsqueda no puede ser null");

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var transaction = connection.BeginTransaction())
                {
                    try
                    {
                        // Validar si la búsqueda ya existe hoy
                        string fechaHoy = DateTime.UtcNow.ToString("yyyy-MM-dd");

                        using (var checkCommand = new SqlCommand(
                            "SELECT COUNT(*) FROM Busquedas WHERE Fecha_Insert = @FechaHoy AND idDato = @idDato AND idFuente = @idFuente AND idEjecutivo = @idEjecutivo",
                            connection, transaction))
                        {
                            checkCommand.Parameters.AddWithValue("@FechaHoy", fechaHoy);
                            checkCommand.Parameters.AddWithValue("@idDato", busqueda.idDato);
                            checkCommand.Parameters.AddWithValue("@idFuente", busqueda.idFuente);
                            checkCommand.Parameters.AddWithValue("@idEjecutivo", idEjecutivo);

                            int count = (int)await checkCommand.ExecuteScalarAsync();
                            if (count > 0)
                            {
                                transaction.Rollback();
                                return false; // Ya existe una búsqueda con esos datos hoy
                            }
                        }

                        // Insertar nueva búsqueda
                        using (var command = new SqlCommand("EXEC [2.9.Búsqueda] @idCartera, @idCuenta, @idEjecutivo, @idDato, @DatoBuscado, @idFuente, @Encontrado, @Telefonos, @Persona, @Puesto, @Lugar, NULL, @TiempoEnCuenta, @link, @validador;", connection, transaction))
                        {
                            command.Parameters.AddWithValue("@idCartera", idCartera);
                            command.Parameters.AddWithValue("@idCuenta", idCuenta?.Trim() ?? string.Empty);
                            command.Parameters.AddWithValue("@idEjecutivo", idEjecutivo);
                            command.Parameters.AddWithValue("@idDato", busqueda.idDato);

                            string datoBuscado = busqueda.idFuente == 2420 && busqueda.Teléfonos != null && busqueda.Teléfonos.Length > 0
                                ? $"XXX-XXX-{busqueda.Teléfonos[0].NúmeroTelefónico.Substring(6, 4)}"
                                : busqueda.Dato ?? string.Empty;

                            command.Parameters.AddWithValue("@DatoBuscado", datoBuscado);
                            command.Parameters.AddWithValue("@idFuente", busqueda.idFuente);
                            command.Parameters.AddWithValue("@Encontrado", busqueda.Encontrado);
                            command.Parameters.AddWithValue("@Telefonos", busqueda.Teléfonos?.Length ?? 0);
                            command.Parameters.AddWithValue("@Persona", busqueda.Persona ?? string.Empty);
                            command.Parameters.AddWithValue("@Puesto", busqueda.Puesto ?? string.Empty);
                            command.Parameters.AddWithValue("@Lugar", busqueda.Lugar ?? string.Empty);
                            command.Parameters.AddWithValue("@TiempoEnCuenta", tiempoEnCuenta.ToString(@"hh\:mm\:ss"));
                            command.Parameters.AddWithValue("@link", busqueda.Link ?? string.Empty);
                            command.Parameters.AddWithValue("@validador", (object?)busqueda.validador ?? DBNull.Value);

                            await command.ExecuteNonQueryAsync(); // Ejecutar sin recuperar idBusqueda
                        }

                        // Guardar nuevos teléfonos
                        if (busqueda.Teléfonos != null && busqueda.Teléfonos.Length > 0)
                        {
                            foreach (var telefono in busqueda.Teléfonos)
                            {
                                string mensaje = GuardaNuevoTelefono(telefono, true, connection, transaction);
                                if (!string.IsNullOrEmpty(mensaje))
                                {
                                    transaction.Rollback();
                                    return false; // Error al guardar teléfono, rollback
                                }
                            }
                        }

                        transaction.Commit();
                        return true;
                    }
                    catch (SqlException sqlEx)
                    {
                        transaction.Rollback();
                        Console.WriteLine($"Error en SQL: {sqlEx.Number} - {sqlEx.Message} - idCartera: {idCartera}, idCuenta: {idCuenta}, idEjecutivo: {idEjecutivo}, idDato: {busqueda.idDato}, idFuente: {busqueda.idFuente}, validador: {busqueda.validador}");
                        return false;
                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        Console.WriteLine($"Error general: {ex.Message}");
                        return false;
                    }
                }
            }
        }

        public string GuardaNuevoTelefono(Telefono telefono, bool esNuevo, SqlConnection connection, SqlTransaction transaction)
        {
            if (telefono == null || string.IsNullOrWhiteSpace(telefono.NúmeroTelefónico) || telefono.NúmeroTelefónico.Length != 10)
            {
                return "Número telefónico inválido o incompleto.";
            }

            try
            {
                using (var command = new SqlCommand("INSERT INTO Telefonos (NumeroTelefonico) VALUES (@NumeroTelefonico)", connection, transaction))
                {
                    command.Parameters.AddWithValue("@NumeroTelefonico", telefono.NúmeroTelefónico);
                    command.ExecuteNonQuery();
                }
                return "";
            }
            catch (SqlException ex)
            {
                Console.WriteLine($"Error de base de datos al guardar teléfono: {ex.Number} - {ex.Message} - NumeroTelefonico: {telefono.NúmeroTelefónico}");
                return "Error al guardar teléfono en la base de datos.";
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error inesperado al guardar teléfono: {ex.Message}");
                return "Error inesperado al guardar el teléfono.";
            }
        }



        #endregion

        #region CargosEnLinea
        public async Task<DataTable> GetCargosEnLineaAsync(int idCartera, string idCuenta)
        {
            DataTable cargos = new DataTable();
            string query = "SELECT * FROM dbo.fn_CargosEnLínea(@idCartera, @idCuenta) ";

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.Add("@idCartera", SqlDbType.Int).Value = idCartera;
                    command.Parameters.Add("@idCuenta", SqlDbType.VarChar).Value = idCuenta;

                    using (var adapter = new SqlDataAdapter(command))
                    {
                        adapter.Fill(cargos);
                    }
                }
            }
            return cargos;
        }

        public async Task ObtenerCargosEnLinea(DataRow drDatos, DataSet dsTablas)
        {
            if (drDatos == null)
                return;

            if (!drDatos.Table.Columns.Contains("idCartera") || !drDatos.Table.Columns.Contains("idCuenta"))
                throw new ArgumentException("Las columnas 'idCartera' y/o 'idCuenta' no existen en el DataRow");

            var idCartera = Convert.ToInt32(drDatos["idCartera"]);
            var idCuenta = Convert.ToString(drDatos["idCuenta"]);

            DataTable CargoGet = await GetCargosEnLineaAsync(idCartera, idCuenta);

            if (CargoGet == null || CargoGet.Rows.Count == 0)
                return;

            if (dsTablas.Tables.Contains("Cargos"))
            {
                dsTablas.Tables.Remove("Cargos");
            }

            CargoGet.TableName = "Cargos";
            dsTablas.Tables.Add(CargoGet);
        }
        public async Task<string> SaveCargoEnlinea(CargoEnLineaRe newCargoEn)
        {
            try
            {
                string idCuenta = newCargoEn.idCuenta.ToString();
                int idCartera = ObtenerIdCarteraDesdeBaseDeDatos(idCuenta);
                dynamic cargoData = ObtenerDatosCargoEnLinea(idCartera, idCuenta);

                if (cargoData != null)
                {
                    try
                    {
                        if (long.TryParse(cargoData.Tarjeta.ToString(), out long numeroTarjetaLong))
                        {
                            Console.WriteLine($"cargoData.Tarjeta: {cargoData.Tarjeta}, numeroTarjetaLong: {numeroTarjetaLong}");

                            string autorizacionString = cargoData.Autorización?.ToString();

                            // Deserialización como DateTime
                            DateTime fechaVencimiento = newCargoEn.vencimiento; // Obtener la fecha del modelo

                            CargoEnLinea newCargo = new CargoEnLinea(
                                monto: Convert.ToDecimal(newCargoEn.Monto),
                                tarjeta: numeroTarjetaLong,
                                autorizacion: autorizacionString,
                                // Pasar el valor de noAutorizacion
                                status: Convert.ToInt32(cargoData.Status),
                                IdBanco: Convert.ToInt32(cargoData.idBanco),
                                idEjecutivoAutorizo: Convert.ToInt32(newCargoEn.IdEjecutivoAutorizo),
                                vencimiento: fechaVencimiento, // Pasar el objeto DateTime
                                nombre: cargoData.Nombre.ToString(),
                                esClabe: Convert.ToBoolean(cargoData._EsClabe),
                                domiciliado: Convert.ToBoolean(cargoData._Domiciliado),
                                sistema: false,
                                idCartera: idCartera,
                                idCuenta: idCuenta,
                                idEjecutivo: Convert.ToInt32(newCargoEn.idEjecutivo)
                            );

                            string saveCargoResult = await ValidateNewCargo(newCargo);
                            return saveCargoResult;
                        }
                        else
                        {
                            return "El número de tarjeta no es válido.";
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error al convertir el número de tarjeta: {ex.Message}");
                        return $"Error al convertir el número de tarjeta: {ex.Message}";
                    }
                }
                else
                {
                    return "No se encontraron datos para el cargo en línea.";
                }
            }
            catch (Exception ex)
            {
                return $"Error al guardar el cargo en línea: {ex.Message}";
            }
            return "Error desconocido al procesar el cargo en línea.";
        }

        private async Task<string> ValidateNewCargo(CargoEnLinea cargoCuenta)
        {
            // Registra el valor de cargoCuenta.Tarjeta
            Console.WriteLine($"Validando Tarjeta: {cargoCuenta.Tarjeta}");

            var newCargoResult = await _ejecutivoRepository.RegisterNewCargo(cargoCuenta);

            if (newCargoResult == null)
            {
                return "Fallo al guardar el cargo en la base de datos.";
            }

            //  Verifica si el resultado contiene un mensaje de error
            if (newCargoResult is IDictionary<string, object> cargoResultDict &&
                cargoResultDict.TryGetValue("Resultado", out object resultadoObj) && resultadoObj != null)
            {
                return Convert.ToString(resultadoObj);
            }

            return "";
        }

        private dynamic ObtenerDatosCargoEnLinea(int idCartera, string idCuenta)
        {
            try
            {
                using (IDbConnection connection = new SqlConnection(_connectionString))
                {
                    string query = "SELECT * FROM dbo.fn_CargosEnLínea(@idCartera, @idCuenta)";
                    return connection.QueryFirstOrDefault(query, new { idCartera = idCartera, idCuenta = idCuenta }); // Pasar idCartera
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al obtener datos de CargoEnLínea: {ex.Message}");
                return null;
            }
        }

        private int ObtenerIdCarteraDesdeBaseDeDatos(string idCuenta)
        {
            try
            {
                using (IDbConnection connection = new SqlConnection(_connectionString))
                {
                    string query = "SELECT idCartera FROM [dbCollection].[dbo].[Cuentas] WHERE idCuenta = @idCuenta";
                    return connection.QueryFirstOrDefault<int>(query, new { idCuenta });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al obtener idCartera: {ex.Message}");
                return 0;
            }
        }



        public async Task<dynamic> ValidateBusqueda(string filtro, string ValorBusqueda)
        {
            string validacion = null;

            using (IDbConnection connection = new SqlConnection(_connectionString)) // Corregido: Usar _connectionString
            {

                string queryBusqueda = "WAITFOR DELAY '00:00:00';\r\n" +
                                        "SELECT TOP 100 \r\n" +
                                        "   C.idCuenta Cuenta, \r\n" +
                                        "   CL.Cartera, \r\n" +
                                        "   P.Producto, \r\n" +
                                        "   C.NombreDeudor Nombre, \r\n" +
                                        "   C.RFC, \r\n" +
                                        "   C.NúmeroCliente, \r\n" +
                                        "   V.Valor Situación, \r\n" +
                                        "   C.idCartera, \r\n" +
                                        "   C.Saldo, \r\n" +
                                        "   C.Fecha_CambioActivación, \r\n" +
                                        "   C.Expediente \r\n" +
                                        "FROM Cuentas C \r\n" +
                                        "    	INNER JOIN Productos P ON P.idProducto = C.idProducto \r\n" +
                                        "    	INNER JOIN Carteras CL ON CL.idCartera = C.idCartera \r\n" +
                                        "       INNER JOIN ValoresCatálogo V ON V.idValor = C.idSituación \r\n"

                                        ;
                switch (filtro)
                {
                    case "Cuenta":
                        queryBusqueda = queryBusqueda.Replace("Cuentas C", "Cuentas C WITH (NOLOCK)");
                        queryBusqueda += " WHERE CuentaActiva = 1 AND C.idCuenta = '" + ValorBusqueda.Replace(" ", "") + "' ";
                        break;

                    case "Nombre":
                        queryBusqueda = queryBusqueda.Replace("Cuentas C", "Cuentas C WITH (NOLOCK)");
                        queryBusqueda += " INNER JOIN Nombres N (NOLOCK) ON N.Expediente = C.Expediente ";

                        foreach (string sNombre in ValorBusqueda.Split(new char[] { ' ' }, StringSplitOptions.RemoveEmptyEntries))
                            queryBusqueda += " AND CONTAINS( N.NombreDeudor, '" + sNombre.Replace("'", "") + "') ";
                        queryBusqueda += "WHERE CuentaActiva = 1";
                        validacion = "Nombre";
                        break;

                    case "RFC":
                        queryBusqueda = queryBusqueda.Replace("Cuentas C", "Cuentas C WITH (INDEX(IX_Cuentas_RFC), NOLOCK)");
                        queryBusqueda += " WHERE CuentaActiva = 1 AND  CHARINDEX('" + ValorBusqueda.Replace(" ", "") + "', C.RFC) = 1  ";
                        break;

                    case "Numero Cliente":
                        queryBusqueda = queryBusqueda.Replace("Cuentas C", "Cuentas C WITH (INDEX(IX_Cuentas_NúmeroCliente), NOLOCK)");
                        queryBusqueda += " WHERE CuentaActiva = 1 AND  C.NúmeroCliente = '" + ValorBusqueda.Replace(" ", "") + "' ";
                        break;

                    case "Telefono":
                        queryBusqueda = queryBusqueda.Replace("Cuentas C", "Cuentas C WITH (NOLOCK)");
                        queryBusqueda += "  LEFT JOIN Teléfonos T WITH (NOLOCK) ON T.idCartera = C.idCartera AND T.idCuenta = C.idCuenta \r\n";

                        //foreach (char caracter in ValorBusqueda.Replace(" ", ""))
                        //    if (!char.IsDigit(caracter))
                        //        return tblResultado;
                        //que el equipo Front controle que solo sean numeros y sean 10 digitos

                        queryBusqueda += " WHERE CuentaActiva = 1 AND T.NúmeroTelefónico = RIGHT('" + ValorBusqueda.Replace(" ", "") + "', 10) ";
                        break;

                    case "Expediente":     //El equipo Front debe validar que no tenga letras

                        queryBusqueda += " WHERE CuentaActiva = 1 AND CL.Abreviación = '";
                        foreach (char Caracter in ValorBusqueda.Substring(0, 3))
                            if (char.IsLetter(Caracter))
                                queryBusqueda += Caracter;
                        queryBusqueda = queryBusqueda.Replace("Cuentas C", "Cuentas C WITH (NOLOCK)");
                        //quitar letras cuando se libere a todas las carteras
                        queryBusqueda += "' AND C.Expediente = " + ValorBusqueda.Replace("AMX", "").Replace("amx", "").Replace(" ", "");


                        break;

                    default:
                        //sQueryWHERE += " AND 2=1";
                        break;
                }

                if (validacion == "Nombre")
                {
                    var busqueda = (await connection.QueryAsync<dynamic>(queryBusqueda, commandType: CommandType.Text));
                    return busqueda;
                }
                else
                {
                    var busqueda = (await connection.QueryFirstOrDefaultAsync<dynamic>(queryBusqueda, commandType: CommandType.Text));
                    return busqueda;
                }


            }
        }



        #endregion

        #region Estado de cuenta
        public async Task<DataTable> GetEstadoDeCuentaAsync(int idCartera, string idCuenta)
        {
            DataTable estado = new DataTable();
            string query = "WAITFOR DELAY '00:00:00' SELECT * FROM dbo.fn_SolicitudEstadosDeCuenta (@idCuenta, @idCartera)";

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.Add("@idCartera", SqlDbType.Int).Value = idCartera;
                    command.Parameters.Add("@idCuenta", SqlDbType.VarChar).Value = idCuenta;

                    using (var adapter = new SqlDataAdapter(command))
                    {
                        adapter.Fill(estado);
                    }
                }
            }
            return estado;
        }

        public async Task ObtenerPagos(DataRow drDatos, DataSet dsTablas)
        {
            if (drDatos == null)
                return;

            if (!drDatos.Table.Columns.Contains("idCartera") || !drDatos.Table.Columns.Contains("idCuenta"))
                throw new ArgumentException("Las columnas 'idCartera' y/o 'idCuenta' no existen en el DataRow");

            var idCartera = Convert.ToInt32(drDatos["idCartera"]);
            var idCuenta = Convert.ToString(drDatos["idCuenta"]);

            DataTable estadoGet = await GetEstadoDeCuentaAsync(idCartera, idCuenta);

            if (estadoGet == null || estadoGet.Rows.Count == 0)
                return;

            if (dsTablas.Tables.Contains("EstadoDeCuenta"))
            {
                dsTablas.Tables.Remove("EstadoDeCuenta");
            }

            estadoGet.TableName = "EstadoDeCuenta";
            dsTablas.Tables.Add(estadoGet);
        }
        public async Task<string> SaveEstadoDeCuenta(EstadoDeCuentaRe newEstadoEn)
        {
            try
            {
                string idCuenta = newEstadoEn.idCuenta.ToString();
                int idCartera = ObtenerIdCarteraDesdeBaseDeDatos(idCuenta);
                dynamic cargoData = ObtenerDatosEstadoDeCuenta(idCartera, idCuenta);

                if (cargoData != null)
                {
                    try
                    {
                        DateTime FechaInicial = newEstadoEn.FechaInicial;
                        DateTime FechaFinal = newEstadoEn.FechaFinal;
                        string CorreoString = cargoData.sCorreoElectronico?.ToString();

                        EstadoDeCuenta newEstado = new EstadoDeCuenta(
                            IdCartera: Convert.ToInt32(idCartera),
                            IdCuenta: idCuenta,
                            IdEjecutivo: Convert.ToInt32(newEstadoEn.idEjecutivo),
                            FechaInicial: FechaInicial,
                            FechaFinal: FechaFinal,
                            consulta: newEstadoEn.Consulta,
                            correoElectronico: CorreoString
                        );

                        string saveEstadoResult = await ValidateBusqueda(newEstado);
                        return saveEstadoResult;
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error al procesar la solicitud de estado de cuenta: {ex.Message}");
                        return $"Error al procesar la solicitud de estado de cuenta: {ex.Message}";
                    }
                }
                else
                {
                    return "No se encontraron datos para la solicitud de estado de cuenta.";
                }
            }
            catch (Exception ex)
            {
                return $"Error al guardar la solicitud de estado de cuenta: {ex.Message}";
            }
            return "Error desconocido al procesar la solicitud de estado de cuenta.";
        }
        private async Task<string> ValidateBusqueda(EstadoDeCuenta estadoCuenta)
        {
            try
            {
                // Asumiendo que necesitas pasar algún valor para ValorBusqueda,
                // puedes obtenerlo del objeto estadoCuenta o de otra fuente.
                string valorBusqueda = estadoCuenta.idCuenta; // Ejemplo: Usar idCuenta como ValorBusqueda

                var newEstadoResult = await _ejecutivoRepository.RegisterNewEstado(estadoCuenta);

                if (newEstadoResult == null)
                {
                    return "Falló al guardar la solicitud de estado de cuenta en la base de datos.";
                }

                if (newEstadoResult is IDictionary<string, object> estadoResultDict &&
                    estadoResultDict.TryGetValue("Resultado", out object resultadoObj) && resultadoObj != null)
                {
                    return Convert.ToString(resultadoObj);
                }

                return "";
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al validar la solicitud de estado de cuenta: {ex.Message}");
                return $"Error al validar la solicitud de estado de cuenta: {ex.Message}";
            }
        }
        private dynamic ObtenerDatosEstadoDeCuenta(int idCartera, string idCuenta)
        {
            try
            {
                using (IDbConnection connection = new SqlConnection(_connectionString))
                {
                    string query = "WAITFOR DELAY '00:00:00' SELECT * FROM dbo.fn_SolicitudEstadosDeCuenta (@idCuenta, @idCartera)";
                    return connection.QueryFirstOrDefault(query, new { idCartera = idCartera, idCuenta = idCuenta }); // Pasar idCartera
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al obtener datos de CargoEnLínea: {ex.Message}");
                return null;
            }
        }






        #endregion

        #region MultiDeudores
        public async Task<DataTable> ObtieneMultideudoresAsync(DataRow drInfo, Hashtable htProducto, string sortMultideudores, string connectionString)
        {
            if (drInfo == null)
                return null; // Devuelve null si drInfo es nulo

            DataTable tblMultideudores = new DataTable();

            using (var connection = new SqlConnection(connectionString))
            {
                await connection.OpenAsync();

                string query = "SELECT TOP 1 * FROM vw_CuentaActiva WHERE idCartera = @idCartera AND idCuenta = @idCuenta " +
                               "UNION \r\n" +
                               "SELECT * FROM vw_CuentaActiva WHERE RFC = @RFC AND @RFC IS NOT NULL AND RTRIM(LTRIM(@RFC)) <> '' \r\n" +
                               "UNION \r\n" +
                               "SELECT * FROM vw_CuentaActiva WHERE NúmeroCliente = @NúmeroCliente AND idCartera = @idCartera AND @NúmeroCliente IS NOT NULL AND RTRIM(LTRIM(@NúmeroCliente)) <> ''";

                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@idCartera", drInfo["idCartera"]);
                    command.Parameters.AddWithValue("@idCuenta", drInfo["idCuenta"]);
                    command.Parameters.AddWithValue("@RFC", drInfo["RFC"]);
                    command.Parameters.AddWithValue("@NúmeroCliente", drInfo["NúmeroCliente"]);

                    // AMEX GDC Búsqueda por nombre.
                    if (drInfo["idProducto"].ToString() == "35")
                    {
                        command.CommandText = "SELECT C.* FROM vw_CuentaActiva C INNER JOIN Y.Producto_35 P ON C.idCuenta = P.idcuenta WHERE idCartera = 1 AND idProducto = 35 AND P.nombreempresa = @nombreempresa";
                        command.Parameters.AddWithValue("@nombreempresa", htProducto["nombreempresa"]);
                    }

                    using (var adapter = new SqlDataAdapter(command))
                    {
                        adapter.Fill(tblMultideudores);
                    }
                }
            }

            if (tblMultideudores.Rows.Count == 0)
                return null; // Devuelve null si no hay filas

            tblMultideudores.PrimaryKey = new DataColumn[] { tblMultideudores.Columns["idCartera"], tblMultideudores.Columns["idCuenta"] };
            tblMultideudores.DefaultView.Sort = sortMultideudores;

            return tblMultideudores;
        }
        public async Task ObtenerMultideudores(DataRow drDatos, DataSet dsTablas, Hashtable htProducto, string sortMultideudores, string connectionString)
        {
            if (drDatos == null)
                return;

            if (!drDatos.Table.Columns.Contains("idCartera") || !drDatos.Table.Columns.Contains("idCuenta"))
                throw new ArgumentException("Las columnas 'idCartera' y/o 'idCuenta' no existen en el DataRow");

            DataTable multideudores = await ObtieneMultideudoresAsync(drDatos, htProducto, sortMultideudores, connectionString);

            if (multideudores == null || multideudores.Rows.Count == 0)
                return;

            if (dsTablas.Tables.Contains("Multideudores"))
            {
                dsTablas.Tables.Remove("Multideudores");
            }

            multideudores.TableName = "Multideudores";
            dsTablas.Tables.Add(multideudores);
        }
        #endregion

        #region Pagos
        public async Task<DataTable> GetPagosAsync(int idCartera, string idCuenta)
        {
            DataTable pagos = new DataTable();
            string query = "SELECT * FROM fn_Pagos(@idCartera, @idCuenta)";

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.Add("@idCartera", SqlDbType.Int).Value = idCartera;
                    command.Parameters.Add("@idCuenta", SqlDbType.VarChar).Value = idCuenta;

                    using (var adapter = new SqlDataAdapter(command))
                    {
                        adapter.Fill(pagos);
                    }
                }
            }
            return pagos;
        }

        public async Task ObtenerPago(DataRow drDatos, DataSet dsTablas)
        {
            if (drDatos == null)
                return;

            if (!drDatos.Table.Columns.Contains("idCartera") || !drDatos.Table.Columns.Contains("idCuenta"))
                throw new ArgumentException("Las columnas 'idCartera' y/o 'idCuenta' no existen en el DataRow");

            var idCartera = Convert.ToInt32(drDatos["idCartera"]);
            var idCuenta = Convert.ToString(drDatos["idCuenta"]);

            DataTable pagosGet = await GetPagosAsync(idCartera, idCuenta);

            if (pagosGet == null || pagosGet.Rows.Count == 0)
                return;

            if (dsTablas.Tables.Contains("Pagos"))
            {
                dsTablas.Tables.Remove("Pagos");
            }

            pagosGet.TableName = "Pagos";
            dsTablas.Tables.Add(pagosGet);
        }
        #endregion

        #region Gestiones
        public async Task<DataTable> ObtieneGestionTeAsync(int idCartera, string idCuenta)
        {
            DataTable gestiones = new DataTable();

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                var parameters = new { IdCartera = idCartera, IdCuenta = idCuenta };
                var gestionesResult = await connection.QueryAsync<dynamic>(
                    "SELECT * FROM fn_GestionesTelefónicas(@IdCartera, @IdCuenta)",
                    parameters);

                if (gestionesResult.Any())
                {
                    // Crear columnas
                    var firstItem = gestionesResult.First() as IDictionary<string, object>;
                    foreach (var key in firstItem.Keys)
                    {
                        gestiones.Columns.Add(key);
                    }

                    // Agregar filas
                    foreach (var item in gestionesResult)
                    {
                        var row = gestiones.NewRow();
                        var itemDict = item as IDictionary<string, object>;
                        if (itemDict != null)
                        {
                            foreach (var key in itemDict.Keys)
                            {
                                row[key] = itemDict[key] ?? DBNull.Value;
                            }
                        }
                        gestiones.Rows.Add(row);
                    }
                }
            }

            return gestiones;
        }
        public async Task<DataTable> GetDomiciliosAsync(int idCartera, string idCuenta)
        {
            DataTable domicilio = new DataTable();
            string query = "SELECT * FROM fn_GestionesDomiciliarias( @idCartera, @idCuenta)";

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.Add("@idCartera", SqlDbType.Int).Value = idCartera;
                    command.Parameters.Add("@idCuenta", SqlDbType.VarChar).Value = idCuenta;

                    using (var adapter = new SqlDataAdapter(command))
                    {
                        adapter.Fill(domicilio);
                    }
                }
            }
            return domicilio;
        }

        public async Task ObtenerDomicilios(DataRow drDatos, DataSet dsTablas)
        {
            if (drDatos == null)
                return;

            if (!drDatos.Table.Columns.Contains("idCartera") || !drDatos.Table.Columns.Contains("idCuenta"))
                throw new ArgumentException("Las columnas 'idCartera' y/o 'idCuenta' no existen en el DataRow");

            var idCartera = Convert.ToInt32(drDatos["idCartera"]);
            var idCuenta = Convert.ToString(drDatos["idCuenta"]);

            DataTable domiciliosGet = await GetDomiciliosAsync(idCartera, idCuenta);

            if (domiciliosGet == null || domiciliosGet.Rows.Count == 0)
                return;

            if (dsTablas.Tables.Contains("Domicilios")) ;
            {
                dsTablas.Tables.Remove("Domicilios");
            }

            domiciliosGet.TableName = "Domicilios";
            dsTablas.Tables.Add(domiciliosGet);
        }
        public DataTable ObtieneGestionesDelDia(int idEjecutivo) // Cambiado a DataTable y eliminado async
        {
            DataTable tblDelDía = new DataTable();

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open(); // Eliminado await

                using (SqlCommand command = new SqlCommand($"SELECT * FROM fn_GestionesTelDiaras({idEjecutivo})", connection))
                {
                    using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                    {
                        adapter.Fill(tblDelDía);
                    }
                }
            }

            if (tblDelDía.Rows.Count == 0)
            {
                return null; // Devuelve null si no hay gestiones
            }

            DataTable Cuentas = tblDelDía.Clone();
            DataTable GestionesEjecutivo = tblDelDía.Clone();
            bool bSeparador = false;

            foreach (DataColumn columna in tblDelDía.Columns)
            {
                if (!bSeparador && columna.ColumnName == "Separador")
                {
                    bSeparador = true;
                    GestionesEjecutivo.Columns.Remove("Separador");
                    GestionesEjecutivo.Columns.Remove("idEjecutivo");
                }
                if (bSeparador)
                    Cuentas.Columns.Remove(columna.ColumnName);
                else if (columna.ColumnName != "idCartera" && columna.ColumnName != "idCuenta" && columna.ColumnName != "Fecha_Insert" && columna.ColumnName != "Segundo_Insert")
                    GestionesEjecutivo.Columns.Remove(columna.ColumnName);
            }

            foreach (DataRow row in tblDelDía.Rows)
            {
                DataRow rowCuentas = Cuentas.NewRow();
                DataRow rowGestiones = GestionesEjecutivo.NewRow();

                foreach (DataColumn col in Cuentas.Columns)
                {
                    rowCuentas[col.ColumnName] = row[col.ColumnName];
                }

                foreach (DataColumn col in GestionesEjecutivo.Columns)
                {
                    rowGestiones[col.ColumnName] = row[col.ColumnName];
                }

                Cuentas.Rows.Add(rowCuentas);
                GestionesEjecutivo.Rows.Add(rowGestiones);
            }

            return tblDelDía; // Devuelve tblDelDía
        }
        #endregion

        #region Scrips
        public DataTable BuscaScripts(int idProducto)
        {
            DataTable scripts = new DataTable();

            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString)) // Usar la cadena de conexión de tu servicio
                {
                    connection.Open();

                    using (SqlCommand command = new SqlCommand($"SELECT * FROM Scripts (NOLOCK) WHERE idProducto = {idProducto}", connection))
                    {
                        using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                        {
                            adapter.Fill(scripts);
                        }
                    }
                }

                if (scripts.Rows.Count == 0)
                {
                    return new DataTable();
                }

                return scripts;
            }
            catch (Exception ex)
            {
                // Log the exception or handle it appropriately
                Console.WriteLine($"Error en BuscaScripts: {ex.Message}");
                return new DataTable(); // or throw the exception
            }
        }
        #endregion

        #region Relaciones
        public DataTable CargaRelaciones()
        {
            DataTable dtRelaciones = new DataTable();

            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString)) // _connectionString debe estar disponible
                {
                    connection.Open();

                    using (SqlCommand command = new SqlCommand("SELECT * FROM vw_Relaciones", connection))
                    {
                        using (SqlDataAdapter adapter = new SqlDataAdapter(command))
                        {
                            adapter.Fill(dtRelaciones);
                        }
                    }
                }

                if (dtRelaciones.Rows.Count == 0)
                {
                    return new DataTable(); // Retorna una tabla vacía si no hay resultados
                }

                // Crea llave primaria.
                dtRelaciones.PrimaryKey = new DataColumn[] { dtRelaciones.Columns["idValor1"], dtRelaciones.Columns["idValor2"] };

                dtRelaciones.TableName = "Relaciones";
                // Ya no manejamos _dsTablas aquí

                return dtRelaciones;
            }
            catch (Exception ex)
            {
                // Log the exception or handle it appropriately
                Console.WriteLine($"Error en CargaRelaciones: {ex.Message}");
                return new DataTable(); // Retorna una tabla vacía en caso de error
            }
        }
        #endregion


        #region Correos
        public async Task<DataTable> GetCorreosAsync(int idCartera, string idCuenta)
        {
            DataTable correos = new DataTable();
            string query = "SELECT * FROM fn_CorreosEnviados(@idCartera, @idCuenta)";

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.Add("@idCartera", SqlDbType.Int).Value = idCartera;
                    command.Parameters.Add("@idCuenta", SqlDbType.VarChar).Value = idCuenta;
                  

                    using (var adapter = new SqlDataAdapter(command))
                    {
                        adapter.Fill(correos);
                    }
                }
            }
            return correos;
        }

        public async Task ObtenerCorreosEJE(DataRow drDatos, DataSet dsTablas)
        {
            if (drDatos == null)
                return;

            if (!drDatos.Table.Columns.Contains("idCartera") || !drDatos.Table.Columns.Contains("idCuenta"))
                throw new ArgumentException("Las columnas 'idCartera' y/o 'idCuenta' no existen en el DataRow");

            var idCartera = Convert.ToInt32(drDatos["idCartera"]);
            var idCuenta = Convert.ToString(drDatos["idCuenta"]);

            DataTable CorreosGet = await GetCorreosAsync(idCartera, idCuenta);

            if (CorreosGet == null || CorreosGet.Rows.Count == 0)
                return;

            if (dsTablas.Tables.Contains("Correos"))
            {
                dsTablas.Tables.Remove("Correos");
            }

            CorreosGet.TableName = "Correos";
            dsTablas.Tables.Add(CorreosGet);
        }

        public async Task<DataTable> GetCorreosEnviadosAsync(int idCartera, string idCuenta)
        {
            DataTable correos = new DataTable();
            string query = "SELECT * FROM fn_Correos(@idCartera, @idCuenta)";

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.Add("@idCartera", SqlDbType.Int).Value = idCartera;
                    command.Parameters.Add("@idCuenta", SqlDbType.VarChar).Value = idCuenta;


                    using (var adapter = new SqlDataAdapter(command))
                    {
                        adapter.Fill(correos);
                    }
                }
            }
            return correos;
        }

        public async Task ObtenerEnviadosEJE(DataRow drDatos, DataSet dsTablas)
        {
            if (drDatos == null)
                return;

            if (!drDatos.Table.Columns.Contains("idCartera") || !drDatos.Table.Columns.Contains("idCuenta"))
                throw new ArgumentException("Las columnas 'idCartera' y/o 'idCuenta' no existen en el DataRow");

            var idCartera = Convert.ToInt32(drDatos["idCartera"]);
            var idCuenta = Convert.ToString(drDatos["idCuenta"]);

            DataTable CorreosGet = await GetCorreosEnviadosAsync(idCartera, idCuenta);

            if (CorreosGet == null || CorreosGet.Rows.Count == 0)
                return;

            if (dsTablas.Tables.Contains("Correos"))
            {
                dsTablas.Tables.Remove("Correos");
            }

            CorreosGet.TableName = "Correos";
            dsTablas.Tables.Add(CorreosGet);
        }

        public async Task<DataTable> GetCorreosCargaAsync(int idCartera, string idCuenta)
        {
            DataTable correos = new DataTable();
            string query = "SELECT * FROM fn_Correos(@idCartera, @idCuenta)";

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.Add("@idCartera", SqlDbType.Int).Value = idCartera;
                    command.Parameters.Add("@idCuenta", SqlDbType.VarChar).Value = idCuenta;


                    using (var adapter = new SqlDataAdapter(command))
                    {
                        adapter.Fill(correos);
                    }
                }
            }
            return correos;
        }

        public async Task ObtenerCargaEJE(DataRow drDatos, DataSet dsTablas)
        {
            if (drDatos == null)
                return;

            if (!drDatos.Table.Columns.Contains("idCartera") || !drDatos.Table.Columns.Contains("idCuenta"))
                throw new ArgumentException("Las columnas 'idCartera' y/o 'idCuenta' no existen en el DataRow");

            var idCartera = Convert.ToInt32(drDatos["idCartera"]);
            var idCuenta = Convert.ToString(drDatos["idCuenta"]);

            DataTable CorreosGet = await GetCorreosCargaAsync(idCartera, idCuenta);

            if (CorreosGet == null || CorreosGet.Rows.Count == 0)
                return;

            if (dsTablas.Tables.Contains("Correos"))
            {
                dsTablas.Tables.Remove("Correos");
            }

            CorreosGet.TableName = "Correos";
            dsTablas.Tables.Add(CorreosGet);
        }
        public async Task<string> NuevoCorreoAsync(CorreosRe nuevoCorreoRe, int idEjecutivo, int idOrigen = 1805, bool ValidarDuplicidad = true)
        {
            string CorreoElectronico = nuevoCorreoRe.CorreoElectronico?.Trim();

            if (string.IsNullOrEmpty(CorreoElectronico))
                return "La dirección de correo electrónica es inválida.";

            try
            {
                MailAddress m = new MailAddress(CorreoElectronico);
            }
            catch (FormatException)
            {
                return "La dirección de correo electrónica es inválida.";
            }

            // Verificar duplicados en la lista CorreosList
            if (_correosList.Find(c => c.CorreoElectronico == CorreoElectronico) != null)
                if (ValidarDuplicidad)
                    return "Dicha dirección de correo ya está dada de alta.";
                else
                    return "";

            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    using (SqlCommand command = new SqlCommand("[2.5.0.GuardaCorreo]", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.AddWithValue("@idCartera", nuevoCorreoRe.IdCartera);
                        command.Parameters.AddWithValue("@idCuenta", nuevoCorreoRe.IdCuenta);
                        command.Parameters.AddWithValue("@CorreoElectronico", CorreoElectronico);
                        command.Parameters.AddWithValue("@idEjecutivo", idEjecutivo);

                        await command.ExecuteNonQueryAsync();
                    }
                }

                // Agregar el objeto Correos a la lista CorreosList
                Correos nuevoCorreo = new Correos(
                    CorreoElectronico,
                    nuevoCorreoRe.IdCartera,
                    nuevoCorreoRe.IdCuenta,
                    idEjecutivo,
                    idOrigen,
                    nuevoCorreoRe.IdInformacion
                );

                _correosList.Add(nuevoCorreo);

                return "";
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error en NuevoCorreoAsync: {ex.Message}");
                return $"Falló al dar de alta nuevo correo: {ex.Message}";
            }
        }
        public async Task<string> IdentificaCorreoAsync(string CorreoElectronico, int idInformacion, int idCartera, string idCuenta, int idEjecutivoInformacion)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    // Verificar si el correo existe en la base de datos
                    string checkQuery = "SELECT COUNT(*) FROM CorreosCuentas WHERE idCartera = @idCartera AND idCuenta = @idCuenta AND CorreoElectronico = @CorreoElectronico";
                    using (SqlCommand checkCommand = new SqlCommand(checkQuery, connection))
                    {
                        checkCommand.Parameters.AddWithValue("@idCartera", idCartera);
                        checkCommand.Parameters.AddWithValue("@idCuenta", idCuenta);
                        checkCommand.Parameters.AddWithValue("@CorreoElectronico", CorreoElectronico);

                        int count = (int)await checkCommand.ExecuteScalarAsync();
                        if (count == 0)
                        {
                            return "La dirección de correo no está asignada a la cuenta.";
                        }
                    }

                    // Verificar si idInformación es válido usando _catalogos.IdsInformacionValidos
                    if (!_catalogos.IdsInformacionValidos.Contains(idInformacion.ToString()))
                    {
                        return "Ingrese un id de Información válido.";
                    }

                    // Actualizar la información del correo
                    string updateQuery = "UPDATE CorreosCuentas SET idInformacion = @idInformacion, idEjecutivoInformacion = @idEjecutivoInformacion, FechaHora_Informacion = GETDATE() WHERE idCartera = @idCartera AND idCuenta = @idCuenta AND CorreoElectronico = @CorreoElectronico";
                    using (SqlCommand updateCommand = new SqlCommand(updateQuery, connection))
                    {
                        updateCommand.Parameters.AddWithValue("@idCartera", idCartera);
                        updateCommand.Parameters.AddWithValue("@idCuenta", idCuenta);
                        updateCommand.Parameters.AddWithValue("@CorreoElectronico", CorreoElectronico);
                        updateCommand.Parameters.AddWithValue("@idInformacion", idInformacion);
                        updateCommand.Parameters.AddWithValue("@idEjecutivoInformacion", idEjecutivoInformacion);

                        await updateCommand.ExecuteNonQueryAsync();
                    }

                    return ""; // Éxito
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error en IdentificaCorreoAsync: {ex.Message}");
                return $"Fallo en base de datos al identificar correo electrónico: {ex.Message}";
            }
        }
        public string EnviaCorreo(string CorreoElectrónico, string Asunto, string Mensaje)
        {
            try
            {
                CorreoElectrónico = CorreoElectrónico.Trim();

                if (_correos != null && _correos.Rows.Find(CorreoElectrónico) == null)
                    return "Dicha dirección de correo no está asignada a la cuenta.";

                if (Asunto.Trim().Length < 5)
                    return "El asunto del correo es ambiguo o vacío.";

                if (Mensaje.Trim().Length < 10)
                    return "El mensaje del correo debe contener mayor información.";

                // Obtener los datos necesarios de IEjecutivoRepository
                int idCartera = _ejecutivoRepository.ObtenerIdCartera();
                string idCuenta = _ejecutivoRepository.ObtenerIdCuenta();
                int idEjecutivo = _ejecutivoRepository.ObtenerIdEjecutivo();
                string NombreEjecutivo = _ejecutivoRepository.ObtenerNombreEjecutivo();

                string query = "EXEC [2.5.1.EnviaCorreo] " +
                               "@idCartera , " +
                               "@idCuenta, " +
                               "@CorreoElectrónico," +
                               "@Asunto," +
                               "@Mensaje," +
                               "@idEjecutivo ";

                var parameters = new
                {
                    idCartera = idCartera,
                    idCuenta = idCuenta,
                    CorreoElectrónico = CorreoElectrónico,
                    Asunto = Asunto,
                    Mensaje = Mensaje,
                    idEjecutivo = idEjecutivo
                };

                var tblResultado = EjecutarConsulta(query, parameters);

                if (tblResultado == null)
                    return "Falló al crear validación de envió de correo el electrónico.";

                if (_enviados == null)
                    return "";

                DataRow drEnvío = _enviados.NewRow();
                //Funciones.AddParametersToRow(command.Parameters, drEnvío); // Asegúrate de que Funciones esté disponible
                drEnvío["idEtapa"] = 2301;
                drEnvío["Fecha_Insert"] = tblResultado.Fecha_Insert;
                drEnvío["Segundo_Insert"] = tblResultado.Segundo_Insert;
                drEnvío["Ejecutivo"] = NombreEjecutivo;
                _enviados.Rows.Add(drEnvío);

                return "";
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error en EnviaCorreo: {ex.Message}");
                return $"Fallo al enviar correo electrónico: {ex.Message}";
            }
        }

        private dynamic EjecutarConsulta(string query, object parameters = null)
        {
            try
            {
                using (IDbConnection connection = new SqlConnection(_connectionString))
                {
                    return connection.QueryFirstOrDefault(query, parameters);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al ejecutar consulta: {ex.Message}");
                return null;
            }
        }
        #endregion
    }

}
#endregion
