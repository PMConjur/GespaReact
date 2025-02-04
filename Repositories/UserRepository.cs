using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using NoriAPI.Models.Login;
using System.Data;
using System.Threading.Tasks;

namespace NoriAPI.Repositories
{
    public interface IUserRepository
    {
        Task<dynamic> ValidateUser(AuthRequest request);
        Task<dynamic> ValidateUserRetry(AuthRequest request);
    }

    public class UserRepository : IUserRepository
    {

        private readonly IConfiguration _configuration;

        public UserRepository(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task<dynamic> ValidateUser(AuthRequest request)
        {
            using var connection = new SqlConnection(_configuration.GetConnectionString("Ventas"));

            string storedIniciaSesion = "EXEC [dbCollection].[API].[IniciaSesion]";
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
                Aplicación = request.Aplicacion,
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
            using var connection = GetConnection("Ventas");

            string storedIniciaSesion = "EXEC [dbCollection].[dbo].[1.1.ValidaEjecutivo]";
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

        private SqlConnection GetConnection(string connection)
        {
            return new SqlConnection(_configuration.GetConnectionString(connection));
        }

    }
}
