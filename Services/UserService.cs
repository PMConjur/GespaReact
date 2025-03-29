using Microsoft.Data.SqlClient;
using NoriAPI.Models.Login;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using NoriAPI.Repositories;
using System;
using NoriAPI.Models;
using System.Data;

namespace NoriAPI.Services
{
    public interface IUserService
    {

        Task<ResultadoReseteo> ValidateContra(ReseteaContra request);
        Task<ResultadoLogin> ValidateUser(AuthRequest request);
        Task<(string, bool)> ValidateUserForRefresh(RenewTokenRequest renewTokenInfo);
        Task<DataTable> GetCierreSesion(int idEjecutivo, int idLogIngreso);
        Task<DataTable> GetCierreLog(int idLogIngreso);

    }

    public class UserService : IUserService
    {
        private readonly IConfiguration _configuration;
        private readonly IUserRepository _userRepository;
        private readonly string _connectionString;

        public UserService(IConfiguration configuration, IUserRepository userRepository)
        {
            _configuration = configuration;
            _userRepository = userRepository;
            _connectionString = _configuration.GetConnectionString("Piso2Amex");
        }

        public async Task<ResultadoReseteo> ValidateContra(ReseteaContra request)
        {

            var validateReseteaContra = await _userRepository.ValidateContra(request);

            var dict = (IDictionary<string, object>)validateReseteaContra;

            if (dict.TryGetValue("Mensaje", out object mensajeObj) && mensajeObj != null)
            {
                return new ResultadoReseteo(mensajeObj.ToString(), null);
            }
            else if (dict.TryGetValue("Éxito", out object mensajeExt) && mensajeExt != null)
            {
                return new ResultadoReseteo(null, mensajeExt.ToString());
            }
            else
            {
                string mensaje = "No se pudo validar el usuario, falló la solicitud con el servidor.";
                return new ResultadoReseteo(mensaje, null);

            }
        }


        public async Task<ResultadoLogin> ValidateUser(AuthRequest request)
        {
            // Variables para crear el objeto EjecutivoLogin de retorno:
            string mensaje = null;
            bool expiro = false;
            bool sesion = false;
            EjecutivoInfoLogin ejecutivoInfoLogin = null;

            //Llamamos al store procedure que valida las credenciales del usuario.
            var validateUser = await _userRepository.ValidateUser(request);

            if (validateUser == null || validateUser.Count == 0)
            {
                try
                {
                    var validateUserRetry = await _userRepository.ValidateUserRetry(request);
                    validateUser = validateUserRetry.Result;
                }
                catch
                {
                    return new ResultadoLogin("No se pudo validar el usuario, falló la solicitud con el servidor.", null, null, null, null);
                    throw;
                }
            }

            var dict = (IDictionary<string, object>)validateUser;

            // Si la propiedad "Expiró" existe, extraemos su valor
            if (dict.TryGetValue("Expiró", out object expiradoObj) && expiradoObj != null)
            {
                // Puede venir como bool, int, etc. Se recomienda convertirlo a bool
                expiro = Convert.ToBoolean(expiradoObj);
            }

            if (dict.TryGetValue("Sesión", out object sesionObj) && sesionObj != null)
            {
                // Puede venir como bool, int, etc. Se recomienda convertirlo a bool
                sesion = Convert.ToBoolean(sesionObj);
            }

            // Si la propiedad "Mensaje" existe, extraemos su valor
            if (dict.TryGetValue("Mensaje", out object mensajeObj) && mensajeObj != null)
            {
                mensaje = mensajeObj.ToString();
                return new ResultadoLogin(mensaje, sesion, expiro, null, null);
            }

            // Si se encontró "idEjecutivo", se asume que la consulta fue exitosa
            if (dict.ContainsKey("idEjecutivo"))
            {
                ejecutivoInfoLogin = MapToEjecutivoInfo(dict);
            }

            var resultado = new ResultadoLogin(mensaje, sesion, expiro, ejecutivoInfoLogin, null);

            return resultado;

        }

        private static EjecutivoInfoLogin MapToEjecutivoInfo(IDictionary<string, object> dict)
        {
            var info = new EjecutivoInfoLogin();

            if (dict.TryGetValue("idEjecutivo", out var idEjecutivo) && idEjecutivo != null)
                info.idEjecutivo = Convert.ToInt32(idEjecutivo);

            if (dict.TryGetValue("idEncargado", out var idEncargado) && idEncargado != null)
                info.idEncargado = Convert.ToInt32(idEncargado);

            if (dict.TryGetValue("Usuario", out var usuario) && usuario != null)
                info.Usuario = usuario.ToString();

            if (dict.TryGetValue("idCartera", out var idCartera))
            {
                // Si es cadena vacía, asignamos 0; de lo contrario, convertimos a short
                var carteraStr = idCartera?.ToString();
                info.idCartera = string.IsNullOrEmpty(carteraStr) ? (short?)0 : Convert.ToInt16(carteraStr);
            }

            if (dict.TryGetValue("idProducto", out var idProducto) && idProducto != null)
                info.idProducto = Convert.ToInt16(idProducto);

            if (dict.TryGetValue("Encargado", out var encargado) && encargado != null)
                info.Encargado = encargado.ToString();

            if (dict.TryGetValue("NombreEjecutivo", out var nombreEjecutivo) && nombreEjecutivo != null)
                info.NombreEjecutivo = nombreEjecutivo.ToString();

            if (dict.TryGetValue("idSucursal", out var idSucursal) && idSucursal != null)
                info.idSucursal = Convert.ToInt16(idSucursal);

            if (dict.TryGetValue("idÁrea", out var idArea) && idArea != null)
                info.idÁrea = Convert.ToInt16(idArea);

            if (dict.TryGetValue("Jerarquía", out var jerarquia) && jerarquia != null)
                info.Jerarquía = Convert.ToByte(jerarquia);

            if (dict.TryGetValue("Extensión", out var extension) && extension != null)
                info.Extensión = Convert.ToInt32(extension);

            if (dict.TryGetValue("Días", out var dias) && dias != null)
                info.Dias = Convert.ToInt32(dias);

            if (dict.TryGetValue("Segmento", out var segmento) && segmento != null)
                info.Segmento = Convert.ToString(segmento);

            if (dict.TryGetValue("idLogIngreso", out var idLogIngreso) && idLogIngreso != null)
                info.idLogIngreso = Convert.ToInt32(idLogIngreso);

            return info;
        }


        //// Validate API key with a direct SQL query
        //public async Task<bool> IsValidApiKey(string apiKey)
        //{
        //    using var connection = _sqlConnection;

        //    string query = "SELECT COUNT(1) FROM AmexNoriApiUsers WHERE ApiKey = @ApiKey";
        //    var parameters = new { ApiKey = apiKey };

        //    var isValid = await connection.ExecuteScalarAsync<bool>(
        //        query,
        //        parameters
        //    );

        //    return isValid;
        //}

        public async Task<bool> RegisterTokenForUser(string token)
        {
            //TODO:  Completar el método
            return true;
        }



        /**
        Validate User For Refresh Method Diseñado por Yoshi
        */

         public async Task<(string, bool)> ValidateUserForRefresh(RenewTokenRequest renewTokenInfo)
        {

            var validatePass = await _userRepository.ValidatePasswordEjecutivo((int)renewTokenInfo.IdEjecutivo, renewTokenInfo.Password);

            if (validatePass is null)
            {
                return ("Invalid Password", false);
            }

            var validateSession = await _userRepository.ValidateExistingSession((int)renewTokenInfo.IdEjecutivo);

            if (validateSession is null)
            {
                return ("Not Logged In", false);
            }

            return ("", true);
        }

        /*Cierre de sesion C#*/
        public async Task<DataTable> GetCierreSesion(int idEjecutivo, int idLogIngreso)
        {
            DataTable sesionCierre = new DataTable();
            string query = "EXEC dbMemory.PS.CierraSesión @idEjecutivo, @idLogIngreso"; // Evita inyección SQL

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand(query, connection))
                {
                    // Usar Add con tipo explícito para evitar problemas con tipos de datos
                    command.Parameters.Add("@idEjecutivo", SqlDbType.Int).Value = idEjecutivo;
                    command.Parameters.Add("@idLogIngreso", SqlDbType.Int).Value = idLogIngreso;

                    using (var adapter = new SqlDataAdapter(command))
                    {
                        adapter.Fill(sesionCierre);
                    }
                }
            }

            return sesionCierre;
        }

        public async Task<DataTable> GetCierreLog(int idLogIngreso)
        {
            DataTable sesionCierreLog = new DataTable();
            string query = "UPDATE dbCollection..LogIngreso SET Segundo_Salida = GETDATE() WHERE idLogIngreso = @idLogIngreso"; // Evita inyección SQL

            using (var connection = new SqlConnection(_connectionString))
            {
                await connection.OpenAsync();
                using (var command = new SqlCommand(query, connection))
                {
                    // Usar Add con tipo explícito para evitar problemas con tipos de datos
                    command.Parameters.Add("@idLogIngreso", SqlDbType.Int).Value = idLogIngreso;

                    using (var adapter = new SqlDataAdapter(command))
                    {
                        adapter.Fill(sesionCierreLog);
                    }
                }
            }

            return sesionCierreLog;
        }

        /*Cierre de sesion C#*/


        private SqlConnection GetConnection(string connection)
        {
            return new SqlConnection(_configuration.GetConnectionString(connection));
        }
    }
}

