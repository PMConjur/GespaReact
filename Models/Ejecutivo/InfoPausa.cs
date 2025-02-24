using System;

namespace NoriAPI.Models.Ejecutivo
{
    public class InfoPausa
    {
        public int IdEjecutivo { get; set; }
        public string Contrasenia { get; set; }
        public string PeCausa { get; set; }
        public TimeSpan Duracion { get; set; }
    }
}
