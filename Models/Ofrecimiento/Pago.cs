using System;

namespace NoriAPI.Models.Ofrecimiento
{
    public class Pago
    {
        public double Monto { get; set; }
        public DateTime Fecha { get; set; }
        public string Referencia { get; set; }
        public string Sucursal { get; set; }

        public Pago(double monto, DateTime fecha)
        {
            Monto = monto;
            Fecha = fecha;
        }

        public Pago(double monto, DateTime fecha, string referencia, string sucursal)
        {
            Monto = monto;
            Fecha = fecha;
            Referencia = referencia;
            Sucursal = sucursal;
        }
    }
}
