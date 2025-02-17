using Microsoft.Extensions.Configuration;
using NoriAPI.Models.Busqueda;
using NoriAPI.Models.Ejecutivo;
using NoriAPI.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NoriAPI.Services
{
    public interface IEjecutivoService
    {
        Task<dynamic> EjecutivoPrueba();
        Task<NegociacionesResponse> ObtenerNegociaciones(int idEjecutivo);

    }

    public class EjecutivoService : IEjecutivoService
    {
        private readonly IConfiguration _configuration;
        private readonly IEjecutivoRepository _ejecutivoRepository;

        public EjecutivoService(IEjecutivoRepository ejecutivoRepository)
        {
            _ejecutivoRepository = ejecutivoRepository;
        }

        public async Task<dynamic> EjecutivoPrueba()
        {
            throw new NotImplementedException();
        }

        public async Task<NegociacionesResponse> ObtenerNegociaciones(int idEjecutivo)
        {
            var negociaciones = (await _ejecutivoRepository.ObtenerNegociacionesAsync(idEjecutivo)).ToList();

            if (negociaciones.Count == 0)
            {
                return new NegociacionesResponse
                {
                    Negociaciones = new List<Negociacion>(),
                    ConteoHoy = 0,
                    TiempoPromedio = null
                };
            }

            // ConteoHoy de negociaciones del día actual
            int conteo = negociaciones.Count(n => n.FechaCreacion == DateTime.Today);

            // Calcular tiempo promedio con base en FechaCreacion y FechaTermino
            TimeSpan? tiempoPromedio = CalcularTiempoPromedio(negociaciones);

            return new NegociacionesResponse
            {
                Negociaciones = negociaciones,
                ConteoHoy = conteo,
                TiempoPromedio = tiempoPromedio.HasValue
                    ? new TiempoPromedioResponse
                    {
                        Horas = (int)tiempoPromedio.Value.TotalHours,
                        Minutos = tiempoPromedio.Value.Minutes,
                        Segundos = tiempoPromedio.Value.Seconds,
                        TotalMinutos = (int)tiempoPromedio.Value.TotalMinutes,
                        TotalSegundos = (int)tiempoPromedio.Value.TotalSeconds
                    }
                    : new TiempoPromedioResponse()
            };
        }
        private static TimeSpan? CalcularTiempoPromedio(IEnumerable<Negociacion> negociaciones)
        {
            var tiempos = negociaciones
                .Where(n => n.FechaCreacion.HasValue && n.FechaTermino.HasValue) // Asegura que ambos valores existen
                .Select(n => (n.FechaTermino.Value - n.FechaCreacion.Value).Ticks) // Aquí ya no hay `null`
                .ToList();

            if (tiempos.Count == 0 || tiempos.Sum() == 0) return null;  // Evita divisiones por cero

            long totalTicks = tiempos.Sum();
            return new TimeSpan(totalTicks / tiempos.Count);
        }

    }

}

