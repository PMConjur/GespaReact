using System;

namespace NoriAPI.Models.Flujo
{
    public class GuardaGestionTelefonicaResult
    {
        public DateTime Fecha_Insert { get; set; }
        public TimeSpan Segundo_Insert { get; set; }
        public short? idSituacion { get; set; }
        public string Fechavici { get; set; }
        public string Nivel { get; set; }
        public string Situacion { get; set; }
        public string Producto { get; set; }
        public string Productos { get; set; }
        public short IdModo { get; set; }
        public string NumeroCliente { get; set; }
        public string Billing { get; set; }
        public string Contacto { get; set; }
        public string Etiqueta { get; set; }
    }
}
