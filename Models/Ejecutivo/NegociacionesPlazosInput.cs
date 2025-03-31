using System;

namespace NoriAPI.Models.Ejecutivo
{
    public class NegociacionPlazosInput
    {
        public short IdCartera { get; set; }
        public string IdCuenta { get; set; }
        public int IdEjecutivo { get; set; }
        public int IdHerramienta { get; set; }
        public decimal MontoNegociado { get; set; }
        public int Plazos { get; set; }
        public int CartaConvenio { get; set; }
        public string Correo { get; set; }
        public string FechaPago { get; set; }
        public string FechaFinNegociacion { get; set; }
        public int IdEjecutivoValidador { get; set; }
        public string Contrasena { get; set; }
        public string FechaInsert { get; set; }
        public string SegundoInsert { get; set; }
        public int Reestructura { get; set; }
        public int Condonacion { get; set; }
        public string IdGrabacion { get; set; }
    }

    // Models/NegociacionPlazosOutput.cs
    public class NegociacionPlazosOutput
    {
        public DateTime Fecha_Insert { get; set; }
        public TimeSpan @Segundo_Insert { get; set; }
        public string Validador { get; set; }
        public int IdEstado { get; set; }
        public TimeSpan Duración { get; set; }
        public string Mensaje { get; set; }
    }

    // Models/ErrorMessage.cs
    public class ErrorMessage
    {
        public string Mensaje { get; set; }
    }
}
