using Dapper;
using Microsoft.AspNetCore.Routing;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using NoriAPI.Models.Login;
using System.Data;
using System.Threading.Tasks;

namespace NoriAPI.Repositories
{
    public interface IUserRepository
    {
        Task<dynamic> ValidateContra(ReseteaContra request);
        Task<dynamic> ValidateUser(AuthRequest request);
        Task<dynamic> ValidateUserRetry(AuthRequest request);
        Task<dynamic> ValidatePasswordEjecutivo(int idEjecutivo, string contrasenia);
        Task<dynamic> ValidateExistingSession(int idEjecutivo);
    }

    public class UserRepository : IUserRepository
    {

        private readonly IConfiguration _configuration;

        public UserRepository(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<dynamic> ValidateContra(ReseteaContra request)
        {
            using var connection = GetConnection("Piso2Amex");

            string storedEstableceContra = "[dbCollection].[dbo].[1.2.EstableceContraseña]";
            var parameters = new
            {
                Usuario = request.Usuario,
                NuevaContraseña = request.NuevaContra,
                Contraseña = request.Contra

            };
            var ReseteaContra = (await connection.QueryFirstOrDefaultAsync<dynamic>(
                storedEstableceContra,
                parameters,
                commandType: CommandType.StoredProcedure
            ));

            return ReseteaContra;

        }



        public async Task<dynamic> ValidateUser(AuthRequest request)
        {
            using var connection = GetConnection("Piso2Amex");

            string storedIniciaSesion = "[dbMemory].[PS].[IniciaSesión]";
            var parameters = new
            {
                Usuario = request.Usuario,
                Contraseña = request.Contrasenia,
                Extensión = request.Extension,
                Bloquear = request.Bloqueo,
                Dominio = request.Dominio,
                Computadora = request.Computadora,
                UsuarioWindows = request.UsuarioWindows,
                IP = request.IP,
                Aplicación = request.Aplicacion,
                Versión = request.Version
            };

            var validarUsuario = (await connection.QueryFirstOrDefaultAsync<dynamic>(
                storedIniciaSesion,
                parameters,
                commandType: CommandType.StoredProcedure
            ));

            return validarUsuario;
        }

        public async Task<dynamic> ValidateUserRetry(AuthRequest request)
        {
            using var connection = GetConnection("Piso2Amex");

            string storedIniciaSesion = "[dbCollection].[dbo].[1.1.ValidaEjecutivo]";
            var parameters = new
            {
                request.Usuario,
                Contraseña = request.Contrasenia,
                Extensión = request.Extension,
                request.Bloqueo,
                request.Dominio,
                request.Computadora,
                request.UsuarioWindows,
                request.IP,
            };

            var validarUsuarioRetry = (await connection.QueryFirstOrDefaultAsync<dynamic>(
                storedIniciaSesion,
                parameters,
                commandType: CommandType.StoredProcedure
            ));

            return validarUsuarioRetry;
        }



        /**
        
        Metodo que valida la contraseña del ejecutivo
        Diseñado por Yoshi
        */


          public async Task<dynamic> ValidatePasswordEjecutivo(int idEjecutivo, string contrasenia)
        {
            using var connection = GetConnection("Piso2Amex");

            string queryPass = "[dbMemory].[PS].[ValidaContraseñaEjecutivo]";

            var parameters = new
            {
                idEjecutivo = idEjecutivo,
                Contraseña = contrasenia,
            };

            var passwordValidate = await connection.ExecuteScalarAsync(
                queryPass,
                parameters,
                commandType: CommandType.StoredProcedure

            );

            return passwordValidate;
        }



        /**
        
        Valtida si existe una sesión activa
        Diseñado por Yoshi
        **/


        public async Task<dynamic> ValidateExistingSession(int idEjecutivo)
        {
            using var connection = GetConnection("Piso2Amex");
            string querySession = "USE [dbMemory] " +
                "SELECT " +
                "CASE WHEN Segundo_Salida IS NULL THEN 1 ELSE 0 END " +
                "FROM [dbMemory].[PS].[Sesiones]" +
                "WHERE idEjecutivo = @idEjecutivo ";

            var parameters = new
            {
                idEjecutivo = idEjecutivo
            };

            var validateSession = await connection.ExecuteScalarAsync(
                querySession,
                parameters,
                commandType: CommandType.Text
            );

            return validateSession;

        }
        


        private SqlConnection GetConnection(string connection)
        {
            return new SqlConnection(_configuration.GetConnectionString(connection));
        }

    }
}