using System;

namespace NoriAPI.Models.Domicilios
{
    public class Domicilio
    {
        public int? IdCartera { get; set; }
        public string? IdCuenta { get; set; }
        public int? IdDomicilio { get; set; }
        public DateTime? FechaInsert { get; set; }
        public int? IdEjecutivo { get; set; }
        public int? IdInformacion { get; set; }
        public string? Calle { get; set; }
        public string? NumeroExterior { get; set; }
        public string? NumeroInterior { get; set; }
        public int? IdCodigoPostal { get; set; }
        public string? CodigoPostal { get; set; }
        public string? ColoniaLocalidad { get; set; }
        public string? DelegacionMunicipio { get; set; }
        public string? Estado { get; set; }
        public int? IdEjecutivoInformacion { get; set; }
        public DateTime? FechaHoraInformacion { get; set; }
        public int? IdLogProceso { get; set; }
        public int? IdClase { get; set; }
        public int? IdOrigen { get; set; }
    }
}
