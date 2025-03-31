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
using NoriAPI.Models.Acciones;
using static NoriAPI.Services.EjecutivoService;

using NoriAPI.Models.Acciones;
using NoriAPI.Models.Flujo;
using static NoriAPI.Models.Ejecutivo.NegociacionClass;
using NoriAPI.Models.CargaGestionamiento;
using NoriAPI.Models.Ofrecimiento;
using Microsoft.IdentityModel.Tokens;
using System.Text.RegularExpressions;
using System.Text;


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
        Task<DataTable> GetVistaAccionamientos(int idCartera, string idCuenta);

        #endregion

        Task<NegociacionesResponse> GetNegociaciones(int idEjecutivo, bool? mesActual);
        Task<Recuperacion> GetRecuperacion(int idEjecutivo, int actual);
        Task<List<PreguntasRespuestasInfo>> ValidatePreguntas_Respuestas();

        #region Calculadora
        Task<ResultadoCalculadora> ValidateInfoCalculadora(int Cartera, string NoCuenta);
        Task<ResultadoCalculadora> ValidateInfoCalculadora1(int Cartera, string NoCuenta, int idHerr);
        Task<ResultadoCalculadora2> ValidateInfoCalculadora2(int idherramienta, string nocuenta, int IdCartera, double MontoRequerido, int Descuento, int iMeses, string dtpFecha, int periodos, int modificar, double montoMod, string fechaPagoMod, int agregarPagos, int filaMod);
        Task<dynamic> GuardarOfrecimiento(SaveOfrecimientoRequest ofrecimientoInfo);
        Task<string> GuardaEliminaPlazos(EliminaGuardaPlazos PlazosInfo);
        Task<dynamic> GuardaNegoaciacionPlazos_(GuardaNegociacionPlazos negociacionInfo);

        #endregion
        Task ObtenerBusquedaEJE(DataRow drDatos, DataSet dsTablas);

        Task<bool> GuardarBusquedaAsync(BusquedaNueva busqueda);
        Task<DataTable> GetSeguimientosEjecutivoAsync(int idEjecutivo);

        Task<DataTable> GetCargosEnLineaAsync(int idCartera, string idCuenta);
        Task ObtenerCargosEnLinea(DataRow drDatos, DataSet dsTablas);
        Task<string> SaveCargoEnlinea(CargoEnLineaRe newCargoEn);
        Task<string> SaveEstadoDeCuenta(EstadoDeCuentaRe newEstadoEn);
        Task ObtenerMultideudores(DataRow drDatos, DataSet dsTablas, Hashtable htProducto, string sortMultideudores, string connectionString);
        Task ObtenerPagos(DataRow drDatos, DataSet dsTablas);
        Task ObtenerPago(DataRow drDatos, DataSet dsTablas);
        Task<DataTable> ObtieneGestionTeAsync(int idCartera, string idCuenta, int Top);
        Task ObtenerDomicilios(DataRow drDatos, DataSet dsTablas);
        DataTable ObtieneGestionesDelDia(int idEjecutivo);

        #region Scripts
        DataTable BuscaScripts(int idProducto);
        Task<DataTable> BuscaScriptsTranslated(int idEjecutivo, int idProducto, int idCartera, string cuenta);

        #endregion
        DataTable CargaRelaciones();
        Task ObtenerCorreosEJE(DataRow drDatos, DataSet dsTablas);
        Task ObtenerEnviadosEJE(DataRow drDatos, DataSet dsTablas);
        Task ObtenerCargaEJE(DataRow drDatos, DataSet dsTablas);
        Task<string> NuevoCorreoAsync(CorreosRe nuevoCorreoRe, int idEjecutivo, int idOrigen = 1805, bool ValidarDuplicidad = true);
        Task<string> IdentificaCorreoAsync(string CorreoElectronico, int idInformacion, int idCartera, string idCuenta, int idEjecutivoInformacion);
        Task<string> EnviaCorreoAsync(string CorreoElectronico, string Asunto, string Mensaje, int idCartera, string idCuenta, int idEjecutivo);
        Task<dynamic> RegisterNewCorreo(CorreosEn newCorreos);
        Task<DataTable> ObtieneGestionesAsync(DataRow drInfo);
        Task<string> AñadeAdicionalAsync(Adicional AdicionalCuenta, DataRow drInfo, Ejecutivo ejecutivo, DataTable Adicionales, Catalogos catalogos);
        Task<bool> GuardaGestionTelefonicaAsync(GestionTelefonica gestion);
        Task<GuardaGestionTelefonicaResult> GuardarGestionTelefonica(EndGestionRequest infoEndGestion);
        Task ObtieneRecordatoriosAsync(DataRow drDatos, DataSet dsTablas);




        #region Acciones
        Task<DataTable> GetAccionesNegociacionesAsync(int idCartera, string idCuenta);
        Task<DataTable> GetAccionesPlazosAsync(int idCartera, string idCuenta);
        Task<DataTable> GetValidadorAsync(int idProducto, int idEjecutivo, string Contraseña);

        // Task<DataTable> GetAccionesComentarioAsync(int idCartera, string idCuenta, int idEjecutivo, string Comentario, bool ModificaSituacion);
        Task<string> AccionesComentario(AccionesComentarioRequest insertCommit);
        Task<(string, bool)> ValidateNewQueja(Queja quejaInsert);

        Task<DataTable> GetWlpAsync(string Proceso, string idCuenta);
        Task ObtieneNegociacionesEjecutivosAsync(DataRow drDatos, DataSet dsTablas);
        Task<DataTable> GetAdiccionalesAsync(int idCartera, string idCuenta);
        Task ObtenerEstadodeCuentaCorreos(DataRow drDatos, DataSet dsTablas);



        Task<DataTable> GetValidadoresAsync(int idProducto);

        //Task<DataTable> GetAccionesComentarioAsync(int idCartera, string idCuenta, int idEjecutivo, string Comentario, bool ModificaSituacion);
        Task<DataTable> GetDropDQuejasAsync();
        Task<DataTable> GetDropDOrigenQuejasAsync();
        Task<DataTable> GetViewQuejasAsync(int idCartera, string idCuenta);
        Task<string> CreaSeguimientoAsync(SeguimientoCompletoModel seguimiento, DataRow _drInfo, int idEjecutivo);
        Task ObtenerUsoHorario(DataRow drDatos, DataSet dsTablas);


        #endregion
    }

    public class EjecutivoService : IEjecutivoService
    {
        private readonly IConfiguration _configuration;
        private readonly string _connectionString;
        private readonly ISearchRepository _searchRepository;
        private readonly IBusquedaRepository _busquedaRepository;
        private readonly IEjecutivoRepository _ejecutivoRepository;
        private readonly ISearchService _searchService;
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

        }

        private DataTable CreaTablaEnviados()
        {
            DataTable enviados = new DataTable();

            // Agregar las columnas que corresponden a la tabla CorreosEnviados
            enviados.Columns.Add("idCartera", typeof(int));
            enviados.Columns.Add("idCuenta", typeof(string));
            enviados.Columns.Add("Fecha_Insert", typeof(DateTime));
            enviados.Columns.Add("Segundo_Insert", typeof(TimeSpan));
            enviados.Columns.Add("idEjecutivo_Insert", typeof(int));
            enviados.Columns.Add("CorreoElectrónico", typeof(string));
            enviados.Columns.Add("idEtapa", typeof(short));
            enviados.Columns.Add("Asunto", typeof(string));
            enviados.Columns.Add("Mensaje", typeof(string));
            enviados.Columns.Add("Ejecutivo", typeof(string));

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

            DataColumn nuevaColumna = new("Estado", typeof(string));
            // Agregar la columna después de "idEstado"
            int index = negociacion.Columns.IndexOf("idEstado");
            if (index != -1) // Verificar que la columna existe
            {
                // Insertar la nueva columna después de la columna específica
                negociacion.Columns.Add(nuevaColumna);
                negociacion.Columns["Estado"].SetOrdinal(index + 1);
            }

            ClasesGespaNonStatic gespaAcciones = new();
            gespaAcciones.dtCatalogos = await _ejecutivoRepository.VwCatalogos();
            gespaAcciones.CargaCatalogos();

            // Llenar los valores de las nuevas columnas usando la lógica de "traducción"
            foreach (DataRow row in negociacion.Rows)
            {

                row["Estado"] = BuscarEnValoresHashtable(gespaAcciones._htValoresCatálogo, Convert.ToString(row["idEstado"]));

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

        public async Task<DataTable> GetValidadorAsync(int idProducto, int idEjecutivo, string Contraseña)//GetValidadoresAsync
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

        public async Task<DataTable> GetValidadoresAsync(int idProducto)
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

        //public async Task<DataTable> GetAccionesComentarioAsync(int idCartera, string idCuenta, int idEjecutivo, string Comentario, bool ModificaSituacion)
        //{

        //    DataTable comentario = new DataTable();
        //    string query = "EXEC [2.13.InsertaComentario] @idCartera, @idCuenta, @idEjecutivo, @Comentario, @ModificaSituación "; // Evita inyección SQL

        //    using (var connection = new SqlConnection(_connectionString))
        //    {
        //        await connection.OpenAsync();
        //        using (var command = new SqlCommand(query, connection))
        //        {
        //            // Usar Add con tipo explícito para evitar problemas con tipos de datos
        //            command.Parameters.Add("@idCartera", SqlDbType.Int).Value = idCartera;
        //            command.Parameters.Add("@idCuenta", SqlDbType.VarChar).Value = idCuenta;
        //            command.Parameters.Add("@idEjecutivo", SqlDbType.Int).Value = idEjecutivo;
        //            command.Parameters.Add("@Comentario", SqlDbType.VarChar).Value = Comentario;
        //            command.Parameters.Add("@ModificaSituación", SqlDbType.Bit).Value = ModificaSituacion;

        //            using (var adapter = new SqlDataAdapter(command))
        //            {
        //                adapter.Fill(comentario);
        //            }
        //        }
        //    }

        //    return comentario;
        //}

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

        public async Task<(string, bool)> ValidateNewQueja(Queja quejaInsert)
        {
            bool insertado = await _ejecutivoRepository.InsertQueja(quejaInsert);
            if (insertado)
            {
                return ("Queja insertada con éxito.", true);
            }
            else
            {
                return ("Error al insertar la queja.", false);
            }
        }

        public async Task<DataTable> GetDropDQuejasAsync()
        {
            DataTable quejasDrop = new DataTable();
            string query = "SELECT C.Catálogo,VC.* FROM dbCollection..Catálogos C " +
                                  "INNER JOIN dbCollection..ValoresCatálogo VC " +
                                  "ON C.idCatálogo = VC.idCatálogo " +
                                  "WHERE C.Catálogo = 'Quejas'"; // Evita inyección SQL

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand(query, connection))
                {
                    using (var adapter = new SqlDataAdapter(command))
                    {
                        adapter.Fill(quejasDrop);
                    }
                }
            }

            return quejasDrop;
        }

        public async Task<DataTable> GetDropDOrigenQuejasAsync()
        {
            DataTable origenDropQuejas = new DataTable();
            string query = "SELECT C.Catálogo,VC.* FROM dbCollection..Catálogos C " +
                                  "INNER JOIN dbCollection..ValoresCatálogo VC " +
                                  "ON C.idCatálogo = VC.idCatálogo " +
                                  "WHERE C.Catálogo = 'Instituciones'"; // Evita inyección SQL

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand(query, connection))
                {
                    using (var adapter = new SqlDataAdapter(command))
                    {
                        adapter.Fill(origenDropQuejas);
                    }
                }
            }

            return origenDropQuejas;
        }

        public async Task<DataTable> GetViewQuejasAsync(int idCartera, string idCuenta)
        {
            DataTable viewQuejas = new DataTable();
            string query = "SELECT * FROM fn_Quejas(@idCartera, @idCuenta)"; // Evita inyección SQL

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
                        adapter.Fill(viewQuejas);
                    }
                }
            }

            ClasesGespaNonStatic gespaQuejas = new();
            gespaQuejas.dtCatalogos = await _ejecutivoRepository.VwCatalogos();
            gespaQuejas.CargaCatalogos();


            // Agregar la columna "Queja" justo después de "idQueja"
            if (viewQuejas.Columns.Contains("idQueja"))
            {
                // Crear e insertar la columna "Banco" después de "idBanco"
                DataColumn quejasColumna = new DataColumn("Queja", typeof(string));
                viewQuejas.Columns.Add(quejasColumna);
                viewQuejas.Columns["Queja"].SetOrdinal(viewQuejas.Columns.IndexOf("idQueja") + 1);
            }

            // Agregar la columna "Queja" justo después de "idQueja"
            if (viewQuejas.Columns.Contains("idInstitución"))
            {
                // Crear e insertar la columna "Banco" después de "idBanco"
                DataColumn institucionColumna = new DataColumn("Institución", typeof(string));
                viewQuejas.Columns.Add(institucionColumna);
                viewQuejas.Columns["Institución"].SetOrdinal(viewQuejas.Columns.IndexOf("idInstitución") + 1);
            }

            // Llenar los valores de la nueva columna usando la lógica de "traducción"
            foreach (DataRow row in viewQuejas.Rows)
            {
                if (viewQuejas.Columns.Contains("idQueja") && row["idQueja"] != DBNull.Value)
                {
                    row["Queja"] = BuscarEnValoresHashtable(gespaQuejas._htValoresCatálogo, Convert.ToString(row["idQueja"]));
                }
            }

            foreach (DataRow row in viewQuejas.Rows)
            {
                if (viewQuejas.Columns.Contains("idInstitución") && row["idInstitución"] != DBNull.Value)
                {
                    row["Institución"] = BuscarEnValoresHashtable(gespaQuejas._htValoresCatálogo, Convert.ToString(row["idInstitución"]));
                }
            }

            return viewQuejas;
        }

        public async Task<string> AccionesComentario(AccionesComentarioRequest insertComment)
        {
            string insertado = await _ejecutivoRepository.InsertComments(insertComment);

            return ("Comentario insertado con éxito.");
        }


        #endregion

        #region Acciones



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

            //----------------------------------------Saldo y producto----------------------------------------------//

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
            // IDs que quieres filtrar para mostrar en el combox
            string idsString = sHerramientas.Substring(sHerramientas.IndexOf("(") + 1, sHerramientas.IndexOf(")") - sHerramientas.IndexOf("(") - 1);
            string[] idsArray = idsString.Split(',');
            List<int> idsFiltrar = new List<int>();

            foreach (string id in idsArray)
            {
                if (int.TryParse(id.Trim(), out int idInt))
                {
                    idsFiltrar.Add(idInt);
                }
            }

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
            //----------------------------------------Producto Y ---------------------------------//
            produc = await _ejecutivoRepository.ObtieneProducto(NoCuenta);

            //------------------------------------------------------------------------------------//

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

            var resultadoCalculadora = new ResultadoCalculadora
            {
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

        public async Task<ResultadoCalculadora2> ValidateInfoCalculadora2(int idherramienta, string nocuenta, int idcartera, double MontoRequerido, int Descuento, int iMeses_, string dtpFecha, int periodos, int modificar, double montoMod, string fechaPagoMod, int agregarPagos, int filaMod)
        {
            DataTable dtDescuentos = new DataTable();
            DataTable HerramientasC = new DataTable();
            DataTable dtHerramientas = new DataTable();
            DataTable dtnegociaciones = new DataTable();
            DataTable produc = new DataTable();
            DataTable tblCuenta = new DataTable();
            DataTable tblsaldo = new DataTable();
            DataTable dtPagosOriginal = new DataTable();
            DataTable dtPagos = new DataTable();
            DataTable dtHerrFiltradas = new DataTable();
            DataTable tblPlazos = new DataTable();
            bool _bLendingPrimes;
            int iAñadidos = 0, iPeriodos = periodos;
            string mensaje = "";

            //---------------------------------------Negociaciones--------------------------------//
            //con el Idestado se valida si la promesa esta vigente
            dtnegociaciones = await _ejecutivoRepository.ObtieneNegociaciones(idcartera, nocuenta);

            dtnegociaciones.PrimaryKey = new DataColumn[] {
                dtnegociaciones.Columns["Fecha_Insert"],
                dtnegociaciones.Columns["Segundo_Insert"],
                dtnegociaciones.Columns["idHerramienta"]
            };
            dtnegociaciones.DefaultView.Sort = "FechaHora DESC";

            //----------------------------------------Saldo y producto----------------------------------------------//

            tblsaldo = await _ejecutivoRepository.InfoCuenta(idcartera, nocuenta);
            double saldo = Convert.ToDouble(tblsaldo.Rows[0]["Saldo"].ToString());

            tblCuenta = await _ejecutivoRepository.ObtieneProducto(nocuenta);

            //------------------------------------Herramientas------------------------------------------//

            dtHerramientas = await _ejecutivoRepository.ObtieneHerramientas(nocuenta);
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

            //----------------------------------------Producto Y ---------------------------------//
            produc = await _ejecutivoRepository.ObtieneProducto(nocuenta);

            string Producto = produc.Rows[0]["Product"].ToString();
            if (Producto == "Placement" || Producto == "Product" || Producto == "Lending" || Producto == "MidPrimes")
                _bLendingPrimes = true;
            else
                _bLendingPrimes = false;

            //_bLendingPrimes = produc.AsEnumerable()
            //        .Any(row => row.ItemArray.Any(field => field.ToString().Contains("Placement")
            //        && field.ToString().Contains("Product")
            //        && field.ToString().Contains("Lending")
            //        && field.ToString().Contains("MidPrimes")));

            //----------------------------------------Pagos----------------------------------------------//

            dtPagosOriginal = await _ejecutivoRepository.ObtienePagos(idcartera, nocuenta);
            dtPagos = new DataTable(); // Crea un nuevo DataTable
            dtPagos.Columns.Add("idCartera", typeof(int));
            dtPagos.Columns.Add("idCuenta", typeof(string));
            dtPagos.Columns.Add("FechaPago", typeof(DateTime));
            dtPagos.Columns.Add("MontoPago", typeof(double)); // Columna MontoPago como double
            dtPagos.Columns.Add("Referencia", typeof(string));
            dtPagos.Columns.Add("Sucursal", typeof(string));
            dtPagos.Columns.Add("Reportado", typeof(string));
            dtPagos.Columns.Add("idEtapa", typeof(string));
            dtPagos.Columns.Add("AcornPostDate", typeof(string));
            dtPagos.Columns.Add("Guardado", typeof(string));
            foreach (DataRow fila in dtPagosOriginal.Rows)
            {
                DataRow nuevaFila = dtPagos.NewRow();

                // Manejo de valores nulos
                nuevaFila["idCartera"] = fila["idCartera"] == DBNull.Value ? null : fila["idCartera"];
                nuevaFila["idCuenta"] = fila["idCuenta"] == DBNull.Value ? null : fila["idCuenta"];
                nuevaFila["FechaPago"] = fila["FechaPago"] == DBNull.Value ? DateTime.MinValue : fila["FechaPago"];
                // Convierte el valor de MontoPago a double
                if (fila["MontoPago"] != DBNull.Value && double.TryParse(fila["MontoPago"].ToString(), out double montoPago))
                {
                    nuevaFila["MontoPago"] = montoPago;
                }
                else
                {
                    nuevaFila["MontoPago"] = 0.0; // O algún valor predeterminado si la conversión falla o es nulo
                }
                nuevaFila["Referencia"] = fila["Referencia"] == DBNull.Value ? null : fila["Referencia"];
                nuevaFila["Sucursal"] = fila["Sucursal"] == DBNull.Value ? null : fila["Sucursal"];
                nuevaFila["Reportado"] = fila["Reportado"] == DBNull.Value ? "" : fila["Reportado"];
                nuevaFila["idEtapa"] = fila["idEtapa"] == DBNull.Value ? null : fila["idEtapa"];
                nuevaFila["AcornPostDate"] = fila["AcornPostDate"] == DBNull.Value ? "" : fila["AcornPostDate"];
                nuevaFila["Guardado"] = fila["Guardado"] == DBNull.Value ? DateTime.MinValue : fila["Guardado"];
                dtPagos.Rows.Add(nuevaFila);
            }
            dtPagos.DefaultView.Sort = "FechaPago DESC";

            DateTime dtFechaPago = DateTime.Now;//este siempre va a ser un dia despues de la fecha actual y la manda el omi
            dtFechaPago = dtFechaPago.AddDays(1);

            (double dMontoRequerido, double dMontoNegociado, tblPlazos, double dPago, double tasamensual) = CalculaPagos(dtFechaPago, iMeses_, _bLendingPrimes, MontoRequerido, idherramienta, saldo, iAñadidos, iPeriodos, drHerramienta, tblCuenta, dtPagos, dtHerramientas, Descuento, dtpFecha);

            if (modificar == 1)
            {
                //validar que los meses no vengan en 0

                DateTime dtFechaPago_ = Convert.ToDateTime(fechaPagoMod);
                DateTime dtFechaPagoAnt;
                double dPago_ = montoMod, dMontoNegociado_, dPagoAnt;
                //if (filaMod > 0)
                //    filaMod = filaMod - 1;// Se resta 1 ya que el datarow inicia en 0
                //else
                //    filaMod = 0;

                dPagoAnt = Math.Round(Convert.ToDouble(tblPlazos.Rows[filaMod]["Pago"].ToString()), 2);
                dtFechaPagoAnt = Convert.ToDateTime(tblPlazos.Rows[filaMod]["Fecha"].ToString());

                foreach (DataRow row in tblPlazos.Rows)
                {
                    if (Convert.ToDateTime(row["Fecha"]) == Convert.ToDateTime(tblPlazos.Rows[tblPlazos.Rows.Count - 1]["Fecha"]) && tblPlazos.Rows.IndexOf(row) != tblPlazos.Rows.Count - 1)
                    {
                        mensaje = "Ya existe un pago con dicha fecha.";
                    }
                }
                if (dPago <= 0)
                {
                    mensaje = "No puede haber pagos de $0.00";
                }
                /*Añadir Pagos*/
                if (agregarPagos == 1)
                {
                    filaMod = 0;
                    (tblPlazos, double montoMod_, mensaje) = AgregaPagos(dtFechaPago, dPago, tblPlazos, _bLendingPrimes, montoMod, fechaPagoMod, dMontoRequerido, filaMod, dPagoAnt, dtFechaPago_);
                    dPago = montoMod_;
                }
                else
                {

                    dMontoNegociado = Convert.ToDouble(tblPlazos.Rows[filaMod]["Saldo"]);
                    if (_bLendingPrimes)
                    {
                        if (montoMod < dPagoAnt)
                        {
                            mensaje = "El monto no puede ser menor al pago calculado.";
                        }
                        if (dtFechaPagoAnt != dtFechaPago_)//&& dgvPlazos.CurrentCell.RowIndex == 0 Aqui solo cambia la fecha de los pagos
                        {
                            DateTime nuevaFecha = Convert.ToDateTime(fechaPagoMod);
                            foreach (DataRow fila in tblPlazos.Rows)
                            {
                                fila["Fecha"] = nuevaFecha; // Actualizar la columna 'Fecha' con la nueva fecha
                            }

                        }
                        if (montoMod != dPagoAnt)
                        {
                            //dMontoNegociado = Convert.ToDouble(tblPlazos.Rows[filaMod]["Saldo"]);
                            (tblPlazos, double nuevoPago) = ModificaPagos(filaMod, dMontoNegociado, dtFechaPago_, tblPlazos, montoMod, _bLendingPrimes);
                            dPago = nuevoPago;
                        }
                    }
                    else
                    {
                        if (idherramienta == 635 && filaMod != 0 && dPago < dMontoNegociado * .04)
                        {
                            (tblPlazos, double nuevoPago) = ModificaPagos(filaMod, dMontoNegociado, dtFechaPago_, tblPlazos, montoMod, _bLendingPrimes);
                            dPago = nuevoPago;
                        }
                        else
                        {
                            (tblPlazos, double nuevoPago) = ModificaPagos(filaMod, dMontoNegociado, dtFechaPago_, tblPlazos, montoMod, _bLendingPrimes);
                            dPago = nuevoPago;
                        }

                    }

                }

            }
            //Muestra cálculos
            double MontoRequerido_ = Convert.ToDouble(dMontoRequerido.ToString());
            double MontoNegociado_ = Convert.ToDouble(dMontoNegociado.ToString());
            double Pago = Convert.ToDouble(tblPlazos.Rows[0]["Pago"].ToString());
            string Plazos = tblPlazos.Rows.Count.ToString();
            double Remanente = Math.Round(Convert.ToDouble(Math.Max(saldo - MontoNegociado_, 0).ToString()));
            double Monto = Math.Round(Convert.ToDouble(dPago));
            List<CalculosInfo> listaCalculos = _ejecutivoRepository.ConvertirDataTableAListaC(tblPlazos);

            /////Regresa valores///////////////////////
            var ResultadoCalculadora2 = new ResultadoCalculadora2
            {
                Calculos = listaCalculos,
                MontoRequerido = MontoRequerido_,
                MontoNegociado = MontoNegociado_,
                Pago = Pago,
                Plazos = Plazos,
                Descuento = Descuento,
                Monto = Monto,
                TasaMensual = tasamensual,
                mensaje = mensaje
            };
            return ResultadoCalculadora2;
        }
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
        private double TasaAnual(int iPeriodos, int iMeses, int idherramienta, DataTable Herramienta)
        {

            double dTasa = 0;

            if (idherramienta != 1010)
            {
                if (!Herramienta.Columns.Contains("Tasa") ||
                !double.TryParse(Herramienta.Rows[0]["Tasa"].ToString(), out dTasa) || dTasa == 0)
                    dTasa = 0.0584;//dTasa = 0.06289956713257; se cambia por indicaciones rios entra en vigor 20241028
            }

            //if (!_Cuenta.HerramientasAmex.Columns.Contains("Tasa") ||
            //    !double.TryParse(_Cuenta.HerramientasAmex.Rows[0]["Tasa"].ToString(), out dTasa) || dTasa == 0 )
            //    dTasa = 0.06289956713257;

            //tasa anterior dTasa = 0.061866667;
            // 6.29000004666667 nueva tasa 0.0629000004666667
            // lblTasaMensual.Text = "Tasa Mensual: " + (Math.Truncate((100 * dTasa) * 1000) / 1000).ToString() + "%";
            return ((1 / dTasa) * (1 - Math.Pow(1 / (1 + dTasa), iMeses)) * iPeriodos);
        }
        private double TasaMensual(int iPeriodos, int iMeses, int idherramienta, DataTable Herramienta)
        {

            double dTasa = 0;

            if (idherramienta != 1010)
            {
                if (!Herramienta.Columns.Contains("Tasa") ||
                !double.TryParse(Herramienta.Rows[0]["Tasa"].ToString(), out dTasa) || dTasa == 0)
                    dTasa = 0.0584;//dTasa = 0.06289956713257; se cambia por indicaciones rios entra en vigor 20241028
            }

            //if (!_Cuenta.HerramientasAmex.Columns.Contains("Tasa") ||
            //    !double.TryParse(_Cuenta.HerramientasAmex.Rows[0]["Tasa"].ToString(), out dTasa) || dTasa == 0 )
            //    dTasa = 0.06289956713257;

            //tasa anterior dTasa = 0.061866667;
            // 6.29000004666667 nueva tasa 0.0629000004666667
            // lblTasaMensual.Text = "Tasa Mensual: " + (Math.Truncate((100 * dTasa) * 1000) / 1000).ToString() + "%";
            return (Math.Truncate((100 * dTasa) * 1000) / 1000);
        }
        public (double dMontoRequerido, double dMontoNegociado, DataTable tblPlazos, double dPago, double tasamensual) CalculaPagos(DateTime dtFechaPago, int iMeses_, bool _bLendingPrimes, double MontoRequerido, int idherramienta, double saldo, int iAñadidos, int iPeriodos, DataRow drHerramienta, DataTable tblCuenta, DataTable dtPagos, DataTable dtHerramientas, int Descuento, string dtpFecha)
        {
            double dMontoNegociado = 0, dPago, dCentavos, dMontoAjuste = 0, dSumaPagos = 0, dPago635 = 0, dTasa = 0, tasamensual = 0, dMontoRequerido = 0, dMensualidad;
            int iMeses = iMeses_;//valor que me debe mandar el omi
            DataTable tblPlazos = new DataTable();

            DateTime dtFechaCorte = new DateTime(),
                    dtActualización = new DateTime();

            //if (_OfreNegAmex.idHerramienta == 143)
            //    double.TryParse(txtMontoAjuste.Text.Replace("$", ""), out dMontoAjuste);

            if (dMontoAjuste > 0 && !_bLendingPrimes)
                dMontoNegociado = MontoRequerido;
            else
                dMontoNegociado = MontoRequerido;

            if (idherramienta == 1010)
                dMontoNegociado = MontoRequerido = saldo;

            //if (frmCuenta.herramientaAmex == "25")
            //{
            //    PrimerPagoAmex = Math.Round(_OfreNegAmex.Saldo * (0.25), 2);
            //}
            //if (frmCuenta.herramientaAmex == "14")
            //{
            //    PrimerPagoAmex = Math.Round(_OfreNegAmex.Saldo * (0.14), 2);
            //}
            //if (frmCuenta.herramientaAmex == "18")
            //{
            //    PrimerPagoAmex = Math.Round(_OfreNegAmex.Saldo * (0.18), 2);
            //}
            //if (frmCuenta.herramientaAmex == "13")
            //{
            //    PrimerPagoAmex = Math.Round(_OfreNegAmex.Saldo * (0.13), 2);
            //}

            iAñadidos = 0;

            //Cálculo con intereses.
            if (_bLendingPrimes)
            {
                if (idherramienta == 1010)
                {
                    dPago = dMontoNegociado / (iPeriodos * iMeses);
                    dCentavos = Math.Round(((float)(dPago - Math.Truncate(dPago)) * (iMeses * iPeriodos)) * 100) / 100;
                    dPago = Math.Truncate(dPago);

                    //EstablecePagos(dMontoNegociado, dPago, dCentavos, iMeses, dtFechaCorte, dtFechaPago, dPago635); este metodo me falta
                }
                else
                {
                    //Calcula fecha corte.
                    DateTime.TryParse(_ejecutivoRepository.CampoCalculado(drHerramienta["CampoFechaCorte"].ToString()).ToString().Replace("00:00:00:000", ""), out dtFechaCorte);
                    DateTime.TryParse(tblCuenta.Rows[0]["CurrentBalanceUpdate"].ToString(), out dtActualización);

                    // Obtener la fecha actual
                    DateTime Hoy = DateTime.Today;
                    dtFechaCorte = new DateTime(Hoy.Year, Hoy.Month, dtFechaCorte.Day);

                    if (dtFechaCorte >= Hoy)
                        dtFechaCorte = dtFechaCorte.AddMonths(-1);

                    //Suma los pagos al monto requerido.
                    if (dtPagos != null && idherramienta == 136)
                        double.TryParse(dtPagos.Compute("SUM (MontoPago)", "Reportado = '' AND FechaPago > '" + dtFechaCorte.ToShortDateString() + "'").ToString(), out dSumaPagos);

                    //Actualiza fecha corte 3 días después o antes si hubo actualización de saldo en sistema.
                    if (Hoy > dtFechaCorte.AddDays(3) || DateTime.Today >= dtFechaCorte && dtActualización <= dtFechaCorte.AddDays(3) && dtFechaCorte <= dtActualización)
                        dtFechaCorte = dtFechaCorte.AddMonths(1);

                    if (idherramienta == 136 || idherramienta == 144)
                        iMeses += 1;

                    //Interés con pagos en el ciclo.
                    if (dSumaPagos > 0)
                    {
                        MontoRequerido = saldo + dSumaPagos;
                        dPago = (MontoRequerido / TasaAnual(1, 1, idherramienta, dtHerramientas));
                        MontoRequerido = (dPago - dSumaPagos) * (1 - Descuento / 100);
                        dMontoNegociado = MontoRequerido;
                    }

                    //Interés de fecha corte cercano
                    if ((idherramienta != 138 && idherramienta != 143 &&
                        !(idherramienta == 140 && iMeses == 1)) &&
                        ((dtFechaPago >= dtFechaCorte.AddDays(-Convert.ToInt16(drHerramienta["Margen"])))
                        || dtFechaPago > dtFechaCorte))
                    {
                        dPago = (dMontoNegociado / TasaAnual(1, 1, idherramienta, dtHerramientas));
                        dPago = (dPago / TasaAnual(iPeriodos, iMeses, idherramienta, dtHerramientas));
                    }
                    else
                        dPago = (dMontoNegociado / TasaAnual(iPeriodos, iMeses, idherramienta, dtHerramientas));

                    dTasa = TasaAnual(iPeriodos, iMeses, idherramienta, dtHerramientas);

                    tasamensual = TasaMensual(iPeriodos, iMeses, idherramienta, dtHerramientas);

                    dPago = Math.Round(dPago, 2);

                    //Cálculo de Monto Requerido
                    dMontoNegociado = dPago * (iPeriodos * (iMeses));
                    dMontoNegociado = Math.Round(dMontoNegociado, 2);

                    dMontoRequerido = dMontoNegociado;

                    if (idherramienta == 143 && dMontoAjuste > 0 && _bLendingPrimes)
                    {
                        dPago = Math.Round(dMontoNegociado - dMontoAjuste / (iPeriodos * iMeses), 2);
                        dMontoNegociado = dPago * (iPeriodos * (iMeses));
                        dMontoRequerido = dMontoNegociado;
                    }

                    if (idherramienta == 136 || idherramienta == 144)
                    {
                        iMeses -= 1;
                        dPago = Math.Round((dMontoNegociado / (iPeriodos * iMeses)), 2);
                    }

                    dMensualidad = dPago;

                    tblPlazos = EstablecePagos(dMontoNegociado, dPago, 0, iMeses, dtFechaCorte, dtFechaPago, dPago635, iPeriodos, idherramienta, dtpFecha);

                    ////////////////////////////////////////////////////////////////////////////////////////////////////////////

                }
            }
            //Cálculo sin intereses
            else
            {
                if (idherramienta == 635)
                {
                    dPago635 = dMontoNegociado * .04;
                    //dPago635 = Math.Round(dPago635);
                    dPago = (dMontoNegociado - dPago635) / (iPeriodos * (iMeses - 1));
                    dCentavos = Math.Round(((float)(dPago - Math.Truncate(dPago)) * ((iMeses - 1) * iPeriodos)) * 100) / 100;
                    dPago = Math.Truncate(dPago);
                    tblPlazos = EstablecePagos(dMontoNegociado, dPago, dCentavos, iMeses, dtFechaCorte, dtFechaPago, dPago635, iPeriodos, idherramienta, dtpFecha);

                }
                else
                {
                    dPago = dMontoNegociado / (iPeriodos * iMeses);
                    dCentavos = Math.Round(((float)(dPago - Math.Truncate(dPago)) * (iMeses * iPeriodos)) * 100) / 100;
                    dPago = Math.Truncate(dPago);

                    tblPlazos = EstablecePagos(dMontoNegociado, dPago, dCentavos, iMeses, dtFechaCorte, dtFechaPago, dPago635, iPeriodos, idherramienta, dtpFecha);

                }

            }
            return (dMontoRequerido, dMontoNegociado, tblPlazos, dPago, tasamensual);
        }
        private DataTable EstablecePagos(double dMontoNegociado, double dPago, double dCentavos, int iMeses, DateTime dtFechaCorte, DateTime dtFechaPago, double dPago635, int iPeriodos, int idherramienta, string dtpFecha)
        {
            DataTable tblPlazos = new DataTable();
            tblPlazos.Columns.Add("No.");
            tblPlazos.Columns.Add("Fecha", typeof(DateTime));
            tblPlazos.Columns.Add("Saldo", typeof(Decimal));
            tblPlazos.Columns.Add("Pago", typeof(Decimal));
            tblPlazos.Columns.Add("Saldo Final", typeof(Decimal));

            double pagoRequerido, pagoRequerido2 = 0;
            string FechaPagoInicial = "", FechaPagoInicial2;
            double PrimerPagoAmex = 0;

            DateTime Quincena1 = dtFechaPago,
                Quincena2 = dtFechaPago.AddDays(14);

            int iDíaQuin1 = Quincena1.Day,
                iDíaQuin2 = Quincena2.Day,
                iPlazos = (iPeriodos * iMeses);

            tblPlazos.Clear();
            for (int i = 1; i <= iPlazos; i++)
            {
                DataRow rowPagos = tblPlazos.NewRow();

                if (idherramienta == 635 && i == 1)
                {
                    rowPagos["No."] = i;
                    rowPagos["Fecha"] = dtFechaPago;
                    rowPagos["Pago"] = dPago635;
                    rowPagos["Saldo"] = dMontoNegociado;
                }
                else
                {

                    dPago += (i == iPlazos ? dCentavos : 0);

                    rowPagos = tblPlazos.NewRow();
                    rowPagos["No."] = i;
                    rowPagos["Fecha"] = dtFechaPago;
                    rowPagos["Pago"] = dPago;
                    rowPagos["Saldo"] = dMontoNegociado;
                }

                if (i == iPlazos && dMontoNegociado - dPago > 0)
                {
                    dPago = Math.Round(dPago + dMontoNegociado - dPago, 2);
                    rowPagos["Pago"] = dPago;
                }

                if (i == iPlazos && dMontoNegociado - dPago < 0)
                {
                    dPago = dPago - Math.Round(Math.Abs(dMontoNegociado - dPago), 2);
                    rowPagos["Pago"] = dPago;
                }

                if (idherramienta == 635 && i == 1)
                    dMontoNegociado = dMontoNegociado - dPago635;
                else
                    dMontoNegociado = dMontoNegociado - dPago;

                dMontoNegociado = Math.Max(0, Math.Round(dMontoNegociado, 2));

                rowPagos["Saldo Final"] = dMontoNegociado;
                tblPlazos.Rows.Add(rowPagos);
                //Evalúa fecha corte
                DateTime DtpFecha = Convert.ToDateTime(dtpFecha);

                switch (iPeriodos)
                {
                    case 1:
                        dtFechaPago = dtFechaPago.AddMonths(1);
                        dtFechaCorte = dtFechaCorte.AddMonths(1);
                        if (dtFechaPago.Day < DtpFecha.Day && new DateTime(dtFechaPago.Year, dtFechaPago.Month, 1).AddMonths(1).AddDays(-1).Day >= DtpFecha.Day)
                            dtFechaPago = new DateTime(dtFechaPago.Year, dtFechaPago.Month, DtpFecha.Day);
                        break;
                    case 2:
                        if (i == 1)
                            dtFechaPago = Quincena2;
                        else if ((i - 1) % 2 == 0)
                        {
                            int iFinMes = new DateTime(Quincena2.AddMonths(1).Year, Quincena2.AddMonths(1).Month, 1).AddMonths(1).AddDays(-1).Day;
                            Quincena2 = dtFechaPago = new DateTime(Math.Max(Quincena2.AddMonths(1).Ticks, new DateTime(Quincena2.AddMonths(1).Year, Quincena2.AddMonths(1).Month, Math.Min(iDíaQuin2, iFinMes)).Ticks));
                        }
                        else
                        {
                            int iFinMes = new DateTime(Quincena1.AddMonths(1).Year, Quincena1.AddMonths(1).Month, 1).AddMonths(1).AddDays(-1).Day;
                            Quincena1 = dtFechaPago = new DateTime(Math.Max(Quincena1.AddMonths(1).Ticks, new DateTime(Quincena1.AddMonths(1).Year, Quincena1.AddMonths(1).Month, Math.Min(iDíaQuin1, iFinMes)).Ticks));
                        }
                        if (dtFechaPago > new DateTime(dtFechaPago.Year, dtFechaPago.Month, dtFechaCorte.Day) && dtFechaPago < new DateTime(dtFechaPago.Year, dtFechaPago.Month, dtFechaCorte.Day).AddMonths(1))
                            iMeses--;

                        break;
                    case 4:
                        dtFechaPago = dtFechaPago.AddDays(7);
                        break;
                }
            }
            if (tblPlazos.Rows.Count >= 2)//herramientaAmex != "0" &&
            {
                //TerminaCálculo("Recuerde que el primer mes debe de pagar el Saldo minimo ( $" + (PrimerPagoAmex + 0.1) + ")");
                pagoRequerido = Math.Round(Convert.ToDouble(tblPlazos.Rows[0]["Pago"]) + Convert.ToDouble(tblPlazos.Rows[1]["Pago"]), 2);
                FechaPagoInicial = Convert.ToString(tblPlazos.Rows[0]["Fecha"]);
                FechaPagoInicial = FechaPagoInicial.Substring(4, 1);
                FechaPagoInicial2 = Convert.ToString(tblPlazos.Rows[1]["Fecha"]);
                FechaPagoInicial2 = FechaPagoInicial2.Substring(4, 1);
                if (pagoRequerido >= PrimerPagoAmex && FechaPagoInicial == FechaPagoInicial2 || pagoRequerido2 >= PrimerPagoAmex || Math.Round(Convert.ToDouble(tblPlazos.Rows[1]["Pago"]), 2) >= PrimerPagoAmex && FechaPagoInicial == FechaPagoInicial2)
                {
                    return tblPlazos;

                    //TerminaCálculo("El pago es correcto. Presione Terminado para continuar.");
                    //lblMensaje.ForeColor = Colores.Verde;
                }
                else
                {
                    return tblPlazos;
                    //btnTerminar.Visible = true;
                    //btnTerminar.Visible = false;
                }
            }
            else
            {
                return tblPlazos;
                //TerminaCálculo("Presione Terminado para continuar.");
            }
        }
        private (DataTable tblPlazo, double montoMod, string mensaje) AgregaPagos(DateTime dtFechaPago, double dPago, DataTable tblPlazos, bool _bLendingPrimes, double montoMod, string fechaPagoMod, double dMontoRequerido, int filaMod, double dPagoAnt, DateTime dtFechaPago_)
        {
            int iAñadidos = 0;
            string mensaje_ = "";
            double dMensualidad = Convert.ToDouble(tblPlazos.Rows[0]["Pago"].ToString());
            double dMontoNegociado = Convert.ToDouble(tblPlazos.Rows[0]["Saldo"]);
            if (Convert.ToDateTime(fechaPagoMod) >= Convert.ToDateTime(tblPlazos.Rows[0]["Fecha"]))
            {
                mensaje_ = "Todos los pagos deben de ser antes de " + Convert.ToDateTime(tblPlazos.Rows[0]["Fecha"]).ToShortDateString();
            }
            if (_bLendingPrimes)
                if (montoMod > dMensualidad)
                {
                    mensaje_ = "El pago no puede se mayor a " + dMensualidad.ToString();
                }
            for (int i = 0; i < tblPlazos.Rows.Count; i++)
                if (Convert.ToDateTime(tblPlazos.Rows[i]["Fecha"]) == Convert.ToDateTime(fechaPagoMod))
                {
                    mensaje_ = "Ya existe un pago con dicha fecha";
                }

            //Pago añadido.
            DataRow drPrimerPago = tblPlazos.NewRow();
            drPrimerPago["Fecha"] = Convert.ToDateTime(fechaPagoMod);
            drPrimerPago["Pago"] = montoMod;
            drPrimerPago["Saldo"] = dMontoRequerido;
            drPrimerPago["Saldo Final"] = Math.Max(0, dMontoRequerido - montoMod);
            tblPlazos.Rows.Add(drPrimerPago);

            DataView dvPlazos = tblPlazos.DefaultView;
            dvPlazos.Sort = "Fecha asc";
            tblPlazos = dvPlazos.ToTable();
            iAñadidos++;

            //Requerido en plazo agregado.
            tblPlazos.Rows[0]["Saldo"] = dMontoRequerido;
            tblPlazos.Rows[0]["Saldo Final"] = dMontoRequerido - Convert.ToDouble(tblPlazos.Rows[0]["Pago"]);

            if (_bLendingPrimes)
            {
                tblPlazos.Rows[iAñadidos]["Pago"] = Convert.ToDouble(tblPlazos.Rows[iAñadidos]["Pago"]) - montoMod;
                tblPlazos.Rows[iAñadidos]["Saldo"] = Convert.ToDouble(tblPlazos.Rows[iAñadidos - 1]["Saldo Final"]);

            }
            //Inicial
            for (int i = 1; i <= iAñadidos; i++)
            {
                tblPlazos.Rows[i]["Saldo"] = tblPlazos.Rows[i - 1]["Saldo Final"];
                tblPlazos.Rows[i]["Saldo Final"] = Convert.ToDouble(tblPlazos.Rows[i]["Saldo"]) - Convert.ToDouble(tblPlazos.Rows[i]["Pago"]);
            }

            //if (!_bLendingPrimes)
            //    (DataTable tblPlazo, double nuevoPago) = ModificaPagos(filaMod, dMontoNegociado, dtFechaPago_, tblPlazos, montoMod, _bLendingPrimes);
            //Conteo
            for (int i = 0; i < tblPlazos.Rows.Count; i++)
            {
                tblPlazos.Rows[i]["No."] = i + 1;
            }
            dMensualidad = Convert.ToDouble(tblPlazos.Rows[iAñadidos]["Pago"]);

            return (tblPlazos, montoMod, mensaje_);

        }
        private (DataTable tblPlazo, double nuevoPago) ModificaPagos(int iPlazo, double dMontoNegociado, DateTime dtFechaPago, DataTable tblPlazo, double montoMod, bool _bLendingPrimes)
        {
            float dCentavos = 0;
            // modificamos el pago de la fila seleccionada
            int rowIndex = iPlazo; // Reemplaza con el índice de la fila que deseas modificar
            double nuevoPago = montoMod; // Reemplaza con el nuevo valor de pago

            if (rowIndex >= 0 && rowIndex < tblPlazo.Rows.Count)
            {
                tblPlazo.Rows[rowIndex]["Pago"] = nuevoPago; // Actualizar la columna 'Pago'
            }
            for (int i = iPlazo; i <= tblPlazo.Rows.Count - 1; i++)
            {
                nuevoPago = (tblPlazo.Rows.Count - 1 == i ? dCentavos + nuevoPago : nuevoPago);
                tblPlazo.Rows[i]["Pago"] = Math.Round(Math.Max(0, nuevoPago), 2);
                tblPlazo.Rows[i]["Saldo"] = Math.Round(Math.Max(0, dMontoNegociado), 2);
                tblPlazo.Rows[i]["Saldo Final"] = Math.Round(Math.Max(0, dMontoNegociado - nuevoPago), 2);
                dMontoNegociado -= nuevoPago;

                if (i == tblPlazo.Rows.Count - 1 && dMontoNegociado > 0)
                    tblPlazo.Rows[i]["Pago"] = nuevoPago + dMontoNegociado;

                if (i == tblPlazo.Rows.Count - 1 && dMontoNegociado < 0)
                    tblPlazo.Rows[i]["Pago"] = nuevoPago + Math.Round(dMontoNegociado, 2);

                if (iPlazo == i)
                {
                    nuevoPago = (dMontoNegociado / (tblPlazo.Rows.Count - i - 1));
                    if (!_bLendingPrimes)
                    {
                        dCentavos += Convert.ToSingle(Math.Round(((float)(nuevoPago - Math.Truncate(nuevoPago)) * (tblPlazo.Rows.Count - i - 1)) * 100) / 100);
                        nuevoPago = Math.Truncate(nuevoPago);
                    }
                    else
                        nuevoPago = Math.Round(nuevoPago, 2);
                }
            }
            return (tblPlazo, montoMod);
        }


        #endregion

        #region GuardaOfrecimientos
        public async Task<dynamic> GuardarOfrecimiento(SaveOfrecimientoRequest ofrecimientoInfo)
        {
            string verificaOfrecimiento = VerificaOfrecimientoNegociación(ofrecimientoInfo);
            if (!verificaOfrecimiento.IsNullOrEmpty())
            {
                return new { Message = verificaOfrecimiento, Success = false };
            }

            if (ofrecimientoInfo.IdHerramienta == 0)
            {
                return new { Message = "Indique la herramienta que se va a ofrecer.", Success = false };
            }

            var validaPootis = await _ejecutivoRepository.GuardaOfrecimientoStored(ofrecimientoInfo);

            // Si no hay resultados, devolvemos un mensaje de error
            if (validaPootis == null || !validaPootis.Any())
            {
                return new { Message = "No se encontraron validadores para el producto.", Success = false };
            }


            return new { Validadores = validaPootis, Message = verificaOfrecimiento, Success = true };

        }
        public static string VerificaOfrecimientoNegociación(SaveOfrecimientoRequest ofrecimiento)
        {
            // Validación de Monto Negociado vs Monto Requerido
            if (Math.Round(ofrecimiento.MontoNegociado, 2, MidpointRounding.ToEven) < ofrecimiento.MontoRequerido
                && !(new[] { 501, 503, 92, 106, 101, 108, 578, 583, 137 }.Contains(ofrecimiento.IdHerramienta)))
            {
                return "El Monto Negociado debe ser MAYOR que el Monto Requerido.";
            }

            // Validación de saldo según cartera
            if (ofrecimiento.MontoNegociado > ofrecimiento.Saldo + 1 &&
                new[] { 5, 7 }.Contains(ofrecimiento.IdCartera))
            {
                return "El Monto Negociado debe ser menor o igual al Saldo.";
            }

            if (ofrecimiento.MontoNegociado > ofrecimiento.Saldo + 1 &&
                ofrecimiento.IdCartera == 4 &&
                new[] { 126, 127, 133 }.Contains(ofrecimiento.IdProducto))
            {
                return "El Monto Negociado debe ser menor o igual al Saldo.";
            }

            // Validación de plazos
            if (ofrecimiento.Plazos == null || ofrecimiento.Plazos.Length == 0)
                return "Se debe de indicar el primer pago y su fecha.";

            if (ofrecimiento.Plazos.Length == 1 && ofrecimiento.Plazos[0].Monto != ofrecimiento.MontoNegociado)
                return "Al elegir un solo pago, el primer pago debe ser IGUAL al monto megociado.";

            if (DateTime.Today.AddDays(ofrecimiento.Dias1erPago) < ofrecimiento.Plazos[0].Fecha)
                return $"El primer pago debe de ser antes de {ofrecimiento.Dias1erPago} días.";

            // Herramientas con pagos en el mismo mes
            if (new[] { 87, 89, 104, 99, 100, 107 }.Contains(ofrecimiento.IdHerramienta) &&
                ofrecimiento.Plazos[0].Fecha.Month != ofrecimiento.Plazos.Last().Fecha.Month)
            {
                return "Todos los plazos para esta herramienta deben de ser en el mismo mes.";
            }

            // Cálculo del descuento si aplica
            if (ofrecimiento.MontoRequerido + 1 < ofrecimiento.MontoNegociado &&
                ofrecimiento.Descuento > 0 &&
                ofrecimiento.MontoRequerido > 0 &&
                ofrecimiento.IdEjecutivoValidador == 0 &&
                ofrecimiento.IdCartera != 1)
            {
                ofrecimiento.Descuento = (int)Math.Round(
                    (1 - ((1 - (ofrecimiento.Descuento / 100.0)) * ofrecimiento.MontoNegociado / ofrecimiento.MontoRequerido)) * 100, 0
                );
            }

            if (ofrecimiento.Descuento < 0)
                return $"El Monto Negociado es mayor al Saldo. Verifique el cálculo del descuento ({ofrecimiento.Descuento}).";

            // Validación de correo para carta convenio
            if (ofrecimiento.CartaConvenio == 1 && !Funciones.ValidaCorreo(ofrecimiento.Correo?.Trim() ?? ""))
                return "Para el envío de la Carta Convenio es necesario un Correo válido.";

            return "";
        }

        #endregion

        #region GuardaEliminaPlazos
        public async Task<string> GuardaEliminaPlazos(EliminaGuardaPlazos PlazosInfo)
        {
            //--------------------------------Todas las herramientas------------------------------//
            DataTable dtHerramientas = await _ejecutivoRepository.ObtieneHerramientasCompletas();
            dtHerramientas.PrimaryKey = new DataColumn[] { dtHerramientas.Columns["idHerramienta"] };

            //----------------------------------------------------------------------------------------------------//
            int idBuscado = PlazosInfo.IdHerramienta;

            int iMargen = Convert.ToInt32(dtHerramientas.Rows.Find(idBuscado)["Margen"]);
            int iDiasEntrePagos = Convert.ToInt32(dtHerramientas.Rows.Find(idBuscado)["DíasEntrePagos"]);

            int iNúmPago = 0;
            DateTime dtFin = new DateTime(), dtInicio = new DateTime();

            foreach (Pago_ PagoNeg in PlazosInfo.Plazos)
            {

                /*InicioPlazoMargen*/
                if (iNúmPago == 0) //Primer pago inicia cuando se inserta.
                    dtInicio = DateTime.Now;

                // Si la diferencia de días entre plazos es mayor 
                else if ((PlazosInfo.Plazos[iNúmPago].Fecha - PlazosInfo.Plazos[iNúmPago - 1].Fecha).TotalDays > iDiasEntrePagos && PlazosInfo.IdHerramienta.ToString() != "509"
                    && PlazosInfo.IdHerramienta.ToString() != "1010")
                {
                    if ((PlazosInfo.Plazos[iNúmPago].Fecha - PlazosInfo.Plazos[iNúmPago - 1].Fecha).TotalDays > iDiasEntrePagos && PlazosInfo.IdHerramienta.ToString() != "510")
                        return "Existe una diferencia mayor a " + iDiasEntrePagos + " días entre el plazo " + iNúmPago + " y el " + (iNúmPago + 1) + ".";
                }

                // Si plazo anterior + margen alcanza este plazo. -> Misma fecha Pago (no se recorre).
                else if (PlazosInfo.Plazos[iNúmPago].Fecha.AddDays(-iMargen) <= PlazosInfo.Plazos[iNúmPago - 1].Fecha)
                    dtInicio = PlazosInfo.Plazos[iNúmPago].Fecha;
                else
                    dtInicio = PlazosInfo.Plazos[iNúmPago - 1].Fecha.AddDays(iMargen + 1);

                /*FinPlazoMargen*/
                // Si rebasa el siguiente plazo -> Siguiente plazo menos un día.
                if (iNúmPago < PlazosInfo.Plazos.Length - 1 && PlazosInfo.Plazos[iNúmPago].Fecha.AddDays(iMargen) >= PlazosInfo.Plazos[iNúmPago + 1].Fecha)
                    dtFin = PlazosInfo.Plazos[iNúmPago + 1].Fecha.AddDays(-1);
                else // Plazo más margen
                {
                    if (PlazosInfo.IdHerramienta.ToString() == "510" && iNúmPago >= 1)
                    {
                        dtFin = PlazosInfo.Plazos[iNúmPago].Fecha.AddDays(iMargen);
                        dtInicio = PlazosInfo.Plazos[iNúmPago - 1].Fecha.AddDays(iMargen + 1);
                    }
                    else
                    {
                        dtFin = PlazosInfo.Plazos[iNúmPago].Fecha.AddDays(iMargen);
                    }
                }
                if (iNúmPago == 0)
                {
                    var borrarPlazos = _ejecutivoRepository.Elimina_Plazos(PlazosInfo);
                }
                var GuardaPlazos = _ejecutivoRepository.Guarda_Plazos(PlazosInfo, PagoNeg, dtInicio, dtFin, iNúmPago);

                iNúmPago++;

            }

            return "Correcto.";
        }

        public async Task<dynamic> GuardaNegoaciacionPlazos_(GuardaNegociacionPlazos negociacionInfo)
        {
            var guardaNeg = await _ejecutivoRepository.Guarda_Negociacion_Plazos(negociacionInfo);

            return guardaNeg;
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
                ClasesGespaNonStatic gespaPause = new();

                // Obtener IdPeCausa desde los catálogos
                int idPeCausa = gespaPause.GetIdValor(catalogosTable, "Pausas", pausa.PeCausa);


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


        private DrInfo ObtenerDrInfo()
        {
            string connectionString = _configuration.GetConnectionString("Piso2Amex");
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                string query = "SELECT idCartera, idCuenta FROM dbCollection.dbo.Cuentas LIMIT 1";
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return new DrInfo
                            {
                                IdCartera = reader.GetInt32(0),
                                IdCuenta = reader.GetString(1)
                            };
                        }
                        else
                        {
                            return null;
                        }
                    }
                }
            }
        }

        private List<SeguimientoModel> ObtenerSeguimientos()
        {
            string connectionString = _configuration.GetConnectionString("Piso2Amex");
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                string query = "SELECT FechaSeguimiento, IdEjecutivo FROM dbCollection.dbo.Seguimientos";
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        List<SeguimientoModel> seguimientos = new List<SeguimientoModel>();
                        while (reader.Read())
                        {
                            seguimientos.Add(new SeguimientoModel
                            {
                                FechaSeguimiento = reader.GetDateTime(0),
                                IdEjecutivo = reader.GetInt32(1)
                            });
                        }
                        return seguimientos;
                    }
                }
            }
        }

        private UltimaGestionModel ObtenerUltimaGestion(string idCuenta)
        {
            string connectionString = _configuration.GetConnectionString("Piso2Amex");
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                string query = "SELECT FechaUltimaGestion, IdEjecutivoUltimaGestion FROM dbCollection.dbo.Cuentas WHERE IdCuenta = @idCuenta";
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@idCuenta", idCuenta);
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return new UltimaGestionModel
                            {
                                FechaUltimaGestion = reader.GetDateTime(0),
                                IdEjecutivoUltimaGestion = reader.GetInt32(1)
                            };
                        }
                        else
                        {
                            return null;
                        }
                    }
                }
            }
        }

        private List<CatalogoModel> ObtenerCatalogos()
        {
            string connectionString = _configuration.GetConnectionString("Piso2Amex");
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                string query = "SELECT IdCatalogo, Catalogo, NombreId, DescripcionCatalogo, FechaCatalogo FROM dbCollection.dbo.Catalogos";
                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        List<CatalogoModel> catalogos = new List<CatalogoModel>();
                        while (reader.Read())
                        {
                            catalogos.Add(new CatalogoModel
                            {
                                IdCatalogo = reader.GetInt32(0),
                                Catalogo = reader.GetString(1),
                                NombreId = reader.GetString(2),
                                DescripcionCatalogo = reader.GetString(3),
                                FechaCatalogo = reader.GetDateTime(4)
                            });
                        }
                        return catalogos;
                    }
                }
            }
        }
        public async Task<string> CreaSeguimientoAsync(SeguimientoCompletoModel seguimiento, DataRow _drInfo, int idEjecutivo)
        {
            string connectionString = _configuration.GetConnectionString("Piso2Amex");

            try
            {
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    await connection.OpenAsync();
                    using (SqlCommand command = new SqlCommand("[dbo].[2.3.CreaSeguimiento]", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        // Imprime los parámetros para depuración
                        Debug.WriteLine("Entrada a CreaSeguimientoAsync:");
                        Debug.WriteLine($"idCartera: {_drInfo["idCartera"]}");
                        Debug.WriteLine($"idCuenta: {_drInfo["idCuenta"]}");
                        Debug.WriteLine($"idEjecutivo: {idEjecutivo}");
                        Debug.WriteLine($"FechaSeguimiento: {seguimiento.Fecha}");
                        Debug.WriteLine($"SegundoSeguimiento: {seguimiento.Segundo}");
                        Debug.WriteLine($"idAcercamiento: {seguimiento.IdAcercamiento}");
                        Debug.WriteLine($"Recordatorio: {seguimiento.Recordatorio}");
                        Debug.WriteLine($"NúmeroTelefónico: {seguimiento.NumeroTelefonico}");
                        Debug.WriteLine($"DatoContacto: {seguimiento.DatoContacto}");
                        Debug.WriteLine($"idMotivoS: {seguimiento.IdMotivoS}");

                        // Asigna los parámetros al comando
                        command.Parameters.AddWithValue("@idCartera", _drInfo["idCartera"]);
                        command.Parameters.AddWithValue("@idCuenta", _drInfo["idCuenta"]);
                        command.Parameters.AddWithValue("@idEjecutivo", idEjecutivo);
                        command.Parameters.AddWithValue("@FechaSeguimiento", seguimiento.Fecha);
                        command.Parameters.AddWithValue("@SegundoSeguimiento", seguimiento.Segundo);
                        command.Parameters.AddWithValue("@idAcercamiento", seguimiento.IdAcercamiento);
                        command.Parameters.AddWithValue("@Recordatorio", seguimiento.Recordatorio);
                        command.Parameters.AddWithValue("@NúmeroTelefónico", seguimiento.NumeroTelefonico.HasValue ? (object)seguimiento.NumeroTelefonico.Value : DBNull.Value);
                        command.Parameters.AddWithValue("@DatoContacto", string.IsNullOrEmpty(seguimiento.DatoContacto) ? DBNull.Value : (object)seguimiento.DatoContacto);
                        command.Parameters.AddWithValue("@IdMotivoS ", string.IsNullOrEmpty(seguimiento.IdMotivoS) ? DBNull.Value : (object)seguimiento.IdMotivoS);

                        await command.ExecuteNonQueryAsync();

                        return ""; // Indica éxito
                    }
                }
            }
            catch (SqlException ex)
            {
                Debug.WriteLine($"Error SQL: {ex.Message}");
                // Analiza el código de error de SqlException para identificar la causa del problema
                if (ex.Number == 2627) // Error de clave duplicada
                {
                    return "Error: Ya existe un seguimiento con la misma fecha y hora.";
                }
                else if (ex.Number == 547) // Error de restricción de clave externa
                {
                    return "Error: No se encontró el registro relacionado.";
                }
                else
                {
                    return $"Falló al crear el seguimiento en la base de datos: {ex.Message}";
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error inesperado: {ex.Message}");
                return $"Error inesperado al crear el seguimiento: {ex.Message}";
            }
        }

        public static class DateTimeExtensions // Usar una clase estática para métodos de extensión
        {
            public static DateTime CombineDateTimeWithTimeSpan(object oFecha, object oSegundo)
            {
                if (oFecha == null || oSegundo == null)
                    return DateTime.MinValue; // Devuelve DateTime.MinValue en lugar de new DateTime()

                if (oFecha is DateTime fecha && oSegundo is TimeSpan segundo) // Usar pattern matching para validar y convertir
                {
                    try
                    {
                        return fecha.AddTicks(segundo.Ticks);
                    }
                    catch (ArgumentOutOfRangeException ex)
                    {
                        // Log the exception or handle it appropriately
                        Console.WriteLine($"Error adding TimeSpan ticks: {ex.Message}");
                        return DateTime.MinValue; // O maneja el error de otra manera
                    }
                }
                else
                {
                    // Log an error or handle the invalid types
                    Console.WriteLine("Invalid types for CombineDateTimeWithTimeSpan");
                    return DateTime.MinValue;
                }
            }
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

            ClasesGespaNonStatic gespaAccionamientos = new();
            gespaAccionamientos.dtCatalogos = await _ejecutivoRepository.VwCatalogos();
            gespaAccionamientos.CargaCatalogos();

            // Agregar la columna "Acercamiento" justo después de "idAcercamiento"
            if (accionamientoGet.Columns.Contains("idAcercamiento"))
            {
                DataColumn acercamientoColumna = new DataColumn("Acercamiento", typeof(string));
                accionamientoGet.Columns.Add(acercamientoColumna);
                accionamientoGet.Columns["Acercamiento"].SetOrdinal(accionamientoGet.Columns.IndexOf("idAcercamiento") + 1);
            }

            // Llenar los valores de las nuevas columnas sobre la Hashtable ValoresCatálogo.
            foreach (DataRow row in accionamientoGet.Rows)
            {
                if (accionamientoGet.Columns.Contains("idAcercamiento") && row["idAcercamiento"] != DBNull.Value)
                {
                    row["Acercamiento"] = BuscarEnValoresHashtable(gespaAccionamientos._htValoresCatálogo, Convert.ToString(row["idAcercamiento"]));
                }
            }



            dsTablas.Tables.Add(accionamientoGet);
        }

        public async Task<DataTable> GetVistaAccionamientos(int idCartera, string idCuenta)
        {
            DataTable vwAccionamientos = new DataTable();
            string query = "SELECT  VC.Valor Accionamientos,COUNT(VC.Valor) Num " +
                                  " FROM fn_Accionamientos(@idCartera, @idCuenta) FN " +
                                  "INNER JOIN dbCollection..ValoresCatálogo VC " +
                                  "ON FN.idAcercamiento = VC.idValor " +
                                  "GROUP BY VC.Valor" +
                                  " ORDER BY VC.Valor ASC"; // Evita inyección SQL

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
                        adapter.Fill(vwAccionamientos);
                    }
                }
            }

            return vwAccionamientos;

        }
        #endregion

        #region Negociaciones
        public async Task<NegociacionesResponse> GetNegociaciones(int idEjecutivo, bool? mesActual)
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

            // Aplica el filtro si se especificó
            if (mesActual.HasValue)
            {
                negociaciones = negociaciones.Where(n => n.MesActual == (mesActual.Value ? "1" : "0")).ToList();
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
            string query = "SELECT * FROM fn_SeguimientosEjecutivo(@idEjecutivo)";

            try
            {
                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    using (var command = new SqlCommand(query, connection))
                    {
                        command.Parameters.Add("@idEjecutivo", SqlDbType.Int).Value = idEjecutivo;

                        using (var adapter = new SqlDataAdapter(command))
                        {
                            await Task.Run(() => adapter.Fill(recordatorios)); // Usar Task.Run para Fill
                        }
                    }
                }
            }
            catch (SqlException ex)
            {
                // Log the exception or handle it appropriately
                Console.WriteLine($"Error retrieving seguimientos: {ex.Message}");
                return null; // Or throw the exception
            }

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

            ClasesGespaNonStatic gespaBusqueda = new();
            gespaBusqueda.dtCatalogos = await _ejecutivoRepository.VwCatalogos();
            gespaBusqueda.CargaCatalogos();

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

            // Agregar las nuevas columnas justo después de "idDato" y "idFuente"
            if (busquedaGet.Columns.Contains("idDato"))
            {
                // Crear e insertar la columna "Dato" después de "idDato"
                DataColumn datoColumna = new DataColumn("Dato", typeof(string));
                busquedaGet.Columns.Add(datoColumna);
                busquedaGet.Columns["Dato"].SetOrdinal(busquedaGet.Columns.IndexOf("idDato") + 1);
            }

            if (busquedaGet.Columns.Contains("idFuente"))
            {
                // Crear e insertar la columna "Fuente" después de "idFuente"
                DataColumn fuenteColumna = new DataColumn("Fuente", typeof(string));
                busquedaGet.Columns.Add(fuenteColumna);
                busquedaGet.Columns["Fuente"].SetOrdinal(busquedaGet.Columns.IndexOf("idFuente") + 1);
            }

            // Llenar los valores de las nuevas columnas sobre la Hashtable ValoresCatálogo.
            foreach (DataRow row in busquedaGet.Rows)
            {
                if (busquedaGet.Columns.Contains("idDato") && row["idDato"] != DBNull.Value)
                {
                    row["Dato"] = BuscarEnValoresHashtable(gespaBusqueda._htValoresCatálogo, Convert.ToString(row["idDato"]));
                }

                if (busquedaGet.Columns.Contains("idFuente") && row["idFuente"] != DBNull.Value)
                {
                    row["Fuente"] = BuscarEnValoresHashtable(gespaBusqueda._htValoresCatálogo, Convert.ToString(row["idFuente"]));
                }
            }

            // Mapeo de "Encontrado" y "Confirmado" a "✓" y "X"
            if (busquedaGet.Columns.Contains("_Encontrado"))
            {
                busquedaGet.Columns.Add("_EncontradoString", typeof(string));
                foreach (DataRow row in busquedaGet.Rows)
                {
                    if (row["_Encontrado"] != DBNull.Value)
                    {
                        try
                        {
                            int valorEncontrado = Convert.ToInt32(row["_Encontrado"]);
                            row["_EncontradoString"] = valorEncontrado == 1 ? "✓" : "X";
                        }
                        catch (InvalidCastException ex)
                        {
                            Console.WriteLine($"Error al convertir _Encontrado: {ex.Message}");
                            row["_EncontradoString"] = "?";
                        }
                    }
                }
                busquedaGet.Columns.Remove("_Encontrado");
                busquedaGet.Columns["_EncontradoString"].ColumnName = "_Encontrado";
            }

            if (busquedaGet.Columns.Contains("_Confirmado"))
            {
                busquedaGet.Columns.Add("_ConfirmadoString", typeof(string));
                foreach (DataRow row in busquedaGet.Rows)
                {
                    if (row["_Confirmado"] != DBNull.Value)
                    {
                        try
                        {
                            int valorConfirmado = Convert.ToInt32(row["_Confirmado"]);
                            row["_ConfirmadoString"] = valorConfirmado == 1 ? "✓" : "X";
                        }
                        catch (InvalidCastException ex)
                        {
                            Console.WriteLine($"Error al convertir _Confirmado: {ex.Message}");
                            row["_ConfirmadoString"] = "?";
                        }
                    }
                }
                busquedaGet.Columns.Remove("_Confirmado");
                busquedaGet.Columns["_ConfirmadoString"].ColumnName = "_Confirmado";
            }

            dsTablas.Tables.Add(busquedaGet);
        }


        public async Task<bool> GuardarBusquedaAsync(BusquedaNueva busqueda)
        {
            Debug.WriteLine("Entrando en GuardarBusquedaAsync");

            // Validación del parámetro 'validador'
            if (!string.IsNullOrEmpty(busqueda.Validador) && !int.TryParse(busqueda.Validador, out _))
            {
                Debug.WriteLine("Error: El valor de 'validador' no es un número válido.");
                return false;
            }

            try
            {
                string connectionString = _configuration.GetConnectionString("Piso2Amex");
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    await connection.OpenAsync();
                    using (SqlCommand command = new SqlCommand("[dbo].[2.9.Búsqueda]", connection))
                    {
                        command.CommandType = System.Data.CommandType.StoredProcedure;

                        // Registros detallados de los parámetros
                        Console.WriteLine($"idCartera: {busqueda.IdCartera}");
                        Console.WriteLine($"idCuenta: {busqueda.IdCuenta}");
                        Console.WriteLine($"idEjecutivo: {busqueda.IdEjecutivo}");
                        Console.WriteLine($"idDato: {busqueda.IdDato}");
                        Console.WriteLine($"DatoBuscado: {busqueda.Dato}");
                        Console.WriteLine($"idFuente: {busqueda.IdFuente}");
                        Console.WriteLine($"Encontrado: {busqueda.Encontrado}");
                        Console.WriteLine($"NúmeroTeléfonosEncontrados: {busqueda.NumeroTelefonosEncontrados}");
                        Console.WriteLine($"NombrePersona: {busqueda.NombrePersona}");
                        Console.WriteLine($"Puesto: {busqueda.Puesto}");
                        Console.WriteLine($"NombreLugar: {busqueda.NombreLugar}");
                        Console.WriteLine($"DomicilioLugar: {busqueda.DomicilioLugar}");
                        Console.WriteLine($"TiempoEnCuenta: {busqueda.TiempoEnCuenta}");
                        Console.WriteLine($"link: {busqueda.Link}");
                        Console.WriteLine($"validador: {busqueda.Validador}");

                        // Parámetros del procedimiento almacenado
                        command.Parameters.AddWithValue("@idCartera", busqueda.IdCartera);
                        command.Parameters.AddWithValue("@idCuenta", busqueda.IdCuenta);
                        command.Parameters.AddWithValue("@idEjecutivo", busqueda.IdEjecutivo);
                        command.Parameters.AddWithValue("@idDato", busqueda.IdDato);
                        command.Parameters.AddWithValue("@DatoBuscado", busqueda.Dato);
                        command.Parameters.AddWithValue("@idFuente", busqueda.IdFuente);
                        command.Parameters.AddWithValue("@Encontrado", busqueda.Encontrado);
                        command.Parameters.AddWithValue("@NúmeroTeléfonosEncontrados", busqueda.NumeroTelefonosEncontrados);
                        command.Parameters.AddParameterWithValueOrDbNull("@NombrePersona", busqueda.NombrePersona);
                        command.Parameters.AddParameterWithValueOrDbNull("@Puesto", busqueda.Puesto);
                        command.Parameters.AddParameterWithValueOrDbNull("@NombreLugar", busqueda.NombreLugar);
                        command.Parameters.AddParameterWithValueOrDbNull("@DomicilioLugar", busqueda.DomicilioLugar);
                        command.Parameters.AddParameterWithValueOrDbNull("@TiempoEnCuenta", busqueda.TiempoEnCuenta);
                        command.Parameters.AddParameterWithValueOrDbNull("@link", busqueda.Link);

                        // Manejo de valores nulos o vacíos para 'validador'
                        if (string.IsNullOrEmpty(busqueda.Validador))
                        {
                            command.Parameters.AddWithValue("@validador", DBNull.Value);
                        }
                        else
                        {
                            command.Parameters.AddWithValue("@validador", int.Parse(busqueda.Validador));
                        }

                        int rowsAffected = await command.ExecuteNonQueryAsync();
                        if (rowsAffected > 0)
                        {
                            Console.WriteLine("Inserción exitosa.");
                            return true;
                        }
                        else
                        {
                            Console.WriteLine("No se insertó ninguna fila.");
                            return false;
                        }
                    }
                }
            }
            catch (SqlException ex)
            {
                Debug.WriteLine($"Error de SQL: {ex.Message}");
                foreach (SqlError error in ex.Errors)
                {
                    Debug.WriteLine($"  Error Number: {error.Number}");
                    Debug.WriteLine($"  Message: {error.Message}");
                    Debug.WriteLine($"  Line Number: {error.LineNumber}");
                    Debug.WriteLine($"  Procedure: {error.Procedure}");
                }
                return false;
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error al guardar la búsqueda: {ex.Message}");
                Debug.WriteLine(ex.StackTrace);
                return false;
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

            DataTable cargoGet = await GetCargosEnLineaAsync(idCartera, idCuenta);

            if (cargoGet == null || cargoGet.Rows.Count == 0)
                return;

            if (dsTablas.Tables.Contains("Cargos"))
            {
                dsTablas.Tables.Remove("Cargos");
            }

            cargoGet.TableName = "Cargos";

            // Agregar la columna "Banco" justo después de "idBanco"
            if (cargoGet.Columns.Contains("idBanco"))
            {
                // Crear e insertar la columna "Banco" después de "idBanco"
                DataColumn bancoColumna = new DataColumn("Banco", typeof(string));
                cargoGet.Columns.Add(bancoColumna);
                cargoGet.Columns["Banco"].SetOrdinal(cargoGet.Columns.IndexOf("idBanco") + 1);
            }

            ClasesGespaNonStatic gespaCargos = new();
            gespaCargos.dtCatalogos = await _ejecutivoRepository.VwCatalogos();
            gespaCargos.CargaCatalogos();


            // Llenar los valores de la nueva columna usando la lógica de "traducción"
            foreach (DataRow row in cargoGet.Rows)
            {
                if (cargoGet.Columns.Contains("idBanco") && row["idBanco"] != DBNull.Value)
                {
                    row["Banco"] = BuscarEnValoresHashtable(gespaCargos._htValoresCatálogo, Convert.ToString(row["idBanco"]));
                }
            }



            dsTablas.Tables.Add(cargoGet);
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
                        foreach (var Caracter in from char Caracter in ValorBusqueda.Substring(0, 3)
                                                 where char.IsLetter(Caracter)
                                                 select Caracter)
                        {
                            queryBusqueda += Caracter;
                        }

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

            // Crear una nueva columna de tipo string
            if (estadoGet.Columns.Contains("_Consulta"))
            {
                estadoGet.Columns.Add("_ConsultaString", typeof(string));

                // Copiar y mapear los datos a la nueva columna
                foreach (DataRow row in estadoGet.Rows)
                {
                    if (row["_Consulta"] != DBNull.Value)
                    {
                        try
                        {
                            int valorConsulta = Convert.ToInt32(row["_Consulta"]);
                            row["_ConsultaString"] = valorConsulta == 1 ? "✓" : "X";
                        }
                        catch (InvalidCastException ex)
                        {
                            Console.WriteLine($"Error al convertir _Consulta: {ex.Message}");
                            row["_ConsultaString"] = "?"; // O un valor predeterminado
                        }
                    }
                }

                // Eliminar la columna original _Consulta
                estadoGet.Columns.Remove("_Consulta");
                // Cambiar el nombre de la nueva columna para reemplazar la original
                estadoGet.Columns["_ConsultaString"].ColumnName = "_Consulta";
            }

            if (dsTablas.Tables.Contains("EstadoDeCuenta"))
            {
                dsTablas.Tables.Remove("EstadoDeCuenta");
            }

            estadoGet.TableName = "EstadoDeCuenta";
            dsTablas.Tables.Add(estadoGet);
        }
        public async Task<DataTable> GetEstadoDeCuentaCorreoAsync(int idCartera, string idCuenta)
        {
            DataTable estado = new DataTable();
            string query = "SELECT * FROM fn_Correos(@idCartera, @idCuenta) where idInformación in (1901,1906,1907)";

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

        public async Task ObtenerEstadodeCuentaCorreos(DataRow drDatos, DataSet dsTablas)
        {
            if (drDatos == null)
                return;

            if (!drDatos.Table.Columns.Contains("idCartera") || !drDatos.Table.Columns.Contains("idCuenta"))
                throw new ArgumentException("Las columnas 'idCartera' y/o 'idCuenta' no existen en el DataRow");

            var idCartera = Convert.ToInt32(drDatos["idCartera"]);
            var idCuenta = Convert.ToString(drDatos["idCuenta"]);

            DataTable estadoGet = await GetEstadoDeCuentaCorreoAsync(idCartera, idCuenta);

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

            ClasesGespaNonStatic gespaPagos = new();
            gespaPagos.dtCatalogos = await _ejecutivoRepository.VwCatalogos();
            gespaPagos.CargaCatalogos();

            AgregarYTraducirColumna(pagosGet, "Sucursal", "SucursalValor", gespaPagos._htValoresCatálogo);
            AgregarYTraducirColumna(pagosGet, "idEtapa", "Etapa", gespaPagos._htValoresCatálogo);

            dsTablas.Tables.Add(pagosGet);
        }
        #endregion

        #region Gestiones
        public async Task<DataTable> ObtieneGestionTeAsync(int idCartera, string idCuenta, int Top)
        {
            DataTable gestiones = new DataTable();

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();

                // Construir la consulta SQL dinámicamente
                string sql = $"SELECT TOP ({Top}) * FROM fn_GestionesTelefónicas(@IdCartera, @IdCuenta)";

                var parameters = new { IdCartera = idCartera, IdCuenta = idCuenta };
                var gestionesResult = await connection.QueryAsync<dynamic>(sql, parameters);

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

            ClasesGespaNonStatic gespaGestiones = new();
            gespaGestiones.dtCatalogos = await _ejecutivoRepository.VwCatalogos();
            gespaGestiones.CargaCatalogos();

            AgregarYTraducirColumna(gestiones, "idContacto", "Contacto", gespaGestiones._htValoresCatálogo);
            AgregarYTraducirColumna(gestiones, "idSituación", "Situación", gespaGestiones._htValoresCatálogo);
            AgregarYTraducirColumna(gestiones, "idParentesco", "Parentesco", gespaGestiones._htValoresCatálogo);
            AgregarYTraducirColumna(gestiones, "idCausaNoPago", "CausaNoPago", gespaGestiones._htValoresCatálogo);
            AgregarYTraducirColumna(gestiones, "idModo", "Modo", gespaGestiones._htValoresCatálogo);
            AgregarYTraducirColumna(gestiones, "idAcercamiento", "Acercamiento", gespaGestiones._htValoresCatálogo);
            AgregarYTraducirColumna(gestiones, "idEtapa", "Etapa", gespaGestiones._htValoresCatálogo);
            AgregarYTraducirColumna(gestiones, "idSucursal", "Sucursal", gespaGestiones._htValoresCatálogo);


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


            //if (dsTablas.Tables.Contains("Domicilios"))

            if (dsTablas.Tables.Contains("Domicilios"))
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

        #region Scripts
        public DataTable BuscaScripts(int idProducto)
        {
            DataTable scripts = new();

            try
            {
                using (SqlConnection connection = new(_connectionString)) // Usar la cadena de conexión de tu servicio
                {
                    connection.Open();

                    using SqlCommand command = new($"SELECT * FROM Scripts (NOLOCK) WHERE idProducto = {idProducto}", connection);
                    using SqlDataAdapter adapter = new(command);
                    adapter.Fill(scripts);
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

        public async Task<DataTable> BuscaScriptsTranslated(int idEjecutivo, int idProducto, int idCartera, string cuenta)
        {
            var scripts = await _ejecutivoRepository.ObtenerScriptsAsync(idProducto);
            var infoCuenta = await _ejecutivoRepository.InfoCuenta(idCartera, cuenta);
            var producto = await _ejecutivoRepository.ObtieneProducto(cuenta);
            var datosEjecutivo = await _ejecutivoRepository.ObtenerDatosEjecutivo(idEjecutivo);

            // Convertimos info de producto en diccionario
            var productoDictionary = new Dictionary<string, string>();
            if (producto.Rows.Count > 0)
            {
                foreach (DataColumn column in producto.Columns)
                {
                    productoDictionary[column.ColumnName] = producto.Rows[0][column].ToString();
                }
            }


            // InfoCuenta: se asume una sola fila
            var drInfo = infoCuenta.Rows.Count > 0 ? infoCuenta.Rows[0] : null;
            var drEjecutivo = datosEjecutivo.Rows.Count > 0 ? datosEjecutivo.Rows[0] : null;

            // Recorremos cada fila del script y aplicamos reemplazo
            foreach (DataRow row in scripts.Rows)
            {
                foreach (DataColumn column in scripts.Columns)
                {
                    if (column.DataType == typeof(string) && row[column] != DBNull.Value)
                    {
                        string original = row[column].ToString();
                        string reemplazado = FormatoScript(original, drInfo, drEjecutivo, productoDictionary);
                        row[column] = reemplazado;
                    }
                }
            }

            return scripts;
        }

        private static string FormatoScript(string texto, DataRow drInfo, DataRow drEjecutivo, Dictionary<string, string> productoDict)
        {
            if (string.IsNullOrEmpty(texto))
                return texto;

            var resultado = new StringBuilder();
            int start = 0;

            while (start < texto.Length)
            {
                int openBracket = texto.IndexOf('[', start);
                if (openBracket == -1)
                {
                    resultado.Append(texto.Substring(start));
                    break;
                }

                int closeBracket = texto.IndexOf(']', openBracket);
                if (closeBracket == -1)
                {
                    resultado.Append(texto.Substring(start));
                    break;
                }

                // Agrega el texto antes del token
                resultado.Append(texto.Substring(start, openBracket - start));

                // Extrae el contenido dentro de los corchetes
                string key = texto.Substring(openBracket + 1, closeBracket - openBracket - 1);

                // Realiza el reemplazo usando ReemplazaInfo
                string reemplazo = ReemplazaInfo(key, drInfo, drEjecutivo, productoDict);
                resultado.Append(reemplazo);

                // Continúa después del cierre del corchete
                start = closeBracket + 1;
            }

            return resultado.ToString();
        }

        private static string ReemplazaInfo(string key, DataRow drInfo, DataRow drEjecutivo, Dictionary<string, string> productoDict)
        {
            if (drInfo != null && drInfo.Table.Columns.Contains(key) && drInfo[key] != DBNull.Value)
                return drInfo[key].ToString();

            if (productoDict != null && productoDict.TryGetValue(key, out var valProducto))
                return valProducto;

            if (drEjecutivo != null && drEjecutivo.Table.Columns.Contains(key) && drEjecutivo[key] != DBNull.Value)
                return drEjecutivo[key].ToString();

            return string.Empty; // Si no se encuentra nada
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

        public async Task<string> EnviaCorreoAsync(string CorreoElectronico, string Asunto, string Mensaje, int idCartera, string idCuenta, int idEjecutivo)
        {
            try
            {
                using (SqlConnection connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();

                    // Verificar si el correo existe en la base de datos
                    string checkQuery = "SELECT COUNT(*) FROM CorreosEnviados WHERE idCartera = @idCartera AND idCuenta = @idCuenta AND CorreoElectronico = @CorreoElectronico";
                    using (SqlCommand checkCommand = new SqlCommand(checkQuery, connection))
                    {
                        checkCommand.Parameters.AddWithValue("@idCartera", idCartera);
                        checkCommand.Parameters.AddWithValue("@idCuenta", idCuenta);
                        checkCommand.Parameters.AddWithValue("@CorreoElectronico", CorreoElectronico);
                        checkCommand.Parameters.AddWithValue("@idEjecutivo", idEjecutivo);

                        int count = (int)await checkCommand.ExecuteScalarAsync();
                        if (count == 0)
                        {
                            return "La dirección de correo no está asignada a la cuenta.";
                        }
                    }

                    // Actualizar la información del correo (sin idInformacion)
                    string updateQuery = "UPDATE CorreosCuentas SET FechaHora_Informacion = GETDATE() WHERE idCartera = @idCartera AND idCuenta = @idCuenta AND CorreoElectronico = @CorreoElectronico";
                    using (SqlCommand updateCommand = new SqlCommand(updateQuery, connection))
                    {
                        updateCommand.Parameters.AddWithValue("@idCartera", idCartera);
                        updateCommand.Parameters.AddWithValue("@idCuenta", idCuenta);
                        updateCommand.Parameters.AddWithValue("@CorreoElectronico", CorreoElectronico);

                        await updateCommand.ExecuteNonQueryAsync();
                    }

                    return ""; // Éxito
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error en EnviaCorreoAsync: {ex.Message}");
                return $"Fallo en base de datos al identificar correo electrónico: {ex.Message}";
            }

            // Agregar un valor de retorno predeterminado o un mensaje de error
            return "Error desconocido al procesar el correo electrónico.";
        }


        public async Task<dynamic> RegisterNewCorreo(CorreosEn newCorreos)
        {
            try
            {
                using (var connection = GetConnection("Piso2Amex"))
                {
                    string newPhoneQuery = "[dbCollection].[dbo].[2.5.1.EnviaCorreo]";
                    var parameters = new
                    {
                        correoElectronico = newCorreos.CorreoElectronico,
                        idCartera = newCorreos.IdCartera,
                        idCuenta = newCorreos.IdCuenta,
                        idEjecutivo = newCorreos.IdEjecutivo,
                        mensaje = newCorreos.Mensaje,
                        asunto = newCorreos.Asunto,
                        idEtapa = newCorreos.IdEtapa
                    };

                    var result = await connection.QueryFirstOrDefaultAsync<dynamic>(
                        newPhoneQuery,
                        parameters,
                        commandType: CommandType.StoredProcedure
                    );

                    if (result == null)
                    {
                        return new { Success = false, Message = "No se recibió respuesta del procedimiento almacenado." };
                    }

                    var dict = result as IDictionary<string, object>;

                    if (dict != null && dict.ContainsKey("Resultado"))
                    {
                        return new Dictionary<string, object>
                {
                    { "Success", false },
                    { "Resultado", dict["Resultado"].ToString() }
                };
                    }

                    return new Dictionary<string, object> { { "Success", true }, { "Data ", result } };
                }
            }
            catch (Exception ex)
            {
                // Manejo de la excepción (por ejemplo, registrar el error)
                Console.WriteLine($"Error en RegisterNewEstado: {ex.Message}");
                return new { Success = false, Message = $"Error: {ex.Message}" };
            }
        }
        private SqlConnection GetConnection(string connectionStringName)
        {
            var connectionString = _configuration.GetConnectionString(connectionStringName);
            return new SqlConnection(connectionString);
        }

        #endregion

        #region Gestiones Telefonicas
        public async Task<DataTable> ObtieneGestionesAsync(DataRow drInfo)
        {
            if (drInfo == null)
                return null;

            DataTable gestiones = new DataTable();
            List<string> cuentas = new List<string>();

            if ((drInfo["idCartera"].ToString() == "7" || drInfo["idCartera"].ToString() == "13") && !string.IsNullOrEmpty(drInfo["NúmeroCliente"].ToString()))
            {
                string queryCuentas = "SELECT idCuenta FROM Cuentas WHERE CuentaActiva = 1 AND idCartera = @idCartera AND NúmeroCliente = @NúmeroCliente";

                using (var connection = GetConnection("Piso2Amex")) // Asumiendo que DataBaseConn tiene una propiedad ConnectionString
                {
                    await connection.OpenAsync();
                    using (var command = new SqlCommand(queryCuentas, connection))
                    {
                        command.Parameters.Add("@NúmeroCliente", SqlDbType.VarChar).Value = drInfo["NúmeroCliente"];
                        command.Parameters.Add("@idCartera", SqlDbType.Int).Value = drInfo["idCartera"];

                        using (var reader = await command.ExecuteReaderAsync())
                        {
                            while (await reader.ReadAsync())
                            {
                                cuentas.Add(reader["idCuenta"].ToString());
                            }
                        }
                    }
                }
            }
            else
            {
                cuentas.Add(drInfo["idCuenta"].ToString());
            }

            foreach (string cuenta in cuentas)
            {
                string queryGestiones = "SELECT * FROM fn_GestionesTelefónicas(@idCartera, @idCuenta)";

                using (var connection = GetConnection("Piso2Amex"))
                {
                    await connection.OpenAsync();
                    using (var command = new SqlCommand(queryGestiones, connection))
                    {
                        command.Parameters.Add("@idCartera", SqlDbType.Int).Value = drInfo["idCartera"];
                        command.Parameters.Add("@idCuenta", SqlDbType.VarChar).Value = cuenta;

                        using (var adapter = new SqlDataAdapter(command))
                        {
                            DataTable tempGestiones = new DataTable();
                            adapter.Fill(tempGestiones);

                            if (gestiones.Columns.Count == 0)
                            {
                                gestiones = tempGestiones.Clone();
                            }

                            foreach (DataRow row in tempGestiones.Rows)
                            {
                                gestiones.ImportRow(row);
                            }
                        }
                    }
                }
            }
            return gestiones;
        }
        public async Task<bool> GuardaGestionTelefonicaAsync(GestionTelefonica gestion)
        {
            try
            {
                string connectionString = _configuration.GetConnectionString("Piso2Amex");
                using (SqlConnection connection = new SqlConnection(connectionString))
                {
                    await connection.OpenAsync();
                    using (SqlCommand command = new SqlCommand("[dbo].[2.1.GuardaGestiónTelefónica]", connection))
                    {
                        command.CommandType = System.Data.CommandType.StoredProcedure;

                        // Parámetros del procedimiento almacenado
                        command.Parameters.AddWithValue("@idCartera", gestion.IdCartera);
                        command.Parameters.AddWithValue("@idCuenta", gestion.IdCuenta);
                        command.Parameters.AddWithValue("@idEjecutivo", gestion.IdEjecutivo);
                        command.Parameters.AddWithValue("@idContacto", gestion.IdContacto);
                        command.Parameters.AddWithValue("@idSituación", gestion.IdSituacion ?? (object)DBNull.Value);
                        command.Parameters.AddWithValue("@idCausaNoPago", gestion.IdCausaNoPago ?? (object)DBNull.Value);
                        command.Parameters.AddWithValue("@idParentesco", gestion.IdParentesco ?? (object)DBNull.Value);
                        command.Parameters.AddWithValue("@idSucursal", gestion.IdSucursal);
                        command.Parameters.AddWithValue("@Extensión", gestion.Extension ?? (object)DBNull.Value);
                        command.Parameters.AddWithValue("@NombreContacto", gestion.NombreContacto ?? (object)DBNull.Value);
                        command.Parameters.AddWithValue("@NúmeroTelefónico", gestion.NumeroTelefonico);
                        command.Parameters.AddWithValue("@Duración", gestion.Duracion);
                        command.Parameters.AddWithValue("@idModo", gestion.IdModo);
                        command.Parameters.AddWithValue("@idAcercamiento", gestion.IdAcercamiento ?? (object)DBNull.Value);
                        command.Parameters.AddWithValue("@Comentario", gestion.Comentario ?? (object)DBNull.Value);
                        command.Parameters.AddWithValue("@TiempoEnCuenta", gestion.TiempoEnCuenta);
                        // Parámetros adicionales
                        command.Parameters.AddWithValue("@Fechavici", gestion.Fechavici ?? (object)DBNull.Value);
                        command.Parameters.AddWithValue("@Nivel", gestion.Nivel ?? (object)DBNull.Value);
                        command.Parameters.AddWithValue("@Situacion", gestion.Situacion ?? (object)DBNull.Value);
                        command.Parameters.AddWithValue("@Productos", gestion.Productos ?? (object)DBNull.Value);
                        command.Parameters.AddWithValue("@Producto", gestion.Producto ?? (object)DBNull.Value);
                        command.Parameters.AddWithValue("@NumeroCliente", gestion.NumeroCliente ?? (object)DBNull.Value);
                        command.Parameters.AddWithValue("@Billing", gestion.Billing ?? (object)DBNull.Value);
                        command.Parameters.AddWithValue("@Contacto", gestion.Contacto ?? (object)DBNull.Value);
                        command.Parameters.AddWithValue("@Situaciones", gestion.Situaciones ?? (object)DBNull.Value);

                        int rowsAffected = await command.ExecuteNonQueryAsync();
                        return rowsAffected > 0;
                    }
                }
            }
            catch (SqlException ex)
            {
                Debug.WriteLine($"Error de SQL: {ex.Message}");
                return false;
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error al guardar la gestión: {ex.Message}");
                return false;
            }
        }
        public async Task<GuardaGestionTelefonicaResult> GuardarGestionTelefonica(EndGestionRequest infoEndGestion)
        {
            var saveGestionResult = await _ejecutivoRepository.GuardarGestionTelefonica(infoEndGestion);
            return saveGestionResult;
        }
        #endregion

        #region Adicionales
        public async Task<DataTable> GetAdiccionalesAsync(int idCartera, string idCuenta)
        {
            DataTable adicionales = new DataTable();
            string query = "SELECT * FROM fn_Adicionales(@idCartera, @idCuenta)";

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.Add("@idCartera", SqlDbType.Int).Value = idCartera;
                    command.Parameters.Add("@idCuenta", SqlDbType.VarChar).Value = idCuenta;


                    using (var adapter = new SqlDataAdapter(command))
                    {
                        adapter.Fill(adicionales);
                    }
                }
            }
            return adicionales;
        }


        public async Task<string> AñadeAdicionalAsync(Adicional AdicionalCuenta, DataRow drInfo, Ejecutivo ejecutivo, DataTable Adicionales, Catalogos catalogos)
        {
            try
            {
                if (AdicionalCuenta.Nombre.Trim().Length < 5)
                    return "El adicional debe de tener un nombre real.";

                NewPhone TeléfonoAdicional = new NewPhone(
                    AdicionalCuenta.NumeroTelefonico,
                    catalogos.idValor("Telefonía", "México"),
                    catalogos.idValor("Orígenes", "Adicional"),
                    catalogos.idValor("Clases", "Nuevo"),
                    new TimeSpan(0),
                    "",
                    0,
                    (int)drInfo["idCartera"],
                    drInfo["idCuenta"].ToString(),
                    (int)ejecutivo.Datos["idEjecutivo"]
                );

                // Convertir NewPhone a NewPhoneRequest
                NewPhoneRe newPhoneRequest = new NewPhoneRe
                {
                    NumeroTelefonico = TeléfonoAdicional.NumeroTelefonico,
                    IdTelefonía = TeléfonoAdicional.IdTelefonía,
                    IdOrigen = TeléfonoAdicional.IdOrigen,
                    IdClase = TeléfonoAdicional.IdClase,
                    HorarioContacto = (TimeSpan)TeléfonoAdicional.HorarioContacto,
                    Estado = TeléfonoAdicional.Estado,
                    Extension = TeléfonoAdicional.Extension,
                    IdCartera = (int)TeléfonoAdicional.IdCartera,
                    IdCuenta = TeléfonoAdicional.IdCuenta,
                    IdEjecutivo = (int)TeléfonoAdicional.IdEjecutivo
                };

                string sMensaje = await _searchService.SaveNewPhoneRe(newPhoneRequest);
                if (!string.IsNullOrEmpty(sMensaje))
                    return sMensaje;

                using (var connection = new SqlConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    using (SqlCommand command = new SqlCommand("[2.4.AñadirAdicional]", connection))
                    {
                        command.CommandType = CommandType.StoredProcedure;

                        command.Parameters.AddWithValue("@idCartera", drInfo["idCartera"]);
                        command.Parameters.AddWithValue("@idCuenta", drInfo["idCuenta"]);
                        command.Parameters.AddWithValue("@NombreAdicional", AdicionalCuenta.Nombre);
                        command.Parameters.AddWithValue("@idParentesco", AdicionalCuenta.IdParentesco);
                        command.Parameters.AddWithValue("@NúmeroTelefónico", string.IsNullOrEmpty(TeléfonoAdicional.NumeroTelefonico) ? DBNull.Value : (object)TeléfonoAdicional.NumeroTelefonico);
                        command.Parameters.AddWithValue("@idEjecutivo", ejecutivo.Datos["idEjecutivo"]);

                        int rowsAffected = await command.ExecuteNonQueryAsync();
                        if (rowsAffected == 0)
                            return "Falló al añadir el adicional en la base de datos.";

                        DataRow drAdicional = Adicionales.NewRow();
                        Funciones.AddParametersToRow(command.Parameters, drAdicional);
                        Adicionales.Rows.Add(drAdicional);
                    }
                }

                return "";
            }
            catch (Exception ex)
            {
                return $"Error interno del servidor: {ex.Message}";
            }
        }

        public static class Funciones
        {
            public static void AddParametersToRow(SqlParameterCollection parameters, DataRow row)
            {
                try
                {
                    foreach (SqlParameter parameter in parameters)
                    {
                        if (parameter.Value != DBNull.Value)
                        {
                            row[parameter.ParameterName.Replace("@", "")] = parameter.Value;
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error en AddParametersToRow: {ex.Message}");
                }
            }

            /// <summary>
            /// Valida la dirección de correo electrónico.
            /// </summary>
            /// <param name="DirecciónCorreo">Dirección de correo electrónico.</param>
            /// <returns>True si es correcta, Falso si es incorrecta.</returns>
            public static bool ValidaCorreo(string DirecciónCorreo)
            {

                string validEmailPattern =
                    @"^(?!\.)(""([^""\r\\]|\\[""\r\\])*""|"
                    + @"([-a-z0-9!#$%&'*+/=?^_`{|}~]|(?<!\.)\.)*)(?<!\.)"
                    + @"@[-a-z0-9][\w\.-]*[a-z0-9]\.[a-z][a-z\.]*[a-z]$";

                Regex ValidEmailRegex = new(validEmailPattern, RegexOptions.IgnoreCase);

                return ValidEmailRegex.IsMatch(DirecciónCorreo);
            }
        }
        #endregion

        #region NegociacionesEjecutivo
        public async Task<DataTable> GetNegiciacionesEjecutivoAsync(int idEjecutivo)
        {
            DataTable negociaciones = new DataTable();
            string query = "SELECT * FROM fn_NegociacionesEjecutivo(@idEjecutivo)"; // Evita inyección SQL

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand(query, connection))
                {
                    // Usar Add con tipo explícito para evitar problemas con tipos de datos
                    command.Parameters.Add("@idEjecutivo", SqlDbType.Int).Value = idEjecutivo;

                    using (var adapter = new SqlDataAdapter(command))
                    {
                        adapter.Fill(negociaciones);
                    }
                }
            }
            //string jsonString = JsonSerializer.Serialize();
            return negociaciones;
        }
        public async Task ObtieneNegociacionesEjecutivosAsync(DataRow drDatos, DataSet dsTablas)
        {
            if (drDatos == null || dsTablas.Tables.Contains("Negociaciones"))
                return;

            // Verifica que drDatos tenga la columna 'idEjecutivo'
            if (!drDatos.Table.Columns.Contains("idEjecutivo"))
                throw new ArgumentException("La columna 'idEjecutivo' no existe en el DataRow");

            var idEjecutivo = drDatos["idEjecutivo"];
            DataTable negociacionesget = await GetNegiciacionesEjecutivoAsync(Convert.ToInt32(idEjecutivo));

            if (negociacionesget == null || negociacionesget.Rows.Count == 0)
                return;

            negociacionesget.TableName = "Negociaciones";
            dsTablas.Tables.Add(negociacionesget);

        }
        #endregion

        #region Guardar Ofrecimiento
        //private string VerificaOfrecimientoNegociación(NegociacionClass Ofrecimiento, DataRow _drInfo)
        //{
        //    if (Math.Round(Ofrecimiento.MontoNegociado, 2, MidpointRounding.ToEven) < Ofrecimiento.MontoRequerido
        //        && !(Ofrecimiento.idHerramienta == 501 || Ofrecimiento.idHerramienta == 503 || Ofrecimiento.idHerramienta == 92
        //        || Ofrecimiento.idHerramienta == 106 || Ofrecimiento.idHerramienta == 101 || Ofrecimiento.idHerramienta == 108
        //        || Ofrecimiento.idHerramienta == 578 || Ofrecimiento.idHerramienta == 583 || Ofrecimiento.idHerramienta == 137))
        //    {
        //        return "El Monto Negociado debe ser MAYOR que el Monto Requerido.";
        //    }

        //    if (Ofrecimiento.MontoNegociado > Ofrecimiento.Saldo + 1 && (_drInfo["idCartera"].ToString() == "7" || _drInfo["idCartera"].ToString() == "5"))
        //    {
        //        return "El Monto Negociado debe ser menor o igual al Saldo.";
        //    }

        //    if (Ofrecimiento.MontoNegociado > Ofrecimiento.Saldo + 1 && (_drInfo["idCartera"].ToString() == "4" && _drInfo["idProducto"].ToString() == "126" || _drInfo["idCartera"].ToString() == "4" && _drInfo["idProducto"].ToString() == "127" || _drInfo["idCartera"].ToString() == "4" && _drInfo["idProducto"].ToString() == "133"))
        //    {
        //        return "El Monto Negociado debe ser menor o igual al Saldo.";
        //    }

        //    if (Ofrecimiento.Plazos.Length == 0)
        //    {
        //        return "Se debe de indicar el primer pago y su fecha.";
        //    }

        //    if (Ofrecimiento.Plazos.Length == 1 && Ofrecimiento.Plazos[0].Monto != Ofrecimiento.MontoNegociado)
        //    {
        //        return "Al elegir un solo pago, el Primer Pago debe ser IGUAL al Monto Negociado.";
        //    }

        //    if (DateTime.Today.AddDays(Ofrecimiento.Días1erPago) < Ofrecimiento.Plazos[0].Fecha)
        //    {
        //        return "El primero pago debe de ser antes de " + Ofrecimiento.Días1erPago + " días.";
        //    }

        //    if ((Ofrecimiento.idHerramienta == 87 || Ofrecimiento.idHerramienta == 89 || Ofrecimiento.idHerramienta == 104 || Ofrecimiento.idHerramienta == 99 || Ofrecimiento.idHerramienta == 100 || Ofrecimiento.idHerramienta == 107) &&
        //        Ofrecimiento.Plazos[0].Fecha.Month != Ofrecimiento.Plazos[Ofrecimiento.Plazos.Length - 1].Fecha.Month)
        //    {
        //        return "Todos los plazos para esta herramienta deben de ser en el mismo mes.";
        //    }

        //    if (Ofrecimiento.MontoRequerido + 1 < Ofrecimiento.MontoNegociado && Ofrecimiento.Descuento > 0 && Ofrecimiento.MontoRequerido > 0 && Ofrecimiento.idEjecutivoValidador == 0 && _drInfo["idCartera"].ToString() != "1")
        //    {
        //        Ofrecimiento.Descuento = (int)Math.Round((1 - ((1 - (Ofrecimiento.Descuento / 100.0)) * Ofrecimiento.MontoNegociado / Ofrecimiento.MontoRequerido)) * 100, 0);
        //    }

        //    if (Ofrecimiento.Descuento < 0)
        //    {
        //        return "El Monto Negociado es mayor al Saldo. Verifique el cálculo del descuento (" + Ofrecimiento.Descuento + ").";
        //    }

        //    if (Ofrecimiento.CartaConvenio == 1 && !Funciones.ValidaCorreo(Ofrecimiento.Correo.Trim()))
        //    {
        //        return "Para el envío de la Carta Convenio es necesario un Correo válido.";
        //    }

        //    return "";
        //}
        //public async Task<string> GuardaOfrecimientoAsync(NegociacionClass Ofrecimiento, DataRow _drInfo, DataRow InfoProducto, EjecutivoClass Ejecutivo, DataTable Negociaciones, DataTable Catálogos, DateTime _Fecha, TimeSpan _Segundo)
        //{
        //    string sMensaje = VerificaOfrecimientoNegociación(Ofrecimiento);
        //    if (sMensaje != "")
        //        return sMensaje;

        //    if (Ofrecimiento.idHerramienta == 0)
        //        return "Indique la herramienta que se va a ofrecer.";

        //    string connectionString = _configuration.GetConnectionString("dbCollection"); // Ajusta el nombre de tu cadena de conexión

        //    try
        //    {
        //        using (SqlConnection connection = new SqlConnection(connectionString))
        //        {
        //            await connection.OpenAsync();
        //            using (SqlCommand command = new SqlCommand("[dbo].[3.1.GuardaOfrecimiento]", connection))
        //            {
        //                command.CommandType = CommandType.StoredProcedure;

        //                // Parámetros del procedimiento almacenado
        //                command.Parameters.AddWithValue("@idCartera", _drInfo["idCartera"]);
        //                command.Parameters.AddWithValue("@idCuenta", _drInfo["idCuenta"]);
        //                command.Parameters.AddWithValue("@idProducto", _drInfo["idProducto"]);
        //                command.Parameters.AddWithValue("@idEjecutivo", Ejecutivo.Datos["idEjecutivo"]);
        //                command.Parameters.AddWithValue("@idHerramienta", Ofrecimiento.idHerramienta);
        //                command.Parameters.AddWithValue("@MontoRequerido", Ofrecimiento.MontoRequerido);
        //                command.Parameters.AddWithValue("@MontoOfrecido", Ofrecimiento.MontoNegociado);
        //                command.Parameters.AddWithValue("@Descuento", Ofrecimiento.Descuento);

        //                if (Ofrecimiento.idHerramienta.ToString() == "509" || Ofrecimiento.idHerramienta.ToString() == "510")
        //                {
        //                    command.Parameters.AddWithValue("@Saldo", InfoProducto["TOTAL_DEUDOR_POSICION"].ToString());
        //                }
        //                else
        //                {
        //                    command.Parameters.AddWithValue("@Saldo", Ofrecimiento.Saldo);
        //                }

        //                command.Parameters.AddWithValue("@Plazos", Ofrecimiento.Plazos.Length);
        //                command.Parameters.AddWithValue("@FechaCorte", Ofrecimiento.FechaCorte == new DateTime() ? DBNull.Value : (object)Ofrecimiento.FechaCorte);
        //                command.Parameters.AddWithValue("@Fecha_Insert", _Fecha);
        //                command.Parameters.AddWithValue("@Segundo_Insert", _Segundo);

        //                using (SqlDataReader reader = await command.ExecuteReaderAsync())
        //                {
        //                    DataTable tblResultado = new DataTable();
        //                    tblResultado.Load(reader);

        //                    // ... (resto de la lógica para actualizar Negociaciones) ...
        //                    DataRow drOfrecimiento = Negociaciones.Rows.Find(new object[] { _Fecha, _Segundo, Ofrecimiento.idHerramienta });

        //                    if (drOfrecimiento == null)
        //                    {
        //                        drOfrecimiento = Negociaciones.NewRow();

        //                        // Supongo que Funciones.AddParametersToRow es una función que tienes para agregar parámetros a una fila de DataTable.
        //                        // Si esta función realiza operaciones de base de datos, deberías adaptarla para ser asíncrona también.
        //                        Funciones.AddParametersToRow(command.Parameters, drOfrecimiento); // Ajusta esto si es necesario
        //                        drOfrecimiento["Ofreció"] = Ejecutivo.Datos["NombreEjecutivo"];
        //                        drOfrecimiento["Herramienta"] = Catálogos.Herramientas.Rows.Find(Ofrecimiento.idHerramienta)["Nombre"];

        //                        Negociaciones.Rows.Add(drOfrecimiento);
        //                    }
        //                    else
        //                    {
        //                        Funciones.AddParametersToRow(command.Parameters, drOfrecimiento); // Ajusta esto si es necesario
        //                    }

        //                    return ""; // Éxito
        //                }
        //            }
        //        }
        //    }
        //    catch (SqlException ex)
        //    {
        //        // Manejo de errores de SQL
        //        return $"Falló al guardar ofrecimiento: {ex.Message}";
        //    }
        //    catch (Exception ex)
        //    {
        //        // Manejo de otros errores
        //        return $"Error inesperado al guardar ofrecimiento: {ex.Message}";
        //    }
        //}
        #endregion

        #region Usos Horarios
        public async Task<DataTable> GetUsosHorariosAsync(string Telefono, string idCuenta, int idCartera, int idEjecutivo)
        {
            DataTable estado = new DataTable();
            string query = "exec [dbCollection].dbo.[ValidarHorarioMarcacion] @Telefono,@idCuenta,@idCartera,@idEjecutivo";

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.Add("@Telefono", SqlDbType.VarChar).Value = Telefono;
                    command.Parameters.Add("@idCuenta", SqlDbType.VarChar).Value = idCuenta;
                    command.Parameters.Add("@idCartera", SqlDbType.Int).Value = idCartera;
                    command.Parameters.Add("@idEjecutivo", SqlDbType.Int).Value = idEjecutivo;

                    using (var adapter = new SqlDataAdapter(command))
                    {
                        adapter.Fill(estado);
                    }
                }
            }
            return estado;
        }

        public async Task ObtenerUsoHorario(DataRow drDatos, DataSet dsTablas)
        {
            if (drDatos == null)
                return;

            if (!drDatos.Table.Columns.Contains("idCartera") || !drDatos.Table.Columns.Contains("idCuenta"))
                throw new ArgumentException("Las columnas 'idCartera' y/o 'idCuenta' no existen en el DataRow");

            var idCartera = Convert.ToInt32(drDatos["idCartera"]);
            var idCuenta = Convert.ToString(drDatos["idCuenta"]);
            var Telefono = Convert.ToString(drDatos["Telefono"]);
            var idEjecutivo = Convert.ToInt32(drDatos["idEjecutivo"]);

            DataTable estadoGet = await GetUsosHorariosAsync(Telefono, idCuenta, idCartera, idEjecutivo);

            if (estadoGet == null || estadoGet.Rows.Count == 0)
                return;


            if (dsTablas.Tables.Contains("EstadoDeCuenta"))
            {
                dsTablas.Tables.Remove("EstadoDeCuenta");
            }

            estadoGet.TableName = "EstadoDeCuenta";
            dsTablas.Tables.Add(estadoGet);
        }
        #endregion

        public static void AgregarYTraducirColumna(DataTable table, string columnaBase, string nuevaColumna, Hashtable valoresCatalogo)
        {
            // Verificar si la columna base existe en la DataTable
            if (table.Columns.Contains(columnaBase))
            {
                // Crear e insertar la nueva columna después de la columna base
                DataColumn nuevaCol = new(nuevaColumna, typeof(string));
                table.Columns.Add(nuevaCol);
                table.Columns[nuevaColumna].SetOrdinal(table.Columns.IndexOf(columnaBase) + 1);

                // Llenar los valores de la nueva columna usando la lógica de "traducción"
                foreach (DataRow row in table.Rows)
                {
                    if (row[columnaBase] != DBNull.Value)
                    {
                        string valor = Convert.ToString(row[columnaBase]);

                        // Validar si el valor es un número antes de traducirlo
                        if (int.TryParse(valor, out _))
                        {
                            row[nuevaColumna] = BuscarEnValoresHashtable(valoresCatalogo, valor);
                        }
                        else
                        {
                            row[nuevaColumna] = DBNull.Value;
                        }
                    }
                }
            }
        }



        /// <summary>
        /// Busca un valor en un Hashtable basado en una clave específica.
        /// </summary>
        /// <param name="valoresCatalogo">Hashtable que contiene pares clave-valor.</param>
        /// <param name="valorBuscado">Clave a buscar dentro del Hashtable.</param>
        /// <returns>El valor asociado a la clave si se encuentra; de lo contrario, retorna <c>null</c>.</returns>
        public static string BuscarEnValoresHashtable(Hashtable valoresCatalogo, string valorBuscado)
        {
            // Recorre todas las entradas en el Hashtable.
            foreach (DictionaryEntry entry in valoresCatalogo)
            {
                // Compara la clave actual con el valor buscado.
                if (entry.Key.ToString() == valorBuscado)
                {
                    return entry.Value.ToString(); // Devuelve el valor asociado si se encuentra.
                }
            }

            return null; // Retorna null si no se encuentra la clave en el Hashtable.
        }


    }


    public static class DataExtensions
    {
        // ... (tu método AsDataTable para SeguimientoModel) ...
        public static DataTable AsDataTable(this List<SeguimientoModel> seguimientos)
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("FechaSeguimiento", typeof(DateTime));
            dt.Columns.Add("IdEjecutivo", typeof(int));

            foreach (var seguimiento in seguimientos)
            {
                DataRow dr = dt.NewRow();
                dr["FechaSeguimiento"] = seguimiento.FechaSeguimiento;
                dr["IdEjecutivo"] = seguimiento.IdEjecutivo;
                dt.Rows.Add(dr);
            }

            return dt;
        }
        public static DataTable AsDataTable(this List<CatalogoModel> catalogos)
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("IdCatalogo", typeof(int));
            dt.Columns.Add("Catalogo", typeof(string));
            dt.Columns.Add("NombreId", typeof(string));
            dt.Columns.Add("DescripcionCatalogo", typeof(string));
            dt.Columns.Add("FechaCatalogo", typeof(DateTime));

            foreach (var catalogo in catalogos)
            {
                DataRow dr = dt.NewRow();
                dr["IdCatalogo"] = catalogo.IdCatalogo;
                dr["Catalogo"] = catalogo.Catalogo;
                dr["NombreId"] = catalogo.NombreId;
                dr["DescripcionCatalogo"] = catalogo.DescripcionCatalogo;
                dr["FechaCatalogo"] = catalogo.FechaCatalogo;
                dt.Rows.Add(dr);
            }

            return dt;
        }
        public static DataRow AsDataRow(this DrInfo drInfo)
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("idCartera", typeof(int));
            dt.Columns.Add("idCuenta", typeof(string));

            DataRow dr = dt.NewRow();
            dr["idCartera"] = drInfo.IdCartera;
            dr["idCuenta"] = drInfo.IdCuenta;

            return dr;
        }
        public static DataRow AsDataRow(this UltimaGestionModel ultimaGestion)
        {
            DataTable dt = new DataTable();
            dt.Columns.Add("FechaUltimaGestion", typeof(DateTime));
            dt.Columns.Add("IdEjecutivoUltimaGestion", typeof(int));

            DataRow dr = dt.NewRow();
            dr["FechaUltimaGestion"] = ultimaGestion.FechaUltimaGestion;
            dr["IdEjecutivoUltimaGestion"] = ultimaGestion.IdEjecutivoUltimaGestion;

            return dr;
        }

    }

}
