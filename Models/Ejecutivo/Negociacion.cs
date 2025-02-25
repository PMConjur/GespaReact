using System;

namespace NoriAPI.Models.Ejecutivo
{
    public class Negociacion
    {
        public int? IdCartera { get; set; }
        public string? IdCuenta { get; set; }
        public string? Herramienta { get; set; }
        public int? IdEstado { get; set; }
        public DateTime? FechaCreacion { get; set; }
        public DateTime? FechaTermino { get; set; } // Puede ser nullable si aún no ha terminado
        public decimal? MontoNegociado { get; set; }
        public decimal? MontoPagado { get; set; }
        public int? Pagos { get; set; }
        public bool? CartaConvenio { get; set; } // `_CartaConvenio` lo mapearemos como `CartaConvenio`
        public string? MesActual { get; set; } // Depende si es un nombre o un número
    }
}