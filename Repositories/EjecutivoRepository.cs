using System;
using System.Data;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using NoriAPI.Models.Ejecutivo;

namespace NoriAPI.Repositories
{
    public interface IEjecutivoRepository
    {
        Task<ResultadoTiempos> ValidateTimes(int numEmpleado);
        Task<dynamic> ValidatePasswordEjecutivo(int idEjecutivo, string contrasenia);
        Task ChangeEjecutivoMode(int idEjecutivo, string modo);
        Task Pausa210(int idEjecutivo, int idValorCausa, TimeSpan tiempo);
        Task IncreaseEjecutivoTime(int idEjecutivo, TimeSpan tiempo, string causa);

    }
    public class EjecutivoRepository : IEjecutivoRepository
    {
        private readonly IConfiguration _configuration;

        public EjecutivoRepository(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        #region Tiempos
        public async Task<ResultadoTiempos> ValidateTimes(int numEmpleado)
        {
            using var connection = GetConnection("Piso2Amex");

            string queryTimes = "[dbMemory].[PS].[TiemposEjecutivo]";

            var parameters = new
            {
                idEjecutivo = numEmpleado,
            };

            var times = await connection.QueryFirstOrDefaultAsync<ResultadoTiempos>(
                queryTimes,
                parameters,
                commandType: CommandType.StoredProcedure

            );

            return times;//pruebas

        }

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

        public async Task Pausa210(int idEjecutivo, int idValorCausa, TimeSpan tiempo)
        {
            using var connection = GetConnection("Piso2Amex");

            string queryPass = "[dbCollection].[dbo].[2.10.Pausa]";

            var parameters = new
            {
                idEjecutivo = idEjecutivo,
                idPausa = idValorCausa,
                Duración = tiempo,
            };

            var pausa = await connection.ExecuteAsync(
                queryPass,
                parameters,
                commandType: CommandType.StoredProcedure

            );
        }

        #endregion

        public async Task ChangeEjecutivoMode(int idEjecutivo, string modo)
        {
            using var connection = GetConnection("Piso2Amex");

            string queryPass = "[dbMemory].[PS].[ModoEjecutivo]";

            var parameters = new
            {
                idEjecutivo = idEjecutivo,
                Modo = modo,
            };

            var mode = await connection.ExecuteAsync(
                queryPass,
                parameters,
                commandType: CommandType.StoredProcedure

            );
        }

        public async Task IncreaseEjecutivoTime(int idEjecutivo, TimeSpan tiempo, string causa)
        {
            using var connection = GetConnection("Piso2Amex");

            string queryPass = "[dbMemory].[PS].[IncrementaTiempo]";

            var parameters = new
            {
                idEjecutivo = idEjecutivo,
                Duración = tiempo,
                Causa = causa
            };

            await connection.ExecuteAsync(
                queryPass,
                parameters,
                commandType: CommandType.StoredProcedure

            );

        }

        private SqlConnection GetConnection(string connection)
        {
            return new SqlConnection(_configuration.GetConnectionString(connection));
        }


    }
}
