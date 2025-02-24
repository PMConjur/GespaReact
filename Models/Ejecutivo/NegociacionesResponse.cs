using System.Collections.Generic;
using System;

namespace NoriAPI.Models.Ejecutivo
{
    public class NegociacionesResponse
    {
        public List<Negociacion>? Negociaciones { get; set; }
        public int? ConteoHoy { get; set; }
        //public TimeSpan? TiempoPromedio { get; set; }
        public TiempoPromedioResponse TiempoPromedio { get; set; }

    }

    public class TiempoPromedioResponse
    {
        public int Horas { get; set; }
        public int Minutos { get; set; }
        public int Segundos { get; set; }
        public int TotalMinutos { get; set; }
        public int TotalSegundos { get; set; }
    }
}
