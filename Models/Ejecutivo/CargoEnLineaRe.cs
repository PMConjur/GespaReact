using System;

namespace NoriAPI.Models.Ejecutivo
{
    public class CargoEnLineaRe
    {
        public string idCuenta { get; set; }
        public int idEjecutivo { get; set; }
        public int idCartera { get; set; }
        public decimal Monto { get; set; }
        public int IdEjecutivoAutorizo { get; set; }
        public long Tarjeta { get; set; }
        public string Nombre { get; set; }
        public DateTime vencimiento { get; set; }


    }
}
