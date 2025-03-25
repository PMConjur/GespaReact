using System.Collections.Generic;
using System.Data;

namespace NoriAPI.Models.Ejecutivo
{
    public class ResultadoCalculadora
    {
        public List<OfrecimientosInfo> Ofrecimientos { get; set; }
        public List<HerramientasInfo> Herramientas { get; set; }
        public double MontoRequerido { get; set; }
        public int Descuento { get; set; }
        public int MaxDias {  get; set; }
        public double MontoDescuento { get; set; }
        public double Saldo {  get; set; }
        public string FechaCorte { get; set; }        

    }
}
