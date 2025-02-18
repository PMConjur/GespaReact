using Microsoft.Extensions.Configuration;
using NoriAPI.Models.Busqueda;
using NoriAPI.Models.Ejecutivo;
using NoriAPI.Repositories;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NoriAPI.Services
{
    public interface IEjecutivoService
    {
        
        Task<TiemposEjecutivo> ValidateTimes(int NumEmpleado);

    }

    

    public class EjecutivoService : IEjecutivoService
    {
        private readonly IConfiguration _configuration;
        private readonly IEjecutivoRepository _ejecutivoRepository;

        public EjecutivoService (IEjecutivoRepository ejecutivoRepository)
        {
            _ejecutivoRepository = ejecutivoRepository;
        }

        

        public async Task<TiemposEjecutivo> ValidateTimes(int NumEmpeado)
        {
            ResultadoTiempos tiempos = null;

            try
            {
                var validateTimes = await _ejecutivoRepository.ValidateTimes(NumEmpeado);
                tiempos = validateTimes;

            }
            catch (Exception ex)
            {
                return new TiemposEjecutivo($"Hubo un problema al obtener los tiempos del ejecutivo: {ex.Message} ", null);
            }

            return new TiemposEjecutivo(null, tiempos);



            // var resultadoTiempos = new TiemposEjecutivo(mensaje);
            //return validateTimes;


        }

    }
}
