
﻿using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

﻿using Microsoft.Extensions.Configuration;
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
using Microsoft.Data.SqlClient;
using System.Text.Json;

namespace NoriAPI.Services
{

    public interface IEjecutivoService
    {
        Task<ResultadoProductividad> ValidateProductividad(int numEmpleado);
        Task<TiemposEjecutivo> ValidateTimes(int numEmpleado);
        Task<string> PauseUnpause(InfoPausa pausa);

        Task ObtenerSeguimientos(DataRow drDatos, DataSet dsTablas);
        Task ObtenerAccionamiento(DataRow drDatos, DataSet dsTablas);

        Task<NegociacionesResponse> GetNegociaciones(int idEjecutivo);
        Task<Recuperacion> GetRecuperacion(int idEjecutivo, int actual);
        Task<List<Preguntas_Respuestas_info>> ValidatePreguntas_Respuestas();

        public class EjecutivoService : IEjecutivoService
        {
            private readonly IConfiguration _configuration;

            private readonly IEjecutivoRepository _ejecutivoRepository;
            private readonly string _connectionString;


        Task<ResultadoCalculadora> ValidateInfoCalculadora(int Cartera, string NoCuenta);
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

        #region Caluculadora
        public async Task<ResultadoCalculadora> ValidateInfoCalculadora(int Cartera, string NoCuenta)
        {
            string mensaje = null;
            DataTable dtnegociaciones = new DataTable();
            DataTable dtPlazos = new DataTable();
            DataTable dtPagos = new DataTable();
            DataTable dtHerramientas = new DataTable();
            DataTable dtDescuentos = new DataTable();
            DataTable InfoProducto = new DataTable();

            
            //---------------------------------------Negociaciones--------------------------------//
            //con el Idestado se valida si la promesa esta vigente


            dtnegociaciones = await _ejecutivoRepository.ObtieneNegociaciones(Cartera, NoCuenta);

            dtnegociaciones.PrimaryKey = new DataColumn[] {
                dtnegociaciones.Columns["Fecha_Insert"],
                dtnegociaciones.Columns["Segundo_Insert"],
                dtnegociaciones.Columns["idHerramienta"]
            };
            dtnegociaciones.DefaultView.Sort = "FechaHora DESC";

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

            //-----------------------------------------------------------------------------------------//

            dtDescuentos.Columns.Add("idHerramienta");
            dtDescuentos.Columns.Add("Descuento");
            dtDescuentos.Columns.Add("MáxDescuento");
            dtDescuentos.Columns.Add("MaxDías");

            string sHerramientas = "idHerramienta IN (0";
            double fDescuento = 0, fMáxDesc = 0;
            int iMáxDías = 0, idHerramienta = 0;

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
                if (int.TryParse(dtHerramientas.Columns[i].ColumnName, out idHerramienta))
                {
                    sHerramientas += "," + dtHerramientas.Columns[i].ColumnName;
                    iMáxDías = Convert.ToInt16(dtHerramientas.Rows[0][i].ToString());
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

            //----------------------------------------Producto Y ---------------------------------//
            InfoProducto = await _ejecutivoRepository.ObtieneProducto(NoCuenta);

            //------------------------------------------------------------------------------------//
            if (InfoProducto.Columns.Contains("Fechacorte") && InfoProducto.Columns["Fechacorte"].ToString() != "")
            {







            }





            //////////////////////////////////////////aun no se que voy a regresar ///////////////////////////////////
            var resultadoCalculadora = new ResultadoCalculadora();
            return resultadoCalculadora;
        }



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

            #region preguntas_respuestas

            #endregion


<<<<<<< HEAD
=======




        private static void CalculaTiempoPromedioTest(DataTable tiempos, string Conteo)
        {
            if (!ClasesGespa.Conteos.Columns.Contains(Conteo) || !tiempos.Columns.Contains("Tiempo" + Conteo)
                || tiempos.Rows[0]["Tiempo" + Conteo].ToString() == "")
                return;
>>>>>>> Mark-16-Calculadora

            public EjecutivoService(IConfiguration configuration, IEjecutivoRepository ejecutivoRepository)
            {
                _configuration = configuration;
                _ejecutivoRepository = ejecutivoRepository;
                _connectionString = _configuration.GetConnectionString("Piso2Amex");

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

            public async Task<DataTable> GetSeguimientosAsync(int idCartera, string idCuenta)
            {
                DataTable seguimiento = new DataTable();
                string query = "SELECT * FROM fn_Seguimientos(@idCartera, @idCuenta)"; // Evita inyección SQL

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

                // Verifica que drDatos tenga las columnas 'idCartera' y 'idCuenta'
                if (!drDatos.Table.Columns.Contains("idCartera") || !drDatos.Table.Columns.Contains("idCuenta"))
                    throw new ArgumentException("Las columnas 'idCartera' y/o 'idCuenta' no existen en el DataRow");

                var idCartera = Convert.ToInt32(drDatos["idCartera"]);
                var idCuenta = Convert.ToString(drDatos["idCuenta"]);

                DataTable seguimientosGet = await GetSeguimientosAsync(idCartera, idCuenta);

                if (seguimientosGet == null || seguimientosGet.Rows.Count == 0)
                    return;

                // Si la tabla ya existe, elimínala antes de agregar la nueva
                if (dsTablas.Tables.Contains("Seguimiento"))
                {
                    dsTablas.Tables.Remove("Seguimiento");
                }

                seguimientosGet.TableName = "Seguimiento";
                dsTablas.Tables.Add(seguimientosGet);
            }
            public async Task<DataTable> GetAccionamientoAsync(int idCartera, string idCuenta)
            {
                DataTable accionamiento = new DataTable();
                string query = "SELECT * FROM fn_Accionamientos(@idCartera, @idCuenta)"; // Evita inyección SQL

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
}