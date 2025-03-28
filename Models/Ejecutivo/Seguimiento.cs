using System;

namespace NoriAPI.Models.Ejecutivo
{
    public class Seguimiento
    {
        public int IdCartera { get; set; }
        public string IdCuenta { get; set; }
        public int IdEjecutivo { get; set; }
        public DateTime Fecha { get; set; }
        public TimeSpan Segundo { get; set; }
        public short IdAcercamiento { get; set; }
        public bool Recordatorio { get; set; }
        public long? NumeroTelefonico { get; set; }
        public string DatoContacto { get; set; }
        public string IdMotivoSeguimiento { get; set; }
    }
}
