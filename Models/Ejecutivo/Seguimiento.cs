using System;

namespace NoriAPI.Models.Ejecutivo
{
    public class Seguimiento
    {
        public DateTime Fecha { get; set; }
        public TimeSpan Segundo { get; set; }
        public int IdAcercamiento { get; set; }
        public bool Recordatorio { get; set; }
        public string NumeroTelefonico { get; set; }
        public string DatoContacto { get; set; }
        public int? IdMotivoSeguimiento { get; set; }
        public DateTime FechaHora { get; set; } // Asegúrate de calcular esto correctamente
        public string IdCuenta { get; internal set; }
    }
}
