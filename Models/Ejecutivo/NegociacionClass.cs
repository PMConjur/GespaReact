using System.Collections.Generic;
using System;

namespace NoriAPI.Models.Ejecutivo
{
    public class NegociacionClass
    {
        public double Saldo { get; private set; }
        public double MontoRequerido { get; set; }
        public double MontoNegociado { get; set; }
        public double Descuento { get; set; }
        public int IdHerramienta { get; private set; }
        public int DiasPrimerPago { get; private set; }
        public int DiasEntrePagos { get; set; } = 1;
        public int IdEjecutivoValidador { get; set; }
        public int CartaConvenio { get; set; } = 0;
        public int Restructura { get; set; } = 0;
        public int Condonacion { get; set; } = 0;
        public string IdGrabacion { get; set; } = "NULL";
        public string MontoPago { get; set; }
        public string Correo { get; set; }
        public string Contraseña { get; set; }
        public DateTime FechaCorte { get; private set; }
        public Pago[] Plazos { get; set; }

        public NegociacionClass(int idHerramienta, double saldo, double descuento, double montoRequerido, int diasPrimerPago, DateTime fechaCorte)
        {
            IdHerramienta = idHerramienta;
            Saldo = saldo;
            Descuento = descuento;
            MontoRequerido = montoRequerido;
            DiasPrimerPago = diasPrimerPago;
            FechaCorte = fechaCorte;

            if (idHerramienta == 89 || idHerramienta == 100)
            {
                if (MontoRequerido < 10000)
                {
                    Descuento += 5;
                }
                else if (MontoRequerido >= 10000 && MontoRequerido < 50000)
                {
                    Descuento += 7;
                }
                else if (MontoRequerido >= 50000)
                {
                    Descuento += 10;
                }
                MontoRequerido = Saldo - (Saldo * (Descuento / 100));
            }
        }
    }

    public class Pago
    {
        public double Monto { get; set; }
        public DateTime Fecha { get; set; }
    }
}
