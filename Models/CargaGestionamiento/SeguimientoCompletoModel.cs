using System;

namespace NoriAPI.Models.CargaGestionamiento
{
    public class SeguimientoCompletoModel
    {
        public int IdCartera { get; set; }
        public string IdCuenta { get; set; }
        public int IdEjecutivo { get; set; } // Asegúrate de que esta propiedad esté presente
        public DateTime Fecha { get; set; }
        public TimeSpan Segundo { get; set; }
        public int IdAcercamiento { get; set; }
        public bool Recordatorio { get; set; }
        public long? NumeroTelefonico { get; set; }
        public string DatoContacto { get; set; }
        public string IdMotivoS { get; set; }
    }
}
