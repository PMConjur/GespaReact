using System;

namespace NoriAPI.Models.Domicilios
{
    public class GestionDomiciliaria
    {
        public int IdDomicilio { get; set; }
        public DateTime Fecha { get; set; }
        public TimeSpan Hora { get; set; }
        public int? IdContacto { get; set; }
        public int? IdSituacion { get; set; }
        public int? IdCausaNoPago { get; set; }
        public string NombreContacto { get; set; }
        public int? IdParentesco { get; set; }
        public int? IdSucursal { get; set; }
        public string ColorFachada { get; set; }
        public string ColorPuerta { get; set; }
        public string ColorHerreria { get; set; }
        public string Pisos { get; set; }
        public int? IdVivienda { get; set; }
        public int? IdHabitacion { get; set; }
        public int? IdEconomico { get; set; }
        public string NombrePropietario { get; set; }
        public string AutoMapeo { get; set; }
        public string AutoMarca { get; set; }
        public string AutoAño { get; set; }
        public string CalleHorizontalNorte { get; set; }
        public string CalleHorizontalSur { get; set; }
        public string CalleVerticalOeste { get; set; }
        public string CalleVerticalEste { get; set; }
        public string Visitador { get; set; }
        public string Capturista { get; set; }
        public DateTime? FechaPagoNegociacion { get; set; }
        public decimal? MontoNegociacion { get; set; }
        public string Comentario { get; set; }


    }
}
