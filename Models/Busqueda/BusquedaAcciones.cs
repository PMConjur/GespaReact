using System;
using System.ComponentModel.DataAnnotations;

namespace NoriAPI.Models.Busqueda
{
    public class BusquedaNueva
    {
        public string IdCuenta { get; set; }
        public int IdEjecutivo { get; set; }
        public int IdCartera { get; set; }
        public string Dato { get; set; }

        public short IdDato { get; set; }
        public short IdFuente { get; set; }
        public bool Encontrado { get; set; }
        public byte NumeroTelefonosEncontrados { get; set; }
        public string NombrePersona { get; set; }
        public string Puesto { get; set; }
        public string NombreLugar { get; set; }
        public string DomicilioLugar { get; set; }
        public TimeSpan? TiempoEnCuenta { get; set; }
        public string Link { get; set; }
        [RegularExpression(@"^\d*$", ErrorMessage = "El validador debe ser un número válido.")]
        public string Validador { get; set; }
    }
}
