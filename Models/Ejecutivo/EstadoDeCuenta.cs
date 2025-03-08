using System;

namespace NoriAPI.Models.Ejecutivo
{
    public class EstadoDeCuenta
    {
        
        
            public EstadoDeCuenta(int IdCartera, string IdCuenta, int IdEjecutivo, DateTime FechaInicial, DateTime FechaFinal, bool consulta, string correoElectronico)
            {
                this.idCartera = IdCartera;
                this.idCuenta = IdCuenta;
                this.idEjecutivo = IdEjecutivo;
                this.FechaInicial = FechaInicial;
                this.FechaFinal = FechaFinal;
                this.Consulta = consulta;
                this.CorreoElectrónico = correoElectronico;
            }
            public int idCartera { get; set; }
            public string idCuenta { get; set; }
            public int idEjecutivo { get; set; }
            public DateTime FechaInicial { get; set; }
            public DateTime FechaFinal { get; set; }
            public bool Consulta { get; set; }
            public string CorreoElectrónico { get; set; }
        
    }
}
