using Microsoft.Extensions.Configuration;
using NoriAPI.Models.Busqueda;
using NoriAPI.Repositories;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NoriAPI.Services
{
    public interface IEjecutivoService
    {
        Task<dynamic> EjecutivoPrueba();

    }

    public class EjecutivoService : IEjecutivoService
    {
        private readonly IConfiguration _configuration;
        private readonly IEjecutivoRepository _ejecutivoRepository;

        public async Task<dynamic> EjecutivoPrueba()
        {
            throw new NotImplementedException();
        }

    }
}
