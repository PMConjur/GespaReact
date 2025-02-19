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
        Task<dynamic> TemplateMethod();
        Task<ResultadoTiempos> ValidateTimes(int NumEmpleado);

    }
    public class EjecutivoRepository : IEjecutivoRepository
    {
        private readonly IConfiguration _configuration;

        public EjecutivoRepository(IConfiguration configuration)
        {
            _configuration = configuration;
        }

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

        public Task<dynamic> TemplateMethod()
        {
            throw new NotImplementedException();
        }

        private SqlConnection GetConnection(string connection)
        {
            return new SqlConnection(_configuration.GetConnectionString(connection));
        }


    }
}
