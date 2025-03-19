using System;

namespace NoriAPI.Models.Ejecutivo
{
    public class GestionTelefonica
    {
        public int IdCartera { get; set; }
        public string IdCuenta { get; set; }
        public DateTime FechaInsert { get; set; }
        public TimeSpan SegundoInsert { get; set; }
        public int IdEjecutivo { get; set; }
        public string NumeroTelefonico { get; set; }
        public short IdContacto { get; set; }
        public short? IdSituacion { get; set; }
        public short IdSucursal { get; set; }
        public short? Extension { get; set; }
        public short IdModo { get; set; }
        public short? IdAcercamiento { get; set; }
        public TimeSpan Duracion { get; set; }
        public TimeSpan TiempoEnCuenta { get; set; }
        public short? IdParentesco { get; set; }
        public string? NombreContacto { get; set; }
        public short? IdCausaNoPago { get; set; }
        public string? Comentario { get; set; }
        public int? IdValidador { get; set; }
        // Añadimos las propiedades extras.
        public string? Fechavici { get; set; }
        public string? Nivel { get; set; }
        public string? Situacion { get; set; }
        public string? Productos { get; set; }
        public string? Producto { get; set; }
        public string? NumeroCliente { get; set; }
        public string? Billing { get; set; }
        public string? Contacto { get; set; }
        public string? Situaciones { get; set; }
    }
}
