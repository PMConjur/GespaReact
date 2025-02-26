using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using NoriAPI.Models.Busqueda;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace NoriAPI.Repositories
{
    public interface ISearchRepository
    {
        Task<dynamic> ValidateBusqueda(string filtro, string ValorBusqueda);
        Task<dynamic> ValidateAutomatico(int numEmpleado);
        Task<List<Phone>> GetPhones(string idCuenta, int idCartera);
    }

    public class SearchRepository : ISearchRepository
    {

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
        public async Task<dynamic> ValidateAutomatico(int numEmpleado)
        {
            using var connection = GetConnection("Piso2Amex");
            string storedAutomatico = "[dbMemory].[AMS].[ObtieneCuenta]";
            var parameters = new
            {
                idEjecutivo = numEmpleado
            };
            var automatico = (await connection.QueryFirstOrDefaultAsync<dynamic>(
                storedAutomatico,
                parameters,
                commandType: CommandType.StoredProcedure
                ));
            return automatico;

        }
        public async Task<List<Phone>> GetPhones(string idCuenta, int idCartera)
        {
            using var connection = GetConnection("Piso2Amex");

            string phonesQuery = "SELECT * FROM [dbo].[fn_TeléfonosLadasGMT](@idCartera, @idCuenta)";

            var phoneList = await connection.QueryAsync<Phone>(
                phonesQuery,
                new { idCartera = idCartera, idCuenta = idCuenta },
                commandType: CommandType.Text
                );

            return phoneList.ToList();
        }
        private SqlConnection GetConnection(string connection)
        {
            return new SqlConnection(_configuration.GetConnectionString(connection));
        }



    }
}
