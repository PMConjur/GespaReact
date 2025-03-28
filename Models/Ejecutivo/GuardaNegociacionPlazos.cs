using System;

namespace NoriAPI.Models.Ejecutivo
{
    public class GuardaNegociacionPlazos
    {
        public int idCartera {  get; set; }
        public int idCuenta { get; set; }
        public int idEjecutivo { get; set; }
        public int idHerramienta { get; set; }
        public double MontoNegociado { get; set; }
        public int Plazos { get; set; }
        public int CartaConvenio { get; set; }
        public string Correo {  get; set; }
        public int idEjecutivoValidador { get; set; }
        public string Contraseña {  get; set; }
        public DateTime FechaPago { get; set; }
        public DateTime FechaFinNegociación { get; set; }
        public DateTime Fecha_Insert { get; set; }
        public string Segundo_Insert {  get; set; }
        public string Reestructura {  get; set; }
        public string Condonacion { get; set; }
        public int idGrabacion {  get; set; }


    }
}
