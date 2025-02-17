using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
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
        Task<IEnumerable<Negociacion>> ObtenerNegociacionesAsync(int idEjecutivo);

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

        public async Task<IEnumerable<Negociacion>> ObtenerNegociacionesAsync(int idEjecutivo)
        {
            using var sqlConnection = GetConnection("Piso2Amex");

            var query = @"
                SELECT 
                    idCartera, idCuenta, Herramienta, idEstado, 
                    FechaCreación AS FechaCreacion, FechaTérmino AS FechaTermino, 
                    MontoNegociado, MontoPagado, Pagos, 
                    _CartaConvenio AS CartaConvenio, MesActual
                FROM fn_NegociacionesEjecutivo(@idEjecutivo)";

            return await sqlConnection.QueryAsync<Negociacion>(query, new { idEjecutivo });
        }


        private SqlConnection GetConnection(string connection)
        {
            return new SqlConnection(_configuration.GetConnectionString(connection));
        }


    }
}
