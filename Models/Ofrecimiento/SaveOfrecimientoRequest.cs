using System;

namespace NoriAPI.Models.Ofrecimiento
{
    public class SaveOfrecimientoRequest
    {
        public int IdCartera { get; set; }
        public string IdCuenta { get; set; }
        public int IdProducto { get; set; }
        public int IdEjecutivo { get; set; }
        public int IdHerramienta { get; set; }
        public double MontoRequerido { get; set; }
        public double MontoNegociado { get; set; }
        public double Descuento { get; set; }
        public double Saldo { get; set; }
        public Pago[] Plazos { get; set; }
        public int Dias1erPago { get; set; }
        public DateTime FechaCorte { get; set; }
        public DateTime FechaInsert { get; set; }
        public TimeSpan SegundoInsert { get; set; }
        public int CartaConvenio { get; set; }
        public string Correo { get; set; }
        public int IdEjecutivoValidador { get; set; }
    }
}
