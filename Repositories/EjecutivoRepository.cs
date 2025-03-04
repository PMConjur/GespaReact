﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System.Linq;
using NoriAPI.Models.Ejecutivo;

namespace NoriAPI.Repositories
{
    public interface IEjecutivoRepository
    {
        #region Productividad
        Task<DataTable> VwCatalogos();
        Task<DataTable> VwRelaciones();
        Task<DataTable> TiemposEjecutivo(int numEmpleado);
        Task<DataTable> MetasEjecutivo(int numEmpleado);
        Task<DataTable> Gestiones(int numEmpleado);
        #endregion

        #region PreguntasRespuestas
        Task<List<Preguntas_Respuestas_info>> ValidatePreguntas_Respuestas();
        #endregion

        #region calculadora
        Task<DataTable> ObtienePlazos(int Cartera, string NoCuenta);
        Task<DataTable> ObtieneNegociaciones(int Cartera, string NoCuenta);
        Task<DataTable> ObtienePagos(int Cartera, string NoCuenta);
        Task<DataTable> ObtieneHerramientas(string NoCuenta);
        Task<DataTable> ObtieneProducto(string NoCuenta);
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

            string queryCatalogos = "SELECT * FROM vw_Catálogos";
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
        public async Task<List<Preguntas_Respuestas_info>> ValidatePreguntas_Respuestas()
        {
            using var connection = GetConnection("Piso2Amex");
            string preg_resp_Query = "select FP.[idPregunta],\r\n" +
                "FP.[Pregunta],\r\n" +
                "FR.[idRespuesta],\r\n" +
                "FR.[idValor],\r\n" +
                "FR.[Respuesta],\r\n" +
                "FR.[idSiguientePregunta],\r\n" +
                "FR.[Seguimiento],\r\n" +
                "FR.[Negociación],\r\n" +
                "FR.[Identificador],\r\n" +
                "VC.[Valor],\r\n" +
                "VC.[ValorActivo]\r\n" +
                "from FlujoPreguntas FP\r\n" +
                "inner join FlujoRespuestas FR\r\n" +
                "on FR.idPregunta = FP.idPregunta \r\n" +
                "left join ValoresCatálogo VC\r\n" +
                "on VC.idValor = FR.idValor \r\n" +
                "order by fr.idPregunta";

            var preg_resp_list = await connection.QueryAsync<Preguntas_Respuestas_info>(
                preg_resp_Query,
                commandType: CommandType.Text);

            return preg_resp_list.ToList();

        }
        #endregion

        #region Calculadora
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

            return ConvertToDataTable(negociaciones, "Negociaciones");            
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

            return ConvertToDataTable(plazos, "Plazos");

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
            return ConvertToDataTable(pagos, "Pagos");

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
            return ConvertToDataTable(producto, "Producto");
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

        private SqlConnection GetConnection(string connection)
        {
            return new SqlConnection(_configuration.GetConnectionString(connection));
        }

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

    }
}
