using Microsoft.Data.SqlClient;
using NoriAPI.Models.Login;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using NoriAPI.Repositories;
using System;
using NoriAPI.Models;

namespace NoriAPI.Services
{
    public interface IUserService
    {

        ////Task<List<dynamic>> ValidateUser(string username, string password, int extension, int bloqueo, string dominio, string computadora, string usuarioWindows, string ip, string aplicacion, string version);
        Task<ResultadoLogin> ValidateUser(AuthRequest request);

    }

    public class UserService : IUserService
    {
        private readonly IConfiguration _configuration;
        private readonly IUserRepository _userRepository;

        public UserService(IConfiguration configuration, IUserRepository userRepository)
        {
            _configuration = configuration;
            _userRepository = userRepository;
        }

        public async Task<ResultadoLogin> ValidateUser(AuthRequest request)
        {
            // Variables para crear el objeto EjecutivoLogin de retorno:
            string mensaje = null;
            bool expiro = false;
            bool sesion = false;
            EjecutivoInfoLogin ejecutivoInfoLogin = null;

            //TODO: Llamar al stored que valida los días que faltan.


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
                    return new ResultadoLogin("No se pudo validar el usuario, falló la solicitud con el servidor.", null, null, null);
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
                return new ResultadoLogin(mensaje, sesion, expiro, null);
            }

            // Si se encontró "idEjecutivo", se asume que la consulta fue exitosa
            if (dict.ContainsKey("idEjecutivo"))
            {
                ejecutivoInfoLogin = MapToEjecutivoInfo(dict);
            }


            var resultado = new ResultadoLogin(mensaje, sesion, expiro, ejecutivoInfoLogin);
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

        private SqlConnection GetConnection(string connection)
        {
            return new SqlConnection(_configuration.GetConnectionString(connection));
        }
    }
}
