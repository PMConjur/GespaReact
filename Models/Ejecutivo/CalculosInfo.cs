using System;

namespace NoriAPI.Models.Ejecutivo
{
    public class CalculosInfo
    {
        public int No { get; set; }
        public DateTime Fecha { get; set; }
        public double saldo { get; set; }
        public double pago { get; set; }
        public double SaldoFinal { get; set; }
    }
}
