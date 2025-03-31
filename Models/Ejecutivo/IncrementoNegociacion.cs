using System;
using System.Data;

namespace NoriAPI.Models.Ejecutivo
{
    public class IncrementoNegociacion
    {
        public int idEjecutivo {  get; set; }
        public double Monto { get; set; }
        public double Saldo { get; set; }
        public string Duracion { get; set; }

    }
}
