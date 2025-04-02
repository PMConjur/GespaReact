using System;

namespace NoriAPI.Models.Ejecutivo
{
    public class Pagos
    {
        public Pagos() { }

        public Pagos(int idCartera, string idCuenta, DateTime fechaPago, double montoPago, string? referencia, string? sucursal, int idEjecutivo)
        {
            this.idCartera = idCartera;
            this.idCuenta = idCuenta;
            FechaPago = fechaPago;
            MontoPago = montoPago;
            Referencia = referencia;
            Sucursal = sucursal;
            this.idEjecutivo = idEjecutivo;
        }
        public int idCartera { get; set; }
        public string idCuenta { get; set; }
        public DateTime FechaPago { get; set; }
        public double MontoPago { get; set; }
        public string? Referencia { get; set; }
        public string? Sucursal { get; set; }
        public int idEjecutivo { get; set; }
    }

}
