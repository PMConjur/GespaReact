using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.Net.NetworkInformation;
using System.Threading.Tasks;
using NoriAPI.Repositories;

namespace NoriAPI.Models
{
    public class ClasesGespaNonStatic
    {
        #region Metodos_Productividad
        public string[] _NombreColumnasConteos = { "Titulares", "Conocidos", "Desconocidos", "SinContacto" };
        public DataTable Cuentas;
        public DataTable Tiempos;
        public DataTable Metas;
        public DataTable GestionesEjecutivo;
        public DataTable Conteos;
        public DataSet _dsTablas = new DataSet();
        public ArrayList _alNombreId = new ArrayList();
        public Hashtable _htValoresCatálogo;
        public Hashtable _htNombreId;
        public DataTable dtCatalogos = new DataTable();
        public DataTable dtRelaciones = new DataTable();
        public DataTable tblDelDía = new DataTable();
        #endregion

        #region Cuenta
        public Hashtable _htProducto;
        public bool _Extranjera = false;
        #endregion



        /// <summary>
        /// Obtiene las gestiones que ha realizado el ejecutivo en el día.
        /// </summary>
        public void ObtieneGestionesDelDia(DataTable gestiones)
        {
            if (_dsTablas.Tables.Contains("Gestiones"))
                return;

            DataTable tblDelDía = gestiones;

            // Crea tablas
            if (tblDelDía is null || tblDelDía.Rows.Count == 0)
            {
                return;
            }


            Cuentas = tblDelDía.Clone();
            GestionesEjecutivo = tblDelDía.Clone();


            bool bSeparador = false;


            // Elimina las columnas a tablas.

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
        }

        #region Productividad
        public void CargaCatalogos()
        {
            _htValoresCatálogo = new Hashtable();
            _htNombreId = new Hashtable();
            foreach (DataRow rowCatalog in dtCatalogos.Rows)
            {
                _htValoresCatálogo.Add(rowCatalog["idValor"].ToString(), rowCatalog["Valor"].ToString());
                _htNombreId.Add(rowCatalog["idValor"].ToString(), rowCatalog["NombreId"].ToString());
                if (!_alNombreId.Contains(rowCatalog["NombreId"]))
                    _alNombreId.Add(rowCatalog["NombreId"]);
            }

            dtCatalogos.PrimaryKey = [dtCatalogos.Columns["idValor"]];

            dtCatalogos.TableName = "Catálogos";
            if (_dsTablas.Tables.Contains("Catálogos"))
            {
                _dsTablas.Relations.Remove("FK_CatálogosRelaciones1");
                _dsTablas.Tables.Remove("Catálogos");
            }

            _dsTablas.Tables.Add(dtCatalogos);

        }

        public void Relaciones()
        {
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
        }

        public Hashtable Relaciones(string Catálogo1, string Catálogo2, params string[] Valor2)
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

        public void ObtieneTiempos()
        {
            foreach (string sColumna in _NombreColumnasConteos)
                if (Tiempos.Columns.Contains("Tiempo" + sColumna))
                    Tiempos.Rows[0]["Tiempo" + sColumna] = new TimeSpan(0);

            Tiempos.Rows.Add("Promedio");
            Tiempos.TableName = "Tiempos";
            _dsTablas.Tables.Add(Tiempos);

        }
        public void ObtieneMetas()
        {
            Metas.TableName = "Metas";
            _dsTablas.Tables.Add(Metas);
        }
        public void ObtieneNegociaciones()
        {
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

        }
        public void ConteosGestiones()
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
        public void CalculaTiempoPromedio(string Conteo)
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

        public string ConteoGestión(DataRow Gestión, Hashtable idContestaciones = null)
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



        #region FuncionesMetodos

        public string MáscaraTeléfono(object NúmeroTelefónico)
        {
            if (NúmeroTelefónico == null)
                return "";

            string sTeléfono = NúmeroTelefónico.ToString().Trim();
            return sTeléfono.Length > 4 ? "XXX-XXX-" + sTeléfono.Substring(sTeléfono.Length - 4, 4) : "";
        }


        public int GetIdValor(DataTable catalogos, string catalogo, object valor)
        {
            if (valor == null)
                return 0;
            // Verifica que la DataTable no sea nula y contenga filas
            if (catalogos == null || catalogos.Rows.Count == 0)
                return 0;

            // Filtra las filas que coincidan con el catálogo y el valor buscado
            DataRow[] drFilas = catalogos.Select($"Catálogo = '{catalogo}' AND Valor = '{valor}'");

            // Si hay coincidencias, retorna el idValor, de lo contrario, retorna 0
            return drFilas.Length > 0 ? Convert.ToInt32(drFilas[0]["idValor"]) : 0;

        }

        /// <summary>
        /// Devuelve el nombre de la Entidad Federativa de acuerdo a su abreviación.
        /// </summary>
        /// <param name="codigoEstado">Abreviación del Estado de la República Mexicana.</param>
        /// <returns></returns>
        public string ObtenerNombreEstado(string codigoEstado)
        {
            Dictionary<string, string> estados = new()
            {
                { "AG", "Aguascalientes" }, { "AGS", "Aguascalientes" },
                { "BN", "Baja California" }, { "BC", "Baja California" },
                { "BS", "Baja California Sur" }, { "BCS", "Baja California Sur" }, { "BAJA", "Baja California Sur" },
                { "CA", "Campeche" }, { "CAMP", "Campeche" },
                { "CH", "Chihuahua" }, { "CHIH", "Chihuahua" },
                { "CS", "Chiapas" }, { "CHIS", "Chiapas" }, { "CHIA", "Chiapas" },
                { "DF", "Ciudad de México" }, { "CDMX", "Ciudad de México" }, { "D.F.", "Ciudad de México" }, { "CIUD", "Ciudad de México" },
                { "GTO", "Guanajuato" }, { "GRO", "Guerrero" },
                { "MEX", "Estado de México" }, { "EDO.", "Estado de México" }, { "EDO", "Estado de México" },
                { "VER", "Veracruz" }, { "YUC", "Yucatán" }, { "ZAC", "Zacatecas" }
            };

            return estados.TryGetValue(codigoEstado.ToUpper(), out string nombre) ? nombre : codigoEstado;
        }

        /// <summary>
        /// Traduce el id por la fecha.
        /// </summary>
        /// <param name="Fecha">Id de fecha. 1 - 01/01/2015.</param>
        /// <param name="Formato">Formato de la fecha. ("corto", "largo" o específica)</param>
        public string Fecha(object Fecha, string Formato = "corto")
        {
            if (Fecha == null || Fecha.ToString() == "" || !DateTime.TryParse(Fecha.ToString(), out DateTime dtFecha))
            {
                return "";
            }

            if (Formato == "corto")
                return dtFecha.ToShortDateString();
            else if (Formato == "largo")
                return dtFecha.ToLongDateString();
            else
                return dtFecha.ToString(Formato);
        }

        /// <summary>
        /// Convierte la fila en una hash table. Los nombres de columnas son los keys y los valores los values.
        /// </summary>
        /// <param name="Tabla">Ocupará la primera fila de la tabla.</param>
        static public Hashtable ConvertRowToHashTable(DataTable Tabla)
        {
            Hashtable htRow = new Hashtable();

            if (Tabla.Rows.Count < 1)
                return htRow;

            for (int iCol = 0; iCol < Tabla.Columns.Count; iCol++)
            {
                htRow.Add(
                    Tabla.Columns[iCol].ColumnName.ToString().Trim(),
                    Tabla.Rows[0][iCol].ToString().Trim()
                );
            }
            return htRow;
        }

        /// <summary>
        /// Convierte el primer elemento de la lista en una hashtable. Los nombres de columnas son los keys y los valores los values.
        /// Modificado del método original de Gespa.
        /// </summary>
        /// <param name="listaDinamica">Ocupará la primera fila de la tabla.</param>
        public static Hashtable ConvertDynamicListToHashTable(IEnumerable<dynamic> listaDinamica)
        {
            Hashtable htRow = [];

            // Verificar si la lista tiene elementos
            var firstRow = listaDinamica.FirstOrDefault();
            if (firstRow == null)
                return htRow;

            // Convertir el primer objeto en un diccionario
            var dict = (IDictionary<string, object>)firstRow;

            foreach (var kvp in dict)
            {
                htRow.Add(kvp.Key.Trim(), kvp.Value?.ToString().Trim() ?? string.Empty);
            }

            return htRow;
        }



        #endregion

        #region FuncionesCatalogos
        public string FormatoPesos(decimal monto)
        {
            return monto.ToString("$ #,0.00");
        }


        #endregion


    }



}