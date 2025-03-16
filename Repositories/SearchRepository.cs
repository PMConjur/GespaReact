using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using NoriAPI.Models.Busqueda.InfoProducto;
using NoriAPI.Models.Domicilios;
using NoriAPI.Models.Ejecutivo;
using NoriAPI.Models.Phones;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace NoriAPI.Repositories
{
    public interface ISearchRepository
    {
        Task<dynamic> ValidateBusqueda(string filtro, string ValorBusqueda);
        Task<dynamic> ValidateAutomatico(int numEmpleado);
        Task<List<Phone>> GetPhones(string idCuenta, int idCartera);
        Task<dynamic> RegisterNewPhone(NewPhone newPhoneToRegister);
        Task<List<CamposPantalla>> GetCamposPantalla(int idCartera, int idProducto);
        Task<dynamic> GetProducto(string idCuenta);

        #region Domicilios
        Task<List<Domicilio>> GetDomicilios(string idCuenta, int idCartera);
        Task<List<GestionDomiciliaria>> GetVisitas(string idCuenta, int idCartera);
        Task<List<CodigosPostales>> SearchCodigosPostales(int idCodigoPostal);
        Task<List<CodigosPostales>> SearchCodigosPostalesByCode(string codigoPostal);
        Task<dynamic> UpdateAddressInfo(UpdateAddressInfoRequest domicilioInfoUpdate);
        Task<dynamic> UpdateAddressClass(UpdateAddressClassRequest domicilioClassUpdate);
        Task<dynamic> InsertNewAddress(NewAddress newAddress);
        #endregion
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

        public async Task<dynamic> RegisterNewPhone(NewPhone newPhoneToRegister)
        {
            using var connection = GetConnection("Piso2Amex");

            string newPhoneQuery = "[dbCollection].[dbo].[2.2.GuardaNuevoTeléfono]";
            var parameters = new
            {
                idCartera = newPhoneToRegister.IdCartera,
                idCuenta = newPhoneToRegister.IdCuenta,
                idEjecutivo = newPhoneToRegister.IdEjecutivo,
                NúmeroTelefónico = newPhoneToRegister.NumeroTelefonico,
                idTelefonia = newPhoneToRegister.IdTelefonia,
                idOrigen = newPhoneToRegister.IdOrigen,
                idClase = newPhoneToRegister.IdClase,
                SegHorarioContacto = newPhoneToRegister.HorarioContacto,
                Extensión = newPhoneToRegister.Extension
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

            // Convertimos a IDictionary para acceder a los valores sin errores
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

        public async Task<List<CamposPantalla>> GetCamposPantalla(int idCartera, int idProducto)
        {
            using var connection = GetConnection("Piso2Amex");

            string fieldsQuery = "SELECT " +
                    "CP.Posición AS Posicion," +
                    "CP.AliasCampo," +
                    "CP.NombreCampo," +
                    "CP.idFormatoCampo AS IdFormatoCampo " +
                "FROM CamposPantalla CP(NOLOCK) INNER JOIN Productos P(NOLOCK) ON CP.idProducto = P.idProducto " +
                "WHERE P.idCartera = @idCartera AND P.idProducto = @idProducto";

            var fieldsList = await connection.QueryAsync<CamposPantalla>(
                fieldsQuery,
                new { idCartera = idCartera, idProducto = idProducto },
                commandType: CommandType.Text
                );

            return fieldsList.ToList();
        }

        public async Task<dynamic> GetProducto(string idCuenta)
        {
            using var connection = GetConnection("Piso2Amex");

            string productQuery = "WAITFOR DELAY '00:00:00';" +
                                 "SELECT * FROM Y.Producto_1 (NOLOCK) " +
                                 "WHERE idCuenta = @IdCuenta";

            var product = await connection.QueryFirstOrDefaultAsync<dynamic>(
                productQuery,
                new { IdCuenta = idCuenta },
                commandType: CommandType.Text
                );

            return product;
        }

        #region Domicilios

        /// <summary>
        /// Obtiene la lista de domicilios asociados a una cuenta y cartera.
        /// </summary>
        /// <param name="idCuenta">Identificador de la cuenta.</param>
        /// <param name="idCartera">Identificador de la cartera.</param>
        /// <returns>Lista de objetos Domicilio.</returns>
        public async Task<List<Domicilio>> GetDomicilios(string idCuenta, int idCartera)
        {
            using var connection = GetConnection("Piso2Amex");

            string domiciliosQuery = "SELECT " +
                "idCartera, " +
                "idCuenta, " +
                "idDomicilio, " +
                "Fecha_Insert, " +
                "idEjecutivo, " +
                "idInformación, " +
                "Calle, " +
                "NúmeroExterior, " +
                "NúmeroInterior, " +
                "idCódigoPostal, " +
                "CódigoPostal, " +
                "ColoniaLocalidad, " +
                "DelegaciónMunicipio, " +
                "Estado, " +
                "FechaHora_Información, " +
                "idLogProceso, " +
                "idClase, " +
                "idOrígen " +
                "FROM " +
                "Domicilios " +
                "(NOLOCK) WHERE idCartera = @IdCartera AND idCuenta = @IdCuenta";

            var parameters = new { IdCuenta = idCuenta, IdCartera = idCartera };

            // Ejecuta la consulta y mapea los resultados a una lista de objetos Domicilio
            var domicilios = (await connection.QueryAsync<Domicilio>(
                domiciliosQuery,
                parameters,
                commandType: CommandType.Text
            )).ToList();

            return domicilios;
        }

        /// <summary>
        /// Obtiene la lista de visitas asociadas a una cuenta y cartera.
        /// </summary>
        /// <param name="idCuenta">Identificador de la cuenta.</param>
        /// <param name="idCartera">Identificador de la cartera.</param>
        /// <returns>Lista de objetos GestionDomiciliaria.</returns>
        public async Task<List<GestionDomiciliaria>> GetVisitas(string idCuenta, int idCartera)
        {
            using var connection = GetConnection("Piso2Amex");

            string visitasQuery = "SELECT * FROM fn_GestionesDomiciliarias(@IdCartera,@IdCuenta)";

            var parameters = new { IdCuenta = idCuenta, IdCartera = idCartera };

            // Ejecuta la consulta y mapea los resultados a una lista de objetos GestionDomiciliaria.
            var visitas = (await connection.QueryAsync<GestionDomiciliaria>(
                visitasQuery,
                parameters,
                commandType: CommandType.Text
            )).ToList();

            return visitas;
        }

        public async Task<List<CodigosPostales>> SearchCodigosPostales(int idCodigoPostal)
        {
            using var connection = GetConnection("Piso2Amex");

            string codigosPostalesQuery = "SELECT * FROM [dbAllocation].[dbo].[CódigosPostales] (NOLOCK) WHERE idCódigoPostal = @IdCodigoPostal";

            var parameters = new { IdCodigoPostal = idCodigoPostal };

            var codigosPostales = await connection.QueryAsync<CodigosPostales>(
                codigosPostalesQuery,
                parameters,
                commandType: CommandType.Text
            );

            return codigosPostales.ToList();
        }
        public async Task<List<CodigosPostales>> SearchCodigosPostalesByCode(string codigoPostal)
        {
            using var connection = GetConnection("Piso2Amex");

            string codigosPostalesQuery = "SELECT * FROM [dbAllocation].[dbo].[CódigosPostales] (NOLOCK) WHERE CódigoPostal = @CodigoPostal";

            var parameters = new { CodigoPostal = codigoPostal };

            var codigosPostales = await connection.QueryAsync<CodigosPostales>(
                codigosPostalesQuery,
                parameters,
                commandType: CommandType.Text
            );

            return codigosPostales.ToList();
        }

        public async Task<List<CodigosPostales>> SearchCodigosPostalesId(int idCodigoPostal)
        {
            using var connection = GetConnection("Piso2Amex");

            string codigosPostalesQuery = "SELECT * FROM [dbAllocation].[dbo].[CódigosPostales] (NOLOCK) WHERE idCódigoPostal = @IdCodigoPostal";

            var parameters = new { IdCodigoPostal = idCodigoPostal };

            var codigosPostales = await connection.QueryAsync<CodigosPostales>(
                codigosPostalesQuery,
                parameters,
                commandType: CommandType.Text
            );

            return codigosPostales.ToList();
        }

        public async Task<dynamic> UpdateAddressInfo(UpdateAddressInfoRequest domicilioInfoUpdate)
        {
            using var connection = GetConnection("Piso2Amex");

            string updateInfoQuery =
                "UPDATE Domicilios SET " +
                "idInformación = @IdInformacion, " +
                "FechaHora_Información = GETDATE() " +
                "WHERE idCartera = @IdCartera AND idCuenta = @IdCuenta AND idDomicilio = @IdDomicilio";

            var parameters = new
            {
                domicilioInfoUpdate.IdInformacion,
                domicilioInfoUpdate.IdCartera,
                domicilioInfoUpdate.IdCuenta,
                domicilioInfoUpdate.IdDomicilio
            };

            var updateAddressResult = await connection.ExecuteAsync(
                updateInfoQuery,
                parameters,
                commandType: CommandType.Text);

            return updateAddressResult;
        }

        public async Task<dynamic> UpdateAddressClass(UpdateAddressClassRequest domicilioClassUpdate)
        {
            using var connection = GetConnection("Piso2Amex");

            string updateInfoQuery =
                "UPDATE Domicilios SET " +
                "idClase = @IdClase, " +
                "FechaHora_Información = GETDATE() " +
                "WHERE idCartera = @IdCartera AND idCuenta = @IdCuenta AND idDomicilio = @IdDomicilio";

            var parameters = new
            {
                domicilioClassUpdate.IdClase,
                domicilioClassUpdate.IdCartera,
                domicilioClassUpdate.IdCuenta,
                domicilioClassUpdate.IdDomicilio
            };

            var updateClassResult = await connection.ExecuteAsync(
                updateInfoQuery,
                parameters,
                commandType: CommandType.Text);

            return updateClassResult;
        }


        public async Task<dynamic> InsertNewAddress(NewAddress newAddress)
        {
            using var connection = GetConnection("Piso2Amex");

            string newAddressStored = "[2.6.NuevoDomicilio]";
            var parameters = new
            {
                idCartera = newAddress.IdCartera,
                idCuenta = newAddress.IdCuenta,
                idEjecutivo = newAddress.IdEjecutivo,
                newAddress.Calle,
                NúmeroExterior = newAddress.NumeroExterior,
                NúmeroInterior = (object?)newAddress.NumeroInterior ?? DBNull.Value,
                IdCodigoPostal = newAddress.IdCodigoPostal == 0 ? (object)DBNull.Value : newAddress.IdCodigoPostal,
                Colonia = newAddress.Colonia,
                idClase = newAddress.IdClase,
                Municipio = (object?)newAddress.Municipio ?? DBNull.Value,
                Estado = (object?)newAddress.Estado ?? DBNull.Value
            };

            var newAddressResult = await connection.QueryFirstOrDefaultAsync<NewAddressResult>(
                newAddressStored,
                parameters,
                commandType: CommandType.StoredProcedure);

            return newAddressResult;
        }


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

        private SqlConnection GetConnection(string connection)
        {
            return new SqlConnection(_configuration.GetConnectionString(connection));
        }



    }
}
