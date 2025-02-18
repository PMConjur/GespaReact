using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Globalization;
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
        Task<IEnumerable<Negociacion>> Negociaciones(int idEjecutivo);
        Task<Recuperacion> RecuperacionActual(int idEjecutivo);
        Task<Recuperacion> RecuperacionAnterior(int idEjecutivo);

    }
    public class EjecutivoRepository : IEjecutivoRepository
    {
        private readonly IConfiguration _configuration;

        public EjecutivoRepository(IConfiguration configuration)
        {
            _configuration = configuration;
        }


        public Task<dynamic> TemplateMethod()
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<Negociacion>> Negociaciones(int idEjecutivo)
        {
            using var connection = GetConnection("Piso2Amex");

            var query = @"
                SELECT 
                    idCartera, idCuenta, Herramienta, idEstado, 
                    FechaCreación AS FechaCreacion, FechaTérmino AS FechaTermino, 
                    MontoNegociado, MontoPagado, Pagos, 
                    _CartaConvenio AS CartaConvenio, MesActual
                FROM fn_NegociacionesEjecutivo(@idEjecutivo)";

            return await connection.QueryAsync<Negociacion>(query, new { idEjecutivo });
        }

        public async Task<Recuperacion> RecuperacionActual(int idEjecutivo)
        {
            using var connection = GetConnection("Piso2Amex");

            string queryFunction = "SELECT * FROM fn_RecuperacionActualEjecutivo(@idEjecutivo)";
            var parameters = new { idEjecutivo = idEjecutivo };
            var actualResult = await connection.QueryFirstOrDefaultAsync<Recuperacion>(queryFunction, parameters);

            return actualResult;
        }
        public async Task<Recuperacion> RecuperacionAnterior(int idEjecutivo)
        {
            using var connection = GetConnection("Piso2Amex");

            string queryFunction = "SELECT * FROM fn_RecuperaciónEjecutivo(@idEjecutivo)";
            var parameters = new { idEjecutivo = idEjecutivo };
            var previousResult = await connection.QueryFirstOrDefaultAsync<Recuperacion>(queryFunction, parameters);

            return previousResult;
        }


        private SqlConnection GetConnection(string connection)
        {
            return new SqlConnection(_configuration.GetConnectionString(connection));
        }


    }
}
