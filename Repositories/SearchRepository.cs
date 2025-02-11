using Dapper;
using Microsoft.AspNetCore.Routing;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using NoriAPI.Models.Busqueda;
using NoriAPI.Models.Login;
using System;
using System.Data;
using System.Threading.Tasks;

namespace NoriAPI.Repositories
{
    public interface ISearchRepository
    {
        Task<dynamic> ValidateBusqueda(string filtro);

    }

    public class SearchRepository : ISearchRepository
    {
        private readonly IConfiguration _configuration;

        public SearchRepository(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<dynamic> ValidateBusqueda(string filtro)
        {
            //esto se debe cambiar

            using var connection = GetConnection("Piso2Amex");

            string queryBusqueda = "WAITFOR DELAY '00:00:00';\r\n" +
                                    "SELECT TOP 300 \r\n" +
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
                                    "       INNER JOIN ValoresCatálogo V ON V.idValor = C.idSituación \r\n" +
                                    "WHERE CuentaActiva = 1"
                                    ;
            //string Filtro = request.Filtro;
            switch (filtro)
            {
                case "Cuenta":
                    //queryBusqueda = sQueryBúsqueda.Replace("Cuentas C", "Cuentas C WITH (NOLOCK)");
                    //sQueryWHERE += " AND C.idCuenta = '" + BúsquedaLimpia.Replace(" ", "") + "' ";// + sQueryidCartera;
                    break;

                case "Nombre":
                    //sQueryBúsqueda = sQueryBúsqueda.Replace("Cuentas C", "Cuentas C WITH (NOLOCK)")
                    //    + " INNER JOIN Nombres N (NOLOCK) ON N.Expediente = C.Expediente ";
                    //
                    //foreach (string sNombre in BúsquedaLimpia.Split(new char[] { ' ' }, StringSplitOptions.RemoveEmptyEntries))
                    //    sQueryWHERE += " AND CONTAINS( N.NombreDeudor, '" + sNombre.Replace("'", "") + "') ";
                    //
                    //sQueryWHERE += sQueryidCartera;

                    break;

                case "RFC":
                    //sQueryBúsqueda = sQueryBúsqueda.Replace("Cuentas C", "Cuentas C WITH (INDEX(IX_Cuentas_RFC), NOLOCK)");
                    //sQueryWHERE += " AND  CHARINDEX('" + BúsquedaLimpia.Replace(" ", "") + "', C.RFC) = 1  ";
                    break;

                case "Número Cliente":
                    //sQueryBúsqueda = sQueryBúsqueda.Replace("Cuentas C", "Cuentas C WITH (INDEX(IX_Cuentas_NúmeroCliente), NOLOCK)");
                    //sQueryWHERE += " AND  C.NúmeroCliente = '" + BúsquedaLimpia.Replace(" ", "") + "' " + sQueryidCartera;
                    break;

                case "Teléfono":
                    //sQueryBúsqueda = sQueryBúsqueda.Replace("Cuentas C", "Cuentas C WITH (NOLOCK)");
                    //sQueryBúsqueda += "       LEFT JOIN Teléfonos T WITH (NOLOCK) ON T.idCartera = C.idCartera AND T.idCuenta = C.idCuenta \r\n";

                    //foreach (char caracter in Búsqueda.Replace(" ", ""))
                    //    if (!char.IsDigit(caracter))
                    //        return tblResultado;
                    //
                    //sQueryWHERE += " AND T.NúmeroTelefónico = RIGHT('" + BúsquedaLimpia.Replace(" ", "") + "', 10) ";
                    break;

                case "Expediente":
                    //string sExpediente = "";
                    //if (BúsquedaLimpia.Length <= 3)
                    //    return tblResultado;
                    //
                    //sQueryWHERE += " AND CL.Abreviación = '";
                    //foreach (char Caracter in BúsquedaLimpia.Substring(0, 3))
                    //    if (char.IsLetter(Caracter))
                    //        sQueryWHERE += Caracter;
                    //
                    //sQueryWHERE += "' AND C.Expediente = ";
                    //foreach (char Caracter in BúsquedaLimpia.Substring(3))
                    //    if (char.IsDigit(Caracter))
                    //        sExpediente += Caracter;
                    //
                    //if (sExpediente == "")
                    //    return tblResultado;
                    //else
                    //    sQueryWHERE += sExpediente;
                    //
                    //sQueryBúsqueda = sQueryBúsqueda.Replace("Cuentas C", DataBaseConn.TablaCuentas(BúsquedaLimpia) + " C WITH (NOLOCK) ");
                    break;

                default:
                    //sQueryWHERE += " AND 2=1";
                    break;
            }

            var busqueda = (await connection.QueryFirstOrDefaultAsync<dynamic>(
                queryBusqueda,
                //parameters,
                commandType: CommandType.Text
            ));

            return busqueda;

        }

        private SqlConnection GetConnection(string connection)
        {
            return new SqlConnection(_configuration.GetConnectionString(connection));
        }


    }
}
