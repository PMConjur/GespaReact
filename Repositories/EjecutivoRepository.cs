using System;
using System.Threading.Tasks;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace NoriAPI.Repositories
{
    public interface IEjecutivoRepository
    {
        Task<dynamic> TemplateMethod();

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

        private SqlConnection GetConnection(string connection)
        {
            return new SqlConnection(_configuration.GetConnectionString(connection));
        }


    }
}
