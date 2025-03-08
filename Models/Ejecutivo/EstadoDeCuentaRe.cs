using System;

namespace NoriAPI.Models.Ejecutivo
{
    public class EstadoDeCuentaRe
    {
        public int idCartera { get; set; }
        public string idCuenta { get; set; }
        public int idEjecutivo { get; set; }
        public DateTime FechaInicial { get; set; }
        public DateTime FechaFinal { get; set; }
        public bool Consulta { get; set; }
        public string CorreoElectrónico { get; set; }
    }
}
