using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System.Linq;
using NoriAPI.Models.Ejecutivo;
using NoriAPI.Models.Phones;
using System.Net;
using NoriAPI.Models.Acciones;
using System.Collections;
using System.Text.RegularExpressions;
using System.Diagnostics;
using NoriAPI.Models.Flujo;
using NoriAPI.Models.Ofrecimiento;
using NoriAPI.Models;
using static NoriAPI.Services.EjecutivoService;
using System.Drawing;

namespace NoriAPI.Repositories
{
    public interface IEjecutivoRepository
    {
        #region Productividad
        Task<DataTable> VwCatalogos();
        Task<DataTable> VwRelaciones();
        Task<DataTable> CuentasEjecutivo(int numEmpleado);
        Task<DataTable> TiemposEjecutivo(int numEmpleado);
        Task<DataTable> MetasEjecutivo(int numEmpleado);
        Task<DataTable> Gestiones(int numEmpleado);

        #endregion


        #region Acciones
        Task<bool> InsertQueja(Queja insertQueja);

        Task<string> InsertComments(AccionesComentarioRequest insertCommit);
        #endregion


        #region PreguntasRespuestas
        Task<List<PreguntasRespuestasInfo>> ValidatePreguntas_Respuestas();
        #endregion

        #region calculadora
        Task<DataTable> ObtienePlazos(int Cartera, string NoCuenta);
        Task<DataTable> ObtieneNegociaciones(int Cartera, string NoCuenta);
        Task<DataTable> ObtienePagos(int Cartera, string NoCuenta);
        Task<DataTable> ObtieneHerramientas(string NoCuenta);
        Task<DataTable> ObtieneProducto(string NoCuenta);
        Task<DataTable> ObtieneHerramientasCompletas();
        Task<DataTable> InfoCuenta(int Cartera, string NoCuenta);
        object CampoCalculado(string Expresión);
        List<OfrecimientosInfo> ConvertirDataTableALista(DataTable dt);
        List<HerramientasInfo> ConvertirDataTableALista_(DataTable dt);
        List<CalculosInfo> ConvertirDataTableAListaC(DataTable dt);
        Task<IEnumerable<OfrecimientoValidadores>> GuardaOfrecimientoStored(SaveOfrecimientoRequest ofrecimientoInfo);

        #endregion

        #region Ofrecer
        string ValidaOfrecer(OfrecerNegociacionRequest ofrecerInfo, int iMaxDias, DateTime fechaCorte, DateTime fechaAsignacion, bool PrimesLending, DataTable dtPagos);

        #endregion

        #region Conteo
        Task<int> ObtieneConteo(int idEjecutivo);
        #endregion


        #region Tiempos
        Task<ResultadoTiempos> ValidateTimes(int numEmpleado);
        Task<dynamic> ValidatePasswordEjecutivo(int idEjecutivo, string contrasenia);
        Task ChangeEjecutivoMode(int idEjecutivo, string modo);
        Task Pausa210(int idEjecutivo, int idValorCausa, TimeSpan tiempo);
        Task IncreaseEjecutivoTime(int idEjecutivo, TimeSpan tiempo, string causa);
        #endregion

        #region Recuperacion
        Task<IEnumerable<Negociacion>> Negociaciones(int idEjecutivo);
        Task<Recuperacion> RecuperacionActual(int idEjecutivo);
        Task<Recuperacion> RecuperacionAnterior(int idEjecutivo);
        Task<DataTable> GetSeguimientosEjecutivoAsync(int idEjecutivo);

        #endregion


        #region GuardaNegociacion
        Task<dynamic> Guarda_Plazos(EliminaGuardaPlazos PlazosInfo, Pago_ pago_, DateTime dtInicio, DateTime dtFin, int iNúmPago);
        Task<dynamic> Elimina_Plazos(EliminaGuardaPlazos PlazosInfo);
        Task<dynamic> IncrementaNegociacion(IncrementoNegociacion incrementaNegInfo);
        bool ValidaCorreo(string correoElectronico);
        #endregion

        #region Scripts
        Task<DataTable> ObtenerScriptsAsync(int idProducto);

        #endregion

        #region Cargo En Linea

        Task<dynamic> RegisterNewEstado(EstadoDeCuenta newEstadoDeCuenta);
        #endregion

        #region GestionTelefonica
        Task<GuardaGestionTelefonicaResult> GuardarGestionTelefonica(EndGestionRequest parametros);

        #endregion

        #region Datos
        int ObtenerIdCartera();
        string ObtenerIdCuenta();
        int ObtenerIdEjecutivo();
        string ObtenerNombreEjecutivo();
        Task<DataTable> ObtenerDatosEjecutivo(int idEjecutivo);
        #endregion
    }
    public class EjecutivoRepository : IEjecutivoRepository
    {

        private readonly IConfiguration _configuration;
        private readonly string _connectionString;

        public EjecutivoRepository(IConfiguration configuration)
        {
            _configuration = configuration;
            _connectionString = configuration.GetConnectionString("Piso2Amex");
        }
        public async Task<DataTable> GetSeguimientosEjecutivoAsync(int idEjecutivo)
        {
            DataTable recordatorios = new DataTable();
            string query = "SELECT * FROM fn_SeguimientosEjecutivo(@idEjecutivo)"; // Evita inyección SQL

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand(query, connection))
                {
                    command.Parameters.Add("@idEjecutivo", SqlDbType.Int).Value = idEjecutivo;

                    using (var adapter = new SqlDataAdapter(command))
                    {
                        adapter.Fill(recordatorios);
                    }
                }
            }

            return recordatorios;
        }

        #region Productividad

        public async Task<DataTable> VwCatalogos()
        {
            using var connection = GetConnection("Piso2Amex");

            string queryCatalogos = "SELECT * FROM vw_Catálogos ORDER BY idValor ASC";
            var catalogos = (await connection.QueryAsync<dynamic>(
                queryCatalogos,
                commandType: CommandType.Text
            ));

            return ConvertToDataTable(catalogos, "Catalogos");

        }
        public async Task<DataTable> VwRelaciones()
        {
            using var connection = GetConnection("Piso2Amex");

            string queryRelaciones = "SELECT * FROM vw_Relaciones";
            var relaciones = (await connection.QueryAsync<dynamic>(
                queryRelaciones,
                commandType: CommandType.Text
            ));

            return ConvertToDataTable(relaciones, "Relaciones");

        }
        public async Task<DataTable> TiemposEjecutivo(int numEmpleado)
        {
            using var connection = GetConnection("Piso2Amex");

            string queryTiempos = "[dbMemory].[PS].[TiemposEjecutivo]";

            var parametersT = new
            {
                idEjecutivo = numEmpleado
            };
            var tiempos = (await connection.QueryAsync<dynamic>(
                queryTiempos,
                parametersT,
                commandType: CommandType.StoredProcedure
            ));

            return ConvertToDataTable(tiempos, "Tiempos");

        }

        public async Task<DataTable> CuentasEjecutivo(int numEmpleado)
        {
            using var connection = GetConnection("Piso2Amex");

            string queryCuentas = "SELECT * FROM fn_GestionesTelDiaras(@idEjecutivo)";

            var parametersCuentas = new
            {
                idEjecutivo = numEmpleado
            };
            var cuentas = (await connection.QueryAsync<dynamic>(
                queryCuentas,
                parametersCuentas,
                commandType: CommandType.Text
            ));

            return ConvertToDataTable(cuentas, "Cuentas");
        }
        public async Task<DataTable> MetasEjecutivo(int numEmpleado)
        {
            using var connection = GetConnection("Piso2Amex");

            string querysMetas = "SELECT * FROM MetasEjecutivo WHERE idEjecutivo = @IdEjecutivo";

            var parameters = new
            {
                IdEjecutivo = numEmpleado
            };

            var metas = (await connection.QueryAsync<dynamic>(
                querysMetas,
                parameters,
                commandType: CommandType.Text
            ));

            return ConvertToDataTable(metas, "Metas");

        }
        public async Task<DataTable> Gestiones(int numEmpleado)
        {
            using var connection = GetConnection("Piso2Amex");

            string queryGestiones = "SELECT * FROM [dbo].[fn_GestionesTelDiaras](@idEjecutivo)";

            var parameters = new
            {
                idEjecutivo = numEmpleado
            };

            var productividad = (await connection.QueryAsync<dynamic>(
                queryGestiones,
                parameters,
                commandType: CommandType.Text
            ));

            return ConvertToDataTable(productividad, "Productividad");


        }

        #region ProductividadOld
        /*


        public async Task<dynamic> ValidateProductividad(int numEmpleado)
        {

            using var connection = GetConnection("Piso2Amex");
            //---------------------------------CargaCatalogos---------------------------------//
            DataTable dtCatalogos = new DataTable();
            _alNombreId = new ArrayList();
            string queryCatalogos = "SELECT * FROM vw_Catálogos";
            var catalogos = (await connection.QueryAsync<dynamic>(
                queryCatalogos,
                commandType: CommandType.Text
            ));
            dtCatalogos = ConvertToDataTable(catalogos, "Catalogos");

            _htValoresCatálogo = new Hashtable();
            _htNombreId = new Hashtable();
            foreach (DataRow rowCatalog in dtCatalogos.Rows)
            {
                _htValoresCatálogo.Add(rowCatalog["idValor"].ToString(), rowCatalog["Valor"].ToString());
                _htNombreId.Add(rowCatalog["idValor"].ToString(), rowCatalog["NombreId"].ToString());
                if (!_alNombreId.Contains(rowCatalog["NombreId"]))
                    _alNombreId.Add(rowCatalog["NombreId"]);
            }

            dtCatalogos.PrimaryKey = new DataColumn[] { dtCatalogos.Columns["idValor"] };

            dtCatalogos.TableName = "Catálogos";
            if (_dsTablas.Tables.Contains("Catálogos"))
            {
                _dsTablas.Relations.Remove("FK_CatálogosRelaciones1");
                _dsTablas.Tables.Remove("Catálogos");
            }

            _dsTablas.Tables.Add(dtCatalogos);
            //---------------------------------------Relaciones --------------------------------------------//
            DataTable dtRelaciones = new DataTable();

            string queryRelaciones = "SELECT * FROM vw_Relaciones";
            var relaciones = (await connection.QueryAsync<dynamic>(
                queryRelaciones,
                commandType: CommandType.Text
            ));
            dtRelaciones = ConvertToDataTable(relaciones, "Relaciones");
            // Crea llave primaria.
            dtRelaciones.PrimaryKey = new DataColumn[] { dtRelaciones.Columns["idValor1"], dtRelaciones.Columns["idValor2"] };

            dtRelaciones.TableName = "Relaciones";
            if (_dsTablas.Tables.Contains("Relaciones"))
                _dsTablas.Tables.Remove("Relaciones");

            _dsTablas.Tables.Add(dtRelaciones);

            _dsTablas.Relations.Add(
                "FK_CatálogosRelaciones1",
                _dsTablas.Tables["Catálogos"].Columns["idValor"],
                _dsTablas.Tables["Relaciones"].Columns["idValor1"],
                false);

            //------------------------------------Tiempos----------------------------------------------//
            string queryTiempos = "[dbMemory].[PS].[TiemposEjecutivo]";

            var parametersT = new
            {
                idEjecutivo = numEmpleado
            };
            var tiempos = (await connection.QueryAsync<dynamic>(
                queryTiempos,
                parametersT,
                commandType: CommandType.StoredProcedure
            ));

            Tiempos = ConvertToDataTable(tiempos, "Tiempos");

            foreach (string sColumna in _NombreColumnasConteos)
                if (Tiempos.Columns.Contains("Tiempo" + sColumna))
                    Tiempos.Rows[0]["Tiempo" + sColumna] = new TimeSpan(0);

            Tiempos.Rows.Add("Promedio");
            Tiempos.TableName = "Tiempos";
            _dsTablas.Tables.Add(Tiempos);
            //-----------------------------------------Metas-----------------------------------------------------//

            string querysMetas = "SELECT * FROM MetasEjecutivo WHERE idEjecutivo = " + numEmpleado;
            var metas = (await connection.QueryAsync<dynamic>(
                querysMetas,
                commandType: CommandType.Text
            ));
            Metas = ConvertToDataTable(metas, "Metas");
            Metas.TableName = "Metas";
            _dsTablas.Tables.Add(Metas);
            //----------------------------------------Gestiones-------------------------------------------------------//

            string queryProductividad = "SELECT * FROM [dbo].[fn_GestionesTelDiaras](@idEjecutivo)";

            var parameters = new
            {
                idEjecutivo = numEmpleado
            };

            var productividad = (await connection.QueryAsync<dynamic>(
                queryProductividad,
                parameters,
                commandType: CommandType.Text
            ));

            DataTable tblDelDía = ConvertToDataTable(productividad, "Productividad");

            // Crea tablas
            Cuentas = tblDelDía.Clone();
            GestionesEjecutivo = tblDelDía.Clone();
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

            // Crea llave primaria.
            Cuentas.PrimaryKey = new DataColumn[] { Cuentas.Columns["idCartera"], Cuentas.Columns["idCuenta"] };

            // Añade tablas al DataSet.
            Cuentas.TableName = "Cuentas";
            GestionesEjecutivo.TableName = "Gestiones";
            _dsTablas.Tables.Add(Cuentas);
            _dsTablas.Tables.Add(GestionesEjecutivo);

            // Crea relaciones entre tablas.
            _dsTablas.Relations.Add("FK_CuentasGestiones",
                new DataColumn[] { Cuentas.Columns["idCartera"], Cuentas.Columns["idCuenta"] },
                new DataColumn[] { GestionesEjecutivo.Columns["idCartera"], GestionesEjecutivo.Columns["idCuenta"] },
                false
            );

            // Llena tablas con información.
            foreach (DataRow fila in tblDelDía.Rows)
            {
                if (!Cuentas.Rows.Contains(new object[] { fila["idCartera"], fila["idCuenta"] }))
                    //Funciones.AddRowToTable(Cuentas, fila);
                    Cuentas.ImportRow(fila);
                GestionesEjecutivo.ImportRow(fila);
            }
            GestionesEjecutivo.Columns["idSituaciónGestión"].ColumnName = "idSituación";

            Cuentas.DefaultView.Sort = "Fecha_Insert DESC, Segundo_Insert DESC";

            ConteosGestiones();

            return Conteos;
        }


        public static void ConteosGestiones()
        {
            // Define tabla.
            //DataTable Conteos = new DataTable();
            Conteos = new DataTable();
            Conteos.Columns.Add("Negociaciones", typeof(int));
            Conteos.Columns.Add("Cuentas", typeof(int));
            foreach (string sColumna in _NombreColumnasConteos)
                Conteos.Columns.Add(sColumna, typeof(int));

            Conteos.Rows.Add();

            // Cuentas
            Conteos.Rows[0]["Cuentas"] = Cuentas.Rows.Count;
            CalculaTiempoPromedio("Cuentas");

            //Negociaciones
            Conteos.Rows[0]["Negociaciones"] = 0;

            //Gestiones
            Hashtable htContestaciones = Relaciones("Contactos", "Contactos", "No le conoce");
            foreach (DataRow Gestión in GestionesEjecutivo.Rows)
                ConteoGestión(Gestión, htContestaciones);

        }
        private static void CalculaTiempoPromedio(string Conteo)
        {
            if (!Conteos.Columns.Contains(Conteo) || !Tiempos.Columns.Contains("Tiempo" + Conteo)
                || Tiempos.Rows[0]["Tiempo" + Conteo].ToString() == "")
                return;

            double dConteo = Convert.ToInt32(Conteos.Rows[0][Conteo]);
            if (dConteo == 0)
                return;

            // 🔹 Convertir correctamente el valor a TimeSpan
            TimeSpan tiempoSpan;
            object tiempoValor = Tiempos.Rows[0]["Tiempo" + Conteo];

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
            Tiempos.Rows[1]["Tiempo" + Conteo] = new TimeSpan(Convert.ToInt64(lRowTicks / dConteo));
        }
        public static Hashtable Relaciones(string Catálogo1, string Catálogo2, params string[] Valor2)
        {

            Hashtable htRelaciones = new Hashtable();

            string sSelectValor2 = "";
            string sValores = "''";
            foreach (string sValor in Valor2)
                sValores += ",'" + sValor + "'";
            if (Valor2.Length > 0)
                sSelectValor2 = " AND Valor2 IN (" + sValores + ") ";

            DataRow[] drFilas = _dsTablas.Tables["Relaciones"].Select("Catálogo1 = '" + Catálogo1 + "' AND Catálogo2 = '" + Catálogo2 + "' " + sSelectValor2);
            foreach (DataRow fila in drFilas)
                htRelaciones.Add(fila["idValor1"].ToString(), fila["idValor2"].ToString());


            return htRelaciones;
        }
        public static string ConteoGestión(DataRow Gestión, Hashtable idContestaciones = null)
        {

            int[] iConteos = { 0, 0, 0, 0 };
            int iConteoAnterior = 0;
            string sIdContacto = Gestión["idContacto"].ToString();
            string sNombreColumna = "";

            if (idContestaciones == null)
                idContestaciones = Relaciones("Contactos", "Contactos", "No le conoce");

            // Contacto - Marcaciones
            iConteos[0] = sIdContacto == "1101" ? 1 : 0;  // #idCatálogo
            iConteos[1] = sIdContacto == "1102" ? 1 : 0;
            iConteos[2] = idContestaciones.ContainsKey(sIdContacto) ? 1 : 0;
            iConteos[3] = iConteos[0] + iConteos[1] + iConteos[2] == 0 ? 1 : 0;

            DataRow drFila = Conteos.Rows[0];

            for (int iCol = 0; iCol < iConteos.Length; iCol++)
            {
                iConteoAnterior = 0;
                int.TryParse(drFila[_NombreColumnasConteos[iCol]].ToString(), out iConteoAnterior);
                drFila[_NombreColumnasConteos[iCol]] = iConteoAnterior + iConteos[iCol];

                if (iConteos[iCol] > 0)
                {
                    sNombreColumna = _NombreColumnasConteos[iCol];

                    // Tíempos
                    //if (Tiempos != null && Tiempos.Rows.Count > 1 && Gestión["Duración"].ToString() != "")
                    //{
                    //    long lTicks = ((TimeSpan)Gestión["Duración"]).Ticks;
                    //    long lRowTicks = ((TimeSpan)Tiempos.Rows[0]["Tiempo" + sNombreColumna]).Ticks + lTicks;
                    //    Tiempos.Rows[0]["Tiempo" + sNombreColumna] = new TimeSpan(lRowTicks);
                    //    Tiempos.Rows[1]["Tiempo" + sNombreColumna] = new TimeSpan(Convert.ToInt64(lRowTicks / (double)(iConteoAnterior + iConteos[iCol])));
                    //}
                    if (Tiempos != null && Tiempos.Rows.Count > 1 && !string.IsNullOrEmpty(Gestión["Duración"].ToString()))
                    {
                        // 🔹 Convertir `Gestión["Duración"]` a `TimeSpan`
                        TimeSpan duracion = TimeSpan.Zero;
                        if (Gestión["Duración"] is TimeSpan)
                        {
                            duracion = (TimeSpan)Gestión["Duración"];  // ✅ Ya es TimeSpan
                        }
                        else if (TimeSpan.TryParse(Gestión["Duración"].ToString(), out TimeSpan parsedDuracion))
                        {
                            duracion = parsedDuracion;  // ✅ Convertido desde string
                        }
                        else
                        {
                            //return;  // ❌ Si no se puede convertir, salir del método
                        }

                        // 🔹 Convertir `Tiempos.Rows[0]["Tiempo" + sNombreColumna]` a `TimeSpan`
                        TimeSpan tiempoAnterior = TimeSpan.Zero;
                        object tiempoValor = Tiempos.Rows[0]["Tiempo" + sNombreColumna];

                        if (tiempoValor is TimeSpan)
                        {
                            tiempoAnterior = (TimeSpan)tiempoValor;  // ✅ Ya es TimeSpan
                        }
                        else if (TimeSpan.TryParse(tiempoValor.ToString(), out TimeSpan parsedTiempo))
                        {
                            tiempoAnterior = parsedTiempo;  // ✅ Convertido desde string
                        }
                        else
                        {
                            //return;  // ❌ Si no se puede convertir, salir del método
                        }

                        // 🔹 Calcular el nuevo tiempo
                        long lTicks = duracion.Ticks;
                        long lRowTicks = tiempoAnterior.Ticks + lTicks;

                        // 🔹 Asignar valores convertidos correctamente
                        Tiempos.Rows[0]["Tiempo" + sNombreColumna] = new TimeSpan(lRowTicks);
                        Tiempos.Rows[1]["Tiempo" + sNombreColumna] = new TimeSpan(Convert.ToInt64(lRowTicks / (double)(iConteoAnterior + iConteos[iCol])));
                    }



                }

            }

            // Tiempos
            return sNombreColumna;
        }

        */
        #endregion

        #endregion

        #region Preguntas_Respuestas
        public async Task<List<PreguntasRespuestasInfo>> ValidatePreguntas_Respuestas()
        {
            using var connection = GetConnection("Piso2Amex");
            string preg_resp_Query = "SELECT * FROM [dbCollection].[dbo].[vw_Flujo]";

            var preg_resp_list = await connection.QueryAsync<PreguntasRespuestasInfo>(
                preg_resp_Query,
                commandType: CommandType.Text);

            return preg_resp_list.ToList();

        }
        #endregion

        #region Calculadora-1raparte

        Hashtable _htProducto;
        public async Task<DataTable> ObtieneNegociaciones(int Cartera, string NoCuenta)
        {
            using var connection = GetConnection("Piso2Amex");
            string querysNegociaciones = "SELECT * FROM fn_OfrecimientosNegociaciones(@idCartera, @idCuenta)";
            var parameters = new
            {
                idCartera = Cartera,
                idCuenta = NoCuenta
            };

            var negociaciones = (await connection.QueryAsync<dynamic>(
                querysNegociaciones,
                parameters,
                commandType: CommandType.Text
             ));
            if (negociaciones != null && negociaciones.Any())
                return ConvertToDataTable(negociaciones, "Negociaciones");
            else
                return null;
        }


        public async Task<DataTable> ObtienePlazos(int Cartera, string NoCuenta)
        {
            using var connection = GetConnection("Piso2Amex");
            string querysPlazos = "SELECT * FROM fn_Plazos(@idCartera, @idCuenta)";
            var parameters = new
            {
                idCartera = Cartera,
                idCuenta = NoCuenta
            };

            var plazos = (await connection.QueryAsync<dynamic>(
                querysPlazos,
                parameters,
                commandType: CommandType.Text
             ));

            if (plazos != null && plazos.Any())
                return ConvertToDataTable(plazos, "Plazos");
            else
                return null;
        }
        public async Task<DataTable> ObtienePagos(int Cartera, string NoCuenta)
        {
            using var connection = GetConnection("Piso2Amex");
            string queryPagos = "SELECT * FROM fn_Pagos(@idCartera, @idCuenta) ";

            var parameters = new
            {
                idCartera = Cartera,
                idCuenta = NoCuenta
            };

            var pagos = (await connection.QueryAsync<dynamic>(
                queryPagos,
                parameters,
                commandType: CommandType.Text
             ));
            if (pagos != null && pagos.Any())
                return ConvertToDataTable(pagos, "Pagos");
            else
                return null;

        }
        public async Task<DataTable> ObtieneHerramientas(string NoCuenta)
        {
            using var connection = GetConnection("Piso2Amex");
            string queryHerramientas = "SELECT * FROM dbo.fn_AMEX_Herramientas(@idCuenta)";

            var parameters = new
            {
                idCuenta = NoCuenta
            };

            var herramientas = (await connection.QueryAsync<dynamic>(
                queryHerramientas,
                parameters,
                commandType: CommandType.Text
             ));
            return ConvertToDataTable(herramientas, "Herramientas");

        }
        public async Task<DataTable> ObtieneHerramientasCompletas()
        {
            using var connection = GetConnection("Piso2Amex");
            string queryHerramientasC = "SELECT * FROM Herramientas (NOLOCK) WHERE Activa = 1 ";

            var herramientasC = (await connection.QueryAsync<dynamic>(
                queryHerramientasC,
                commandType: CommandType.Text
             ));
            return ConvertToDataTable(herramientasC, "HerramientasCompletas");
        }
        public async Task<DataTable> ObtieneProducto(string NoCuenta)
        {
            using var connection = GetConnection("Piso2Amex");
            string queryProducto = "select * from dbCollection.y.Producto_1 where idcuenta = @idCuenta";

            var parameters = new
            {
                idCuenta = NoCuenta
            };

            var producto = (await connection.QueryAsync<dynamic>(
                queryProducto,
                parameters,
                commandType: CommandType.Text
             ));
            _htProducto = ConvertirDataTableAHashtable(ConvertToDataTable(producto, "Producto"));
            return ConvertToDataTable(producto, "Producto");
        }

        public async Task<DataTable> InfoCuenta(int Cartera, string NoCuenta)
        {
            using var connection = GetConnection("Piso2Amex");
            string queryInfoCuenta = "WAITFOR DELAY '00:00:00';SELECT TOP 1 * FROM vw_CuentaActiva WHERE idCartera = @idCartera AND idCuenta = @idCuenta ";

            var parameters = new
            {
                idCuenta = NoCuenta,
                idCartera = Cartera
            };

            var InfoCuenta = (await connection.QueryAsync<dynamic>(
                queryInfoCuenta,
                parameters,
                commandType: CommandType.Text
             ));
            return ConvertToDataTable(InfoCuenta, "InfoCuenta");
        }

        public async Task<IEnumerable<OfrecimientoValidadores>> GuardaOfrecimientoStored(SaveOfrecimientoRequest ofrecimientoInfo)
        {
            using var connection = GetConnection("Piso2Amex");
            string queryOfrecimiento = "[dbo].[3.1.GuardaOfrecimiento]";

            var parameters = new
            {
                idCartera = ofrecimientoInfo.IdCartera,
                idCuenta = ofrecimientoInfo.IdCuenta,
                idProducto = ofrecimientoInfo.IdProducto,
                idEjecutivo = ofrecimientoInfo.IdEjecutivo,

                idHerramienta = ofrecimientoInfo.IdHerramienta,
                MontoRequerido = ofrecimientoInfo.MontoRequerido,
                Descuento = ofrecimientoInfo.Descuento,
                Saldo = ofrecimientoInfo.Saldo,
                FechaCorte = ofrecimientoInfo.FechaCorte,

                Fecha_Insert = ofrecimientoInfo.FechaInsert,
                Segundo_Insert = ofrecimientoInfo.SegundoInsert,

                MontoOfrecido = ofrecimientoInfo.MontoNegociado,
                Plazos = ofrecimientoInfo.Plazos.Length,

            };

            var result = await connection.QueryAsync<OfrecimientoValidadores>(
                queryOfrecimiento,
                parameters,
                commandType: CommandType.StoredProcedure
            );

            return result;
        }

        public object CampoCalculado(string Expresión)
        {

            string[] sCampos = Expresión.Split(new char[] { '[', ']' }, StringSplitOptions.RemoveEmptyEntries);
            string sResult = Expresión;

            for (int i = 0; i < sCampos.Length; i++)
            {
                if (_htProducto[sCampos[i]] != null)
                    sResult = sResult.Replace("[" + sCampos[i] + "]", _htProducto[sCampos[i]].ToString().Trim());
            }

            if (Expresión.StartsWith('#'))
                return EvaluateDate(sResult.Replace("#", ""));

            else if (sCampos.Length > 1 && (Expresión.Contains('+') || Expresión.Contains('-') || Expresión.Contains('*') || Expresión.Contains('/') || Expresión.Contains('^')))
                return Evaluate(sResult);

            return sResult;
        }
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

        #endregion

        #region Ofrecer
        public string ValidaOfrecer(OfrecerNegociacionRequest ofrecerInfo, int iMaxDias, DateTime fechaCorte, DateTime fechaAsignacion, bool PrimesLending, DataTable dtPagos)
        {
            string mensaje = "";

            if (ofrecerInfo.MontoNegociado == 0)
            {
                mensaje = "Agregue pagos para calcular el Monto Negociado.";
                return mensaje;
            }
            int iDías = Convert.ToInt16(EvaluateDate(ofrecerInfo.Plazos[ofrecerInfo.Plazos.Length - 1].Fecha.ToShortDateString()
                + " - "
                + ((ofrecerInfo.idHerramienta == 141 || ofrecerInfo.Plazos.Length == 1) ? DateTime.Today.ToShortDateString() : ofrecerInfo.Plazos[0].Fecha.ToShortDateString())));

            if (iDías > iMaxDias)
            {
                mensaje = "La negociación se debe cumplir antes de " + iMaxDias + " días";
                return mensaje;
            }
            if (ofrecerInfo.idHerramienta == 139 && ofrecerInfo.Plazos.Length == 1)
            {
                mensaje = "Debe de ingresar al menos dos pagos para esta herramienta.";
                return mensaje;
            }
            //Bloqueo Parcial ajuste
            if (ofrecerInfo.idHerramienta == 142)
            {
                int DíasRes = 3, DíasSum = 2;
                DateTime FechaCorte = new DateTime(DateTime.Today.Year, DateTime.Today.Month, fechaCorte.Day);

                for (int i = 1; i <= DíasSum; i++)
                    if (FechaCorte.AddDays(i).DayOfWeek == DayOfWeek.Sunday || FechaCorte.AddDays(i).DayOfWeek == DayOfWeek.Saturday)
                        DíasSum++;

                for (int i = 1; i <= DíasRes; i++)
                    if (FechaCorte.AddDays(-i).DayOfWeek == DayOfWeek.Sunday || FechaCorte.AddDays(-i).DayOfWeek == DayOfWeek.Saturday)
                        DíasRes++;

                if (ofrecerInfo.Plazos[0].Fecha >= FechaCorte.AddDays(-DíasRes) && ofrecerInfo.Plazos[0].Fecha <= FechaCorte.AddDays(DíasSum))
                {
                    mensaje = "El primer pago no puede ser cercano al corte.";
                    return mensaje;
                }

            }
            //Bloqueo Oasis
            if (ofrecerInfo.idHerramienta == 140)
            {

                double dSumaPagos = 0;

                if (dtPagos != null)
                    double.TryParse(dtPagos.Compute("SUM (MontoPago)", " Reportado = '' AND  FechaPago >= '" + fechaAsignacion.ToShortDateString() + "'").ToString(), out dSumaPagos);

                if (ofrecerInfo.idHerramienta == 140 && ofrecerInfo.MontoNegociado + dSumaPagos < 12000)
                {
                    mensaje = "El monto total recuperado para esta herramienta debe de ser mayor o igual a $12,000.00";
                    return mensaje;
                }
            }
            if (ofrecerInfo.idHerramienta == 136 || ofrecerInfo.idHerramienta == 144)
            {
                if (Math.Round((100 - (ofrecerInfo.MontoNegociado / ofrecerInfo.saldo) * 100), 2) <= 0)
                {
                    mensaje = "No se permite 0% de descuento. Verifique la herramienta.";
                    return mensaje;
                }

                if (Math.Round(ofrecerInfo.MontoNegociado, 2) < Math.Round((float)ofrecerInfo.saldo * (1 - ofrecerInfo.descuento / (float)100), 2))
                {
                    mensaje = "El Monto Negociado debe ser MAYOR que el Monto Requerido.";
                    return mensaje;
                }

                if (Math.Round((100 - (ofrecerInfo.MontoNegociado / ofrecerInfo.saldo) * 100), 2) > ofrecerInfo.maxDescuento)
                {
                    mensaje = "El descuento introducido supera el máximo permitido (" + ofrecerInfo.maxDescuento + " %).";
                    return mensaje;
                }
                if (!(PrimesLending))
                {
                    ofrecerInfo.MontoRequerido = Math.Round((float)ofrecerInfo.saldo * (1 - ofrecerInfo.descuento / (float)100), 2);
                    ofrecerInfo.descuento = Math.Round((100 - (ofrecerInfo.MontoNegociado / ofrecerInfo.saldo) * 100), 2);
                }
            }
            if (mensaje == "")
                mensaje = "No hay problema";

            return mensaje;
        }

        #endregion

        #region Conteo
        public async Task<int> ObtieneConteo(int idEjecutivo)
        {
            int Conteo;
            using var connection = GetConnection("Piso2Amex");
            string queryInfoConteo = "select Cuentas from [dbo].[MetasEjecutivo] where idEjecutivo = @idEjecutivo";

            var parameters = new
            {
                idEjecutivo = idEjecutivo
            };

            var InfoConteo = (await connection.QueryAsync<int>(
                queryInfoConteo,
                parameters,
                commandType: CommandType.Text
            ));
            return InfoConteo.FirstOrDefault();
        }



        #endregion

        #region GuardaEliminaPlazos

        public async Task<dynamic> Elimina_Plazos(EliminaGuardaPlazos PlazosInfo)
        {
            using var connection = GetConnection("Piso2Amex");
            string eliminaPlazosQuery = "DELETE Insert_Plazos WHERE idCartera = @idCartera AND idCuenta = @idCuenta AND Fecha_Insert = @Fecha_Insert AND Segundo_Insert = @Segundo_Insert";
            var parameters = new
            {
                idCartera = PlazosInfo.IdCartera,
                idCuenta = PlazosInfo.IdCuenta,
                Fecha_Insert = PlazosInfo.FechaInsert,
                Segundo_Insert = PlazosInfo.Segundo_Insert
            };
            var resultadoEliminaPlazos = await connection.ExecuteAsync(
                eliminaPlazosQuery,
                parameters,
                commandType: CommandType.Text
            );
            return resultadoEliminaPlazos;
        }

        public async Task<dynamic> Guarda_Plazos(EliminaGuardaPlazos PlazosInfo, Pago_ pago_, DateTime dtInicio, DateTime dtFin, int iNúmPago)
        {
            using var connection = GetConnection("Piso2Amex");

            string guardaPlazosQuery = "INSERT INTO Insert_Plazos ( idCartera, idCuenta, Fecha_Insert, Segundo_Insert, FechaPago, MontoPago, FechaInicioPlazo, FechaFinPlazo, Ordinal ) VALUES ( " +
                        "@idCartera, " +
                        "@idCuenta, " +
                        "@Fecha_Insert, " +
                        "@Segundo_Insert, " +

                        "@FechaPago, " +
                        "@MontoPago, " +

                        "@FechaInicioPlazo, " +
                        "@FechaFinPlazo, " +

                        "@Ordinal )";
            var parameters = new
            {
                idCartera = PlazosInfo.IdCartera,
                idCuenta = PlazosInfo.IdCuenta,
                Fecha_Insert = PlazosInfo.FechaInsert,
                Segundo_Insert = PlazosInfo.Segundo_Insert,
                FechaPago = pago_.Fecha,
                MontoPago = pago_.Monto,
                FechaInicioPlazo = dtInicio,
                FechaFinPlazo = dtFin,
                Ordinal = iNúmPago
            };
            var resultadoInsertaPlazos = await connection.ExecuteAsync(
                guardaPlazosQuery,
                parameters,
                commandType: CommandType.Text
            );

            return resultadoInsertaPlazos;
        }

        //public async Task<dynamic> Guarda_Negociacion_Plazos(GuardaNegociacionPlazos negociacionInfo)
        //{
        //    using var connection = GetConnection("Piso2Amex");

        //    string guardaNegociacionQuery = "[3.2.GuardaNegociaciónPlazos] " +
        //        "@idCartera, " +
        //        "@idCuenta, " +

        //        "@idEjecutivo, " +

        //        "@idHerramienta, " +
        //        "@MontoNegociado, " +
        //        "@Plazos, " +
        //        "@CartaConvenio," +
        //        "@Correo," +
        //        "@FechaPago," +
        //        "@FechaFinNegociación," +

        //        "@idEjecutivoValidador," +
        //        "@Contraseña," +

        //       "@Fecha_Insert," +
        //       "@Segundo_Insert," +
        //       "@Reestructura," +
        //       "@Condonacion," +
        //       "@idGrabacion";

        //    var parameters = new
        //    {
        //        idCartera = negociacionInfo.idCartera,
        //        idCuenta = negociacionInfo.idCuenta,
        //        idEjecutivo = negociacionInfo.idEjecutivo,
        //        idHerramienta = negociacionInfo.idHerramienta,
        //        MontoNegociado = negociacionInfo.MontoNegociado,
        //        Plazos = negociacionInfo.Plazos,
        //        CartaConvenio = negociacionInfo.CartaConvenio,
        //        Correo = negociacionInfo.Correo,
        //        FechaPago = negociacionInfo.FechaPago,
        //        FechaFinNegociación = negociacionInfo.FechaFinNegociación,
        //        idEjecutivoValidador = negociacionInfo.idEjecutivoValidador,
        //        Contraseña = negociacionInfo.Contrasena,
        //        Fecha_Insert = negociacionInfo.Fecha_Insert,
        //        Segundo_Insert = negociacionInfo.Segundo_Insert,
        //        Reestructura = negociacionInfo.Reestructura,
        //        Condonacion = negociacionInfo.Condonacion,
        //        idGrabacion = negociacionInfo.idGrabacion

        //    };
        //    var resultadoGuardaNeg = await connection.QueryFirstOrDefaultAsync<dynamic>(
        //        guardaNegociacionQuery,
        //        parameters,
        //        commandType: CommandType.StoredProcedure
        //    );

        //    return resultadoGuardaNeg;

        //}

        public async Task<dynamic> IncrementaNegociacion(IncrementoNegociacion incrementaNegInfo)
        {
            using var connection = GetConnection("Piso2Amex");

            string incrementaNegQuery = "[dbMemory].PS.IncrementaNegociación";

            var parameters = new
            {
                idEjecutivo = incrementaNegInfo.idEjecutivo,
                Monto = incrementaNegInfo.Monto,
                Saldo = incrementaNegInfo.Saldo,
                Duración = incrementaNegInfo.Duracion
            };
            var resultadoIncrementaNeg = await connection.QueryFirstOrDefaultAsync<ResultIncrementaNeg>(
                incrementaNegQuery,
                parameters,
                commandType: CommandType.StoredProcedure
            );

            return resultadoIncrementaNeg;
        }



        #endregion

        #region Tiempos
        public async Task<ResultadoTiempos> ValidateTimes(int numEmpleado)
        {
            using var connection = GetConnection("Piso2Amex");

            string queryTimes = "[dbMemory].[PS].[TiemposEjecutivo]";

            var parameters = new
            {
                idEjecutivo = numEmpleado,
            };

            var times = await connection.QueryFirstOrDefaultAsync<ResultadoTiempos>(
                queryTimes,
                parameters,
                commandType: CommandType.StoredProcedure

            );

            return times;//pruebas

        }

        public async Task<dynamic> ValidatePasswordEjecutivo(int idEjecutivo, string contrasenia)
        {
            using var connection = GetConnection("Piso2Amex");

            string queryPass = "[dbMemory].[PS].[ValidaContraseñaEjecutivo]";

            var parameters = new
            {
                idEjecutivo = idEjecutivo,
                Contraseña = contrasenia,
            };

            var passwordValidate = await connection.ExecuteScalarAsync(
                queryPass,
                parameters,
                commandType: CommandType.StoredProcedure

            );

            return passwordValidate;
        }

        public async Task ChangeEjecutivoMode(int idEjecutivo, string modo)
        {
            using var connection = GetConnection("Piso2Amex");

            string queryPass = "[dbMemory].[PS].[ModoEjecutivo]";

            var parameters = new
            {
                idEjecutivo = idEjecutivo,
                Modo = modo,
            };

            var mode = await connection.ExecuteAsync(
                queryPass,
                parameters,
                commandType: CommandType.StoredProcedure

            );
        }


        public async Task Pausa210(int idEjecutivo, int idValorCausa, TimeSpan tiempo)
        {
            using var connection = GetConnection("Piso2Amex");

            string queryPass = "[dbCollection].[dbo].[2.10.Pausa]";

            var parameters = new
            {
                idEjecutivo = idEjecutivo,
                idPausa = idValorCausa,
                Duración = tiempo,
            };

            var pausa = await connection.ExecuteAsync(
                queryPass,
                parameters,
                commandType: CommandType.StoredProcedure

            );
        }

        public async Task IncreaseEjecutivoTime(int idEjecutivo, TimeSpan tiempo, string causa)
        {
            using var connection = GetConnection("Piso2Amex");

            string queryPass = "[dbMemory].[PS].[IncrementaTiempo]";

            var parameters = new
            {
                idEjecutivo = idEjecutivo,
                Duración = tiempo,
                Causa = causa
            };

            await connection.ExecuteAsync(
                queryPass,
                parameters,
                commandType: CommandType.StoredProcedure

            );

        }


        #region Acciones
        public async Task<bool> InsertQueja(Queja insertQueja)
        {
            using var connection = GetConnection("Piso2Amex");

            string query = @"INSERT INTO dbo.Quejas (idCartera, idCuenta, Fecha_Insert, Segundo_Insert, Folio, idEjecutivo_Insert, 
                                                                            idQueja, idInstitución, Solicitante, LlamadaEntrada, NúmeroTelefónico, CorreoElectrónico, 
                                                                            idDomicilio, Comentario, NúmeroTelefónico_Contacto, CorreoElectrónico_Contacto) 
                                                                VALUES(@idCartera ,@idCuenta ,@Fecha_Insert ,@Segundo_Insert ,@Folio ,@idEjecutivo_Insert ,
                                                                             @idQueja ,@idInstitución ,@Solicitante ,@LlamadaEntrada ,@NúmeroTelefónico ,@CorreoElectrónico ,
                                                                             @idDomicilio ,@Comentario ,@TeléfonoContacto ,@CorreoContacto)";

            var parameters = new
            {
                idCartera = insertQueja.IdCartera,
                idCuenta = insertQueja.IdCuenta,
                Fecha_Insert = insertQueja.FechaInsert,
                Segundo_Insert = insertQueja.SegundoInsert,
                Folio = insertQueja.Folio,
                idEjecutivo_Insert = insertQueja.IdEjecutivoInsert,
                idQueja = insertQueja.IdQueja,
                idInstitución = insertQueja.IdInstitucion,
                Solicitante = insertQueja.Solicitante,
                LlamadaEntrada = insertQueja.LlamadaEntrada,
                NúmeroTelefónico = insertQueja.NumeroTelefonico,
                CorreoElectrónico = insertQueja.CorreoElectronico,
                idDomicilio = insertQueja.IdDomicilio,
                Comentario = insertQueja.Comentario,
                TeléfonoContacto = insertQueja.NumeroTelefonicoContacto,
                CorreoContacto = insertQueja.CorreoElectronicoContacto
            };


            int filasAfectadas = await connection.ExecuteAsync(query, parameters, commandType: CommandType.Text);

            return filasAfectadas > 0;
        }

        public async Task<string> InsertComments(AccionesComentarioRequest insertCommit)
        {
            using var connection = GetConnection("Piso2Amex");

            string query = "[dbCollection].[dbo].[2.13.InsertaComentario]";

            var parameters = new
            {
                idCartera = insertCommit.IdCartera,
                idCuenta = insertCommit.IdCuenta,
                idEjecutivo = insertCommit.IdEjecutivo,
                Comentario = insertCommit.Comentario,
                ModificaSituación = insertCommit.ModificaSituacion,

            };

            var filasAfectadas = await connection.ExecuteScalarAsync<dynamic>(
                query,
                parameters,
                commandType: CommandType.StoredProcedure);

            //int filasAfectadas = await connection.ExecuteAsync(query, parameters, commandType: CommandType.StoredProcedure);

            return Convert.ToString(filasAfectadas);
        }

        #endregion




        #endregion

        #region Scripts

        public async Task<DataTable> ObtenerScriptsAsync(int idProducto)
        {
            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            string query = "SELECT * FROM Scripts (NOLOCK) WHERE idProducto = @idProducto";

            var scripts = new DataTable();
            using var command = new SqlCommand(query, connection);
            command.Parameters.AddWithValue("@idProducto", idProducto);

            using var adapter = new SqlDataAdapter(command);
            adapter.Fill(scripts);

            return scripts;
        }



        #endregion

        #region NegociacionesRecuperacion

        public async Task<IEnumerable<Negociacion>> Negociaciones(int idEjecutivo)
        {
            using var connection = GetConnection("Piso2Amex");

            var query = @"
                SELECT
                    idCartera, idCuenta, Herramienta, idEstado,
                    FechaCreación AS FechaCreacion, FechaTérmino AS FechaTermino,
                    MontoNegociado, MontoPagado, Pagos,
                    _CartaConvenio AS CartaConvenio, MesActual
                FROM fn_NegociacionesEjecutivo(@idEjecutivo)";

            return await connection.QueryAsync<Negociacion>(query, new { idEjecutivo });
        }

        public async Task<Recuperacion> RecuperacionActual(int idEjecutivo)
        {
            using var connection = GetConnection("Piso2Amex");

            string queryFunction = "SELECT * FROM fn_RecuperacionActualEjecutivo(@idEjecutivo)";
            var parameters = new { idEjecutivo = idEjecutivo };
            var actualResult = await connection.QueryFirstOrDefaultAsync<Recuperacion>(queryFunction, parameters);

            return actualResult;
        }
        public async Task<Recuperacion> RecuperacionAnterior(int idEjecutivo)
        {
            using var connection = GetConnection("Piso2Amex");

            string queryFunction = "SELECT * FROM fn_RecuperaciónEjecutivo(@idEjecutivo)";
            var parameters = new { idEjecutivo = idEjecutivo };
            var previousResult = await connection.QueryFirstOrDefaultAsync<Recuperacion>(queryFunction, parameters);

            return previousResult;
        }
        #endregion

        #region Cargos en linea

        #endregion

        #region Estado de cuenta
        public async Task<dynamic> RegisterNewEstado(EstadoDeCuenta newEstadoDeCuenta)
        {
            try
            {
                using var connection = GetConnection("Piso2Amex");

                string newPhoneQuery = "[dbCollection].[dbo].[2.14.SolicitaEstadoCuenta]";
                var parameters = new
                {
                    IdCartera = newEstadoDeCuenta.idCartera,
                    IdCuenta = newEstadoDeCuenta.idCuenta,
                    IdEjecutivo = newEstadoDeCuenta.idEjecutivo,
                    fechaInicial = newEstadoDeCuenta.FechaInicial,
                    fechaFinal = newEstadoDeCuenta.FechaFinal,
                    consulta = newEstadoDeCuenta.Consulta,
                    correoElectronico = newEstadoDeCuenta.CorreoElectrónico
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
            catch (Exception ex)
            {
                // Manejo de la excepción (por ejemplo, registrar el error)
                Console.WriteLine($"Error en RegisterNewEstado: {ex.Message}");
                return new { Success = false, Message = $"Error: {ex.Message}" };
            }
        }
        #endregion

        #region EnviarCorreo

        #endregion

        private static DataTable ConvertToDataTable(IEnumerable<dynamic> data, string tableName)
        {
            DataTable table = new DataTable(tableName);

            if (!data.Any())
                return table; // Retorna tabla vacía si no hay datos

            // 🔹 Crear columnas en el DataTable a partir de las claves del primer elemento
            foreach (var key in ((IDictionary<string, object>)data.First()).Keys)
            {
                table.Columns.Add(key);
            }

            // 🔹 Agregar las filas al DataTable
            foreach (var item in data)
            {
                var row = table.NewRow();
                foreach (var key in ((IDictionary<string, object>)item).Keys)
                {
                    row[key] = ((IDictionary<string, object>)item)[key] ?? DBNull.Value;
                }
                table.Rows.Add(row);
            }

            return table;
        }
        public Hashtable ConvertirDataTableAHashtable(DataTable dt)
        {
            Hashtable ht = new Hashtable();

            if (dt.Rows.Count > 0)
            {
                DataRow row = dt.Rows[0]; // Tomamos la primera fila

                foreach (DataColumn col in dt.Columns)
                {
                    ht[col.ColumnName] = row[col];
                }
            }

            return ht;
        }
        public List<OfrecimientosInfo> ConvertirDataTableALista(DataTable dt)
        {
            if (dt.Rows.Count > 0)
            {
                return dt.AsEnumerable().Select(row => new OfrecimientosInfo
                {
                    Fecha_Insert = Convert.ToString(row.Field<DateTime>("Fecha_Insert")),
                    Segundo_Insert = row.Field<string>("Segundo_Insert"),
                    Herramienta = row.Field<string>("Herramienta"),
                    idEstado = row.Field<string>("idEstado"),
                    Vencimiento = row.Field<string>("Vencimiento"),
                    SaldoInterés = Convert.ToString(row.Field<Decimal>("SaldoInterés")),
                    Descuento = Convert.ToString(row.Field<Decimal>("Descuento")),
                    Requerido = Convert.ToString(row.Field<Decimal>("MontoRequerido")),
                    Negociado = Convert.ToString(row.Field<Decimal>("MontoNegociado")),
                    Pagado = Convert.ToString(row.Field<Decimal>("MontoPagado")),
                    Plazos = Convert.ToString(row.Field<int>("Plazos")),
                    Ofrecio = row.Field<string>("Ofreció"),
                    Valido = row.Field<string>("Validó"),
                    CartaConvenio = Convert.ToString(row.Field<bool>("_CartaConvenio")),
                    Interes = Convert.ToString(row.Field<Decimal>("SaldoInterés")),
                    Remanente = Convert.ToString(row.Field<Decimal>("Remanente"))
                }).ToList();
            }
            else
                return null;
        }
        public List<HerramientasInfo> ConvertirDataTableALista_(DataTable dt)
        {
            return dt.AsEnumerable().Select(row => new HerramientasInfo
            {
                idHerramienta = row.Field<int>("idHerramienta"),
                Nombre = row.Field<string>("Nombre")
            }).ToList();
        }
        public List<CalculosInfo> ConvertirDataTableAListaC(DataTable dt)
        {
            return dt.AsEnumerable().Select(row => new CalculosInfo
            {
                No = row.Field<int>("No"),
                Fecha = row.Field<DateTime>("Fecha"),
                saldo = row.Field<double>("saldo"),
                pago = row.Field<double>("pago"),
                SaldoFinal = row.Field<double>("SaldoFinal")
            }).ToList();

        }
        public bool ValidaCorreo(string correoElectronico)
        {
            string validEmailPattern =
                @"^(?!\.)(""([^""\r\\]|\\[""\r\\])*""|"
                + @"([-a-z0-9!#$%&'*+/=?^_`{|}~]|(?<!\.)\.)*)(?<!\.)"
                + @"@[-a-z0-9][\w\.-]*[a-z0-9]\.[a-z][a-z\.]*[a-z]$";

            Regex ValidEmailRegex = new Regex(validEmailPattern, RegexOptions.IgnoreCase);
            return ValidEmailRegex.IsMatch(correoElectronico);
        }

        #region Datos
        public int ObtenerIdCartera()
        {

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SqlCommand command = new SqlCommand("SELECT idCartera FROM [dbCollection].[dbo].[Cuentas] WHERE idCuenta = @idCuenta", connection); // Reemplaza ... con tu lógica
                return (int)command.ExecuteScalar();
            }
        }

        public string ObtenerIdCuenta()
        {

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SqlCommand command = new SqlCommand("select * from CorreosEnviados where idCuenta = @idCuenta", connection); // Reemplaza ... con tu lógica
                return command.ExecuteScalar().ToString();
            }
        }

        public int ObtenerIdEjecutivo()
        {

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SqlCommand command = new SqlCommand("SELECT idEjecutivo FROM [dbCollection].[dbo].[Ejecutivos] WHERE idEjecutivo = @idEjecutivo ", connection); // Reemplaza ... con tu lógica
                return (int)command.ExecuteScalar();
            }
        }

        public string ObtenerNombreEjecutivo()
        {

            using (SqlConnection connection = new SqlConnection(_connectionString))
            {
                connection.Open();
                SqlCommand command = new SqlCommand("SELECT NombreEjecutivo FROM [dbCollection].[dbo].[Ejecutivos] WHERE NombreEjecutivo = @NombreEjecutivo", connection); // Reemplaza ... con tu lógica
                return command.ExecuteScalar().ToString();
            }
        }

        public async Task<DataTable> ObtenerDatosEjecutivo(int idEjecutivo)
        {
            string query = @"
                SELECT TOP 1
                E.idEjecutivo,
                E.idEncargado,
                E.Usuario,
                E.idCartera,
	            S.NombreEjecutivo Encargado,
	            E.NombreEjecutivo NombreEjecutivo,
	            E.idSucursal,
	            E.Jerarquía,
	            E.idÁrea,
	            M.Segmento
	            FROM dbCollection..Ejecutivos E
				            LEFT JOIN dbCollection..Ejecutivos S ON S.idEjecutivo = E.idEncargado
				            LEFT JOIN dbCollection..MetasEjecutivo M ON E.idEjecutivo = M.idEjecutivo
	            WHERE E.idEjecutivo = @idEjecutivo";

            using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            using var command = new SqlCommand(query, connection);
            command.Parameters.AddWithValue("@idEjecutivo", idEjecutivo);

            var table = new DataTable();
            using var adapter = new SqlDataAdapter(command);
            adapter.Fill(table);

            return table;

        }


        #endregion

        #region GestionTelefonica
        public async Task<GuardaGestionTelefonicaResult> GuardarGestionTelefonica(EndGestionRequest parametros)
        {
            using var connection = GetConnection("Piso2Amex");

            string storedGestion = "[dbo].[2.1.GuardaGestionTelefonica]";
            var gestionParameters = new
            {
                idCartera = parametros.IdCartera,
                idCuenta = parametros.IdCuenta,
                idEjecutivo = parametros.IdEjecutivo,
                idContacto = parametros.IdContacto,
                idSituación = parametros.IdSituacion,
                idCausaNoPago = parametros.IdCausaNoPago,
                idParentesco = parametros.IdParentesco,
                idSucursal = parametros.IdSucursal,
                Extensión = parametros.Extension,
                NombreContacto = parametros.NombreContacto,
                CodificaciónCartera = parametros.CodificacionCartera,
                NúmeroTelefónico = parametros.NumeroTelefonico,
                Duración = parametros.Duracion,
                idModo = parametros.IdModo,
                idAcercamiento = parametros.IdAcercamiento,
                Comentario = parametros.Comentario,
                TiempoEnCuenta = parametros.TiempoEnCuenta,
                Fechavici = parametros.Fechavici,
                Nivel = parametros.Nivel,
                Situacion = parametros.Situacion,
                Productos = parametros.Productos,
                Producto = parametros.Producto,
                NumeroCliente = parametros.NumeroCliente,
                Billing = parametros.Billing,
                Contacto = parametros.Contacto,
                Situaciones = parametros.Situaciones
            };
            var guardaGestionResult = await connection.QueryFirstOrDefaultAsync<GuardaGestionTelefonicaResult>(storedGestion, gestionParameters, commandType: CommandType.StoredProcedure
);

            return guardaGestionResult;

        }

        #endregion


        private SqlConnection GetConnection(string connection)
        {
            return new SqlConnection(_configuration.GetConnectionString(connection));
        }

    }
}
