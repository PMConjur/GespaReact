using System;

namespace NoriAPI.Models.Ejecutivo
{
    public class CalculosInfo
    {
        public int No {  get; set; }
        public DateTime Fecha {  get; set; }
        public decimal saldo { get; set; }
        public decimal pago { get; set; }
        public decimal SaldoFinal { get; set; }
    }
}
