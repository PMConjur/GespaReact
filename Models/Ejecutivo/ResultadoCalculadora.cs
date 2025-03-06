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
        public double MontoDescuento { get; set; }
        public double Saldo {  get; set; }
        public string FechaCorte { get; set; }

        //public ResultadoCalculadora(List<OfrecimientosInfo> ofrecimientos, List<HerramientasInfo> herramientas, double montoRequerido, int descuento, double montoDescuento, double saldo, string fechaCorte)
        //{
        //    Ofrecimientos = ofrecimientos;
        //    Herramientas = herramientas;
        //    MontoRequerido = montoRequerido;
        //    Descuento = descuento;
        //    MontoDescuento = montoDescuento;
        //    Saldo = saldo;
        //    FechaCorte = fechaCorte;
        //}

    }
}
