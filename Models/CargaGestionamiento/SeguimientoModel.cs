using System;

namespace NoriAPI.Models.CargaGestionamiento
{
    public class SeguimientoModel
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
    }


}
