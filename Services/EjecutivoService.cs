using Microsoft.Extensions.Configuration;
using NoriAPI.Models.Busqueda;
<<<<<<< HEAD
using NoriAPI.Repositories;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
=======
using NoriAPI.Models.Ejecutivo;
using NoriAPI.Repositories;
using System;
using System.Collections.Generic;
>>>>>>> Mark-10-Tiempos
using System.Threading.Tasks;

namespace NoriAPI.Services
{
    public interface IEjecutivoService
    {
<<<<<<< HEAD
        Task<ResultadoProductividad> ValidateProductividad(int numEmpleado);

    }

=======

        Task<TiemposEjecutivo> ValidateTimes(int numEmpleado);
        Task<string> PauseUnpause(InfoPausa pausa);

    }



>>>>>>> Mark-10-Tiempos
    public class EjecutivoService : IEjecutivoService
    {
        private readonly IConfiguration _configuration;
        private readonly IEjecutivoRepository _ejecutivoRepository;

<<<<<<< HEAD
        #region Metodos_Productividad
        public static string[] _NombreColumnasConteos = { "Titulares", "Conocidos", "Desconocidos", "SinContacto" };
        public static DataTable Cuentas;
        public static DataTable Tiempos;
        public static DataTable Metas;
        public static DataTable GestionesEjecutivo;
        public static DataTable Conteos;
        public static DataSet _dsTablas = new DataSet();
        public static ArrayList _alNombreId;
        public static Hashtable _htValoresCatálogo;
        public static Hashtable _htNombreId;
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
            Cuentas = new DataTable();
            Tiempos = new DataTable();
            Metas = new DataTable();
            GestionesEjecutivo = new DataTable();
            Conteos = new DataTable();
            _dsTablas = new DataSet();
            _alNombreId = new ArrayList();
            _htValoresCatálogo = new Hashtable(); 
            _htNombreId = new Hashtable();
            string mensaje = null;

            //Comentada la vieja llamada al método
            //var productividadInfo = await _ejecutivoRepository.ValidateProductividad(numEmpleado);
            //var prod = (IDictionary<string, object>)productividadInfo;
            // Convertir productividadInfo a DataTable

            //---------------------------------CargaCatalogos---------------------------------//
            DataTable dtCatalogos = new DataTable();
            _alNombreId = new ArrayList();

            // NUEVA LLAMADA AL REPOSITORY
            dtCatalogos = await _ejecutivoRepository.VwCatalogos();

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

            dtRelaciones = await _ejecutivoRepository.VwRelaciones();

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

            Tiempos = await _ejecutivoRepository.TiemposEjecutivo(numEmpleado);

            foreach (string sColumna in _NombreColumnasConteos)
                if (Tiempos.Columns.Contains("Tiempo" + sColumna))
                    Tiempos.Rows[0]["Tiempo" + sColumna] = new TimeSpan(0);

            Tiempos.Rows.Add("Promedio");
            Tiempos.TableName = "Tiempos";
            _dsTablas.Tables.Add(Tiempos);

            //-----------------------------------------Metas-----------------------------------------------------//

            Metas = await _ejecutivoRepository.MetasEjecutivo(numEmpleado);

            Metas.TableName = "Metas";
            _dsTablas.Tables.Add(Metas);


            //----------------------------------------Gestiones-------------------------------------------------------//
            DataTable tblDelDía = await _ejecutivoRepository.Gestiones(numEmpleado);



            // Aquí terminan las consultas a la base y empieza la creación y adición de tablas.
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


            DataTable dt = Conteos;

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

        private static void ConteosGestiones()
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
        private static void CalculaTiempoPromedioTest(DataTable tiempos, string Conteo)
        {
            if (!Conteos.Columns.Contains(Conteo) || !tiempos.Columns.Contains("Tiempo" + Conteo)
                || tiempos.Rows[0]["Tiempo" + Conteo].ToString() == "")
                return;

            double dConteo = Convert.ToInt32(Conteos.Rows[0][Conteo]);
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

        #endregion


    }

=======
        public EjecutivoService(IEjecutivoRepository ejecutivoRepository)
        {
            _ejecutivoRepository = ejecutivoRepository;

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


    }
>>>>>>> Mark-10-Tiempos
}
