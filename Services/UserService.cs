using Dapper;
using Microsoft.Data.SqlClient;
using System.Data;
using NoriAPI.Models.Login;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using System.Linq;
using System.Collections.Generic;
using NoriAPI.Repositories;
using NoriAPI.Models.Login;
using System;
using Microsoft.AspNetCore.Mvc;

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
            string mensaje;
            bool expiro = false;

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
                    return new ResultadoLogin("No se pudo validar el usuario, falló la solicitud con el servidor.", null, null);
                    throw;
                }
            }

            //Tras ejecutar la primera o la segunda consulta la base de datos, se validará si 
            foreach (var property in ((IDictionary<string, object>)validateUser).Keys)
            {
                if (property == "Expiró")
                {
                    expiro = true;
                }

                if (property == "Mensaje")
                {
                    return new ResultadoLogin(property, expiro, null);
                }

            }


            return validateUser;

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
