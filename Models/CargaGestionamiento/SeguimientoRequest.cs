using System;

namespace NoriAPI.Models.CargaGestionamiento
{
    public class SeguimientoModel
    {
        public int IdEjecutivo { get; internal set; }
        public DateTime FechaSeguimiento { get; internal set; }

        public class Seguimiento
        {
            public DateTime Fecha { get; set; }
            public TimeSpan Segundo { get; set; }
            public int IdAcercamiento { get; set; }
            public string Recordatorio { get; set; }
            public long? NumeroTelefonico { get; set; }
            public string DatoContacto { get; set; }
            public string IdMotivoSeguimiento { get; set; }
        }
    }


}
