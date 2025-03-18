using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using System;
using NoriAPI.Models.Busqueda;
using NoriAPI.Models;
using System.Data;
using System.Transactions;

namespace NoriAPI.Repositories
{
    public interface IBusquedaRepository
    {
       
       
        DataTable Búsquedas { get; }
    }

    public class BusquedaRepository : IBusquedaRepository
    {
        private readonly string _connectionString;
        public DataTable Búsquedas { get; set; } = new DataTable();

        public BusquedaRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("Piso2Amex");
            Búsquedas = new DataTable();
            Búsquedas.Columns.Add("idDato", typeof(int));
            Búsquedas.Columns.Add("idFuente", typeof(int));
            Búsquedas.Columns.Add("idEjecutivo", typeof(int));
            Búsquedas.Columns.Add("Fecha_Insert", typeof(DateTime));
            Búsquedas.Columns.Add("Segundo_Insert", typeof(TimeSpan));
        }

        

       

    }
}
