using System;

namespace NoriAPI.Models.CargaGestionamiento
{
    public class SeguimientoCompletoModel
    {
        public int IdCartera { get; set; }
        public string IdCuenta { get; set; }
        public DateTime FechaInsert { get; set; }
        public TimeSpan SegundoInsert { get; set; }
        public int IdEjecutivo { get; set; }
        public DateTime FechaSeguimiento { get; set; }
        public TimeSpan SegundoSeguimiento { get; set; }
        public int IdAcercamiento { get; set; }
        public string NumeroTelefonico { get; set; }
        public bool Recordatorio { get; set; }
        public bool Realizado { get; set; }
        public int IdEjecutivoRealizado { get; set; }
        public TimeSpan SegundoRealizado { get; set; }
        public int IdMotivoSeg { get; set; }
        public int IdEjecutivoQuery { get; set; } // idEjecutivo de la consulta
        public string NombreEjecutivoQuery { get; set; } // nombreEjecutivo de la consulta
        public DateTime? FechaQuery { get; set; } // Fecha de la consulta
        public TimeSpan? SegundoQuery { get; set; } // Segundo de la consulta
        public bool AutomáticoQuery { get; set; } // Automático de la consulta
    }
}
