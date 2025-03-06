using System.Collections.Generic;
using System.Data;

namespace NoriAPI.Models.Ejecutivo
{
    public class ResultadoCalculadora
    {
        public DataTable Ofrecimientos { get; set; }
        public DataTable Herramientas { get; set; }
        public double MontoRequerido { get; set; }
        public int Descuento { get; set; }
        public double MontoDescuento { get; set; }
        public double Saldo {  get; set; }
        public string FechaCorte { get; set; }

        //public ResultadoCalculadora(DataTable ofrecimientos, DataTable herramientas, double montoRequerido, int descuento, double montoDescuento, double saldo, string fechaCorte)
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
