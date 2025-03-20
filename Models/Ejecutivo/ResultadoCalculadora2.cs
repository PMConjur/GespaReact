using System.Collections.Generic;

namespace NoriAPI.Models.Ejecutivo
{
    public class ResultadoCalculadora2
    {
        public List<CalculosInfo> Calculos { get; set; }
        public double MontoRequerido { get; set; }
        public double MontoNegociado {  get; set; }
        public double Pago { get; set; }
        public string Plazos { get; set; }
        public double Descuento { get; set; }
        public double Monto {  get; set; }
        public double TasaMensual {  get; set; }
    }
}
