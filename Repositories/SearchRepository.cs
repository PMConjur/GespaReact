using Dapper;
using Microsoft.AspNetCore.Routing;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using NoriAPI.Models.Busqueda;
using NoriAPI.Models.Login;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace NoriAPI.Repositories
{
    public interface ISearchRepository
    {
        Task<dynamic> ValidateBusqueda(string filtro, string ValorBusqueda);
        Task<dynamic> ValidateProductividad(int NumEmpleado);
        Task<dynamic> ValidateAutomatico(int numEmpleado);
    }

    public class SearchRepository : ISearchRepository
    {
        static DataSet _dsTablas;
        public static DataTable Conteos;
        public static DataTable Tiempos;
        public static DataTable Cuentas;
        public static DataTable GestionesEjecutivo;

        private readonly IConfiguration _configuration;
        public SearchRepository(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        public async Task<dynamic> ValidateBusqueda(string filtro, string ValorBusqueda)
        {
            string validacion = null;

            using var connection = GetConnection("Piso2Amex");

            string queryBusqueda = "WAITFOR DELAY '00:00:00';\r\n" +
                                    "SELECT TOP 100 \r\n" +
                                    "   C.idCuenta Cuenta, \r\n" +
                                    "   CL.Cartera, \r\n" +
                                    "   P.Producto, \r\n" +
                                    "   C.NombreDeudor Nombre, \r\n" +
                                    "   C.RFC, \r\n" +
                                    "   C.NúmeroCliente, \r\n" +
                                    "   V.Valor Situación, \r\n" +
                                    //"   C.Saldo, \r\n" +
                                    "   C.idCartera \r\n" +
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
        public async Task<dynamic> ValidateAutomatico(int numEmpleado)
        {
            using var connection = GetConnection("Piso2Amex");

            string storedAutomatico = "[dbMemory].[AMS].[ObtieneCuenta]";
            var parameters = new
            {
                idEjecutivo = numEmpleado
            };
            var Automatico = (await connection.QueryFirstOrDefaultAsync<dynamic>(
                storedAutomatico,
                parameters,
                commandType : CommandType.StoredProcedure                
                ));
            return Automatico;

        }      
        private SqlConnection GetConnection(string connection)
        {
            return new SqlConnection(_configuration.GetConnectionString(connection));
        }

        #region Productividad
        public async Task<dynamic> ValidateProductividad(int NumEmpleado)
        {
            using var connection = GetConnection("Piso2Amex");

            string queryProductividad = "SELECT * FROM [dbo].[fn_GestionesTelDiaras](@idEjecutivo)";

            var parameters = new
            {
                idEjecutivo = NumEmpleado
            };

            var productividad = (await connection.QueryAsync<dynamic>(
                queryProductividad,
                parameters,
                commandType: CommandType.Text
            ));

            DataTable tblDelDía = ConvertToDataTable(productividad);            
            


            // Crea tablas
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
            return productividad;

        }
        static void ConteosGestiones()
        {

            // Define tabla.
            Conteos = new DataTable();
            Conteos.Columns.Add("Negociaciones", typeof(int));
            Conteos.Columns.Add("Cuentas", typeof(int));
            foreach (string sColumna in CuentaClass.NombreColumnasConteos)
                Conteos.Columns.Add(sColumna, typeof(int));

            Conteos.Rows.Add();

            // Cuentas
            Conteos.Rows[0]["Cuentas"] = Cuentas.Rows.Count;
            CalculaTiempoPromedio("Cuentas");

            //Negociaciones
            Conteos.Rows[0]["Negociaciones"] = 0;

            //Gestiones
            Hashtable htContestaciones = Catalogos.Relaciones("Contactos", "Contactos", "No le conoce");
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
            long lRowTicks = ((TimeSpan)Tiempos.Rows[0]["Tiempo" + Conteo]).Ticks;
            Tiempos.Rows[1]["Tiempo" + Conteo] = new TimeSpan(Convert.ToInt64(lRowTicks / dConteo));
        }
        public static string ConteoGestión(DataRow Gestión, Hashtable idContestaciones = null)
        {

            int[] iConteos = { 0, 0, 0, 0 };
            int iConteoAnterior = 0;
            string sIdContacto = Gestión["idContacto"].ToString();
            string sNombreColumna = "";

            if (idContestaciones == null)
                idContestaciones = Catalogos.Relaciones("Contactos", "Contactos", "No le conoce");

            // Contacto - Marcaciones
            iConteos[0] = sIdContacto == "1101" ? 1 : 0;  // #idCatálogo
            iConteos[1] = sIdContacto == "1102" ? 1 : 0;
            iConteos[2] = idContestaciones.ContainsKey(sIdContacto) ? 1 : 0;
            iConteos[3] = iConteos[0] + iConteos[1] + iConteos[2] == 0 ? 1 : 0;

            DataRow drFila = Conteos.Rows[0];

            for (int iCol = 0; iCol < iConteos.Length; iCol++)
            {
                iConteoAnterior = 0;
                int.TryParse(drFila[CuentaClass.NombreColumnasConteos[iCol]].ToString(), out iConteoAnterior);
                drFila[CuentaClass.NombreColumnasConteos[iCol]] = iConteoAnterior + iConteos[iCol];

                if (iConteos[iCol] > 0)
                {
                    sNombreColumna = CuentaClass.NombreColumnasConteos[iCol];

                    // Tíempos
                    if (Tiempos != null && Tiempos.Rows.Count > 1 && Gestión["Duración"].ToString() != "")
                    {
                        long lTicks = ((TimeSpan)Gestión["Duración"]).Ticks;
                        long lRowTicks = ((TimeSpan)Tiempos.Rows[0]["Tiempo" + sNombreColumna]).Ticks + lTicks;
                        Tiempos.Rows[0]["Tiempo" + sNombreColumna] = new TimeSpan(lRowTicks);
                        Tiempos.Rows[1]["Tiempo" + sNombreColumna] = new TimeSpan(Convert.ToInt64(lRowTicks / (double)(iConteoAnterior + iConteos[iCol])));
                    }

                }

            }


            // Tiempos            
            return sNombreColumna;
        }

        private static DataTable ConvertToDataTable(IEnumerable<dynamic> data)
        {
            DataTable table = new DataTable();

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


        #endregion

    }
}
